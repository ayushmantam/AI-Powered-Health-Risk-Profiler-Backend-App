# Health Risk Profiler API - Complete Postman Testing Guide

## Prerequisites

1. **Start the Server**
   ```bash
   cd health-risk-profiler
   npm start
   ```
   The server will run on `http://localhost:3000`

2. **Set up Environment Variables** (Optional but recommended)
   - Set `GEMINI_API_KEY` for AI features
   - Set `MONGODB_URI` for database features

3. **Import Postman Collection**
   - Import the `POSTMAN_COLLECTION.json` file into Postman
   - The collection includes all endpoints with pre-configured requests

## API Endpoints Overview

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Server health check |
| `/api/health/parse` | POST | Parse input (JSON/Text/Image) |
| `/api/health/extract-factors` | POST | Extract risk factors |
| `/api/health/classify-risk` | POST | Classify risk level |
| `/api/health/recommendations` | POST | Generate recommendations |
| `/api/health/complete-profile` | POST | Complete workflow |

---

## Step-by-Step Testing Guide

### 1. Health Check
**Endpoint:** `GET http://localhost:3000/health`

**Purpose:** Verify server is running

**Steps:**
1. Open Postman
2. Create new request
3. Set method to `GET`
4. Set URL to `http://localhost:3000/health`
5. Click Send

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-04T20:00:00.000Z",
  "service": "Health Risk Profiler API"
}
```

---

### 2. Parse Input - JSON Data
**Endpoint:** `POST http://localhost:3000/api/health/parse`

**Purpose:** Parse structured health data from JSON

**Steps:**
1. Set method to `POST`
2. Set URL to `http://localhost:3000/api/health/parse`
3. Go to Headers tab
4. Add header: `Content-Type: application/json`
5. Go to Body tab
6. Select `raw` and `JSON`
7. Enter this JSON:
```json
{
  "age": 42,
  "smoker": true,
  "exercise": "rarely",
  "diet": "high sugar"
}
```
8. Click Send

**Expected Response:**
```json
{
  "answers": {
    "age": 42,
    "smoker": true,
    "exercise": "rarely",
    "diet": "high sugar"
  },
  "missing_fields": [],
  "confidence": 0.95,
  "raw_text": undefined
}
```

---

### 3. Parse Input - Text Data
**Endpoint:** `POST http://localhost:3000/api/health/parse`

**Purpose:** Parse unstructured text using AI

**Steps:**
1. Set method to `POST`
2. Set URL to `http://localhost:3000/api/health/parse`
3. Go to Headers tab
4. Add header: `Content-Type: application/json`
5. Go to Body tab
6. Select `raw` and `JSON`
7. Enter this JSON:
```json
{
  "text": "Age: 42, Smoker: yes, Exercise: rarely, Diet: high sugar"
}
```
8. Click Send

**Expected Response:**
```json
{
  "answers": {
    "age": 42,
    "smoker": true,
    "exercise": "rarely",
    "diet": "high sugar"
  },
  "missing_fields": [],
  "confidence": 0.85,
  "raw_text": "Age: 42, Smoker: yes, Exercise: rarely, Diet: high sugar"
}
```

---

### 4. Parse Input - Image Upload
**Endpoint:** `POST http://localhost:3000/api/health/parse`

**Purpose:** Extract data from scanned health survey image

**Steps:**
1. Set method to `POST`
2. Set URL to `http://localhost:3000/api/health/parse`
3. Go to Body tab
4. Select `form-data`
5. Add key: `image` (⚠️ **IMPORTANT**: The field name must be exactly `image`)
6. Change type from `Text` to `File`
7. Click `Select Files` and choose a health survey image (JPG/PNG)
8. Click Send

**⚠️ Common Error Fix:**
If you get "Unexpected field" error, make sure:
- The field name is exactly `image` (not `file`, `upload`, or anything else)
- You're using `form-data` body type (not `raw`)
- The file is a valid image format (JPG, PNG)

**Expected Response:**
```json
{
  "answers": {
    "age": 42,
    "smoker": true,
    "exercise": "rarely",
    "diet": "high sugar"
  },
  "missing_fields": [],
  "confidence": 0.75,
  "raw_text": "Extracted text from image..."
}
```

---

### 5. Test Incomplete Profile (Guardrail)
**Endpoint:** `POST http://localhost:3000/api/health/parse`

**Purpose:** Test validation for incomplete data

**Steps:**
1. Set method to `POST`
2. Set URL to `http://localhost:3000/api/health/parse`
3. Go to Headers tab
4. Add header: `Content-Type: application/json`
5. Go to Body tab
6. Select `raw` and `JSON`
7. Enter this JSON (incomplete data):
```json
{
  "age": 42
}
```
8. Click Send

**Expected Response:**
```json
{
  "status": "incomplete_profile",
  "reason": "Profile is incomplete. Please provide more information.",
  "missing_fields": ["smoker", "exercise", "diet"],
  "completeness": 0.25
}
```

---

### 6. Extract Risk Factors
**Endpoint:** `POST http://localhost:3000/api/health/extract-factors`

**Purpose:** Identify risk factors from health profile

**Steps:**
1. Set method to `POST`
2. Set URL to `http://localhost:3000/api/health/extract-factors`
3. Go to Headers tab
4. Add header: `Content-Type: application/json`
5. Go to Body tab
6. Select `raw` and `JSON`
7. Enter this JSON:
```json
{
  "answers": {
    "age": 42,
    "smoker": true,
    "exercise": "rarely",
    "diet": "high sugar"
  }
}
```
8. Click Send

**Expected Response:**
```json
{
  "factors": ["smoking", "poor diet", "low exercise", "high sugar intake"],
  "confidence": 0.88
}
```

---

### 7. Classify Risk Level
**Endpoint:** `POST http://localhost:3000/api/health/classify-risk`

**Purpose:** Determine risk level based on profile and factors

**Steps:**
1. Set method to `POST`
2. Set URL to `http://localhost:3000/api/health/classify-risk`
3. Go to Headers tab
4. Add header: `Content-Type: application/json`
5. Go to Body tab
6. Select `raw` and `JSON`
7. Enter this JSON:
```json
{
  "answers": {
    "age": 42,
    "smoker": true,
    "exercise": "rarely",
    "diet": "high sugar"
  },
  "factors": ["smoking", "poor diet", "low exercise"]
}
```
8. Click Send

**Expected Response:**
```json
{
    "risk_level": "moderate",
    "score": 65,
    "rationale": [
        "smoking",
        "low physical activity",
        "unhealthy diet",
        "high sugar intake"
    ]
}
```

---

### 8. Generate Recommendations
**Endpoint:** `POST http://localhost:3000/api/health/recommendations`

**Purpose:** Get personalized health recommendations

**Steps:**
1. Set method to `POST`
2. Set URL to `http://localhost:3000/api/health/recommendations`
3. Go to Headers tab
4. Add header: `Content-Type: application/json`
5. Go to Body tab
6. Select `raw` and `JSON`
7. Enter this JSON:
```json
{
  "risk_level": "high",
  "factors": ["smoking", "poor diet", "low exercise"]
}
```
8. Click Send

**Expected Response:**
```json
{
  "risk_level": "high",
  "factors": ["smoking", "poor diet", "low exercise"],
  "recommendations": [
    "Consider smoking cessation programs and nicotine replacement therapy",
    "Reduce sugar intake and incorporate more fruits, vegetables, and whole grains",
    "Start with light exercise like walking 15-20 minutes daily",
    "Schedule regular health check-ups with your doctor",
    "Consider stress management techniques like meditation or yoga"
  ],
  "status": "ok"
}
```

---

### 9. Complete Profile Flow - JSON
**Endpoint:** `POST http://localhost:3000/api/health/complete-profile`

**Purpose:** Run entire workflow in one request

**Steps:**
1. Set method to `POST`
2. Set URL to `http://localhost:3000/api/health/complete-profile`
3. Go to Headers tab
4. Add header: `Content-Type: application/json`
5. Go to Body tab
6. Select `raw` and `JSON`
7. Enter this JSON:
```json
{
  "age": 42,
  "smoker": true,
  "exercise": "rarely",
  "diet": "high sugar"
}
```
8. Click Send

**Expected Response:**
```json
{
  "profile": {
    "answers": {
      "age": 42,
      "smoker": true,
      "exercise": "rarely",
      "diet": "high sugar"
    },
    "confidence": 0.95
  },
  "factors": {
    "list": ["smoking", "poor diet", "low exercise"],
    "confidence": 0.88
  },
  "risk": {
    "risk_level": "high",
    "risk_score": 8.5,
    "confidence": 0.9
  },
  "recommendations": [
    "Consider smoking cessation programs...",
    "Reduce sugar intake..."
  ],
  "status": "ok"
}
```

---

### 10. Complete Profile Flow - Image
**Endpoint:** `POST http://localhost:3000/api/health/complete-profile`

**Purpose:** Run entire workflow with image input

**Steps:**
1. Set method to `POST`
2. Set URL to `http://localhost:3000/api/health/complete-profile`
3. Go to Body tab
4. Select `form-data`
5. Add key: `image` (⚠️ **IMPORTANT**: The field name must be exactly `image`)
6. Change type from `Text` to `File`
7. Click `Select Files` and choose a health survey image
8. Click Send

**Expected Response:**
```json
{
  "profile": {
    "answers": {
      "age": 42,
      "smoker": true,
      "exercise": "rarely",
      "diet": "high sugar"
    },
    "confidence": 0.75
  },
  "factors": {
    "list": ["smoking", "poor diet", "low exercise"],
    "confidence": 0.88
  },
  "risk": {
    "risk_level": "high",
    "risk_score": 8.5,
    "confidence": 0.9
  },
  "recommendations": [
    "Consider smoking cessation programs...",
    "Reduce sugar intake..."
  ],
  "status": "ok"
}
```

---

## Test Scenarios

### Low Risk Profile Test
Use this data for testing low-risk scenarios:
```json
{
  "age": 25,
  "smoker": false,
  "exercise": "daily",
  "diet": "balanced and healthy"
}
```

### Moderate Risk Profile Test
Use this data for testing moderate-risk scenarios:
```json
{
  "age": 45,
  "smoker": false,
  "exercise": "sometimes",
  "diet": "moderate sugar intake"
}
```

### High Risk Profile Test
Use this data for testing high-risk scenarios:
```json
{
  "age": 55,
  "smoker": true,
  "exercise": "never",
  "diet": "high fat and sugar, processed foods"
}
```

---

## Error Testing

### Missing Required Fields
Test with missing data to verify error handling:
```json
{
  "age": 42
}
```

### Invalid Data Types
Test with wrong data types:
```json
{
  "age": "not a number",
  "smoker": "maybe",
  "exercise": "invalid_option",
  "diet": 123
}
```

### Large File Upload
Test with oversized images (should be limited to 5MB by default).

---

## Environment Variables Setup

### For AI Features (Optional)
1. Get a Gemini API key from Google AI Studio
2. Set environment variable:
   - Windows: `set GEMINI_API_KEY=your_api_key_here`
   - Linux/Mac: `export GEMINI_API_KEY=your_api_key_here`

### For Database Features (Optional)
1. Set up MongoDB connection
2. Set environment variable:
   - Windows: `set MONGODB_URI=mongodb://localhost:27017/health-risk-profiler`
   - Linux/Mac: `export MONGODB_URI=mongodb://localhost:27017/health-risk-profiler`

---

## Troubleshooting

### Common Issues:

1. **"generateContent is not a function"**
   - Set the GEMINI_API_KEY environment variable
   - Restart the server

2. **"File too large"**
   - Images should be under 5MB
   - Supported formats: JPG, PNG

3. **"Connection refused"**
   - Ensure server is running on port 3000
   - Check if port is already in use

4. **"MongoDB Connection Error"**
   - This is optional - server runs without database
   - Set MONGODB_URI if you want database features

### Server Logs
Monitor server logs for detailed error information:
```bash
npm run dev  # For development with auto-restart
```

---

## Performance Testing

### Load Testing with Postman
1. Create a collection runner
2. Set iterations to 10-50
3. Add delay between requests (1-2 seconds)
4. Monitor response times and success rates

### Image Processing Testing
- Test with different image sizes and qualities
- Test with various image formats (JPG, PNG)
- Test OCR accuracy with different fonts and layouts

---

This guide covers all available API endpoints with detailed step-by-step instructions. Use the imported Postman collection for quick testing, or follow the manual steps above.
