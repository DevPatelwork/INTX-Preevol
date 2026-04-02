const mongoose = require('mongoose');

const buildTransactionSchema = () => {
  const schema = new mongoose.Schema({
    removed: { type: Boolean, default: false },
    company: {
      type: mongoose.Schema.ObjectId,
      ref: 'Company',
      autopopulate: true,
      index: true,
    },
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true, autopopulate: true },
    number: { type: Number, required: true },
    year: { type: Number, required: true },
    date: { type: Date, required: true },
    expiredDate: { type: Date, required: true },
    client: { type: mongoose.Schema.ObjectId, ref: 'Client', autopopulate: true },
    vendor: { type: mongoose.Schema.ObjectId, ref: 'Client', autopopulate: true },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['draft', 'pending', 'sent', 'accepted', 'rejected', 'cancelled', 'on hold'],
      default: 'draft',
    },
    items: [
      {
        product: { type: mongoose.Schema.ObjectId, ref: 'Product', autopopulate: true },
        itemName: { type: String, required: true },
        description: { type: String, default: '' },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true, default: 0 },
        total: { type: Number, required: true, default: 0 },
      },
    ],
    taxRate: { type: Number, default: 0 },
    subTotal: { type: Number, default: 0 },
    taxTotal: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    currency: { type: String, default: 'NA', uppercase: true, required: true },
    paymentStatus: {
      type: String,
      default: 'unpaid',
      enum: ['unpaid', 'paid', 'partially'],
    },
    updated: { type: Date, default: Date.now },
    created: { type: Date, default: Date.now },
  });

  schema.plugin(require('mongoose-autopopulate'));
  return schema;
};

module.exports = { buildTransactionSchema };
