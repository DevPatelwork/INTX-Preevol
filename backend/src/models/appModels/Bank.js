const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  legacyBankId: { type: Number, sparse: true, index: true },
  company: { type: mongoose.Schema.ObjectId, ref: 'Company', autopopulate: true, index: true },
  
  // Bank Information
  bankName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  
  // Account Information
  accountName: { 
    type: String, 
    default: '',
    trim: true 
  },
  accountNo: { 
    type: String, 
    default: '' 
  },
  
  // Branch Information
  branch: { 
    type: String, 
    default: '' 
  },
  branchName: { 
    type: String, 
    default: '' 
  },
  address: { 
    type: String, 
    default: '' 
  },
  
  // Banking Codes
  ifscCode: { 
    type: String, 
    default: '' 
  },
  micrCode: { 
    type: String, 
    default: '' 
  },
  swiftCode: { 
    type: String, 
    default: '' 
  },
  
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

schema.index({ company: 1, bankName: 1, accountNo: 1 }, { unique: true, sparse: true });
schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Bank', schema);
