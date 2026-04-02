const express = require('express');

const { catchErrors } = require('@/handlers/errorHandlers');

const router = express.Router();

const adminController = require('@/controllers/coreControllers/adminController');
const settingController = require('@/controllers/coreControllers/settingController');
const mongoose = require('mongoose');

const { singleStorageUpload } = require('@/middlewares/uploadMiddleware');

// //_______________________________ Admin management_______________________________

router.route('/admin/read/:id').get(catchErrors(adminController.read));

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
