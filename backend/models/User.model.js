const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  files: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
  }],
  refreshToken: {
    type: String,
    default: '',
  },
  userType: {
    type: String,
    enum: ['A', 'U', 'B'],
    default: 'U',
  }
}, { timestamps: true });


// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare raw and hashed password
userSchema.methods.validatePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};


// Generate access and refresh tokens
userSchema.methods.generateTokens = function () {
  const user = {
    id: this._id,
    username: this.username,
    email: this.email,
    userType: this.userType,
    files: this.files,
  };

  const accessToken = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: '30m'
  });

  const refreshToken = jwt.sign({id: this.id}, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

  return { accessToken, refreshToken };
};

// check if user is admin
userSchema.methods.isAdmin = function () {
  return this.userType === 'A';
};


//  Static method to validate access token
userSchema.statics.validateAccessToken = function (token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

// Static method to validate refresh token
userSchema.statics.validateRefreshToken = function (token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
