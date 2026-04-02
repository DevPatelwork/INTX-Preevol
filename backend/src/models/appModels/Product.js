const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  legacyProductId: {
    type: Number,
    sparse: true,
    index: true,
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: true,
    index: true,
    autopopulate: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    default: '',
  },
  categoryRef: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    autopopulate: true,
    index: true,
  },
  categoryId: {
    type: Number,
    default: null,
    index: true,
  },
  subCategory: {
    type: String,
    default: '',
  },
  subCategoryRef: {
    type: mongoose.Schema.ObjectId,
    ref: 'SubCategory',
    autopopulate: true,
    index: true,
  },
  subCategoryId: {
    type: Number,
    default: null,
    index: true,
  },
  description: {
    type: String,
    default: '',
  },
  hsnOrSac: {
    type: String,
    default: '',
  },
  uom: {
    type: String,
    default: '',
  },
  gstRate: {
    type: Number,
    default: 0,
  },
  rate: {
    type: Number,
    default: 0,
  },
  isService: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: String,
    default: '',
  },
  updatedBy: {
    type: String,
    default: '',
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

schema.index({ company: 1, name: 1 });
schema.index({ company: 1, categoryId: 1, subCategoryId: 1 });
schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Product', schema);
