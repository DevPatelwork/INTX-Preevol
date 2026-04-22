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
  legacyCompanyId: {
    type: Number,
    sparse: true,
    index: true,
  },
  
  // Company Basic Information
  name: {
    type: String,
    required: true,
    trim: true,
  },
  
  // Address Information
  address: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  state: {
    type: String,
    default: '',
  },
  stateCode: {
    type: String,
    default: '',
  },
  pin: {
    type: String,
    default: '',
  },
  
  // Contact Information
  contact: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  email1: {
    type: String,
    default: '',
  },
  email2: {
    type: String,
    default: '',
  },
  website: {
    type: String,
    default: '',
  },
  phone1: {
    type: String,
    default: '',
  },
  phone2: {
    type: String,
    default: '',
  },
  
  // Tax Registration
  gstin: {
    type: String,
    default: '',
    uppercase: true,
  },
  panNo: {
    type: String,
    default: '',
    uppercase: true,
  },
  tanNo: {
    type: String,
    default: '',
    uppercase: true,
  },
  cinNo: {
    type: String,
    default: '',
    uppercase: true,
  },
  lutNo: {
    type: String,
    default: '',
  },
  
  // Financial Information
  financialYear: {
    type: String,
    default: '',
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  
  // Bank Details (Primary)
  bankName: {
    type: String,
    default: '',
  },
  accountNo: {
    type: String,
    default: '',
  },
  ifscCode: {
    type: String,
    default: '',
  },
  branch: {
    type: String,
    default: '',
  },
  
  // Terms & Conditions
  termsAndConditions: {
    type: String,
    default: '',
  },
  
  // Document Prefixes
  prefix: {
    invoice: { type: String, default: 'INV' },
    serviceInvoice: { type: String, default: 'SINV' },
    quotation: { type: String, default: 'QUO' },
    proformaInvoice: { type: String, default: 'PI' },
    purchaseOrder: { type: String, default: 'PO' },
    workOrder: { type: String, default: 'WO' },
    proposal: { type: String, default: 'PROP' },
  },
  
  // Document Counters
  counters: {
    invoice: { type: Number, default: 0 },
    serviceInvoice: { type: Number, default: 0 },
    quotation: { type: Number, default: 0 },
    proformaInvoice: { type: Number, default: 0 },
    purchaseOrder: { type: Number, default: 0 },
    workOrder: { type: Number, default: 0 },
    proposal: { type: Number, default: 0 },
  },
  
  // Supply Location
  supplyFrom: {
    type: String,
    default: '',
  },
  
  // Audit Fields
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

schema.index({ name: 1 }, { unique: true, partialFilterExpression: { removed: { $eq: false } } });

module.exports = mongoose.model('Company', schema);
