const { generateContent } = require('../config/gemini.config');
const logger = require('../utils/logger');

class AIService {
  async parseTextToHealthData(text) {
    try {
      const prompt = `
Extract health survey data from the following text and return ONLY a valid JSON object with these fields:
- age (number)
- smoker (boolean)
- exercise (string: "never", "rarely", "sometimes", "regularly", "daily")
- diet (string description)

Text: "${text}"

Return ONLY the JSON object, no explanation or markdown formatting.
Example format: {"age": 42, "smoker": true, "exercise": "rarely", "diet": "high sugar"}
`;

      const response = await generateContent(prompt);
      
      // Clean response - remove markdown code blocks if present
      let cleanResponse = response.trim();
      cleanResponse = cleanResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      const data = JSON.parse(cleanResponse);
      
      return {
        answers: data,
        confidence: 0.85
      };
    } catch (error) {
      logger.error('AI Parsing Error:', error);
      throw new Error(`Failed to parse text with AI: ${error.message}`);
    }
  }

  async extractRiskFactors(answers) {
    try {
      const prompt = `
Based on this health profile, identify risk factors. Return ONLY a JSON array of risk factor strings.

Profile: ${JSON.stringify(answers)}

Common risk factors: smoking, poor diet, sedentary lifestyle, high sugar intake, obesity, alcohol, stress, etc.

Return ONLY a JSON object in this format:
{"factors": ["factor1", "factor2"], "confidence": 0.88}

No explanation, just the JSON.
`;

      const response = await generateContent(prompt);
      
      let cleanResponse = response.trim();
      cleanResponse = cleanResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      const data = JSON.parse(cleanResponse);
      
      return data;
    } catch (error) {
      logger.error('Factor Extraction Error:', error);
      throw new Error(`Failed to extract factors: ${error.message}`);
    }
  }

  async generateRecommendations(riskLevel, factors) {
    try {
      const prompt = `
Generate 3-5 actionable, non-diagnostic health recommendations based on:
- Risk Level: ${riskLevel}
- Risk Factors: ${factors.join(', ')}

Return ONLY a JSON array of recommendation strings. Keep recommendations practical, specific, and encouraging.

Format: ["recommendation1", "recommendation2", "recommendation3"]

No explanation, just the JSON array.
`;

      const response = await generateContent(prompt);
      
      let cleanResponse = response.trim();
      cleanResponse = cleanResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      const recommendations = JSON.parse(cleanResponse);
      
      return Array.isArray(recommendations) ? recommendations : [];
    } catch (error) {
      logger.error('Recommendations Generation Error:', error);
      throw new Error(`Failed to generate recommendations: ${error.message}`);
    }
  }
}

module.exports = new AIService();