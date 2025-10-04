const logger = require('../utils/logger');

class RiskService {
  calculateRiskScore(answers, factors) {
    let score = 0;
    const rationale = [];

    // Age factor
    if (answers.age) {
      if (answers.age > 60) {
        score += 20;
        rationale.push('age over 60');
      } else if (answers.age > 45) {
        score += 10;
        rationale.push('age over 45');
      }
    }

    // Smoking factor
    if (answers.smoker === true) {
      score += 30;
      rationale.push('smoking');
    }

    // Exercise factor
    const exerciseLevel = answers.exercise?.toLowerCase() || '';
    if (['never', 'rarely'].includes(exerciseLevel)) {
      score += 20;
      rationale.push('low physical activity');
    } else if (exerciseLevel === 'sometimes') {
      score += 10;
      rationale.push('moderate physical activity');
    }

    // Diet factor
    const diet = answers.diet?.toLowerCase() || '';
    if (diet.includes('high sugar') || diet.includes('high fat') || diet.includes('processed')) {
      score += 15;
      rationale.push('unhealthy diet');
    }
    if (diet.includes('high sugar')) {
      rationale.push('high sugar intake');
    }

    // Factor-based scoring
    factors.forEach(factor => {
      const factorLower = factor.toLowerCase();
      
      if (factorLower.includes('obesity') || factorLower.includes('overweight')) {
        score += 15;
        if (!rationale.includes(factor)) rationale.push(factor);
      }
      if (factorLower.includes('alcohol')) {
        score += 10;
        if (!rationale.includes(factor)) rationale.push(factor);
      }
      if (factorLower.includes('stress')) {
        score += 10;
        if (!rationale.includes(factor)) rationale.push(factor);
      }
    });

    // Cap score at 100
    score = Math.min(score, 100);

    return { score, rationale: [...new Set(rationale)] };
  }

  classifyRiskLevel(score) {
    if (score >= 70) return 'high';
    if (score >= 40) return 'moderate';
    return 'low';
  }

  validateProfile(answers) {
    const requiredFields = ['age', 'smoker', 'exercise', 'diet'];
    const missingFields = [];
    const presentFields = [];

    requiredFields.forEach(field => {
      if (answers[field] === undefined || answers[field] === null || answers[field] === '') {
        missingFields.push(field);
      } else {
        presentFields.push(field);
      }
    });

    const completeness = presentFields.length / requiredFields.length;
    
    return {
      isValid: completeness > 0.5,
      missingFields,
      completeness,
      message: completeness <= 0.5 ? '>50% fields missing' : 'Profile is valid'
    };
  }

  assessRisk(answers, factors) {
    try {
      const { score, rationale } = this.calculateRiskScore(answers, factors);
      const riskLevel = this.classifyRiskLevel(score);

      logger.info(`Risk Assessment: Level=${riskLevel}, Score=${score}`);

      return {
        risk_level: riskLevel,
        score,
        rationale
      };
    } catch (error) {
      logger.error('Risk Assessment Error:', error);
      throw new Error(`Failed to assess risk: ${error.message}`);
    }
  }
}

module.exports = new RiskService();