require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { globSync } = require('glob');
const fs = require('fs');
const { generate: uniqueId } = require('shortid');
const Joi = require('joi');

const mongoose = require('mongoose');

const setup = async (req, res) => {
  const Admin = mongoose.model('Admin');
  const AdminPassword = mongoose.model('AdminPassword');
  const Setting = mongoose.model('Setting');

  const newAdminPassword = new AdminPassword();

  const { name, email, password, language, timezone, country, config = {} } = req.body;

  const objectSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required(),
    password: Joi.string().required(),
  });

  const { error, value } = objectSchema.validate({ name, email, password });
  if (error) {
    return res.status(409).json({
      success: false,
      result: null,
      error: error,
      message: 'Invalid/Missing credentials.',
      errorMessage: error.message,
    });
  }

  const adminsCount = await Admin.countDocuments();
  if (adminsCount > 0) {
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Setup already completed. Please login with an existing admin account.',
    });
  }

  const salt = uniqueId();

  const passwordHash = newAdminPassword.generateHash(salt, password);

  const accountOwnner = {
    email,
    name,
    enabled: true,
    role: 'owner',
  };
  const result = await new Admin(accountOwnner).save();

  const AdminPasswordData = {
    password: passwordHash,
    emailVerified: true,
    salt: salt,
    user: result._id,
  };
  await new AdminPassword(AdminPasswordData).save();

  const settingData = [];

  const settingsFiles = globSync('./src/setup/defaultSettings/**/*.json');

  for (const filePath of settingsFiles) {
    const file = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const settingsToUpdate = {
      preevol_techinite_app_email: email,
      preevol_techinite_app_company_email: email,
      preevol_techinite_app_timezone: timezone,
      preevol_techinite_app_country: country,
      preevol_techinite_app_language: language || 'en_us',
    };

    const newSettings = file.map((x) => {
      const settingValue = settingsToUpdate[x.settingKey];
      return settingValue ? { ...x, settingValue } : { ...x };
    });

    settingData.push(...newSettings);
  }

  await Setting.insertMany(settingData);

  const Taxes = mongoose.models.Taxes;
  if (Taxes) {
    await Taxes.insertMany([{ taxName: 'Tax 0%', taxValue: '0', isDefault: true }]);
  }

  const PaymentMode = mongoose.models.PaymentMode;
  if (PaymentMode) {
    await PaymentMode.insertMany([
      {
        name: 'Default Payment',
        description: 'Default Payment Mode (Cash , Wire Transfer)',
        isDefault: true,
      },
    ]);
  }

  return res.status(200).json({
    success: true,
    result: {},
    message: 'Successfully Preevol Techinite App Setup',
  });
};

module.exports = setup;
