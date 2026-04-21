const mongoose = require('mongoose');
const { resolveCompanyId } = require('@/controllers/helpers/companyScope');

/**
 * Report Service for generating various business reports
 */
class ReportService {
  /**
   * Generate Sales Report
   * @param {Object} filters - Date range, client, status filters
   * @param {Object} req - Request object for company context
   */
  async generateSalesReport(filters, req) {
    try {
      const Invoice = mongoose.model('Invoice');
      const companyId = resolveCompanyId(req);

      const query = { removed: false };
      if (companyId) query.company = companyId;

      // Apply date filters
      if (filters.startDate || filters.endDate) {
        query.date = {};
        if (filters.startDate) query.date.$gte = new Date(filters.startDate);
        if (filters.endDate) query.date.$lte = new Date(filters.endDate);
      }

      // Apply client filter
      if (filters.client) query.client = filters.client;

      // Apply status filter
      if (filters.status) query.status = filters.status;

      const invoices = await Invoice.find(query)
        .populate('client', 'name')
        .populate('company', 'name')
        .sort({ date: -1 });

      // Calculate summary
      const summary = {
        totalInvoices: invoices.length,
        totalAmount: invoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
        totalTax: invoices.reduce((sum, inv) => sum + (inv.taxTotal || 0), 0),
        totalDiscount: invoices.reduce((sum, inv) => sum + (inv.discountTotal || 0), 0),
        paidAmount: invoices
          .filter((inv) => inv.paymentStatus === 'paid')
          .reduce((sum, inv) => sum + (inv.total || 0), 0),
        unpaidAmount: invoices
          .filter((inv) => inv.paymentStatus === 'unpaid')
          .reduce((sum, inv) => sum + (inv.total || 0), 0),
        partiallyPaidAmount: invoices
          .filter((inv) => inv.paymentStatus === 'partially')
          .reduce((sum, inv) => sum + (inv.total || 0), 0),
      };

      return {
        success: true,
        data: invoices,
        summary,
      };
    } catch (error) {
      console.error('Sales report generation failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Generate Service Report
   * @param {Object} filters - Date range, client filters
   * @param {Object} req - Request object for company context
   */
  async generateServiceReport(filters, req) {
    try {
      const ServiceInvoice = mongoose.model('ServiceInvoice');
      const companyId = resolveCompanyId(req);

      const query = { removed: false };
      if (companyId) query.company = companyId;

      if (filters.startDate || filters.endDate) {
        query.date = {};
        if (filters.startDate) query.date.$gte = new Date(filters.startDate);
        if (filters.endDate) query.date.$lte = new Date(filters.endDate);
      }

      if (filters.client) query.client = filters.client;

      const invoices = await ServiceInvoice.find(query)
        .populate('client', 'name')
        .populate('company', 'name')
        .sort({ date: -1 });

      const summary = {
        totalInvoices: invoices.length,
        totalAmount: invoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
        totalTax: invoices.reduce((sum, inv) => sum + (inv.taxTotal || 0), 0),
      };

      return {
        success: true,
        data: invoices,
        summary,
      };
    } catch (error) {
      console.error('Service report generation failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Generate Stock/Inventory Report
   * @param {Object} filters - Goods, date filters
   * @param {Object} req - Request object for company context
   */
  async generateStockReport(filters, req) {
    try {
      const Goods = mongoose.model('Goods');
      const GoodsInventory = mongoose.model('GoodsInventory');
      const companyId = resolveCompanyId(req);

      // Get all goods
      const goodsQuery = { removed: false };
      if (companyId) goodsQuery.company = companyId;
      if (filters.goods) goodsQuery._id = filters.goods;

      const goods = await Goods.find(goodsQuery)
        .populate('type', 'typeName')
        .populate('model', 'modelName')
        .populate('moc', 'mocName')
        .populate('plungerDia', 'plungerDiaName');

      // Calculate stock for each item
      const stockData = await Promise.all(
        goods.map(async (item) => {
          const inventoryQuery = {
            goods: item._id,
            removed: false,
          };
          if (companyId) inventoryQuery.company = companyId;

          if (filters.startDate || filters.endDate) {
            inventoryQuery.invDate = {};
            if (filters.startDate) inventoryQuery.invDate.$gte = new Date(filters.startDate);
            if (filters.endDate) inventoryQuery.invDate.$lte = new Date(filters.endDate);
          }

          const inventory = await GoodsInventory.find(inventoryQuery);

          // Calculate closing stock
          let inwardQty = 0;
          let outwardQty = 0;

          inventory.forEach((inv) => {
            if (inv.inventoryType === 'IN') inwardQty += inv.qty;
            else if (inv.inventoryType === 'OUT') outwardQty += inv.qty;
            else if (inv.inventoryType === 'RETURN') inwardQty += inv.qty;
          });

          const closingQty = inwardQty - outwardQty;
          const reOrderLevel = item.reOrderLevel || 0;

          return {
            goods: item,
            openingQty: 0, // Would need snapshot data
            inwardQty,
            outwardQty,
            closingQty,
            reOrderLevel,
            isBelowReorder: closingQty <= reOrderLevel,
            inventoryValue: closingQty * (item.unitPrice || 0),
          };
        })
      );

      const summary = {
        totalItems: stockData.length,
        itemsBelowReorder: stockData.filter((s) => s.isBelowReorder).length,
        totalInventoryValue: stockData.reduce((sum, s) => sum + s.inventoryValue, 0),
      };

      return {
        success: true,
        data: stockData,
        summary,
      };
    } catch (error) {
      console.error('Stock report generation failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Generate GST Report
   * @param {Object} filters - Date range filters
   * @param {Object} req - Request object for company context
   */
  async generateGSTReport(filters, req) {
    try {
      const Invoice = mongoose.model('Invoice');
      const companyId = resolveCompanyId(req);

      const query = { removed: false };
      if (companyId) query.company = companyId;

      if (filters.startDate || filters.endDate) {
        query.date = {};
        if (filters.startDate) query.date.$gte = new Date(filters.startDate);
        if (filters.endDate) query.date.$lte = new Date(filters.endDate);
      }

      const invoices = await Invoice.find(query)
        .populate('client', 'name gstin')
        .populate('items.product', 'hsnSac');

      // Aggregate GST data
      const gstData = {
        b2b: [], // Business to Business
        b2c: [], // Business to Consumer
        hsnSummary: {},
        taxRateSummary: {},
      };

      invoices.forEach((inv) => {
        const isB2B = inv.client?.gstin && inv.client.gstin !== 'URP';
        const invoiceData = {
          invoiceNo: inv.number,
          invoiceDate: inv.date,
          clientName: inv.client?.name,
          clientGstin: inv.client?.gstin,
          taxableValue: inv.subTotal,
          igst: inv.taxTotal, // Assuming IGST for now
          cgst: 0,
          sgst: 0,
          totalTax: inv.taxTotal,
          invoiceValue: inv.total,
        };

        if (isB2B) {
          gstData.b2b.push(invoiceData);
        } else {
          gstData.b2c.push(invoiceData);
        }

        // HSN Summary
        inv.items.forEach((item) => {
          const hsn = item.product?.hsnSac || 'N/A';
          if (!gstData.hsnSummary[hsn]) {
            gstData.hsnSummary[hsn] = {
              hsnCode: hsn,
              totalQuantity: 0,
              taxableValue: 0,
              taxAmount: 0,
            };
          }
          gstData.hsnSummary[hsn].totalQuantity += item.quantity;
          gstData.hsnSummary[hsn].taxableValue += item.total;
          gstData.hsnSummary[hsn].taxAmount += item.total * (inv.taxRate / 100);
        });

        // Tax Rate Summary
        const taxRate = inv.taxRate || 0;
        if (!gstData.taxRateSummary[taxRate]) {
          gstData.taxRateSummary[taxRate] = {
            rate: taxRate,
            taxableValue: 0,
            taxAmount: 0,
          };
        }
        gstData.taxRateSummary[taxRate].taxableValue += inv.subTotal;
        gstData.taxRateSummary[taxRate].taxAmount += inv.taxTotal;
      });

      const summary = {
        totalInvoices: invoices.length,
        b2bCount: gstData.b2b.length,
        b2cCount: gstData.b2c.length,
        totalTaxableValue: invoices.reduce((sum, inv) => sum + (inv.subTotal || 0), 0),
        totalTax: invoices.reduce((sum, inv) => sum + (inv.taxTotal || 0), 0),
        totalInvoiceValue: invoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
      };

      return {
        success: true,
        data: gstData,
        summary,
      };
    } catch (error) {
      console.error('GST report generation failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Generate Party/Client Ledger
   * @param {String} clientId - Client ID
   * @param {Object} filters - Date range filters
   * @param {Object} req - Request object for company context
   */
  async generateClientLedger(clientId, filters, req) {
    try {
      const Invoice = mongoose.model('Invoice');
      const Payment = mongoose.model('Payment');
      const companyId = resolveCompanyId(req);

      const query = {
        removed: false,
        client: clientId,
      };
      if (companyId) query.company = companyId;

      if (filters.startDate || filters.endDate) {
        query.date = {};
        if (filters.startDate) query.date.$gte = new Date(filters.startDate);
        if (filters.endDate) query.date.$lte = new Date(filters.endDate);
      }

      const [invoices, payments] = await Promise.all([
        Invoice.find(query).sort({ date: 1 }),
        Payment.find({ ...query, removed: false }).sort({ date: 1 }),
      ]);

      // Build ledger entries
      const ledger = [];
      let balance = 0;

      // Combine and sort by date
      const entries = [
        ...invoices.map((inv) => ({
          type: 'INVOICE',
          date: inv.date,
          number: inv.number,
          description: `Invoice #${inv.number}`,
          debit: inv.total,
          credit: 0,
          reference: inv._id,
        })),
        ...payments.map((pay) => ({
          type: 'PAYMENT',
          date: pay.date,
          number: pay.number || '',
          description: `Payment Received`,
          debit: 0,
          credit: pay.amount,
          reference: pay._id,
        })),
      ].sort((a, b) => new Date(a.date) - new Date(b.date));

      // Calculate running balance
      entries.forEach((entry) => {
        balance += entry.debit - entry.credit;
        ledger.push({
          ...entry,
          balance,
        });
      });

      const summary = {
        totalInvoices: invoices.length,
        totalInvoiceAmount: invoices.reduce((sum, inv) => sum + inv.total, 0),
        totalPayments: payments.length,
        totalPaymentAmount: payments.reduce((sum, pay) => sum + pay.amount, 0),
        closingBalance: balance,
      };

      return {
        success: true,
        data: ledger,
        summary,
      };
    } catch (error) {
      console.error('Client ledger generation failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = new ReportService();
