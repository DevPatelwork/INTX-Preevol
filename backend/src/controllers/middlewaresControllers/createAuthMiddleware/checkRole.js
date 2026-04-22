const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    // Owner has access to everything
    if (user.role === 'owner') {
      return next();
    }

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};

module.exports = checkRole;
