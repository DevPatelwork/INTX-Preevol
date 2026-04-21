const mongoose = require('mongoose');
const { calculate } = require('@/helpers');
const { resolveCompanyId } = require('@/controllers/helpers/companyScope');
const { resolveProductForInvoiceItem } = require('@/controllers/appControllers/invoiceController/productPriceResolver');

const normalizeBody = async (req, body) => {
  const input = { ...body };
  const { items = [], taxRate = 0, discount = 0 } = input;
  const resolvedItems = await Promise.all(
    (Array.isArray(items) ? items : []).map((item) => resolveProductForInvoiceItem(item))
  );

  let subTotal = 0;
  resolvedItems.forEach((item) => {
    const safeQuantity = Number(item?.quantity || 0);
    const safePrice = Number(item?.price || 0);
    const lineTotal = calculate.multiply(safeQuantity, safePrice);
    subTotal = calculate.add(subTotal, lineTotal);
    item.price = safePrice;
    item.total = lineTotal;
  });

  const safeDiscount = Number(discount || 0);
  const discountedSubTotal = calculate.sub(subTotal, safeDiscount);
  const safeTaxRate = Number(taxRate || 0);
  const taxTotal = calculate.multiply(discountedSubTotal, safeTaxRate / 100);
  const total = calculate.add(discountedSubTotal, taxTotal);
  const paymentStatus = total === 0 ? 'paid' : 'unpaid';

  return {
    ...input,
    company: resolveCompanyId(req) || input.company,
    items: resolvedItems,
    subTotal,
    discountTotal: Number(discount || 0),
    taxTotal,
    total,
    paymentStatus,
  };
};

const createTransactionController = ({ modelName }) => {
  const Model = mongoose.model(modelName);

  const create = async (req, res) => {
    const payload = await normalizeBody(req, req.body);
    payload.createdBy = req.admin?._id;
    payload.removed = false;
    const result = await new Model(payload).save();
    return res.status(200).json({ success: true, result, message: `${modelName} created successfully` });
  };

  const read = async (req, res) => {
    const companyId = resolveCompanyId(req);
    const query = { _id: req.params.id, removed: false };
    if (companyId) query.company = companyId;
    const result = await Model.findOne(query).populate('createdBy', 'name').exec();
    if (!result) return res.status(404).json({ success: false, result: null, message: 'No document found' });
    return res.status(200).json({ success: true, result, message: 'Document found' });
  };

  const update = async (req, res) => {
    const companyId = resolveCompanyId(req);
    const query = { _id: req.params.id, removed: false };
    if (companyId) query.company = companyId;
    const payload = await normalizeBody(req, req.body);
    const result = await Model.findOneAndUpdate(query, payload, { new: true, runValidators: true }).exec();
    if (!result) return res.status(404).json({ success: false, result: null, message: 'No document found' });
    return res.status(200).json({ success: true, result, message: 'Document updated' });
  };

  const remove = async (req, res) => {
    const companyId = resolveCompanyId(req);
    const query = { _id: req.params.id, removed: false };
    if (companyId) query.company = companyId;
    const result = await Model.findOneAndUpdate(query, { removed: true }, { new: true }).exec();
    if (!result) return res.status(404).json({ success: false, result: null, message: 'No document found' });
    return res.status(200).json({ success: true, result, message: 'Document deleted' });
  };

  const list = async (req, res) => {
    const companyId = resolveCompanyId(req);
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.items || 10);
    const skip = page * limit - limit;
    const query = { removed: false };
    if (companyId) query.company = companyId;
    if (req.query.q && req.query.fields) {
      const fields = req.query.fields.split(',').map((f) => f.trim()).filter(Boolean);
      if (fields.length > 0) {
        query.$or = fields.map((field) => ({ [field]: { $regex: new RegExp(req.query.q, 'i') } }));
      }
    }
    const [result, count] = await Promise.all([
      Model.find(query).skip(skip).limit(limit).sort({ created: -1 }).populate('createdBy', 'name').exec(),
      Model.countDocuments(query),
    ]);
    return res.status(200).json({
      success: true,
      result,
      pagination: { page, pages: Math.ceil(count / limit), count },
      message: 'Successfully found all documents',
    });
  };

  const listAll = async (req, res) => {
    const companyId = resolveCompanyId(req);
    const query = { removed: false };
    if (companyId) query.company = companyId;
    const result = await Model.find(query).sort({ created: -1 }).exec();
    return res.status(200).json({ success: true, result, message: 'Successfully found all documents' });
  };

  const filter = list;
  const search = list;
  const summary = async (_req, res) =>
    res.status(200).json({ success: true, result: { count: 0, total: 0 }, message: 'Summary is not implemented yet' });

  return { create, read, update, delete: remove, list, listAll, filter, search, summary };
};

module.exports = createTransactionController;
