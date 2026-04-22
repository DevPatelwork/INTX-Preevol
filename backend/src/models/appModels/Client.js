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
  legacyPartyId: {
    type: Number,
    sparse: true,
    index: true,
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    autopopulate: true,
    index: true,
  },

  // Party/Customer Name
  name: {
    type: String,
    required: true,
    trim: true,
  },
  
  // Contact Person
  contactPerson: {
    type: String,
    default: '',
  },
  
  // Contact Numbers
  contact1: {
    type: String,
    default: '',
  },
  contact2: {
    type: String,
    default: '',
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
  country: {
    type: String,
    default: 'India',
  },
  
  // Digital Contact
  email: {
    type: String,
    default: '',
  },
  website: {
    type: String,
    default: '',
  },
  
  // GST & Tax Registration
  gstStatus: {
    type: String,
    enum: ['Registered', 'Unregistered', 'Composition', 'SEZ', 'Export', ''],
    default: '',
  },
  gstin: {
    type: String,
    uppercase: true,
    default: '',
  },
  panNo: {
    type: String,
    uppercase: true,
    default: '',
  },
  
  // Additional Tax Numbers
  vatNo: {
    type: String,
    default: '',
  },
  cstNo: {
    type: String,
    default: '',
  },
  eccNo: {
    type: String,
    default: '',
  },
  iecCode: {
    type: String,
    default: '',
  },
  
  // Legacy fields for backward compatibility
  contactPerson: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  assigned: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
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
schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Client', schema);
