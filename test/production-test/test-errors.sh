#!/bin/bash

# Rootly SDK Comprehensive Test Suite
# Tests all SDK features documented in README

echo "=========================================="
echo "Rootly SDK Comprehensive Test Suite"
echo "=========================================="
echo ""

BASE_URL="${1:-http://localhost:3000}"
echo "Testing against: $BASE_URL"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

test_count=0

run_test() {
    test_count=$((test_count + 1))
    echo -e "${BLUE}[$test_count] $1${NC}"
    echo "→ $2"
    eval $2 2>/dev/null
    echo ""
    sleep 0.5
}

echo "=========================================="
echo "CATEGORY 1: Normal Operations"
echo "Expected: NO errors in Rootly"
echo "=========================================="
echo ""

run_test "Health Check" "curl -s $BASE_URL/health | jq -r '.status'"
run_test "Get All Users" "curl -s $BASE_URL/api/users | jq -r '.success'"
run_test "Get User #1" "curl -s $BASE_URL/api/users/1 | jq -r '.user.name'"
run_test "Calculate 10+2" "curl -s '$BASE_URL/api/calculate?a=10&b=2' | jq -r '.result'"

echo "=========================================="
echo "CATEGORY 2: Automatic Error Capture"
echo "Expected: 3 errors in Rootly"
echo "=========================================="
echo ""

run_test "Uncaught Exception" "curl -s $BASE_URL/test/uncaught-exception | jq -r '.message'"
run_test "Unhandled Rejection" "curl -s $BASE_URL/test/unhandled-rejection | jq -r '.message'"
run_test "Async Error" "curl -s $BASE_URL/test/async-error | jq -r '.error'"

echo "=========================================="
echo "CATEGORY 3: Manual Error Capture"
echo "Expected: 5 errors in Rootly"
echo "=========================================="
echo ""

run_test "Basic Manual Capture" "curl -s $BASE_URL/test/manual-capture | jq -r '.message'"
run_test "Capture with Context" "curl -s '$BASE_URL/test/capture-with-context?userId=12345' | jq -r '.message'"
run_test "Severity Levels (3 errors)" "curl -s $BASE_URL/test/severity-levels | jq -r '.message'"

echo "=========================================="
echo "CATEGORY 4: Express Middleware"
echo "Expected: 1 error in Rootly (only 500)"
echo "=========================================="
echo ""

run_test "Express 500 Error (captured)" "curl -s $BASE_URL/test/express-500 | jq -r '.error'"
run_test "Express 404 Error (NOT captured)" "curl -s $BASE_URL/test/express-404 | jq -r '.error'"
run_test "Validation Error (NOT captured)" "curl -s -X POST $BASE_URL/test/express-validation | jq -r '.error'"

echo "=========================================="
echo "CATEGORY 5: Function Wrapping"
echo "Expected: 2 errors in Rootly"
echo "=========================================="
echo ""

run_test "Wrapped Sync Error" "curl -s '$BASE_URL/test/wrapped-sync?value=-5' | jq -r '.error'"
run_test "Wrapped Sync Success" "curl -s '$BASE_URL/test/wrapped-sync?value=10' | jq -r '.result'"
run_test "Wrapped Async Error" "curl -s $BASE_URL/test/wrapped-async | jq -r '.error'"
run_test "Wrapped Async Success" "curl -s '$BASE_URL/test/wrapped-async?userId=1' | jq -r '.user.name'"

echo "=========================================="
echo "CATEGORY 6: Serverless Simulation"
echo "Expected: 1 error in Rootly"
echo "=========================================="
echo ""

run_test "Serverless Success" "curl -s $BASE_URL/test/serverless-handler | jq -r '.message'"
run_test "Serverless Error + Flush" "curl -s '$BASE_URL/test/serverless-handler?fail=true' | jq -r '.error'"

echo "=========================================="
echo "CATEGORY 7: Edge Cases"
echo "Expected: ~4-5 errors in Rootly"
echo "=========================================="
echo ""

run_test "Null Reference Error" "curl -s '$BASE_URL/test/null-reference?userId=999' | jq -r '.error'"
run_test "Type Error" "curl -s '$BASE_URL/test/type-error?a=hello&b=world' | jq -r '.error'"
run_test "Database Timeout (random)" "curl -s $BASE_URL/test/database-timeout | jq -r '.error // .success'"
run_test "Payment Error - Insufficient Funds" "curl -s -X POST $BASE_URL/test/payment-error -H 'Content-Type: application/json' -d '{\"userId\": 1, \"amount\": 5000}' | jq -r '.error'"
run_test "Payment Error - Invalid User" "curl -s -X POST $BASE_URL/test/payment-error -H 'Content-Type: application/json' -d '{\"userId\": 999, \"amount\": 100, \"cardNumber\": \"1234567890123456\"}' | jq -r '.error'"

echo ""
echo "=========================================="
echo "✅ Test Suite Complete!"
echo "=========================================="
echo "Total Tests Run: $test_count"
echo ""
echo "📊 Expected Errors in Rootly Dashboard:"
echo "  - Category 1: 0 errors (normal operations)"
echo "  - Category 2: 3 errors (automatic capture)"
echo "  - Category 3: 5 errors (manual capture)"
echo "  - Category 4: 1 error (Express 500 only)"
echo "  - Category 5: 2 errors (wrapped functions)"
echo "  - Category 6: 1 error (serverless)"
echo "  - Category 7: 4-5 errors (edge cases)"
echo ""
echo "Total Expected: ~16-17 errors"
echo ""
echo "🔍 Check your Rootly dashboard now!"
echo "=========================================="
