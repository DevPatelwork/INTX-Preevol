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

  name: {
    type: String,
    required: true,
  },
  contactPerson: String,
  phone: String,
  country: String,
  address: String,
  city: String,
  state: String,
  stateCode: String,
  email: String,
  gstStatus: String,
  gstin: {
    type: String,
    uppercase: true,
  },
  panNo: {
    type: String,
    uppercase: true,
  },
  pin: String,
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
