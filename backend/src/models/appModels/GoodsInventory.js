const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  legacyInventoryId: { type: Number, sparse: true, index: true },
  company: { type: mongoose.Schema.ObjectId, ref: 'Company', autopopulate: true, index: true },
  goods: { type: mongoose.Schema.ObjectId, ref: 'Goods', autopopulate: true, index: true },
  goodsId: { type: Number, default: null, index: true },
  party: { type: mongoose.Schema.ObjectId, ref: 'Client', autopopulate: true, index: true },
  partyName: { type: String, default: '' },
  partyOtherDetail: { type: String, default: '' },
  invDate: { type: Date, required: true, default: Date.now },
  uom: { type: String, default: '' },
  qty: { type: Number, required: true, default: 0 },
  pricePerUnit: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },
  remarks: { type: String, default: '' },
  inventoryType: { type: String, default: '' },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

schema.index({ company: 1, goods: 1, invDate: -1 });
schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('GoodsInventory', schema);
