const mongoose = require('mongoose');
const { appendAudit, resolveCompanyId } = require('@/controllers/helpers/companyScope');
const { applyLookupRelations } = require('@/controllers/helpers/lookupResolver');

const getModel = () => mongoose.model('Product');

const buildPagination = (page, limit, count) => ({
  page,
  pages: Math.ceil(count / limit),
  count,
});

const list = async (req, res) => {
  const companyId = resolveCompanyId(req);

  const page = Number(req.query.page || 1);
  const limit = Number(req.query.items || 10);
  const skip = page * limit - limit;
  const query = { removed: false };
  if (companyId) query.company = companyId;
  if (req.query.q) query.name = { $regex: new RegExp(req.query.q, 'i') };

  const [result, count] = await Promise.all([
    getModel().find(query).skip(skip).limit(limit).sort({ created: -1 }).exec(),
    getModel().countDocuments(query),
  ]);

  return res.status(200).json({
    success: true,
    result,
    pagination: buildPagination(page, limit, count),
    message: 'Successfully found all documents',
  });
};

const listAll = async (req, res) => {
  const companyId = resolveCompanyId(req);
  const query = { removed: false };
  if (companyId) query.company = companyId;
  const result = await getModel().find(query).sort({ created: -1 }).exec();
  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully found all documents',
  });
};

const create = async (req, res) => {
  const companyId = resolveCompanyId(req);
  if (!companyId) {
    return res.status(400).json({ success: false, result: null, message: 'Company context is required' });
  }

  const payload = await applyLookupRelations(getModel(), req, appendAudit(req, req.body));
  const result = await new (getModel())({
    ...payload,
    company: companyId,
    removed: false,
  }).save();

  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully Created the document in Model ',
  });
};

const read = async (req, res) => {
  const companyId = resolveCompanyId(req);
  const query = { _id: req.params.id, removed: false };
  if (companyId) query.company = companyId;
  const result = await getModel().findOne(query).exec();
  if (!result) {
    return res.status(404).json({ success: false, result: null, message: 'No document found ' });
  }
  return res.status(200).json({ success: true, result, message: 'we found this document ' });
};

const update = async (req, res) => {
  const companyId = resolveCompanyId(req);
  const query = { _id: req.params.id, removed: false };
  if (companyId) query.company = companyId;
  const payload = await applyLookupRelations(getModel(), req, appendAudit(req, req.body));
  const result = await getModel().findOneAndUpdate(
    query,
    payload,
    { new: true, runValidators: true }
  ).exec();
  if (!result) {
    return res.status(404).json({ success: false, result: null, message: 'No document found ' });
  }
  return res.status(200).json({ success: true, result, message: 'we update this document ' });
};

const remove = async (req, res) => {
  const companyId = resolveCompanyId(req);
  const query = { _id: req.params.id };
  if (companyId) query.company = companyId;
  const result = await getModel().findOneAndUpdate(
    query,
    { $set: { removed: true, ...appendAudit(req, {}) } },
    { new: true }
  ).exec();
  if (!result) {
    return res.status(404).json({ success: false, result: null, message: 'No document found ' });
  }
  return res.status(200).json({ success: true, result, message: 'Successfully Deleted the document ' });
};

const search = list;
const filter = list;
const summary = async (_req, res) =>
  res.status(200).json({ success: true, result: { count: 0, total: 0 }, message: 'Summary is not implemented yet' });

module.exports = { create, read, update, delete: remove, list, listAll, filter, search, summary };
