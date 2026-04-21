const mongoose = require('mongoose');

const proposalScopeMasterSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    autopopulate: true,
    index: true,
  },
  scopeCode: {
    type: String,
    required: true,
    trim: true,
  },
  scopeItem: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  defaultQuantity: {
    type: Number,
    default: 1,
  },
  unitPrice: {
    type: Number,
    default: 0,
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    autopopulate: true,
  },
  pumpType: {
    type: String,
    trim: true,
  },
  pumpModel: {
    type: String,
    trim: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  sortOrder: {
    type: Number,
    default: 0,
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

proposalScopeMasterSchema.plugin(require('mongoose-autopopulate'));
proposalScopeMasterSchema.index({ company: 1, scopeCode: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('ProposalScopeMaster', proposalScopeMasterSchema);
