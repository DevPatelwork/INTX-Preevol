const { applyLookupRelations } = require('@/controllers/helpers/lookupResolver');
const { resolveCompanyId, appendAudit } = require('@/controllers/helpers/companyScope');

const create = async (Model, req, res) => {
  try {
    console.log('CREATE - Model:', Model.modelName);
    console.log('CREATE - Request body:', req.body);
    console.log('CREATE - Admin:', req.admin?._id);
    
    // Auto-assign company for multi-tenancy
    const companyId = resolveCompanyId(req);
    console.log('CREATE - Resolved companyId:', companyId);
    
    if (companyId) {
      req.body.company = companyId;
    }

    // Append audit information
    req.body = appendAudit(req, req.body);
    console.log('CREATE - Body after audit:', req.body);

    // Creating a new document in the collection
    req.body = await applyLookupRelations(Model, req, req.body);
    req.body.removed = false;
    
    console.log('CREATE - Final body before save:', req.body);
    
    const result = await new Model({
      ...req.body,
    }).save();

    console.log('CREATE - Saved successfully:', result._id);

    // Returning successfull response
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully Created the document in Model ',
    });
  } catch (error) {
    console.error('CREATE - Error:', error.message);
    console.error('CREATE - Full error:', JSON.stringify(error, null, 2));
    if (error.errors) {
      console.error('CREATE - Validation errors:', JSON.stringify(error.errors, null, 2));
    }
    return res.status(400).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
    });
  }
};

module.exports = create;
