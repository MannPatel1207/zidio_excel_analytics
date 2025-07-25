const upload = require('../config/multer.config');
const cloudinary = require('../config/cloudinary.config');
const fs = require('fs');
const ApiError = require('../utils/Api/ApiError.api')

const fileUploadMiddleware = (req, res, next) => {

    //upload file to localstorage
    upload.single('file')(req, res, async (err) => {

        //file not uploaded
        if (err) {
        return res.status(400).json({ error: 'File upload failed', details: err.message });
        }

        try {
            //file upload to cluodinary
            const result = await cloudinary.uploader.upload(req.file.path , {
                folder: 'excelAnalysis/',
                resource_type: 'raw',
                });

            //add file in request object
            req.file.cloudinaryUrl = result.secure_url;
            req.file.cloudinaryId = result.public_id; 
            req.file.originalName = req.file.originalname; 

            next();
            } catch (uploadError) {
                console.log(uploadError);
                return res.status(500).json(new ApiError(500, 'Cloudinary upload failed', uploadError.message ));
            }
    });
}

module.exports = fileUploadMiddleware;