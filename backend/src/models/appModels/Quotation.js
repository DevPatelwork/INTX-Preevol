const mongoose = require('mongoose');
const { buildTransactionSchema } = require('@/models/helpers/buildTransactionSchema');

module.exports = mongoose.model('Quotation', buildTransactionSchema());
