const User = require('../models/User.model');
const ApiSuccess = require('../utils/Api/ApiSuccess.api');
const ApiError = require('../utils/Api/ApiError.api');

// REGISTER
const register =async (req, res) => {
  const { username, email, password, userType = 'U' } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, 'All fields are required');
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'User already exists');
  }

  const user = await User.create({ username, email, password, userType });

  const { accessToken, refreshToken } = user.generateTokens();
  user.refreshToken = refreshToken;
  await user.save();

  res
    .status(201)
    .json(new ApiSuccess(201, 'User registered successfully', { accessToken, refreshToken, user:{id:user._id, type:user.userType, username:user.username, email:user.email} }));
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.validatePassword(password))) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const { accessToken, refreshToken } = user.generateTokens();
  user.refreshToken = refreshToken;
  await user.save();

  res
    .status(200)
    .json(new ApiSuccess(200, 'Login successful', { accessToken, refreshToken, user:{id:user._id, type:user.userType, username:user.username, email:user.email} }));
};

// REFRESH TOKEN
const refresh = async (req, res) => {
  const { refreshToken } = req.body;


  if (!refreshToken) {
    throw new ApiError(400, 'Refresh token required');
  }

  const decoded = User.validateRefreshToken(refreshToken);
  if (!decoded) {
    throw new ApiError(403, 'Invalid refresh token');
  }

  const user = await User.findById(decoded.id);
  if (!user || user.refreshToken !== refreshToken) {
    throw new ApiError(403, 'Unauthorized');
  }

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } = user.generateTokens();
  user.refreshToken = newRefreshToken;
  await user.save();

  res
    .status(200)
    .json(new ApiSuccess(200, 'Token refreshed', { accessToken: newAccessToken, refreshToken: newRefreshToken }));
};

// LOGOUT
const logout = async (req, res) => {
  const { refreshToken } = req.body;


  if (!refreshToken) {
    throw new ApiError(400, 'Refresh token required');
  }

  const user = await User.findOne({ refreshToken });
  if (user) {
    user.refreshToken = '';
    await user.save();
  }

  res.status(200).json(new ApiSuccess(200, 'Logged out successfully'));
};

module.exports = {
  register,
  login,
  refresh,
  logout,
};
