const express = require('express');
const router = express.Router();
const healthController = require('../controllers/health.controller');
const { uploadImage, uploadAnyField } = require('../middlewares/upload.middleware');

// Step 1: OCR/Text Parsing
router.post('/parse', uploadAnyField, healthController.parseInput);

// Step 2: Factor Extraction
router.post('/extract-factors', healthController.extractFactors);

// Step 3: Risk Classification
router.post('/classify-risk', healthController.classifyRisk);

// Step 4: Generate Recommendations
router.post('/recommendations', healthController.generateRecommendations);

// Complete Profile Flow (All steps combined)
router.post('/complete-profile', uploadAnyField, healthController.completeProfile);

module.exports = router;