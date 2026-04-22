const mongoose = require('mongoose');
const { generate: uniqueId } = require('shortid');

const create = async (req, res) => {
  try {
    const Admin = mongoose.model('Admin');
    const AdminPassword = mongoose.model('AdminPassword');

    const { email, name, surname, role, enabled, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        result: null,
        message: 'An account with this email already exists.',
      });
    }

    // Create new admin
    const adminData = {
      email: email.toLowerCase(),
      name,
      surname,
      role: role || 'user',
      enabled: enabled !== undefined ? enabled : true,
    };

    const newAdmin = await new Admin(adminData).save();

    // Generate salt and hash password
    const newAdminPassword = new AdminPassword();
    const salt = uniqueId();
    const passwordHash = newAdminPassword.generateHash(salt, password || 'admin123');

    const adminPasswordData = {
      password: passwordHash,
      emailVerified: true,
      salt: salt,
      user: newAdmin._id,
    };

    await new AdminPassword(adminPasswordData).save();

    return res.status(200).json({
      success: true,
      result: newAdmin,
      message: 'User created successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};

module.exports = create;
