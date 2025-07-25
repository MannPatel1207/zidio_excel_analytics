const File = require('../models/File.model');
const { GoogleGenAI } = require('@google/genai');
const ApiError = require('../utils/Api/ApiError.api');
const ApiSuccess = require('../utils/Api/ApiSuccess.api');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const {getData} = require('./file.controller')   



const ai = new GoogleGenAI({ apiKey: process.env.GENAI_API_KEY });

const getInsights = async (req, res) => {
    try{
        const { recordId } = req.body;
        const record = await File.findById(recordId);

        if (!record) {
            return res.status(404).json(new ApiError(404, 'Record not found'));
        }

         //download file from uploadUrl
        const filename = `temp-${Date.now()}.xlsx`;
        const tempPath = path.join(__dirname, '..', 'uploads', filename);
        
        // Download file from Cloudinary URL
        console.log(tempPath);
        const response = await axios.get(record.uploadUrl, { responseType: 'stream' });
        const writer = fs.createWriteStream(tempPath);
        
        await new Promise((resolve, reject) => {
            response.data.pipe(writer);
            writer.on('finish', resolve);
            writer.on('error', reject);
        }); 
        
        
        const data = await getData(tempPath);

        console.log('data:', data);

        const sampleData = JSON.stringify(data);

        async function main() {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                // contents: `You are data analyst. Give 3 actionable insights based on the following data: ${sampleData}`,
                contents: `You are a professional data analyst.

                            Given the following Excel data sample, provide:
                            1. Two smart, actionable insights from the data.
                            2. For each insight, suggest the most appropriate chart type (e.g., bar chart, line chart, pie chart, scatter plot etc.) and explain why that chart fits.
                            give in short detail

                            Here is the data sample:
                            ${sampleData}`,
            });
            console.log(response.text);

            return response.text;
        }

        const insights = await main();

        res.status(201).json(new ApiSuccess(201, 'Insights generated successfully', { insights })
            
        );
    }
    catch (err) {
        console.error(err);
        res.status(500).json(new ApiError(500, 'Error generating insights', err));
    }
}

module.exports = {getInsights};