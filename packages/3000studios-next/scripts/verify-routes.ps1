# Check for key routes to ensure integrity
$expected = @(
    "app/page.tsx",
    "app/about/page.tsx",
    "app/blog/page.tsx",
    "app/contact/page.tsx",
    "app/portfolio/page.tsx",
    "app/projects/page.tsx",
    "app/jws/page.tsx",
    "app/live/page.tsx",
    "app/store/page.tsx",
    "app/apps/page.tsx",
    "app/revenue/page.tsx",
    "app/vendors-platform/page.tsx",
    "app/login/page.tsx",
    "app/admin/page.tsx",
    "app/admin/revenue/page.tsx",
    "app/admin/settings/page.tsx"
)

$missing = $expected | Where-Object { -not (Test-Path $_) }

if ($missing.Count -gt 0) {
    Write-Error "❌ Missing routes:`n$($missing -join "`n")"
    exit 1
}

Write-Host "✅ All routes verified"
