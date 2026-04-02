const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  legacyModelId: { type: Number, sparse: true, index: true },
  company: { type: mongoose.Schema.ObjectId, ref: 'Company', autopopulate: true, index: true },
  modelName: { type: String, required: true, trim: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

schema.index({ company: 1, modelName: 1 }, { unique: true, sparse: true });
schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Model', schema);
