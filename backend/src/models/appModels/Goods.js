const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  legacyGoodsId: { type: Number, sparse: true, index: true },
  company: { type: mongoose.Schema.ObjectId, ref: 'Company', autopopulate: true, index: true },
  type: { type: mongoose.Schema.ObjectId, ref: 'Type', autopopulate: true, index: true },
  typeName: { type: String, default: '', index: true },
  category: { type: mongoose.Schema.ObjectId, ref: 'Category', autopopulate: true, index: true },
  stockCategoryId: { type: Number, default: null, index: true },
  subCategory: { type: mongoose.Schema.ObjectId, ref: 'SubCategory', autopopulate: true, index: true },
  stockSubCategoryId: { type: Number, default: null, index: true },
  model: { type: mongoose.Schema.ObjectId, ref: 'Model', autopopulate: true, index: true },
  modelName: { type: String, default: '', index: true },
  plungerDia: { type: mongoose.Schema.ObjectId, ref: 'PlungerDia', autopopulate: true, index: true },
  plungerDiaName: { type: String, default: '' },
  goodsName: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  uom: { type: String, default: '' },
  hsn: { type: String, default: '' },
  gstRate: { type: Number, default: 0 },
  avgPricePerUnit: { type: Number, default: 0 },
  openingQty: { type: Number, default: 0 },
  closingQty: { type: Number, default: 0 },
  closingStockVal: { type: Number, default: 0 },
  reOrderLevel: { type: Number, default: 0 },
  fullGoodsName: { type: String, default: '' },
  lastUpdatedText: { type: String, default: '' },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

schema.index({ company: 1, goodsName: 1 }, { unique: true, sparse: true });
schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Goods', schema);
