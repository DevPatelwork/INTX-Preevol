const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  legacySubCategoryId: { type: Number, sparse: true, index: true },
  company: { type: mongoose.Schema.ObjectId, ref: 'Company', autopopulate: true, index: true },
  category: { type: mongoose.Schema.ObjectId, ref: 'Category', autopopulate: true, index: true },
  categoryId: { type: Number, default: null, index: true },
  name: { type: String, required: true, trim: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

schema.index({ company: 1, category: 1, name: 1 }, { unique: true, sparse: true });
schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('SubCategory', schema);
