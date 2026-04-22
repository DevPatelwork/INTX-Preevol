const express = require('express');

const { catchErrors } = require('@/handlers/errorHandlers');

const router = express.Router();

const adminController = require('@/controllers/coreControllers/adminController');
const settingController = require('@/controllers/coreControllers/settingController');
const invoiceController = require('@/controllers/coreControllers/invoiceController');
const clientController = require('@/controllers/coreControllers/clientController');
const categoryController = require('@/controllers/coreControllers/categoryController');
const subCategoryController = require('@/controllers/coreControllers/subCategoryController');
const productController = require('@/controllers/coreControllers/productController');
const mongoose = require('mongoose');

const { singleStorageUpload } = require('@/middlewares/uploadMiddleware');

// //_______________________________ Admin management_______________________________

router.route('/admin/create').post(catchErrors(adminController.create));
router.route('/admin/read/:id').get(catchErrors(adminController.read));
router.route('/admin/update/:id').patch(catchErrors(adminController.update));
router.route('/admin/delete/:id').delete(catchErrors(adminController.delete));
router.route('/admin/search').get(catchErrors(adminController.search));
router.route('/admin/list').get(catchErrors(adminController.list));
router.route('/admin/listAll').get(catchErrors(adminController.listAll));
router.route('/admin/filter').get(catchErrors(adminController.filter));
router.route('/admin/password-update/:id').patch(catchErrors(adminController.updatePassword));

//_______________________________ Admin Profile _______________________________

router.route('/admin/profile/password').patch(catchErrors(adminController.updateProfilePassword));
router
  .route('/admin/profile/update')
  .patch(
    singleStorageUpload({ entity: 'admin', fieldName: 'photo', fileType: 'image' }),
    catchErrors(adminController.updateProfile)
  );

// //____________________________________________ API for Global Setting _________________

router.route('/setting/create').post(catchErrors(settingController.create));
router.route('/setting/read/:id').get(catchErrors(settingController.read));
router.route('/setting/update/:id').patch(catchErrors(settingController.update));
//router.route('/setting/delete/:id).delete(catchErrors(settingController.delete));
router.route('/setting/search').get(catchErrors(settingController.search));
router.route('/setting/list').get(catchErrors(settingController.list));
router.route('/setting/listAll').get(catchErrors(settingController.listAll));
router.route('/setting/filter').get(catchErrors(settingController.filter));
router
  .route('/setting/readBySettingKey/:settingKey')
  .get(catchErrors(settingController.readBySettingKey));
router.route('/setting/listBySettingKey').get(catchErrors(settingController.listBySettingKey));
router
  .route('/setting/updateBySettingKey/:settingKey?')
  .patch(catchErrors(settingController.updateBySettingKey));
router
  .route('/setting/upload/:settingKey?')
  .patch(
    singleStorageUpload({ entity: 'setting', fieldName: 'settingValue', fileType: 'image' }),
    catchErrors(settingController.updateBySettingKey)
  );
router.route('/setting/updateManySetting').patch(catchErrors(settingController.updateManySetting));

// //_______________________________ Invoice management_______________________________

router.route('/invoice/create').post(catchErrors(invoiceController.create));
router.route('/invoice/read/:id').get(catchErrors(invoiceController.read));
router.route('/invoice/update/:id').patch(catchErrors(invoiceController.update));
router.route('/invoice/delete/:id').delete(catchErrors(invoiceController.delete));
router.route('/invoice/search').get(catchErrors(invoiceController.search));
router.route('/invoice/list').get(catchErrors(invoiceController.list));
router.route('/invoice/listAll').get(catchErrors(invoiceController.listAll));
router.route('/invoice/filter').get(catchErrors(invoiceController.filter));

// //_______________________________ Client management_______________________________

router.route('/client/create').post(catchErrors(clientController.create));
router.route('/client/read/:id').get(catchErrors(clientController.read));
router.route('/client/update/:id').patch(catchErrors(clientController.update));
router.route('/client/delete/:id').delete(catchErrors(clientController.delete));
router.route('/client/search').get(catchErrors(clientController.search));
router.route('/client/list').get(catchErrors(clientController.list));
router.route('/client/listAll').get(catchErrors(clientController.listAll));
router.route('/client/filter').get(catchErrors(clientController.filter));

// //_______________________________ Category management_______________________________

router.route('/category/create').post(catchErrors(categoryController.create));
router.route('/category/read/:id').get(catchErrors(categoryController.read));
router.route('/category/update/:id').patch(catchErrors(categoryController.update));
router.route('/category/delete/:id').delete(catchErrors(categoryController.delete));
router.route('/category/search').get(catchErrors(categoryController.search));
router.route('/category/list').get(catchErrors(categoryController.list));
router.route('/category/listAll').get(catchErrors(categoryController.listAll));
router.route('/category/filter').get(catchErrors(categoryController.filter));

// //_______________________________ SubCategory management_______________________________

router.route('/subCategory/create').post(catchErrors(subCategoryController.create));
router.route('/subCategory/read/:id').get(catchErrors(subCategoryController.read));
router.route('/subCategory/update/:id').patch(catchErrors(subCategoryController.update));
router.route('/subCategory/delete/:id').delete(catchErrors(subCategoryController.delete));
router.route('/subCategory/search').get(catchErrors(subCategoryController.search));
router.route('/subCategory/list').get(catchErrors(subCategoryController.list));
router.route('/subCategory/listAll').get(catchErrors(subCategoryController.listAll));
router.route('/subCategory/filter').get(catchErrors(subCategoryController.filter));

// //_______________________________ Product management_______________________________

router.route('/product/create').post(catchErrors(productController.create));
router.route('/product/read/:id').get(catchErrors(productController.read));
router.route('/product/update/:id').patch(catchErrors(productController.update));
router.route('/product/delete/:id').delete(catchErrors(productController.delete));
router.route('/product/search').get(catchErrors(productController.search));
router.route('/product/list').get(catchErrors(productController.list));
router.route('/product/listAll').get(catchErrors(productController.listAll));
router.route('/product/filter').get(catchErrors(productController.filter));

//____________________________________________ Server Time _________________
router.route('/server/time').get((req, res) => {
  return res.status(200).json({
    success: true,
    result: {
      now: new Date().toISOString(),
    },
    message: 'Server time fetched successfully',
  });
});

//____________________________________________ Company Context _________________
router.route('/company-context').patch(async (req, res) => {
  const { companyId } = req.body || {};
  if (!companyId || !mongoose.Types.ObjectId.isValid(companyId)) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Valid companyId is required',
    });
  }

  req.admin.currentCompany = companyId;
  await req.admin.save();

  return res.status(200).json({
    success: true,
    result: { currentCompany: companyId },
    message: 'Current company context updated',
  });
});

module.exports = router;
