const mongoose = require('mongoose');

const resolveCompanyId = (req) => {
  const headerCompanyId = req.headers['x-company-id'];
  const bodyCompanyId = req.body?.company;
  const currentCompanyId = req.admin?.currentCompany;
  const companyId = bodyCompanyId || headerCompanyId || currentCompanyId || null;

  if (!companyId) return null;
  if (!mongoose.Types.ObjectId.isValid(companyId)) return null;
  return companyId;
};

const appendAudit = (req, payload = {}) => {
  const name = req.admin?.name || req.admin?.email || '';
  const adminId = req.admin?._id || null;
  return {
    ...payload,
    updatedBy: name,
    ...(payload.createdBy ? {} : { createdBy: adminId }),
    updated: new Date(),
  };
};

module.exports = { resolveCompanyId, appendAudit };
