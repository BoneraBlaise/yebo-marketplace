# Deploy build/ to GitHub Pages gh-pages branch (Windows-safe)
$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$work = "C:\yebo-ghp"
$remote = "https://github.com/BoneraBlaise/yebo-marketplace.git"

Set-Location $repoRoot
Write-Host "Building production bundle..."
npm run build
if ($LASTEXITCODE -ne 0) { throw "Build failed" }

Copy-Item -Path "$repoRoot\build\index.html" -Destination "$repoRoot\build\404.html" -Force
Write-Host "Created build/404.html for SPA deep links"

if (Test-Path $work) { Remove-Item $work -Recurse -Force }
git clone --branch gh-pages --single-branch $remote $work 2>$null
Set-Location $work
if ($LASTEXITCODE -ne 0) {
  git clone $remote $work
  Set-Location $work
  git checkout --orphan gh-pages
  git rm -rf . 2>$null
}

Get-ChildItem -Force | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force
Copy-Item -Path "$repoRoot\build\*" -Destination $work -Recurse -Force
if (-not (Test-Path "$work\.nojekyll")) { New-Item -ItemType File -Path "$work\.nojekyll" | Out-Null }

git add -A
$sha = git -C $repoRoot rev-parse --short HEAD
git commit -m "deploy: production build from main@$sha"
git push origin gh-pages
Write-Host "Deployed to gh-pages. Enable GitHub Pages in repo Settings if not already active."
Write-Host "URL: https://bonerabliaise.github.io/yebo-marketplace/"
