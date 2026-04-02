const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  legacyPOProductId: { type: Number, sparse: true, index: true },
  company: { type: mongoose.Schema.ObjectId, ref: 'Company', autopopulate: true, index: true },
  category: { type: mongoose.Schema.ObjectId, ref: 'Category', autopopulate: true, index: true },
  subCategory: { type: mongoose.Schema.ObjectId, ref: 'SubCategory', autopopulate: true, index: true },
  categoryId: { type: Number, default: null, index: true },
  subCategoryId: { type: Number, default: null, index: true },
  productName: { type: String, required: true, trim: true },
  uom: { type: String, default: '' },
  hsnNoOrSacNo: { type: String, default: '' },
  machineNo: { type: String, default: '' },
  price: { type: Number, default: 0 },
  fullProductName: { type: String, default: '' },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

schema.index({ company: 1, productName: 1 }, { unique: true, sparse: true });
schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('POProduct', schema);
