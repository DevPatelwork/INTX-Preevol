const express = require('express');
const router = express.Router();
const ReportService = require('@/modules/reports/ReportService');

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
 * Sales Report
 * GET /api/reports/sales
 */
router.get('/sales', ensureAuth, async (req, res) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      client: req.query.client,
      status: req.query.status,
    };

    const result = await ReportService.generateSalesReport(filters, req);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Sales report error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * Service Report
 * GET /api/reports/service
 */
router.get('/service', ensureAuth, async (req, res) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      client: req.query.client,
    };

    const result = await ReportService.generateServiceReport(filters, req);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Service report error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * Stock/Inventory Report
 * GET /api/reports/stock
 */
router.get('/stock', ensureAuth, async (req, res) => {
  try {
    const filters = {
      goods: req.query.goods,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const result = await ReportService.generateStockReport(filters, req);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Stock report error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * GST Report
 * GET /api/reports/gst
 */
router.get('/gst', ensureAuth, async (req, res) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const result = await ReportService.generateGSTReport(filters, req);
    return res.status(200).json(result);
  } catch (error) {
    console.error('GST report error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * Client Ledger
 * GET /api/reports/ledger/:clientId
 */
router.get('/ledger/:clientId', ensureAuth, async (req, res) => {
  try {
    const { clientId } = req.params;
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const result = await ReportService.generateClientLedger(clientId, filters, req);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Client ledger error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
