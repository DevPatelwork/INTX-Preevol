const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const { appendAudit } = require('@/controllers/helpers/companyScope');
const Company = require('@/models/appModels/Company');

console.log('✅ Company Controller Module Loaded');

function modelController() {
  const methods = createCRUDController('Company');
  console.log('✅ Company Controller Initialized, default methods:', Object.keys(methods));

  const baseCreate = methods.create;
  const baseUpdate = methods.update;
  const baseListAll = methods.listAll;
  const baseRead = methods.read;
  const baseSearch = methods.search;
  const baseFilter = methods.filter;

  // Override paginatedList to skip company filter - companies don't have company field
  methods.paginatedList = async (req, res) => {
    console.log('Company paginatedList called - custom implementation');
    console.log('Query params:', req.query);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = (page - 1) * limit;

    const { sortBy = 'created', sortValue = -1 } = req.query;

    try {
      // First, let's check what's in the database
      const allCompanies = await Company.find({ removed: false });
      console.log('All companies in DB:', allCompanies.length, allCompanies.map(c => c.name));

      // Query without company filter - companies are top-level entities
      const resultsPromise = Company.find({ removed: false })
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: parseInt(sortValue) })
        .exec();

      const countPromise = Company.countDocuments({ removed: false });

      const [result, count] = await Promise.all([resultsPromise, countPromise]);
      
      console.log('Company paginatedList found', count, 'companies, returned', result.length);
      console.log('Result array:', result.map(c => ({ id: c._id, name: c.name })));
      
      const pages = Math.ceil(count / limit);
      const pagination = { page, pages, count, pageSize: limit };

      return res.status(200).json({
        success: true,
        result: result,
        pagination,
        message: count > 0 ? 'Successfully found all documents' : 'Collection is Empty',
      });
    } catch (error) {
      console.error('Company paginatedList error:', error);
      return res.status(500).json({
        success: false,
        result: [],
        pagination: { page: 1, pages: 0, count: 0 },
        message: 'Error fetching companies: ' + error.message,
      });
    }
  };

  // Override list to use our custom paginatedList
  methods.list = methods.paginatedList;

  // Override listAll to skip company filter
  methods.listAll = async (req, res) => {
    console.log('Company listAll called');
    try {
      const result = await Company.find({ removed: false })
        .sort({ created: 'desc' })
        .exec();

      console.log('Company listAll found', result.length, 'companies');

      return res.status(200).json({
        success: true,
        result,
        message: result.length > 0 ? 'Successfully found all documents' : 'Collection is Empty',
      });
    } catch (error) {
      console.error('Company listAll error:', error);
      return res.status(500).json({
        success: false,
        result: [],
        message: 'Error fetching companies: ' + error.message,
      });
    }
  };

  methods.create = async (req, res) => {
    try {
      // Check for duplicate name
      const existingCompany = await Company.findOne({
        name: req.body.name,
        removed: false,
      });

      if (existingCompany) {
        return res.status(409).json({
          success: false,
          result: null,
          message: 'A company with this name already exists.',
        });
      }

      req.body = appendAudit(req, req.body);
      return baseCreate(req, res);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          result: null,
          message: 'A company with this name already exists.',
        });
      }
      throw error;
    }
  };

  methods.update = async (req, res) => {
    try {
      // Check for duplicate name (excluding current company)
      const existingCompany = await Company.findOne({
        name: req.body.name,
        removed: false,
        _id: { $ne: req.params.id },
      });

      if (existingCompany) {
        return res.status(409).json({
          success: false,
          result: null,
          message: 'A company with this name already exists.',
        });
      }

      req.body = appendAudit(req, req.body);
      return baseUpdate(req, res);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          result: null,
          message: 'A company with this name already exists.',
        });
      }
      throw error;
    }
  };

  return methods;
}

module.exports = modelController();
