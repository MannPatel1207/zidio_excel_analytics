const mongoose = require('mongoose');


const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
        trim: true,
    },
    fileType: {
        type: String,
        required: true,
        enum: ['csv', 'xlsx', 'xls'],
    },
    uploadUrl: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    graphs: {
        type: Map,
        of: Number,
        default: () => {
            const obj = {};
            for (let i = 0; i < 10; i++) {
                obj[i] = 0;
            }
            return obj;
        }
    },
    insights: {
        type: Boolean,
        default: false,
    },
    insights: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });



const File =  mongoose.models.File || mongoose.model('File', fileSchema);
// const File =  mongoose.model('File', fileSchema);
module.exports = File;
