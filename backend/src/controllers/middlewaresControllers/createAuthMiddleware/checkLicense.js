const checkLicense = async (req, res, next) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    // Owner bypasses license check
    if (user.role === 'owner') {
      return next();
    }

    // Check if license is active
    if (!user.isLicenseActive) {
      return res.status(403).json({ 
        success: false, 
        message: 'License is inactive. Please renew your subscription.' 
      });
    }

    // Check license expiry
    if (user.licenseExpiryDate && new Date() > new Date(user.licenseExpiryDate)) {
      return res.status(403).json({ 
        success: false, 
        message: 'License has expired. Please renew your subscription.' 
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = checkLicense;
