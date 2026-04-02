const { resolveCompanyId } = require('@/controllers/helpers/companyScope');

const summary = async (Model, req, res) => {
  // Get company filter for multi-tenancy
  const companyId = resolveCompanyId(req);
  const companyFilter = companyId ? { company: companyId } : {};

  //  Query the database for a list of all results
  const countPromise = Model.countDocuments({
    removed: false,
    ...companyFilter,
  });

  const resultsPromise = await Model.countDocuments({
    removed: false,
    ...companyFilter,
  })
    .where(req.query.filter)
    .equals(req.query.equal)
    .exec();
  // Resolving both promises
  const [countFilter, countAllDocs] = await Promise.all([resultsPromise, countPromise]);

  if (countAllDocs.length > 0) {
    return res.status(200).json({
      success: true,
      result: { countFilter, countAllDocs },
      message: 'Successfully count all documents',
    });
  } else {
    return res.status(203).json({
      success: false,
      result: [],
      message: 'Collection is Empty',
    });
  }
};

module.exports = summary;
