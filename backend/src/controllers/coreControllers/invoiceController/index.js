const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const crudController = createCRUDController('Invoice');

module.exports = crudController;
