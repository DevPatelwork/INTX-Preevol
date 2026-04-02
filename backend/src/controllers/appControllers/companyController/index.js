const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const { appendAudit } = require('@/controllers/helpers/companyScope');

function modelController() {
  const methods = createCRUDController('Company');

  const baseCreate = methods.create;
  const baseUpdate = methods.update;

  methods.create = (req, res) => {
    req.body = appendAudit(req, req.body);
    return baseCreate(req, res);
  };

  methods.update = (req, res) => {
    req.body = appendAudit(req, req.body);
    return baseUpdate(req, res);
  };

  return methods;
}

module.exports = modelController();
