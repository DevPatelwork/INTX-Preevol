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
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
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
  financialYear: {
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
  supplyFrom: {
    type: String,
    default: '',
  },
  pin: {
    type: String,
    default: '',
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  prefix: {
    invoice: { type: String, default: 'INV' },
    serviceInvoice: { type: String, default: 'SINV' },
    quotation: { type: String, default: 'QUO' },
    purchaseOrder: { type: String, default: 'PO' },
    workOrder: { type: String, default: 'WO' },
  },
  counters: {
    invoice: { type: Number, default: 0 },
    serviceInvoice: { type: Number, default: 0 },
    quotation: { type: Number, default: 0 },
    purchaseOrder: { type: Number, default: 0 },
    workOrder: { type: Number, default: 0 },
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

schema.index({ name: 1 }, { unique: true, partialFilterExpression: { removed: { $eq: false } } });

module.exports = mongoose.model('Company', schema);
