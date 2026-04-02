const { resolveCompanyId } = require('@/controllers/helpers/companyScope');

const read = async (Model, req, res) => {
  // Get company filter for multi-tenancy
  const companyId = resolveCompanyId(req);
  const companyFilter = companyId ? { company: companyId } : {};

  // Find document by id
  const result = await Model.findOne({
    _id: req.params.id,
    removed: false,
    ...companyFilter,
  }).exec();
  // If no results found, return document not found
  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found ',
    });
  } else {
    // Return success resposne
    return res.status(200).json({
      success: true,
      result,
      message: 'we found this document ',
    });
  }
};

module.exports = read;
