const User = require('../models/User.model');
const ApiError = require('../utils/Api/ApiError.api')

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, "AcessToken Required.");
  }

  const token = authHeader.split(' ')[1];

  // ✅ Call the static method
  const decoded = User.validateAccessToken(token);

  if (!decoded) {
    throw new ApiError(403, "Invalid or expired token");
  }

  req.user = decoded;
  next();
};

module.exports = authenticateUser;
