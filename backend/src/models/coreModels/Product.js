const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  
  subCategory: {
    type: Schema.Types.ObjectId,
    ref: 'SubCategory',
  },
  
  productName: {
    type: String,
    required: true,
  },
  
  uom: {
    type: String,
    enum: ['PCS', 'KG', 'L', 'M', 'BOX', 'NOS'],
    default: 'PCS',
  },
  
  hsnSac: String,
  machineNo: String,
  
  price: {
    type: Number,
    default: 0,
  },
  
  isService: {
    type: Boolean,
    default: false,
  },
  
  fullProductName: String,
  
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },

  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
});

module.exports = mongoose.model('Product', productSchema);
