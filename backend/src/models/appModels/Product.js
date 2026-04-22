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
  
  // Product Name
  name: {
    type: String,
    required: true,
    trim: true,
  },
  fullProductName: {
    type: String,
    default: '',
    trim: true,
  },
  
  // Category References
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
  
  // Product Details
  description: {
    type: String,
    default: '',
  },
  
  // Tax Information
  hsnOrSac: {
    type: String,
    default: '',
  },
  hsnSac: {
    type: String,
    default: '',
  },
  gstRate: {
    type: Number,
    default: 0,
  },
  
  // Unit of Measure
  uom: {
    type: String,
    default: '',
  },
  
  // Pricing
  rate: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    default: 0,
  },
  
  // Product Type
  isService: {
    type: Boolean,
    default: false,
  },
  
  // Additional Fields
  machineNo: {
    type: String,
    default: '',
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
