const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');

let genAI;
let model;

// Initialize Gemini AI
const initializeGemini = () => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      logger.warn('GEMINI_API_KEY not found. AI features will be disabled.');
      return null;
    }

    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    logger.info('Gemini AI initialized successfully');
    return model;
  } catch (error) {
    logger.error('Failed to initialize Gemini AI:', error);
    return null;
  }
};

// Generate content using Gemini AI
const generateContent = async (prompt) => {
  try {
    if (!model) {
      // Initialize if not already done
      const initializedModel = initializeGemini();
      if (!initializedModel) {
        throw new Error('Gemini AI not available. Please check your API key.');
      }
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    logger.error('Gemini API Error:', error);
    throw new Error(`Gemini API call failed: ${error.message}`);
  }
};

// Initialize on module load
initializeGemini();

module.exports = {
  generateContent,
  initializeGemini
};
