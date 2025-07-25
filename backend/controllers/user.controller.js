const User = require('../models/User.model');
const File = require('../models/File.model');
const ApiError = require('../utils/Api/ApiError.api');
const ApiSuccess = require('../utils/Api/ApiSuccess.api');

const getAllUser = async (req, res) => {

    //only for admin
    const users = await User.find().sort({ createdAt: -1 });
;

    return res.status(200).json(new ApiSuccess(200, "Users feched Successfully.", {users}));

}

const getHistory = async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('files');
    if (!user) {
        return res.status(404).json(new ApiError(404, 'User not found'));
    }
    return res.status(200).json(new ApiSuccess(200, 'User history fetched successfully', { history: user.files }));
}

const blockUser =async  (req, res) => {
    const {userId} = req.body;

    const user = await User.findById(userId);

    if(!user){
        return res.status(400).json(new ApiSuccess(400, 'Invalid User Id'));
    }

    user.userType = 'B';

    await user.save();

    return res.status(200).json(new ApiSuccess(200, 'User blocked successfully'));
}

const unBlockUser =async  (req, res) => {
    const {userId} = req.body;

    const user = await User.findById(userId);

    if(!user){
        return res.status(400).json(new ApiSuccess(400, 'Invalid User Id'));
    }

    user.userType = 'U';

    await user.save();

    return res.status(200).json(new ApiSuccess(200, 'User blocked successfully'));
}

const retiveGraphData = async (req, res) => {
    let graph = Array(10).fill(0);

    const files = await File.find({});

    files.forEach(file => {
        file.graphs.forEach((value, key) => {
            const index = parseInt(key);
            if (!isNaN(index) && index >= 0 && index < graph.length) {
                graph[index] += value;
            }
        });
    });

    return res.status(200).json(new ApiSuccess(200, 'Graphs retrieved successfully', { graphs: graph }));
};


module.exports = {getAllUser, getHistory, blockUser, retiveGraphData, unBlockUser}