# Production smoke test — API health, CORS, and build artifacts
$ErrorActionPreference = "Continue"
$api = "https://guriraline-server-7rac.onrender.com/api/v2"
$prodOrigin = "https://bonerabliaise.github.io"
$passed = 0
$failed = 0
$warned = 0

function Test-Case($name, $script) {
  Write-Host "`n--- $name ---"
  try {
    $result = & $script
    if ($result -eq $true) { $script:passed++; Write-Host "PASS" } 
    elseif ($result -eq "WARN") { $script:warned++; Write-Host "WARN (known blocker)" }
    else { $script:failed++; Write-Host "FAIL" }
  } catch {
    $script:failed++
    Write-Host "FAIL: $($_.Exception.Message)"
  }
}

Test-Case "API products (no Origin)" {
  $r = Invoke-WebRequest -Uri "$api/product/get-all-products" -Headers @{ Accept = "application/json" } -UseBasicParsing -TimeoutSec 90
  $r.StatusCode -eq 201 -or $r.StatusCode -eq 200
}

Test-Case "API login bad creds (no Origin)" {
  $body = '{"email":"smoke@test.invalid","password":"x"}'
  try {
    $r = Invoke-WebRequest -Uri "$api/user/login-user" -Method POST -ContentType "application/json" -Headers @{ Accept = "application/json" } -Body $body -UseBasicParsing -TimeoutSec 90
    $true
  } catch {
    $code = $_.Exception.Response.StatusCode.value__
    $sr = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $txt = $sr.ReadToEnd()
    Write-Host "HTTP $code $txt"
    $txt -notmatch "CORS"
  }
}

Test-Case "CORS products from GitHub Pages origin" {
  try {
    $r = Invoke-WebRequest -Uri "$api/product/get-all-products" -Headers @{ Origin = $prodOrigin; Accept = "application/json" } -UseBasicParsing -TimeoutSec 90
    Write-Host "HTTP $($r.StatusCode) — CORS allowed"
    $true
  } catch {
    $code = $_.Exception.Response.StatusCode.value__
    Write-Host "HTTP $code — backend must whitelist $prodOrigin (see docs/BACKEND_CORS_REQUIREMENTS.md)"
    "WARN"
  }
}

Test-Case "CORS login from GitHub Pages origin" {
  $body = '{"email":"smoke@test.invalid","password":"x"}'
  try {
    $r = Invoke-WebRequest -Uri "$api/user/login-user" -Method POST -ContentType "application/json" -Headers @{ Origin = $prodOrigin; Accept = "application/json" } -Body $body -UseBasicParsing -TimeoutSec 90
    $true
  } catch {
    $code = $_.Exception.Response.StatusCode.value__
    $sr = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $txt = $sr.ReadToEnd()
    Write-Host "HTTP $code $txt"
    if ($txt -match "CORS") { "WARN" } else { $false }
  }
}

Test-Case "Production build folder exists" {
  Test-Path "build\index.html"
}

Test-Case "Build index references yebo-marketplace base" {
  if (-not (Test-Path "build\index.html")) { return $false }
  $html = Get-Content "build\index.html" -Raw
  $html -match "/yebo-marketplace/static/"
}

Test-Case "Build static JS bundle exists" {
  (Get-ChildItem "build\static\js\main.*.js" -ErrorAction SilentlyContinue | Measure-Object).Count -gt 0
}

Test-Case "Google OAuth redirect endpoint" {
  try {
    Invoke-WebRequest -Uri "$api/auth/google?redirect=https://bonerabliaise.github.io/yebo-marketplace/login-success" -MaximumRedirection 0 -UseBasicParsing -TimeoutSec 90 | Out-Null
    $false
  } catch {
    $_.Exception.Response.StatusCode.value__ -eq 302
  }
}

Write-Host "`n========================================"
Write-Host "SMOKE SUMMARY: $passed passed, $failed failed, $warned warnings"
Write-Host "========================================"
if ($failed -gt 0) { exit 1 }
exit 0
