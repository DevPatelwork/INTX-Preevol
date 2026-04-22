const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },

  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true },
  
  // Invoice Type and Tax Configuration
  invoiceType: {
    type: String,
    default: 'Sales Invoice',
    enum: ['Sales Invoice', 'Service Invoice', 'SEZ Sales Invoice', 'SEZ Service Invoice', 'Export Sales Invoice', 'Export Service Invoice'],
  },
  taxType: {
    type: String,
    default: 'Local State',
    enum: ['Local State', 'Inter-State'],
  },
  lutOption: {
    type: String,
    enum: ['With LUT', 'Without LUT', ''],
    default: '',
  },
  
  // Invoice Header Fields
  number: {
    type: String,
    required: true,
    index: true,
  },
  date: {
    type: Date,
    required: true,
  },
  challanNo: {
    type: String,
    default: '',
  },
  challanDate: {
    type: Date,
  },
  partyDcNo: {
    type: String,
    default: '',
  },
  partyDcDate: {
    type: Date,
  },
  poReference: {
    type: String,
    default: '',
  },
  poDate: {
    type: Date,
  },
  arnNo: {
    type: String,
    default: '',
  },
  arnDate: {
    type: Date,
  },
  transportationMode: {
    type: String,
    default: '',
  },
  modelNo: {
    type: String,
    default: '',
  },
  againstForm: {
    type: String,
    default: '',
  },
  
  // Company Reference
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    autopopulate: true,
    index: true,
  },
  
  // Receiver (Bill To) Section
  receiver: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    autopopulate: true,
    required: false,
  },
  receiverName: {
    type: String,
    default: '',
  },
  receiverAddress: {
    type: String,
    default: '',
  },
  receiverGstin: {
    type: String,
    default: '',
  },
  receiverState: {
    type: String,
    default: '',
  },
  receiverStateCode: {
    type: String,
    default: '',
  },
  receiverPanNo: {
    type: String,
    default: '',
  },
  
  // Consignee (Ship To) Section
  consignee: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    autopopulate: true,
  },
  consigneeName: {
    type: String,
    default: '',
  },
  consigneeAddress: {
    type: String,
    default: '',
  },
  consigneeGstin: {
    type: String,
    default: '',
  },
  consigneeState: {
    type: String,
    default: '',
  },
  consigneeStateCode: {
    type: String,
    default: '',
  },
  consigneePanNo: {
    type: String,
    default: '',
  },
  sameAsReceiver: {
    type: Boolean,
    default: false,
  },
  
  // Line Items
  items: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        autopopulate: true,
      },
      itemName: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        default: '',
      },
      hsnSac: {
        type: String,
        default: '',
      },
      uom: {
        type: String,
        default: '',
      },
      quantity: {
        type: Number,
        default: 1,
        required: true,
      },
      rate: {
        type: Number,
        default: 0,
      },
      isService: {
        type: Boolean,
        default: false,
      },
      amount: {
        type: Number,
        default: 0,
      },
      discountPercent: {
        type: Number,
        default: 0,
      },
      discountAmount: {
        type: Number,
        default: 0,
      },
      taxableValue: {
        type: Number,
        default: 0,
      },
      cgstRate: {
        type: Number,
        default: 0,
      },
      cgstAmount: {
        type: Number,
        default: 0,
      },
      sgstRate: {
        type: Number,
        default: 0,
      },
      sgstAmount: {
        type: Number,
        default: 0,
      },
      igstRate: {
        type: Number,
        default: 0,
      },
      igstAmount: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
      },
    },
  ],
  
  // Footer Section - Amounts
  totalAmountBeforeTax: {
    type: Number,
    default: 0,
  },
  
  // Packing Charges
  packingCharges: {
    type: Number,
    default: 0,
  },
  packingCgstRate: {
    type: Number,
    default: 0,
  },
  packingCgstAmount: {
    type: Number,
    default: 0,
  },
  packingSgstRate: {
    type: Number,
    default: 0,
  },
  packingSgstAmount: {
    type: Number,
    default: 0,
  },
  packingIgstRate: {
    type: Number,
    default: 0,
  },
  packingIgstAmount: {
    type: Number,
    default: 0,
  },
  
  // Tax Totals
  cgstTotal: {
    type: Number,
    default: 0,
  },
  sgstTotal: {
    type: Number,
    default: 0,
  },
  igstTotal: {
    type: Number,
    default: 0,
  },
  totalGstTax: {
    type: Number,
    default: 0,
  },
  
  // Grand Totals
  totalAmountAfterTax: {
    type: Number,
    default: 0,
  },
  gstReverseCharge: {
    type: Boolean,
    default: false,
  },
  roundOff: {
    type: Number,
    default: 0,
  },
  grandTotal: {
    type: Number,
    default: 0,
  },
  totalInWords: {
    type: String,
    default: '',
  },
  taxInWords: {
    type: String,
    default: '',
  },
  remarks: {
    type: String,
    default: '',
  },
  
  // Payment & Status
  currency: {
    type: String,
    default: 'INR',
    uppercase: true,
  },
  credit: {
    type: Number,
    default: 0,
  },
  payment: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Payment',
    },
  ],
  paymentStatus: {
    type: String,
    default: 'unpaid',
    enum: ['unpaid', 'paid', 'partially'],
  },
  isOverdue: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'sent', 'refunded', 'cancelled', 'on hold'],
    default: 'draft',
  },
  
  // E-Invoice (IRN) Compliance Fields
  irn: {
    type: String,
    index: true,
  },
  irnQrCode: {
    type: String,
  },
  irnAckNo: {
    type: String,
  },
  irnAckDate: {
    type: Date,
  },
  irnStatus: {
    type: String,
    enum: ['PENDING', 'ACTIVE', 'CANCELLED'],
    default: 'PENDING',
  },
  irnCancelDate: {
    type: Date,
  },
  signedInvoice: {
    type: String,
  },
  
  // E-Way Bill Fields
  ewbNo: {
    type: String,
    index: true,
  },
  ewbDate: {
    type: Date,
  },
  ewbValidUpto: {
    type: Date,
  },
  ewbStatus: {
    type: String,
    enum: ['PENDING', 'ACTIVE', 'CANCELLED', 'EXPIRED'],
    default: 'PENDING',
  },
  ewbCancelDate: {
    type: Date,
  },
  
  // E-Way Bill Extended Fields
  transporterId: {
    type: String,
    default: '',
  },
  transporterName: {
    type: String,
    default: '',
  },
  transportMode: {
    type: String,
    enum: ['Road', 'Rail', 'Air', 'Ship', ''],
    default: '',
  },
  transportDistance: {
    type: Number,
    default: 0,
  },
  vehicleNo: {
    type: String,
    default: '',
  },
  vehicleType: {
    type: String,
    enum: ['Regular', 'Over Dimensional Cargo', ''],
    default: '',
  },
  cewbNo: {
    type: String,
    default: '',
  },
  placeOfDelivery: {
    type: String,
    default: '',
  },
  shippingPin: {
    type: String,
    default: '',
  },
  
  // Files & Documents
  pdf: {
    type: String,
  },
  files: [
    {
      id: String,
      name: String,
      path: String,
      description: String,
      isPublic: {
        type: Boolean,
        default: true,
      },
    },
  ],
  
  // Legacy fields for backward compatibility
  year: {
    type: Number,
  },
  content: String,
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    autopopulate: true,
  },
  
  // Timestamps
  updated: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

invoiceSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Invoice', invoiceSchema);
