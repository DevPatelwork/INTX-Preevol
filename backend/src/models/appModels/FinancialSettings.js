const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  legacyFinancialYearId: { type: Number, sparse: true, index: true },
  company: { type: mongoose.Schema.ObjectId, ref: 'Company', autopopulate: true, index: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  financialYear: { type: String, required: true, trim: true },
  salesInvoiceCount: { type: String, default: '0' },
  serviceInvoiceCount: { type: String, default: '0' },
  proformaSalesInvoiceCount: { type: String, default: '0' },
  proformaServiceInvoiceCount: { type: String, default: '0' },
  quotationCount: { type: String, default: '0' },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

schema.index({ company: 1, financialYear: 1 }, { unique: true, sparse: true });
schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('FinancialSettings', schema);
