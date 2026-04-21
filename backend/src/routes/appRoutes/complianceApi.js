const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const EInvoiceService = require('@/modules/einvoice/EInvoiceService');
const EWayBillService = require('@/modules/eway/EWayBillService');
const { resolveCompanyId } = require('@/controllers/helpers/companyScope');

// Middleware to ensure authentication
const ensureAuth = async (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }
  next();
};

/**
 * Generate E-Invoice (IRN) for an invoice
 * POST /api/compliance/einvoice/generate/:invoiceId
 */
router.post('/einvoice/generate/:invoiceId', ensureAuth, async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const Invoice = mongoose.model('Invoice');
    const Company = mongoose.model('Company');
    const Client = mongoose.model('Client');

    const companyId = resolveCompanyId(req);
    const invoice = await Invoice.findOne({
      _id: invoiceId,
      removed: false,
      company: companyId,
    }).populate('client');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    const result = await EInvoiceService.generateIRN(invoice, company, invoice.client);

    if (result.success) {
      // Save IRN details to invoice
      await Invoice.findByIdAndUpdate(invoiceId, {
        irn: result.irn,
        irnQrCode: result.qrCode,
        irnAckNo: result.ackNo,
        irnAckDate: result.ackDate,
        irnStatus: 'ACTIVE',
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('E-Invoice generation error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * Cancel E-Invoice (IRN)
 * POST /api/compliance/einvoice/cancel/:invoiceId
 */
router.post('/einvoice/cancel/:invoiceId', ensureAuth, async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { cancelReason, cancelRemarks } = req.body;

    const Invoice = mongoose.model('Invoice');
    const companyId = resolveCompanyId(req);

    const invoice = await Invoice.findOne({
      _id: invoiceId,
      removed: false,
      company: companyId,
    });

    if (!invoice || !invoice.irn) {
      return res.status(404).json({
        success: false,
        message: 'Invoice or IRN not found',
      });
    }

    const result = await EInvoiceService.cancelIRN(invoice.irn, cancelReason, cancelRemarks);

    if (result.success) {
      await Invoice.findByIdAndUpdate(invoiceId, {
        irnStatus: 'CANCELLED',
        irnCancelDate: result.cancelDate,
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('E-Invoice cancellation error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * Generate E-Way Bill
 * POST /api/compliance/ewaybill/generate/:invoiceId
 */
router.post('/ewaybill/generate/:invoiceId', ensureAuth, async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { transportDetails } = req.body;

    const Invoice = mongoose.model('Invoice');
    const Company = mongoose.model('Company');
    const companyId = resolveCompanyId(req);

    const invoice = await Invoice.findOne({
      _id: invoiceId,
      removed: false,
      company: companyId,
    }).populate('client');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    const result = await EWayBillService.generateEWayBill(
      invoice,
      company,
      invoice.client,
      transportDetails
    );

    if (result.success) {
      await Invoice.findByIdAndUpdate(invoiceId, {
        ewbNo: result.ewbNo,
        ewbDate: result.ewbDate,
        ewbValidUpto: result.validUpto,
        ewbStatus: 'ACTIVE',
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('E-Way Bill generation error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * Cancel E-Way Bill
 * POST /api/compliance/ewaybill/cancel/:invoiceId
 */
router.post('/ewaybill/cancel/:invoiceId', ensureAuth, async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { cancelReason } = req.body;

    const Invoice = mongoose.model('Invoice');
    const companyId = resolveCompanyId(req);

    const invoice = await Invoice.findOne({
      _id: invoiceId,
      removed: false,
      company: companyId,
    });

    if (!invoice || !invoice.ewbNo) {
      return res.status(404).json({
        success: false,
        message: 'Invoice or E-Way Bill not found',
      });
    }

    const result = await EWayBillService.cancelEWayBill(invoice.ewbNo, cancelReason);

    if (result.success) {
      await Invoice.findByIdAndUpdate(invoiceId, {
        ewbStatus: 'CANCELLED',
        ewbCancelDate: result.cancelDate,
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('E-Way Bill cancellation error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * Update vehicle details for E-Way Bill
 * POST /api/compliance/ewaybill/update-vehicle/:invoiceId
 */
router.post('/ewaybill/update-vehicle/:invoiceId', ensureAuth, async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const vehicleDetails = req.body;

    const Invoice = mongoose.model('Invoice');
    const companyId = resolveCompanyId(req);

    const invoice = await Invoice.findOne({
      _id: invoiceId,
      removed: false,
      company: companyId,
    });

    if (!invoice || !invoice.ewbNo) {
      return res.status(404).json({
        success: false,
        message: 'Invoice or E-Way Bill not found',
      });
    }

    const result = await EWayBillService.updateVehicle(invoice.ewbNo, vehicleDetails);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Vehicle update error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
