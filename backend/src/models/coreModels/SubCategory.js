const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subCategorySchema = new Schema({
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
  
  name: {
    type: String,
    required: true,
  },
  
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

module.exports = mongoose.model('SubCategory', subCategorySchema);
