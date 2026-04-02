const { applyLookupRelations } = require('@/controllers/helpers/lookupResolver');
const { resolveCompanyId, appendAudit } = require('@/controllers/helpers/companyScope');

const create = async (Model, req, res) => {
  // Auto-assign company for multi-tenancy
  const companyId = resolveCompanyId(req);
  if (companyId) {
    req.body.company = companyId;
  }

  // Append audit information
  req.body = appendAudit(req, req.body);

  // Creating a new document in the collection
  req.body = await applyLookupRelations(Model, req, req.body);
  req.body.removed = false;
  const result = await new Model({
    ...req.body,
  }).save();

  // Returning successfull response
  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully Created the document in Model ',
  });
};

module.exports = create;
