const createUserController = require('@/controllers/middlewaresControllers/createUserController');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

// Get user-specific methods (password, profile) - these use modelName string
const userController = createUserController('Admin');

// Get all CRUD methods from generic controller - these use Mongoose Model object
const crudController = createCRUDController('Admin');

// Combine: userController first for user-specific methods, then crudController overrides
const adminController = {
  ...userController,
  ...crudController,
  create: require('./create'),
};

module.exports = adminController;
