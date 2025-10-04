const Tesseract = require('tesseract.js');
const logger = require('../utils/logger');

class OCRService {
  async extractTextFromImage(imagePath) {
    try {
      logger.info('Starting OCR processing...');
      
      const { data: { text, confidence } } = await Tesseract.recognize(
        imagePath,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              logger.debug(`OCR Progress: ${Math.round(m.progress * 100)}%`);
            }
          }
        }
      );

      logger.info(`OCR completed with confidence: ${confidence}`);
      return {
        text: text.trim(),
        confidence: confidence / 100
      };
    } catch (error) {
      logger.error('OCR Error:', error);
      throw new Error(`OCR processing failed: ${error.message}`);
    }
  }  

  parseHealthFields(text) {
    const fields = {};
    
    // Parse age
    const ageMatch = text.match(/age[:\s]+(\d+)/i);
    if (ageMatch) {
      fields.age = parseInt(ageMatch[1]);
    }

    // Parse smoker
    const smokerMatch = text.match(/smoker[:\s]+(yes|no|true|false)/i);
    if (smokerMatch) {
      fields.smoker = ['yes', 'true'].includes(smokerMatch[1].toLowerCase());
    }

    // Parse exercise
    const exerciseMatch = text.match(/exercise[:\s]+(\w+)/i);
    if (exerciseMatch) {
      fields.exercise = exerciseMatch[1].toLowerCase();
    }

    // Parse diet
    const dietMatch = text.match(/diet[:\s]+(.+?)(?:\n|$)/i);
    if (dietMatch) {
      fields.diet = dietMatch[1].trim().toLowerCase();
    }

    return fields;
  }
}

module.exports = new OCRService();