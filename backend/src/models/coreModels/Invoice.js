const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  
  // Invoice Type Selection
  invoiceType: {
    type: String,
    enum: ['Sales Invoice', 'Service Invoice', 'SEZ Sales Invoice', 'SEZ Service Invoice', 'Export Sales Invoice', 'Export Service Invoice'],
    default: 'Sales Invoice',
  },
  taxType: {
    type: String,
    enum: ['Local State', 'Inter-State'],
    default: 'Local State',
  },
  lutOption: {
    type: String,
    enum: ['With LUT', 'Without LUT'],
    default: 'Without LUT',
  },

  // Header Section
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  invoiceDate: {
    type: Date,
    default: Date.now,
  },
  challanNo: String,
  challanDate: Date,
  partyDcNo: String,
  partyDcDate: Date,
  po: String,
  poDate: Date,
  arnNo: String,
  arnDate: Date,
  transportationMode: String,
  modelNo: String,
  againstForm: String,

  // Receiver (Bill To)
  receiverName: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  receiverAddress: String,
  receiverGstin: String,
  receiverState: String,
  receiverStateCode: String,
  receiverPanNo: String,

  // Consignee (Ship To)
  consigneeName: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
  },
  consigneeAddress: String,
  consigneeGstin: String,
  consigneeState: String,
  consigneeStateCode: String,
  consigneePanNo: String,
  sameAsReceiver: {
    type: Boolean,
    default: true,
  },

  // Line Items
  items: [{
    productName: String,
    description: String,
    hsnSac: String,
    uom: String,
    quantity: Number,
    rate: Number,
    isService: Boolean,
    amount: Number,
    discount: Number,
    taxableValue: Number,
    cgstRate: Number,
    cgstAmt: Number,
    sgstRate: Number,
    sgstAmt: Number,
    igstRate: Number,
    igstAmt: Number,
    totalAmount: Number,
  }],

  // Footer Section
  totalAmountBeforeTax: Number,
  packingCharges: Number,
  packingCgstRate: Number,
  packingCgstAmt: Number,
  packingSgstRate: Number,
  packingSgstAmt: Number,
  packingIgstRate: Number,
  packingIgstAmt: Number,
  cgstTotal: Number,
  sgstTotal: Number,
  igstTotal: Number,
  totalGstTax: Number,
  totalAmountAfterTax: Number,
  gstReverseCharge: Boolean,
  roundOff: Number,
  grandTotal: Number,
  totalInWords: String,
  taxInWords: String,
  remarks: String,

  // E-Invoice Integration
  irnNo: String,
  ackNo: String,
  ackDate: Date,
  qrCode: String,
  transporterId: String,
  transporterName: String,
  transportMode: String,
  distance: Number,
  vehicleNo: String,
  vehicleType: String,
  eWayBillNo: String,
  eWayBillDate: Date,
  eWayValidTill: Date,
  cewbNo: String,
  placeOfDelivery: String,
  shippingPin: String,

  // Status
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    default: 'draft',
  },

  // Company
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },

  // Metadata
  created: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
  },
  updated: Date,
});

module.exports = mongoose.model('Invoice', invoiceSchema);
