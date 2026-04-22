const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
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

module.exports = mongoose.model('Category', categorySchema);
