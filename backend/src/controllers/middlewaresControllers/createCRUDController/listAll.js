const { resolveCompanyId } = require('@/controllers/helpers/companyScope');

const listAll = async (Model, req, res) => {
  const sort = req.query.sort || 'desc';
  const enabled = req.query.enabled || undefined;

  // Get company filter for multi-tenancy
  const companyId = resolveCompanyId(req);
  const companyFilter = companyId ? { company: companyId } : {};

  //  Query the database for a list of all results

  let result;
  if (enabled === undefined) {
    result = await Model.find({
      removed: false,
      ...companyFilter,
    })
      .sort({ created: sort })
      .populate()
      .exec();
  } else {
    result = await Model.find({
      removed: false,
      enabled: enabled,
      ...companyFilter,
    })
      .sort({ created: sort })
      .populate()
      .exec();
  }

  if (result.length > 0) {
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully found all documents',
    });
  } else {
    return res.status(203).json({
      success: false,
      result: [],
      message: 'Collection is Empty',
    });
  }
};

module.exports = listAll;
