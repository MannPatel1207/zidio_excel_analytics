const fs = require('fs');
const xlsx = require('xlsx');
const File = require('../models/File.model');
const path = require('path');
const ApiSuccess = require('../utils/Api/ApiSuccess.api');
const ApiError = require('../utils/Api/ApiError.api');
const axios = require('axios');
const User = require('../models/User.model')

const uploadFile = async (req, res) => {

     try {
         
        const file = new File({
            filename: req.file.originalname,
            fileType: req.file.mimetype.includes('csv') ? 'csv' : 'xlsx',
            uploadUrl: req.file.cloudinaryUrl,
            user: req.user.id,
            graphs: [],
            insights: false
        });

        const user = await User.findById(req.user.id);
        user.files.push(file._id);

        await user.save();        
        await file.save();

            
        const dataClass =await getData(req.file.path);
        dataClass.data = {file, retrivedData: dataClass.data};

        return res.status(dataClass.statusCode).json(dataClass);
    } catch (error) {
        console.log(error);
        return res.status(500).json(new ApiError(500, 'Error processing file', error));
    }
}

const retriveData = async (req, res) => {
    try {
        console.log(req.params.id);
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).json(new ApiError(404, 'File not found'));
        }

        //download file from uploadUrl
        const filename = `temp-${Date.now()}.xlsx`;
        const tempPath = path.join(__dirname, '..', 'uploads', filename);

        // Download file from Cloudinary URL
        console.log(tempPath);
        const response = await axios.get(file.uploadUrl, { responseType: 'stream' });
        const writer = fs.createWriteStream(tempPath);

        await new Promise((resolve, reject) => {
            response.data.pipe(writer);
            writer.on('finish', resolve);
            writer.on('error', reject);
        }); 


        const dataClass = await getData(tempPath);

        return res.status(dataClass.statusCode).json(dataClass);
    } catch (error) {
        console.log(error);
        return res.status(500).json(new ApiError(500, 'Error retrieving file data', error));
    }
}

const getData = async (filePath) => {
    try {
        // const file = await File.findById(req.params.id);
        // if (!file) {
        //     return res.status(404).send('File not found');
        // }

        const workbook = xlsx.readFile(filePath);
        const allData = {};

        workbook.SheetNames.forEach((sheetName) => {
            const sheet = workbook.Sheets[sheetName];
            allData[sheetName] = xlsx.utils.sheet_to_json(sheet);
        });

        fs.unlinkSync(filePath); // Clean up

        return new ApiSuccess(200, 'File data retrieved successfully', allData);
    } catch (error) {
        console.log(error);
        return new ApiError(500, 'Error retrieving file data');
    }
}

const retriveFiles = async (req, res) => {
    try {
        const files = await File.find({ user: req.user.id });
        if (!files || files.length === 0) {
            return res.status(404).json(new ApiError(404, 'No files found for this user'));
        }

        return res.status(200).json(new ApiSuccess(200, 'Files retrieved successfully', {files}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new ApiError(500, 'Error retrieving files', error));
    }
}

const retriveAllFiles = async (req, res) => {
    try {
        const files = await File.find().sort({ createdAt: -1 });
        if (!files || files.length === 0) {
            return res.status(404).json(new ApiError(404, 'No files found for this user'));
        }

        return res.status(200).json(new ApiSuccess(200, 'Files retrieved successfully', {files}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new ApiError(500, 'Error retrieving files', error));
    }
}

const updateGraph = async (req, res) => {
    const { id: fileId } = req.params;
    const { graphId } = req.body;

    const file = await File.findById(fileId);
    if (!file) {
        return res.status(404).json(new ApiError(404, 'No file found'));
    }

    const key = String(graphId);
    const currentValue = file.graphs.get(key) || 0;
    file.graphs.set(key, currentValue + 1);

    await file.save();

    return res.status(200).json(new ApiSuccess(200, 'Graph updated successfully', {}));
};



module.exports = {uploadFile, retriveData, retriveFiles, retriveAllFiles, getData, updateGraph}