const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },

  // Party/Customer Information
  name: {
    type: String,
    required: true,
  },
  company: String,
  
  // Contact Information
  contactPerson: String,
  contact1: String,
  contact2: String,
  email: String,
  website: String,

  // Address
  address: String,
  city: String,
  state: String,
  stateCode: Number,
  pin: String,

  // Tax Information
  gstStatus: {
    type: String,
    enum: ['Registered', 'Unregistered', 'Composition', 'Consumer'],
    default: 'Unregistered',
  },
  gstin: String,
  panNo: String,
  vatNo: String,
  cstNo: String,
  eccNo: String,
  iecCode: String,

  // Company Association
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },

  // Metadata
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
});

module.exports = mongoose.model('Client', clientSchema);
