const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  legacyBankId: { type: Number, sparse: true, index: true },
  company: { type: mongoose.Schema.ObjectId, ref: 'Company', autopopulate: true, index: true },
  bankName: { type: String, required: true, trim: true },
  branchName: { type: String, default: '' },
  accountNo: { type: String, default: '' },
  micrCode: { type: Number, default: null, index: true },
  ifscCode: { type: String, default: '' },
  swiftCode: { type: String, default: '', index: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

schema.index({ company: 1, bankName: 1, accountNo: 1 }, { unique: true, sparse: true });
schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Bank', schema);
