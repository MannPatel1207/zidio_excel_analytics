const User = require('../models/User.model');
const ApiError = require('../utils/Api/ApiError.api');

const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin()) {
      throw new ApiError(403, 'Admin access required');
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = requireAdmin;
