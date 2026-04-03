const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const { appendAudit } = require('@/controllers/helpers/companyScope');
const Company = require('@/models/appModels/Company');

function modelController() {
  const methods = createCRUDController('Company');

  const baseCreate = methods.create;
  const baseUpdate = methods.update;
  const baseListAll = methods.listAll;

  methods.paginatedList = async (req, res) => {
    console.log('Company paginatedList called');
    // Skip company filter for companies - they don't have a company field
    const Model = Company;
    const page = req.query.page || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = page * limit - limit;

    const { sortBy = 'created', sortValue = -1 } = req.query;

    const resultsPromise = Model.find({
      removed: false,
    })
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortValue })
      .exec();

    const countPromise = Model.countDocuments({
      removed: false,
    });

    const [result, count] = await Promise.all([resultsPromise, countPromise]);
    console.log('Company paginatedList found', count, 'companies');
    const pages = Math.ceil(count / limit);
    const pagination = { page, pages, count };

    if (count > 0) {
      return res.status(200).json({
        success: true,
        result,
        pagination,
        message: 'Successfully found all documents',
      });
    } else {
      return res.status(203).json({
        success: true,
        result: [],
        pagination,
        message: 'Collection is Empty',
      });
    }
  };

  methods.list = methods.paginatedList;

  methods.listAll = async (req, res) => {
    try {
      const result = await Company.find({
        removed: false,
      })
        .sort({ created: 'desc' })
        .exec();

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
    } catch (error) {
      throw error;
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
