#!/bin/bash

# Rootly Production Test - Automated Error Testing Script
# This script tests all error scenarios and verifies SDK capture

echo "🧪 Starting Rootly Production Test Suite"
echo "=========================================="
echo ""

BASE_URL="${1:-http://localhost:3000}"

echo "📍 Testing against: $BASE_URL"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_count=0
error_count=0

run_test() {
    test_count=$((test_count + 1))
    echo -e "${YELLOW}Test $test_count: $1${NC}"
    echo "Command: $2"
    eval $2
    echo ""
    sleep 1
}

echo "✅ Testing Working Endpoints (Should NOT generate errors)"
echo "-----------------------------------------------------------"

run_test "Health Check" "curl -s $BASE_URL/ | jq ."
run_test "Get All Users" "curl -s $BASE_URL/api/users | jq ."
run_test "Get Valid User" "curl -s $BASE_URL/api/users/1 | jq ."
run_test "Valid Division" "curl -s '$BASE_URL/api/divide?a=10&b=2' | jq ."

echo ""
echo "❌ Testing Error Scenarios (SHOULD generate errors in Rootly)"
echo "----------------------------------------------------------------"

run_test "Null Reference Error - Invalid User ID" "curl -s $BASE_URL/api/users/999 | jq ."

run_test "Division by Zero" "curl -s '$BASE_URL/api/divide?a=10&b=0' | jq ."

run_test "Type Error - Invalid Division Input" "curl -s '$BASE_URL/api/divide?a=abc&b=5' | jq ."

run_test "Async Error - Missing User ID" "curl -s $BASE_URL/api/async-task | jq ."

run_test "Async Error - Invalid User" "curl -s '$BASE_URL/api/async-task?userId=999' | jq ."

run_test "Database Query Error" "curl -s '$BASE_URL/api/db/query?table=users' | jq ."

run_test "Payment Error - Insufficient Funds" "curl -s -X POST $BASE_URL/api/payments -H 'Content-Type: application/json' -d '{\"userId\": 1, \"amount\": 5000}' | jq ."

run_test "Payment Error - Invalid User" "curl -s -X POST $BASE_URL/api/payments -H 'Content-Type: application/json' -d '{\"userId\": 999, \"amount\": 100, \"cardNumber\": \"1234567890123456\"}' | jq ."

run_test "Order Error - Missing Items" "curl -s -X POST $BASE_URL/api/orders -H 'Content-Type: application/json' -d '{\"userId\": 1, \"total\": 100}' | jq ."

run_test "Order Error - Invalid User" "curl -s -X POST $BASE_URL/api/orders -H 'Content-Type: application/json' -d '{\"userId\": 999, \"items\": [{\"name\": \"Product\"}], \"total\": 50}' | jq ."

run_test "Unhandled Promise Rejection" "curl -s $BASE_URL/api/unhandled-promise | jq ."

run_test "JSON Parse Error" "curl -s '$BASE_URL/api/sync-error?config=invalid-json' | jq ."

echo ""
echo "=========================================="
echo "✅ Test Suite Complete!"
echo "📊 Total Tests Run: $test_count"
echo ""
echo "🔍 Check your Rootly dashboard to verify all errors were captured!"
echo "Expected: ~12 errors should appear in the dashboard"
echo "=========================================="
