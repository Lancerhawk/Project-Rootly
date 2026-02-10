# Rootly Production Test Application

A realistic production-grade Express application with intentional error scenarios to test Rootly SDK error capture capabilities.

## 🎯 Purpose

This application simulates real-world coding mistakes and error scenarios to verify that Rootly SDK captures all errors correctly when deployed to Render.

## 🚀 Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

3. **Add your Rootly API key to `.env`:**
   ```
   ROOTLY_API_KEY=your_actual_api_key
   ```

4. **Run the app:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

5. **Visit:** http://localhost:3000

## 📦 Deploy to Render

1. **Push to GitHub**
2. **Create new Web Service on Render**
3. **Connect your repository**
4. **Configure:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment Variables:** Add `ROOTLY_API_KEY`

## 🧪 Error Scenarios to Test

### 1. **Null Reference Error** ❌
```bash
curl http://localhost:3000/api/users/999
```
**Expected:** `Cannot read property 'name' of undefined`

### 2. **Division by Zero / NaN** ❌
```bash
curl http://localhost:3000/api/divide?a=10&b=0
curl http://localhost:3000/api/divide?a=abc&b=5
```
**Expected:** Type errors and Infinity handling issues

### 3. **Async Promise Rejection** ❌
```bash
curl http://localhost:3000/api/async-task
curl http://localhost:3000/api/async-task?userId=999
```
**Expected:** Unhandled promise rejections

### 4. **Database Query Error** ❌
```bash
curl http://localhost:3000/api/db/query?table=users
```
**Expected:** Random connection timeouts and undefined property access

### 5. **Payment Processing Error** ❌
```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "amount": 5000}'

curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{"userId": 999, "amount": 100, "cardNumber": "1234567890123456"}'
```
**Expected:** Insufficient funds error, undefined user errors

### 6. **Order Creation Errors** ❌
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "total": 100}'

curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId": 999, "items": [{"name": "Product"}], "total": 50}'
```
**Expected:** Array access errors, undefined user errors

### 7. **Unhandled Promise Rejection** ❌
```bash
curl http://localhost:3000/api/unhandled-promise
```
**Expected:** Unhandled promise rejection

### 8. **JSON Parse Error** ❌
```bash
curl http://localhost:3000/api/sync-error?config=invalid-json
```
**Expected:** JSON parse error

## ✅ Working Endpoints

These endpoints work correctly and should NOT generate errors:

```bash
# Health check
curl http://localhost:3000/

# Get all users
curl http://localhost:3000/api/users

# Get specific user (valid ID)
curl http://localhost:3000/api/users/1

# Division (valid inputs)
curl http://localhost:3000/api/divide?a=10&b=2
```

## 📊 What to Verify

After deploying to Render and triggering errors:

1. ✅ All errors appear in Rootly dashboard
2. ✅ Error messages are accurate
3. ✅ Stack traces point to correct lines
4. ✅ Request context is captured (method, path, etc.)
5. ✅ Errors are deduplicated properly
6. ✅ Rate limiting works correctly

## 🔧 Environment Variables

- `ROOTLY_API_KEY` - Your Rootly API key (required)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (default: production)

## 📝 Notes

- All errors are **intentional** and represent common coding mistakes
- The app runs normally and doesn't crash
- Errors only occur when specific endpoints are called
- This simulates real production scenarios where bugs exist in code
