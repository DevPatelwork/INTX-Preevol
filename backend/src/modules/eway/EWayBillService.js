const axios = require('axios');

/**
 * E-Way Bill Service for GST compliance
 * Handles E-Way Bill generation and management
 */
class EWayBillService {
  constructor() {
    this.baseURL = process.env.EWAY_API_URL || 'https://api.gst.gov.in/ewaybill';
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
      console.error('E-Way Bill authentication failed:', error.message);
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
   * Generate E-Way Bill
   * @param {Object} invoice - Invoice document
   * @param {Object} company - Company details
   * @param {Object} client - Client details
   * @param {Object} transport - Transport details
   */
  async generateEWayBill(invoice, company, client, transport = {}) {
    try {
      const token = await this.ensureAuth();

      // Build E-Way Bill payload
      const payload = this.buildEWayPayload(invoice, company, client, transport);

      const response = await axios.post(
        `${this.baseURL}/v1.03/ewayapi`,
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
        ewbNo: response.data.ewayBillNo,
        ewbDate: response.data.ewayBillDate,
        validUpto: response.data.validUpto,
        qrCode: response.data.qrCode,
      };
    } catch (error) {
      console.error('E-Way Bill generation failed:', error.message);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }

  /**
   * Cancel E-Way Bill
   * @param {String} ewbNo - E-Way Bill Number
   * @param {String} cancelReason - Reason for cancellation (1-4)
   */
  async cancelEWayBill(ewbNo, cancelReason) {
    try {
      const token = await this.ensureAuth();

      const response = await axios.post(
        `${this.baseURL}/v1.03/ewayapi/cancel`,
        {
          ewbNo,
          cancelRsnCode: cancelReason,
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
        cancelDate: response.data.cancelDate,
      };
    } catch (error) {
      console.error('E-Way Bill cancellation failed:', error.message);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }

  /**
   * Update vehicle number for E-Way Bill
   * @param {String} ewbNo - E-Way Bill Number
   * @param {Object} vehicleDetails - Vehicle details
   */
  async updateVehicle(ewbNo, vehicleDetails) {
    try {
      const token = await this.ensureAuth();

      const response = await axios.post(
        `${this.baseURL}/v1.03/ewayapi/updateVehicle`,
        {
          ewbNo,
          ...vehicleDetails,
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
        data: response.data,
      };
    } catch (error) {
      console.error('Vehicle update failed:', error.message);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }

  /**
   * Get E-Way Bill details
   * @param {String} ewbNo - E-Way Bill Number
   */
  async getEWayBill(ewbNo) {
    try {
      const token = await this.ensureAuth();

      const response = await axios.get(
        `${this.baseURL}/v1.03/ewayapi/getewaybill`,
        {
          params: { ewbNo },
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
      console.error('Get E-Way Bill failed:', error.message);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }

  /**
   * Extend E-Way Bill validity
   * @param {String} ewbNo - E-Way Bill Number
   * @param {String} reason - Reason for extension
   * @param {String} remarks - Additional remarks
   */
  async extendValidity(ewbNo, reason, remarks = '') {
    try {
      const token = await this.ensureAuth();

      const response = await axios.post(
        `${this.baseURL}/v1.03/ewayapi/extendValidity`,
        {
          ewbNo,
          extnRsnCode: reason,
          extnRmrk: remarks,
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
        newValidUpto: response.data.validUpto,
      };
    } catch (error) {
      console.error('Extend validity failed:', error.message);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }

  /**
   * Build E-Way Bill payload
   */
  buildEWayPayload(invoice, company, client, transport) {
    const supplyType = company.state === client.state ? 'I' : 'O'; // Inward/Outward
    const subSupplyType = supplyType === 'O' ? 1 : 2; // Supply/Export

    return {
      supplyType,
      subSupplyType,
      docType: 'INV',
      docNo: String(invoice.number),
      docDate: this.formatDate(invoice.date),
      fromGstin: company.gstin,
      fromTrdName: company.name,
      fromAddr1: company.address?.substring(0, 120) || '',
      fromPlace: company.city || '',
      fromPincode: company.pin || 0,
      fromStateCode: company.stateCode || 0,
      toGstin: client.gstin || 'URP',
      toTrdName: client.name,
      toAddr1: client.address?.substring(0, 120) || '',
      toPlace: client.city || '',
      toPincode: client.pin || 0,
      toStateCode: client.stateCode || 0,
      totalValue: invoice.subTotal,
      totInvValue: invoice.total,
      transMode: transport.transMode || '1', // Road
      transDistance: transport.distance || 0,
      transporterId: transport.transporterId || '',
      transporterName: transport.transporterName || '',
      transDocNo: transport.docNo || '',
      transDocDate: transport.docDate ? this.formatDate(transport.docDate) : '',
      vehicleNo: transport.vehicleNo || '',
      vehicleType: transport.vehicleType || 'R', // Regular
      itemList: invoice.items.map((item, index) => ({
        productName: item.itemName,
        productDesc: item.description || '',
        hsnCode: item.hsnSac || '',
        quantity: item.quantity,
        qtyUnit: item.unit || 'NOS',
        taxableAmount: item.total,
        cgstRate: 0,
        sgstRate: 0,
        igstRate: invoice.taxRate,
        cessRate: 0,
        cessNonAdvol: 0,
      })),
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

module.exports = new EWayBillService();
