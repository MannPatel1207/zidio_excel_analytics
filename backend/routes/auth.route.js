const express = require('express');
const authRouter = express.Router();
const wrapAsync = require('../utils/WrapAsync.util');
const authController = require('../controllers/auth.controller');

authRouter.post('/register', wrapAsync(authController.register));
authRouter.post('/login', wrapAsync(authController.login));
authRouter.post('/refresh', wrapAsync(authController.refresh));
authRouter.post('/logout', wrapAsync(authController.logout));

module.exports = authRouter