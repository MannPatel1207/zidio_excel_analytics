const express = require('express');
const insightRouter = express.Router();
const wrapAsync = require('../utils/WrapAsync.util');
const insightContoller = require('../controllers/insight.contoller');
const authenticateUser = require('../middlewares/auth.middleware');
const requireAdmin = require('../middlewares/adminAcess.middleware');

insightRouter.post('/', insightContoller.getInsights);

module.exports = insightRouter