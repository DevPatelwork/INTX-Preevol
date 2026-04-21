const mongoose = require('mongoose');

const proposalScopeHistorySchema = new mongoose.Schema({
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
  proposal: {
    type: mongoose.Schema.ObjectId,
    ref: 'ProposalHistory',
    required: true,
    index: true,
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
  quantity: {
    type: Number,
    default: 1,
  },
  unitPrice: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
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

proposalScopeHistorySchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('ProposalScopeHistory', proposalScopeHistorySchema);
