const fileUploadMiddleware = require('../middlewares/fileUpload.middleware');
const express = require('express');
const fileRouter = express.Router();
const fileController = require('../controllers/file.controller');
const authenticateUser = require('../middlewares/auth.middleware');
const requireAdmin = require('../middlewares/adminAcess.middleware');

// Import the file upload middleware

fileRouter.get('/', authenticateUser, fileController.retriveAllFiles);
fileRouter.get('/all', authenticateUser, requireAdmin, fileController.retriveAllFiles);
fileRouter.post('/upload',authenticateUser, fileUploadMiddleware, fileController.uploadFile);
fileRouter.get('/:id/data',authenticateUser, fileController.retriveData);
fileRouter.post('/:id/',authenticateUser, fileController.updateGraph);

module.exports = fileRouter;