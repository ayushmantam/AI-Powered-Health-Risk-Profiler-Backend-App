const Joi = require('joi');

const healthProfileSchema = Joi.object({
  age: Joi.number().integer().min(1).max(120).required(),
  smoker: Joi.boolean().required(),
  exercise: Joi.string().valid('never', 'rarely', 'sometimes', 'regularly', 'daily').required(),
  diet: Joi.string().min(3).max(200).required()
});

const factorsSchema = Joi.object({
  answers: healthProfileSchema.required(),
});

const riskSchema = Joi.object({
  answers: healthProfileSchema.required(),
  factors: Joi.array().items(Joi.string()).min(1).required()
});

const recommendationsSchema = Joi.object({
  risk_level: Joi.string().valid('low', 'moderate', 'high').required(),
  factors: Joi.array().items(Joi.string()).min(1).required()
});

const validateHealthProfile = (data) => {
  return healthProfileSchema.validate(data);
};

const validateFactorsRequest = (data) => {
  return factorsSchema.validate(data);
};

const validateRiskRequest = (data) => {
  return riskSchema.validate(data);
};

const validateRecommendationsRequest = (data) => {
  return recommendationsSchema.validate(data);
};

module.exports = {
  validateHealthProfile,
  validateFactorsRequest,
  validateRiskRequest,
  validateRecommendationsRequest
};