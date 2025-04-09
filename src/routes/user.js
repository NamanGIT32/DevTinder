const express = require('express');
const { userAuth } = require('../middlewares/userAuth');
const User = require('../models/user');
const { connectionRequestModel } = require('../models/request');
const { connection } = require('mongoose');
const router = express.Router();

const userSafeInfo = "firstName middleName lastName age imageURL gender skills about status";

// It would fetch all the pending connection requests
router.get('/getAllRequests', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const requests = await connectionRequestModel.find({
            toUserId: loggedInUserId,
            status: "interested"
        }).populate('fromUserId', ["firstName", "lastName", "imageURL", "_id"]);
        return res.status(200).json({response: "fetched all pending connection requests", data: requests}); 
    } catch (error) {
        return res.status(400).json({error: error.message, stack: error.stack});
    }
});

// It would fetch all the connections of user
router.get('/getAllConnections', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const getAllConnections = await connectionRequestModel.find({$or: [{fromUserId: loggedInUserId, status: "accepted"}, {toUserId: loggedInUserId, status: "accepted"}]  
        }).populate('fromUserId', userSafeInfo).populate('toUserId', userSafeInfo);

        const data = getAllConnections.map((connection) => {
            if(loggedInUserId.toString()===connection.fromUserId._id.toString()){
                return {connectionId: connection._id, user:connection.toUserId};
            }
            return {connectionId:connection._id, user:connection.fromUserId};
        });
        return res.status(200).json({response: "All connections fetched successfully", data: data});
    } catch (error) {
        return res.status(400).json({error: error.message, stack: error.stack});
    }
})

// Shows the feed of user
router.get('/feed', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const page = req.query.page || 1;
        let limit = req.query.limit || 10;
        const skip = (page-1)*limit;
        limit = limit>10?10:limit;
        const connections = await connectionRequestModel.find({
            $or: [{fromUserId: loggedInUserId}, {toUserId: loggedInUserId}]
        }).select("fromUserId toUserId");

        const uniqueConnectionsSet = new Set();
        connections.forEach(connection => 
            {uniqueConnectionsSet.add(connection.fromUserId._id.toString())
            uniqueConnectionsSet.add(connection.toUserId._id.toString())}
        );
        const feedUsers = await User.find({
            _id: {$nin: Array.from(uniqueConnectionsSet), $ne: loggedInUserId}
        })
        .select(userSafeInfo)
        .skip(skip)
        .limit(limit);

        return res.status(200).json({response: "User feed fetched successfully", data: feedUsers})
    } catch (error) {
        return res.status(400).json({error: error.message, stack: error.stack});
    }
});

router.delete('/deleteAccount', userAuth, async (req, res)=>{
    try {
        const loggedInUserId = req.user._id;
        const user = await User.findById(loggedInUserId);
        if(!user){
            throw new Error("User not found");
        }
        const connections = await connectionRequestModel.find({$or:[{fromUserId:loggedInUserId}, {toUserId: loggedInUserId}]}).select("_id");
        const deletedConnections = await connectionRequestModel.deleteMany({ _id: { $in: connections }});
        if(!deletedConnections.acknowledged){
            throw new Error("Error!! Connections not deleted");
        }
        await User.findByIdAndDelete(loggedInUserId);
        res.cookie("token", "", {maxAge: 0});
        return res.status(200).json({response: "user deleted successfully", deletedConnections: deletedConnections.deletedCount});
    } catch (error) {
        return res.status(400).json({error: error.message, stack: error.stack});
    } 
});

module.exports = router;