const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  legacyProposalId: { type: Number, sparse: true, index: true },
  proposalNumber: { type: String, required: true, trim: true },
  companyId: { type: Number, default: null, index: true },
  partyId: { type: Number, default: null, index: true },
  productId: { type: Number, default: null, index: true },
  company: { type: mongoose.Schema.ObjectId, ref: 'Company', autopopulate: true, index: true },
  party: { type: mongoose.Schema.ObjectId, ref: 'Client', autopopulate: true, index: true },
  product: { type: mongoose.Schema.ObjectId, ref: 'Product', autopopulate: true, index: true },
  pumpType: { type: String, default: '' },
  pumpModel: { type: String, default: '' },
  price: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  proposalDate: { type: Date, default: Date.now },
  generatedBy: { type: String, default: '' },
  fullProductName: { type: String, default: '' },
  dischargeCapacity: { type: String, default: '' },
  dischargePressure: { type: String, default: '' },
  pumpSPM: { type: String, default: '' },
  blockMaterial: { type: String, default: '' },
  valveAssembly: { type: String, default: '' },
  plungerMaterial: { type: String, default: '' },
  inletOutlet: { type: String, default: '' },
  suctionPressure: { type: String, default: '' },
  driveDetails: { type: String, default: '' },
  formattedPrice: { type: String, default: '' },
  priceInWords: { type: String, default: '' },
  application: { type: String, default: '' },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

schema.index({ proposalNumber: 1 }, { unique: true, sparse: true });
schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('ProposalHistory', schema);
