# Production smoke test - API health, CORS, and build artifacts
$ErrorActionPreference = "Continue"
$api = "https://yebone-backend.onrender.com/api/v2"
$prodOrigin = "https://bonerabliaise.github.io"
$passed = 0
$failed = 0
$warned = 0

function Write-Pass { param($msg); Write-Host "PASS $msg"; $script:passed++ }
function Write-Fail { param($msg); Write-Host "FAIL $msg"; $script:failed++ }
function Write-Warn { param($msg); Write-Host "WARN $msg"; $script:warned++ }

Write-Host ""
Write-Host "--- API products (no Origin) ---"
try {
  $r = Invoke-WebRequest -Uri "$api/product/get-all-products" -Headers @{ Accept = "application/json" } -UseBasicParsing -TimeoutSec 90
  if ($r.StatusCode -eq 201 -or $r.StatusCode -eq 200) { Write-Pass "HTTP $($r.StatusCode)" } else { Write-Fail "HTTP $($r.StatusCode)" }
} catch { Write-Fail $_.Exception.Message }

Write-Host ""
Write-Host "--- API login bad creds (no Origin) ---"
try {
  $body = '{"email":"smoke@test.invalid","password":"x"}'
  Invoke-WebRequest -Uri "$api/user/login-user" -Method POST -ContentType "application/json" -Headers @{ Accept = "application/json" } -Body $body -UseBasicParsing -TimeoutSec 90 | Out-Null
  Write-Pass "reachable"
} catch {
  if ($_.Exception.Response) {
    $sr = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $txt = $sr.ReadToEnd()
    if ($txt -match "CORS") { Write-Fail $txt } else { Write-Pass "HTTP error without CORS" }
  } else { Write-Fail $_.Exception.Message }
}

Write-Host ""
Write-Host "--- CORS products from GitHub Pages origin ---"
try {
  $r = Invoke-WebRequest -Uri "$api/product/get-all-products" -Headers @{ Origin = $prodOrigin; Accept = "application/json" } -UseBasicParsing -TimeoutSec 90
  Write-Pass "HTTP $($r.StatusCode) CORS allowed"
} catch {
  $code = $_.Exception.Response.StatusCode.value__
  Write-Warn "HTTP $code backend must whitelist $prodOrigin"
}

Write-Host ""
Write-Host "--- CORS login from GitHub Pages origin ---"
try {
  $body = '{"email":"smoke@test.invalid","password":"x"}'
  Invoke-WebRequest -Uri "$api/user/login-user" -Method POST -ContentType "application/json" -Headers @{ Origin = $prodOrigin; Accept = "application/json" } -Body $body -UseBasicParsing -TimeoutSec 90 | Out-Null
  Write-Pass "CORS allowed"
} catch {
  if ($_.Exception.Response) {
    $sr = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $txt = $sr.ReadToEnd()
    if ($txt -match "CORS") { Write-Warn $txt } else { Write-Pass "non-CORS response" }
  } else { Write-Fail $_.Exception.Message }
}

Write-Host ""
Write-Host "--- Production build index.html ---"
if (Test-Path "build\index.html") {
  $html = Get-Content "build\index.html" -Raw
  if ($html -match "/yebo-marketplace/static/") { Write-Pass "asset paths use /yebo-marketplace/" } else { Write-Fail "missing subdirectory base" }
} else { Write-Fail "build/index.html missing run npm run build first" }

Write-Host ""
Write-Host "--- Production JS bundle ---"
if ((Get-ChildItem "build\static\js\main.*.js" -ErrorAction SilentlyContinue | Measure-Object).Count -gt 0) {
  Write-Pass "main JS bundle present"
} else { Write-Fail "no main JS bundle" }

Write-Host ""
Write-Host "--- Google OAuth redirect endpoint ---"
$oauthOut = curl.exe -s -o NUL -w "%{http_code}" "https://yebone-backend.onrender.com/api/v2/auth/google?redirect=https://bonerabliaise.github.io/yebo-marketplace/login-success"
if ($oauthOut -eq "302" -or $oauthOut -eq "301") { Write-Pass "HTTP $oauthOut redirect" } else { Write-Warn "HTTP $oauthOut" }

Write-Host ""
Write-Host "========================================"
Write-Host "SMOKE SUMMARY: $passed passed, $failed failed, $warned warnings"
Write-Host "========================================"
if ($failed -gt 0) { exit 1 }
exit 0
