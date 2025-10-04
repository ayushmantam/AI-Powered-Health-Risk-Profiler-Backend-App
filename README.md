# Health Risk Profiler API

An AI-powered health risk assessment system that analyzes health survey data from multiple input sources (JSON, text, images) and provides personalized risk assessments and recommendations.

## 🚀 Features

- **Multi-Input Support**: Process health data from JSON, text, or scanned images
- **OCR Integration**: Extract text from health survey images using Tesseract.js
- **AI-Powered Analysis**: Use Google Gemini AI for intelligent data parsing and risk factor extraction
- **Risk Assessment**: Classify health risks into low, moderate, and high categories
- **Personalized Recommendations**: Generate actionable health recommendations
- **RESTful API**: Clean, well-documented API endpoints
- **Error Handling**: Comprehensive error handling and validation
- **File Upload Support**: Handle image uploads with proper validation

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Usage Examples](#usage-examples)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🔧 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (optional, for data persistence)
- **Google Gemini API Key** (optional, for AI features)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd health-risk-profiler
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # MongoDB Configuration (optional)
   MONGODB_URI=mongodb://localhost:27017/health-risk-profiler
   
   # Gemini AI Configuration (optional)
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # File Upload Configuration
   MAX_FILE_SIZE=5242880
   
   # OCR Configuration
   TESSERACT_PATH=C:\\Program Files\\Tesseract-OCR\\tesseract.exe
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 3000 | No |
| `NODE_ENV` | Environment mode | development | No |
| `MONGODB_URI` | MongoDB connection string | - | No |
| `GEMINI_API_KEY` | Google Gemini API key | - | No |
| `MAX_FILE_SIZE` | Max file upload size (bytes) | 5242880 (5MB) | No |
| `TESSERACT_PATH` | Tesseract OCR path | - | No |

### Getting API Keys

#### Google Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `GEMINI_API_KEY`

#### MongoDB (Optional)
- Install MongoDB locally or use MongoDB Atlas
- Add connection string to `MONGODB_URI`

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client        │    │   Express API    │    │   Services      │
│   (Postman/     │───▶│   (Routes &      │───▶│   (OCR, AI,     │
│   Frontend)     │    │    Controllers)  │    │    Risk)        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   Middleware     │
                       │   (Upload,       │
                       │    Error, CORS)  │
                       └──────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   External APIs  │
                       │   (Gemini AI,    │
                       │    Tesseract)    │
                       └──────────────────┘
```

### Project Structure

```
health-risk-profiler/
├── src/
│   ├── config/
│   │   ├── db.config.js          # MongoDB configuration
│   │   └── gemini.config.js      # Gemini AI configuration
│   ├── controllers/
│   │   └── health.controller.js  # API request handlers
│   ├── middlewares/
│   │   ├── error.middleware.js   # Error handling
│   │   └── upload.middleware.js  # File upload handling
│   ├── models/
│   │   └── healthProfile.model.js # MongoDB schema
│   ├── routes/
│   │   └── health.routes.js      # API routes
│   ├── services/
│   │   ├── ai.service.js         # Gemini AI integration
│   │   ├── ocr.service.js        # Tesseract OCR integration
│   │   └── risk.service.js       # Risk assessment logic
│   ├── utils/
│   │   ├── logger.js             # Logging utility
│   │   └── validation.js         # Input validation
│   ├── app.js                    # Express app configuration
│   └── server.js                 # Server entry point
├── uploads/                      # Temporary file storage
├── POSTMAN_COLLECTION.json       # Postman collection
├── API_TESTING_GUIDE.md          # Detailed testing guide
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

### Data Flow

1. **Input Processing**
   - JSON data → Direct validation
   - Text data → AI parsing
   - Image data → OCR → AI parsing

2. **Risk Assessment**
   - Extract risk factors using AI
   - Calculate risk score
   - Classify risk level

3. **Recommendations**
   - Generate personalized recommendations
   - Return comprehensive response

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Server health check |
| `/api/health/parse` | POST | Parse input (JSON/Text/Image) |
| `/api/health/extract-factors` | POST | Extract risk factors |
| `/api/health/classify-risk` | POST | Classify risk level |
| `/api/health/recommendations` | POST | Generate recommendations |
| `/api/health/complete-profile` | POST | Complete workflow |

### Health Check

**GET** `/health`

Check if the server is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-04T20:00:00.000Z",
  "service": "Health Risk Profiler API"
}
```

### Parse Input

**POST** `/api/health/parse`

Parse health survey data from various input sources.

#### JSON Input
```json
{
  "age": 42,
  "smoker": true,
  "exercise": "rarely",
  "diet": "high sugar"
}
```

#### Text Input
```json
{
  "text": "Age: 42, Smoker: yes, Exercise: rarely, Diet: high sugar"
}
```

#### Image Input
- Content-Type: `multipart/form-data`
- Field name: `image`
- Supported formats: JPG, PNG, JPEG
- Max size: 5MB

**Response:**
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
  "raw_text": "Extracted text from image..."
}
```

### Extract Risk Factors

**POST** `/api/health/extract-factors`

Extract health risk factors from a profile.

**Request:**
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

**Response:**
```json
{
  "factors": ["smoking", "poor diet", "low exercise"],
  "confidence": 0.88
}
```

### Classify Risk

**POST** `/api/health/classify-risk`

Classify health risk level.

**Request:**
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

**Response:**
```json
{
  "risk_level": "high",
  "risk_score": 8.5,
  "confidence": 0.9,
  "factors_analyzed": 3,
  "recommendations_needed": true
}
```

### Generate Recommendations

**POST** `/api/health/recommendations`

Generate personalized health recommendations.

**Request:**
```json
{
  "risk_level": "high",
  "factors": ["smoking", "poor diet", "low exercise"]
}
```

**Response:**
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

### Complete Profile Flow

**POST** `/api/health/complete-profile`

Run the entire workflow in one request.

**Request:** (Same as parse input - JSON, text, or image)

**Response:**
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

## 💡 Usage Examples

### cURL Examples

#### Health Check
```bash
curl -X GET http://localhost:3000/health
```

#### Parse JSON Input
```bash
curl -X POST http://localhost:3000/api/health/parse \
  -H "Content-Type: application/json" \
  -d '{
    "age": 42,
    "smoker": true,
    "exercise": "rarely",
    "diet": "high sugar"
  }'
```

#### Upload Image
```bash
curl -X POST http://localhost:3000/api/health/parse \
  -F "image=@/path/to/survey-image.jpg"
```

#### Complete Profile Flow
```bash
curl -X POST http://localhost:3000/api/health/complete-profile \
  -H "Content-Type: application/json" \
  -d '{
    "age": 42,
    "smoker": true,
    "exercise": "rarely",
    "diet": "high sugar"
  }'
```

### JavaScript/Node.js Example

```javascript
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api/health';

// Complete profile analysis
async function analyzeHealthProfile(profileData) {
  try {
    const response = await axios.post(`${API_BASE}/complete-profile`, profileData);
    
    console.log('Risk Level:', response.data.risk.risk_level);
    console.log('Risk Score:', response.data.risk.risk_score);
    console.log('Recommendations:', response.data.recommendations);
    
    return response.data;
  } catch (error) {
    console.error('Analysis failed:', error.response.data);
  }
}

// Example usage
const healthData = {
  age: 42,
  smoker: true,
  exercise: "rarely",
  diet: "high sugar"
};

analyzeHealthProfile(healthData);
```

### Python Example

```python
import requests
import json

API_BASE = "http://localhost:3000/api/health"

def analyze_health_profile(profile_data):
    try:
        response = requests.post(
            f"{API_BASE}/complete-profile",
            json=profile_data,
            headers={"Content-Type": "application/json"}
        )
        response.raise_for_status()
        
        data = response.json()
        print(f"Risk Level: {data['risk']['risk_level']}")
        print(f"Risk Score: {data['risk']['risk_score']}")
        print(f"Recommendations: {data['recommendations']}")
        
        return data
    except requests.exceptions.RequestException as e:
        print(f"Analysis failed: {e}")

# Example usage
health_data = {
    "age": 42,
    "smoker": True,
    "exercise": "rarely",
    "diet": "high sugar"
}

analyze_health_profile(health_data)
```

## 🧪 Testing

### Using Postman

1. **Import Collection**
   - Import `POSTMAN_COLLECTION.json` into Postman
   - All endpoints are pre-configured with example requests

2. **Run Tests**
   - Start the server: `npm start`
   - Open Postman collection
   - Run individual requests or the entire collection

### Manual Testing

1. **Start the server**
   ```bash
   npm start
   ```

2. **Test health endpoint**
   ```bash
   curl http://localhost:3000/health
   ```

3. **Test complete workflow**
   ```bash
   curl -X POST http://localhost:3000/api/health/complete-profile \
     -H "Content-Type: application/json" \
     -d '{"age": 25, "smoker": false, "exercise": "daily", "diet": "healthy"}'
   ```

### Test Scenarios

#### Low Risk Profile
```json
{
  "age": 25,
  "smoker": false,
  "exercise": "daily",
  "diet": "balanced and healthy"
}
```

#### Moderate Risk Profile
```json
{
  "age": 45,
  "smoker": false,
  "exercise": "sometimes",
  "diet": "moderate sugar intake"
}
```

#### High Risk Profile
```json
{
  "age": 55,
  "smoker": true,
  "exercise": "never",
  "diet": "high fat and sugar, processed foods"
}
```

## 🚀 Deployment

### Environment Setup

1. **Production Environment Variables**
   ```env
   NODE_ENV=production
   PORT=3000
   GEMINI_API_KEY=your_production_api_key
   MONGODB_URI=your_production_mongodb_uri
   ```

2. **Install Production Dependencies**
   ```bash
   npm install --production
   ```

3. **Start Production Server**
   ```bash
   npm start
   ```

### Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   COPY package*.json ./
   RUN npm install --production
   
   COPY . .
   EXPOSE 3000
   
   CMD ["npm", "start"]
   ```

2. **Build and Run**
   ```bash
   docker build -t health-risk-profiler .
   docker run -p 3000:3000 --env-file .env health-risk-profiler
   ```

### Cloud Deployment

#### Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-app-name

# Set environment variables
heroku config:set GEMINI_API_KEY=your_api_key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

#### AWS/Google Cloud/Azure
- Use container services (ECS, Cloud Run, Container Instances)
- Set up environment variables
- Configure load balancers and auto-scaling

## 🔧 Troubleshooting

### Common Issues

#### 1. "generateContent is not a function"
**Cause:** Missing or invalid Gemini API key
**Solution:**
```bash
export GEMINI_API_KEY=your_valid_api_key
npm restart
```

#### 2. "Unexpected field" Error
**Cause:** Wrong field name in file upload
**Solution:** Use field name `image` in form-data

#### 3. "File too large" Error
**Cause:** Image exceeds 5MB limit
**Solution:** Compress image or increase `MAX_FILE_SIZE`

#### 4. OCR Processing Fails
**Cause:** Poor image quality or unsupported format
**Solution:** 
- Use clear, high-contrast images
- Ensure text is readable
- Try JPG or PNG formats

#### 5. MongoDB Connection Error
**Cause:** Database not available or wrong URI
**Solution:**
- MongoDB is optional - server runs without it
- Check `MONGODB_URI` format
- Ensure MongoDB is running

### Debug Mode

Enable debug logging:
```bash
DEBUG=* npm start
```

### Logs

Check server logs for detailed error information:
```bash
# Development mode shows detailed logs
npm run dev

# Production mode logs to console
npm start
```

## 📊 Performance

### Optimization Tips

1. **Image Processing**
   - Compress images before upload
   - Use appropriate image formats (JPG for photos, PNG for text)
   - Resize large images

2. **API Calls**
   - Use the complete-profile endpoint for full workflows
   - Cache results when possible
   - Implement rate limiting for production

3. **Database**
   - Index frequently queried fields
   - Use connection pooling
   - Implement data archiving

### Monitoring

- Monitor API response times
- Track error rates
- Monitor file upload success rates
- Set up health checks

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```
3. **Make your changes**
4. **Add tests** (if applicable)
5. **Commit your changes**
   ```bash
   git commit -m "Add new feature"
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/new-feature
   ```
7. **Create a Pull Request**

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Update documentation for new features
- Test all changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation:** Check `API_TESTING_GUIDE.md` for detailed testing instructions
- **Issues:** Create an issue on GitHub
- **Email:** Contact the development team

## 🔄 Version History

- **v1.0.0** - Initial release with basic functionality
- **v1.1.0** - Added image upload support
- **v1.2.0** - Enhanced AI integration
- **v1.3.0** - Improved error handling and validation

---

**Made with ❤️ for better health assessment**
