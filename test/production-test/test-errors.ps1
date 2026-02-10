# Rootly SDK Comprehensive Test Suite
# Tests all SDK features documented in README

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Rootly SDK Comprehensive Test Suite" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$BASE_URL = if ($args[0]) { $args[0] } else { "http://localhost:3000" }
Write-Host "Testing against: $BASE_URL" -ForegroundColor Yellow
Write-Host ""

$testCount = 0

function Run-Test {
    param(
        [string]$Name,
        [string]$Url
    )
    
    $script:testCount++
    Write-Host "[$script:testCount] $Name" -ForegroundColor Blue
    Write-Host "→ $Url" -ForegroundColor Gray
    
    try {
        $response = Invoke-RestMethod -Uri $Url -Method Get -ErrorAction SilentlyContinue
        Write-Host ($response | ConvertTo-Json -Compress) -ForegroundColor Green
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
    Start-Sleep -Milliseconds 500
}

function Run-PostTest {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Body
    )
    
    $script:testCount++
    Write-Host "[$script:testCount] $Name" -ForegroundColor Blue
    Write-Host "→ POST $Url" -ForegroundColor Gray
    
    try {
        $response = Invoke-RestMethod -Uri $Url -Method Post -Body $Body -ContentType "application/json" -ErrorAction SilentlyContinue
        Write-Host ($response | ConvertTo-Json -Compress) -ForegroundColor Green
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
    Start-Sleep -Milliseconds 500
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "CATEGORY 1: Normal Operations" -ForegroundColor Cyan
Write-Host "Expected: NO errors in Rootly" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Run-Test "Health Check" "$BASE_URL/health"
Run-Test "Get All Users" "$BASE_URL/api/users"
Run-Test "Get User #1" "$BASE_URL/api/users/1"
Run-Test "Calculate 10+2" "$BASE_URL/api/calculate?a=10&b=2"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "CATEGORY 2: Automatic Error Capture" -ForegroundColor Cyan
Write-Host "Expected: 3 errors in Rootly" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Run-Test "Uncaught Exception" "$BASE_URL/test/uncaught-exception"
Run-Test "Unhandled Rejection" "$BASE_URL/test/unhandled-rejection"
Run-Test "Async Error" "$BASE_URL/test/async-error"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "CATEGORY 3: Manual Error Capture" -ForegroundColor Cyan
Write-Host "Expected: 5 errors in Rootly" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Run-Test "Basic Manual Capture" "$BASE_URL/test/manual-capture"
Run-Test "Capture with Context" "$BASE_URL/test/capture-with-context?userId=12345"
Run-Test "Severity Levels (3 errors)" "$BASE_URL/test/severity-levels"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "CATEGORY 4: Express Middleware" -ForegroundColor Cyan
Write-Host "Expected: 1 error in Rootly (only 500)" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Run-Test "Express 500 Error (captured)" "$BASE_URL/test/express-500"
Run-Test "Express 404 Error (NOT captured)" "$BASE_URL/test/express-404"
Run-PostTest "Validation Error (NOT captured)" "$BASE_URL/test/express-validation" "{}"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "CATEGORY 5: Function Wrapping" -ForegroundColor Cyan
Write-Host "Expected: 2 errors in Rootly" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Run-Test "Wrapped Sync Error" "$BASE_URL/test/wrapped-sync?value=-5"
Run-Test "Wrapped Sync Success" "$BASE_URL/test/wrapped-sync?value=10"
Run-Test "Wrapped Async Error" "$BASE_URL/test/wrapped-async"
Run-Test "Wrapped Async Success" "$BASE_URL/test/wrapped-async?userId=1"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "CATEGORY 6: Serverless Simulation" -ForegroundColor Cyan
Write-Host "Expected: 1 error in Rootly" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Run-Test "Serverless Success" "$BASE_URL/test/serverless-handler"
Run-Test "Serverless Error + Flush" "$BASE_URL/test/serverless-handler?fail=true"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "CATEGORY 7: Edge Cases" -ForegroundColor Cyan
Write-Host "Expected: ~4-5 errors in Rootly" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Run-Test "Null Reference Error" "$BASE_URL/test/null-reference?userId=999"
Run-Test "Type Error" "$BASE_URL/test/type-error?a=hello&b=world"
Run-Test "Database Timeout (random)" "$BASE_URL/test/database-timeout"
Run-PostTest "Payment Error - Insufficient Funds" "$BASE_URL/test/payment-error" '{"userId": 1, "amount": 5000}'
Run-PostTest "Payment Error - Invalid User" "$BASE_URL/test/payment-error" '{"userId": 999, "amount": 100, "cardNumber": "1234567890123456"}'

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✅ Test Suite Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Total Tests Run: $testCount" -ForegroundColor Yellow
Write-Host ""
Write-Host "📊 Expected Errors in Rootly Dashboard:" -ForegroundColor Yellow
Write-Host "  - Category 1: 0 errors (normal operations)" -ForegroundColor Gray
Write-Host "  - Category 2: 3 errors (automatic capture)" -ForegroundColor Gray
Write-Host "  - Category 3: 5 errors (manual capture)" -ForegroundColor Gray
Write-Host "  - Category 4: 1 error (Express 500 only)" -ForegroundColor Gray
Write-Host "  - Category 5: 2 errors (wrapped functions)" -ForegroundColor Gray
Write-Host "  - Category 6: 1 error (serverless)" -ForegroundColor Gray
Write-Host "  - Category 7: 4-5 errors (edge cases)" -ForegroundColor Gray
Write-Host ""
Write-Host "Total Expected: ~16-17 errors" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔍 Check your Rootly dashboard now!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
