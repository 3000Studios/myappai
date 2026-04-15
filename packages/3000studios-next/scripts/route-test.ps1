$routes = @(
    "/",
    "/about",
    "/blog",
    "/contact",
    "/portfolio",
    "/projects",
    "/jws",
    "/live",
    "/store",
    "/apps",
    "/revenue",
    "/vendors-platform",
    "/login"
)

Write-Host ""
Write-Host "🧪 ROUTE TESTING" -ForegroundColor Cyan
Write-Host "=================" -ForegroundColor Cyan
Write-Host ""

foreach ($route in $routes) {
    Write-Host "  Testing route: $route" -ForegroundColor Yellow
  
    # Check if page.tsx exists for this route
    $routePath = "app" + $route.Replace("/", "\")
    if ($route -eq "/") {
        $routePath = "app"
    }
  
    $pagePath = Join-Path $routePath "page.tsx"
  
    if (Test-Path $pagePath) {
        Write-Host "    ✅ EXISTS" -ForegroundColor Green
    }
    else {
        Write-Host "    ❌ MISSING" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ ROUTE TEST COMPLETE" -ForegroundColor Green
Write-Host ""
