const axios = require('axios');
const mongoose = require('mongoose');

/**
 * E-Invoice Service for GST compliance
 * Handles IRN (Invoice Reference Number) generation
 */
class EInvoiceService {
  constructor() {
    this.baseURL = process.env.EINVOICE_API_URL || 'https://api.gst.gov.in/einvoice';
    this.authToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Get authentication token from GST portal
   */
  async authenticate() {
    try {
      const response = await axios.post(`${this.baseURL}/auth`, {
        clientId: process.env.GST_CLIENT_ID,
        clientSecret: process.env.GST_CLIENT_SECRET,
        gstin: process.env.GSTIN,
      });

      this.authToken = response.data.authToken;
      this.tokenExpiry = new Date(Date.now() + response.data.expiresIn * 1000);

      return this.authToken;
    } catch (error) {
      console.error('E-Invoice authentication failed:', error.message);
      throw new Error('Failed to authenticate with GST portal');
    }
  }

  /**
   * Check if current token is valid
   */
  isTokenValid() {
    return this.authToken && this.tokenExpiry && new Date() < this.tokenExpiry;
  }

  /**
   * Ensure valid authentication
   */
  async ensureAuth() {
    if (!this.isTokenValid()) {
      await this.authenticate();
    }
    return this.authToken;
  }

  /**
   * Generate IRN (Invoice Reference Number)
   * @param {Object} invoice - Invoice document
   * @param {Object} company - Company details
   * @param {Object} client - Client details
   */
  async generateIRN(invoice, company, client) {
    try {
      const token = await this.ensureAuth();

      // Build E-Invoice payload according to GST schema
      const payload = this.buildEInvoicePayload(invoice, company, client);

      const response = await axios.post(
        `${this.baseURL}/v1.03/Invoice`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        irn: response.data.Irn,
        qrCode: response.data.SignedQRCode,
        ackNo: response.data.AckNo,
        ackDate: response.data.AckDate,
        signedInvoice: response.data.SignedInvoice,
      };
    } catch (error) {
      console.error('IRN generation failed:', error.message);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }

  /**
   * Cancel IRN
   * @param {String} irn - Invoice Reference Number
   * @param {String} cancelReason - Reason for cancellation
   * @param {String} cancelRemarks - Additional remarks
   */
  async cancelIRN(irn, cancelReason, cancelRemarks = '') {
    try {
      const token = await this.ensureAuth();

      const response = await axios.post(
        `${this.baseURL}/v1.03/Invoice/Cancel`,
        {
          Irn: irn,
          CnlRsn: cancelReason,
          CnlRem: cancelRemarks,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        cancelDate: response.data.CancelDate,
      };
    } catch (error) {
      console.error('IRN cancellation failed:', error.message);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }

  /**
   * Get IRN details by document number
   * @param {String} docNumber - Document number
   * @param {String} docDate - Document date (DD/MM/YYYY)
   */
  async getIRNByDocDetails(docNumber, docDate) {
    try {
      const token = await this.ensureAuth();

      const response = await axios.get(
        `${this.baseURL}/v1.03/Invoice/irnbydocdetails`,
        {
          params: {
            docnum: docNumber,
            docdate: docDate,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Get IRN failed:', error.message);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }

  /**
   * Build E-Invoice payload according to GST schema
   */
  buildEInvoicePayload(invoice, company, client) {
    const items = invoice.items.map((item, index) => ({
      SlNo: String(index + 1),
      PrdDesc: item.itemName,
      IsServc: item.isService ? 'Y' : 'N',
      HsnCd: item.hsnSac || '',
      Qty: item.quantity,
      Unit: item.unit || 'NOS',
      UnitPrice: item.price,
      TotAmt: item.total,
      Discount: item.discount || 0,
      PreTaxVal: item.total,
      AssAmt: item.total,
      GstRt: invoice.taxRate,
      IgstAmt: 0, // Will be calculated based on IGST/CGST/SGST
      CgstAmt: 0,
      SgstAmt: 0,
      TotItemVal: item.total,
    }));

    return {
      Version: '1.1',
      TranDtls: {
        TaxSch: 'GST',
        SupTyp: 'B2B',
        RegRev: 'N',
        IgstOnIntra: 'N',
      },
      DocDtls: {
        Typ: 'INV',
        No: String(invoice.number),
        Dt: this.formatDate(invoice.date),
      },
      SellerDtls: {
        Gstin: company.gstin,
        LglNm: company.name,
        Addr1: company.address?.substring(0, 100) || '',
        Loc: company.city || '',
        Pin: company.pin || 0,
        Stcd: company.stateCode || '',
        Ph: company.phone1 || '',
        Em: company.email1 || '',
      },
      BuyerDtls: {
        Gstin: client.gstin || 'URP',
        LglNm: client.name,
        Addr1: client.address?.substring(0, 100) || '',
        Loc: client.city || '',
        Pin: client.pin || 0,
        Stcd: client.stateCode || '',
        Ph: client.phone || '',
        Em: client.email || '',
        Pos: client.stateCode || '',
      },
      ValDtls: {
        AssVal: invoice.subTotal,
        Discount: invoice.discount || 0,
        OthChrg: 0,
        RndOffAmt: 0,
        TotInvVal: invoice.total,
      },
      ItemList: items,
      PayDtls: {
        Nm: '',
        Accdet: '',
        Mode: '',
        FininsBr: '',
        PayTerm: '',
        PayInstr: '',
        CrTrn: '',
        DirDr: '',
        CrDay: 0,
        PaidAmt: 0,
        PaymtDue: invoice.total,
      },
      EwbDtls: {
        TransId: '',
        TransName: '',
        TransMode: '1',
        Distance: 0,
        TransDocNo: '',
        TransDocDt: '',
        VehNo: '',
        VehType: 'R',
      },
    };
  }

  formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
}

module.exports = new EInvoiceService();
