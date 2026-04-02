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
  legacyVendorId: {
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

  name: {
    type: String,
    required: true,
  },
  contactPerson: String,
  contactNo1: String,
  contactNo2: String,
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  stateCode: {
    type: String,
    required: true,
  },
  email: String,
  website: String,
  gstStatus: {
    type: String,
    required: true,
  },
  gstin: {
    type: String,
    uppercase: true,
    required: true,
  },
  panNo: {
    type: String,
    uppercase: true,
    required: true,
  },
  vatNo: String,
  cstNo: String,
  eccNo: String,
  iecCode: String,
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

module.exports = mongoose.model('Vendor', schema);
