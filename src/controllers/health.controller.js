const ocrService = require('../services/ocr.service');
const aiService = require('../services/ai.service');
const riskService = require('../services/risk.service');
const logger = require('../utils/logger');
const fs = require('fs').promises;

class HealthController {
  // Step 1: OCR/Text Parsing
  async parseInput(req, res, next) {
    try {
      let answers = {};
      let confidence = 0;
      let rawText = '';

      // Debug logging
      logger.info('Request body:', req.body);
      logger.info('Request file:', req.file);
      logger.info('Request files:', req.files);

      // Handle image upload
      let uploadedFile = req.file || (req.files && req.files[0]);
      if (uploadedFile) {
        logger.info('Processing image input...');
        logger.info('Uploaded file details:', {
          fieldname: uploadedFile.fieldname,
          originalname: uploadedFile.originalname,
          mimetype: uploadedFile.mimetype,
          size: uploadedFile.size,
          path: uploadedFile.path
        });
        
        try {
          const ocrResult = await ocrService.extractTextFromImage(uploadedFile.path);
          rawText = ocrResult.text;
          logger.info('OCR extracted text:', rawText);
          
          // Try regex parsing first
          let parsedFields = ocrService.parseHealthFields(rawText);
          
          // If regex parsing yields incomplete data, use AI
          const fieldCount = Object.keys(parsedFields).length;
          if (fieldCount < 3) {
            logger.info('Using AI for better text parsing...');
            const aiResult = await aiService.parseTextToHealthData(rawText);
            parsedFields = aiResult.answers;
            confidence = aiResult.confidence;
          } else {
            confidence = ocrResult.confidence;
          }
          
          answers = parsedFields;
        } catch (ocrError) {
          logger.error('OCR processing failed, returning basic response:', ocrError);
          // Return a basic response even if OCR fails
          answers = {
            age: 0,
            smoker: false,
            exercise: "unknown",
            diet: "unable to process image"
          };
          confidence = 0.1;
        }
        
        // Clean up uploaded file
        await fs.unlink(uploadedFile.path).catch(err => 
          logger.warn('Failed to delete temp file:', err)
        );
      }
      // Handle JSON text input
      else if (req.body.text) {
        logger.info('Processing text input with AI...');
        const aiResult = await aiService.parseTextToHealthData(req.body.text);
        answers = aiResult.answers;
        confidence = aiResult.confidence;
        rawText = req.body.text;
      }
      // Handle direct JSON input
      else if (req.body.age !== undefined) {
        logger.info('Processing direct JSON input...');
        answers = {
          age: req.body.age,
          smoker: req.body.smoker,
          exercise: req.body.exercise,
          diet: req.body.diet
        };
        confidence = 0.95;
      } else {
        return res.status(400).json({
          status: 'error',
          message: 'No valid input provided. Send JSON data, text field, or image file.'
        });
      }

      // Validate profile completeness
      const validation = riskService.validateProfile(answers);
      
      if (!validation.isValid) {
        return res.status(400).json({
          status: 'incomplete_profile',
          reason: validation.message,
          missing_fields: validation.missingFields,
          completeness: validation.completeness
        });
      }

      res.json({
        answers,
        missing_fields: validation.missingFields,
        confidence: parseFloat(confidence.toFixed(2)),
        raw_text: rawText || undefined
      });

    } catch (error) {
      next(error);
    }
  }

  // Step 2: Factor Extraction
  async extractFactors(req, res, next) {
    try {
      const { answers } = req.body;

      if (!answers) {
        return res.status(400).json({
          status: 'error',
          message: 'Missing required field: answers'
        });
      }

      // Validate profile
      const validation = riskService.validateProfile(answers);
      if (!validation.isValid) {
        return res.status(400).json({
          status: 'incomplete_profile',
          reason: validation.message
        });
      }

      // Extract factors using AI
      const result = await aiService.extractRiskFactors(answers);

      res.json({
        factors: result.factors || [],
        confidence: parseFloat((result.confidence || 0.85).toFixed(2))
      });

    } catch (error) {
      next(error);
    }
  }

  // Step 3: Risk Classification
  async classifyRisk(req, res, next) {
    try {
      const { answers, factors } = req.body;

      if (!answers || !factors) {
        return res.status(400).json({
          status: 'error',
          message: 'Missing required fields: answers and factors'
        });
      }

      const riskAssessment = riskService.assessRisk(answers, factors);

      res.json(riskAssessment);

    } catch (error) {
      next(error);
    }
  }

  // Step 4: Recommendations
  async generateRecommendations(req, res, next) {
    try {
      const { risk_level, factors } = req.body;

      if (!risk_level || !factors) {
        return res.status(400).json({
          status: 'error',
          message: 'Missing required fields: risk_level and factors'
        });
      }

      const recommendations = await aiService.generateRecommendations(risk_level, factors);

      res.json({
        risk_level,
        factors,
        recommendations,
        status: 'ok'
      });

    } catch (error) {
      next(error);
    }
  }

  // Complete Profile Flow (All Steps Combined)
  async completeProfile(req, res, next) {
    try {
      let answers = {};
      let confidence = 0;

      // Step 1: Parse Input
      let uploadedFile = req.file || (req.files && req.files[0]);
      if (uploadedFile) {
        const ocrResult = await ocrService.extractTextFromImage(uploadedFile.path);
        let parsedFields = ocrService.parseHealthFields(ocrResult.text);
        
        if (Object.keys(parsedFields).length < 3) {
          const aiResult = await aiService.parseTextToHealthData(ocrResult.text);
          parsedFields = aiResult.answers;
          confidence = aiResult.confidence;
        } else {
          confidence = ocrResult.confidence;
        }
        
        answers = parsedFields;
        
        await fs.unlink(uploadedFile.path).catch(err => 
          logger.warn('Failed to delete temp file:', err)
        );
      } else if (req.body.text) {
        const aiResult = await aiService.parseTextToHealthData(req.body.text);
        answers = aiResult.answers;
        confidence = aiResult.confidence;
      } else if (req.body.age !== undefined) {
        answers = {
          age: req.body.age,
          smoker: req.body.smoker,
          exercise: req.body.exercise,
          diet: req.body.diet
        };
        confidence = 0.95;
      } else {
        return res.status(400).json({
          status: 'error',
          message: 'No valid input provided'
        });
      }

      // Validate
      const validation = riskService.validateProfile(answers);
      if (!validation.isValid) {
        return res.status(400).json({
          status: 'incomplete_profile',
          reason: validation.message,
          missing_fields: validation.missingFields
        });
      }

      // Step 2: Extract Factors
      const factorResult = await aiService.extractRiskFactors(answers);
      const factors = factorResult.factors || [];

      // Step 3: Classify Risk
      const riskAssessment = riskService.assessRisk(answers, factors);

      // Step 4: Generate Recommendations
      const recommendations = await aiService.generateRecommendations(
        riskAssessment.risk_level,
        factors
      );

      res.json({
        profile: {
          answers,
          confidence: parseFloat(confidence.toFixed(2))
        },
        factors: {
          list: factors,
          confidence: parseFloat((factorResult.confidence || 0.85).toFixed(2))
        },
        risk: riskAssessment,
        recommendations,
        status: 'ok'
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new HealthController();