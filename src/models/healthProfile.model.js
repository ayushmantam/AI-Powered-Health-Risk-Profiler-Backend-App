const mongoose = require('mongoose');

const healthProfileSchema = new mongoose.Schema({
  answers: {
    age: {
      type: Number,
      required: true,
      min: 1,
      max: 120
    },
    smoker: {
      type: Boolean,
      required: true
    },
    exercise: {
      type: String,
      required: true,
      enum: ['never', 'rarely', 'sometimes', 'regularly', 'daily']
    },
    diet: {
      type: String,
      required: true
    }
  },
  factors: [{
    type: String
  }],
  risk: {
    level: {
      type: String,
      enum: ['low', 'moderate', 'high']
    },
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    rationale: [{
      type: String
    }]
  },
  recommendations: [{
    type: String
  }],
  confidence: {
    type: Number,
    min: 0,
    max: 1
  },
  metadata: {
    inputType: {
      type: String,
      enum: ['text', 'image', 'json']
    },
    ocrConfidence: Number
  }
}, {
  timestamps: true
});

// Index for faster queries
healthProfileSchema.index({ 'risk.level': 1, createdAt: -1 });

const HealthProfile = mongoose.model('HealthProfile', healthProfileSchema);

module.exports = HealthProfile;