    const express = require('express');
    const userRouter = express.Router();
    const wrapAsync = require('../utils/WrapAsync.util');
    const userContoller = require('../controllers/user.controller');
    const authenticateUser = require('../middlewares/auth.middleware');
    const requireAdmin = require('../middlewares/adminAcess.middleware');

    userRouter.get('/', authenticateUser, requireAdmin, wrapAsync(userContoller.getAllUser));
    userRouter.get('/history', authenticateUser, userContoller.getHistory);
    userRouter.post('/block', authenticateUser, requireAdmin, userContoller.blockUser);
    userRouter.post('/unblock', authenticateUser,requireAdmin, userContoller.unBlockUser);
    userRouter.get('/graphData', authenticateUser,requireAdmin, userContoller.retiveGraphData);

    module.exports = userRouter