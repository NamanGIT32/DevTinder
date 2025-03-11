const express = require('express');
const { userAuth } = require('../middlewares/userAuth');
const { connectionRequestModel } = require('../models/request');
const router = express.Router();

// It would fetch all the pending connection requests
router.get('/getAllRequests', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const requests = await connectionRequestModel.find({
            toUserId: loggedInUserId,
            status: "interested"
        }).populate('fromUserId', ["firstName", "lastName"]);
        return res.status(200).json({response: "fetched all pending connection requests", data: requests}); 
    } catch (error) {
        return res.status(400).json({error: error.message, stack: error.stack});
    }
});

router.get('/getAllConnections', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const getAllConnections = await connectionRequestModel.find({$or: [{fromUserId: loggedInUserId, status: "accepted"}, {toUserId: loggedInUserId, status: "accepted"}]  
        }).populate('fromUserId', ["firstName", "lastName"]).populate('toUserId', ["firstName", "lastName"]);

        const data = getAllConnections.map((connection) => {
            if(loggedInUserId.toString()===connection.fromUserId._id.toString()){
                return connection.toUserId;
            }
            return connection.fromUserId;
        });
        return res.status(200).json({response: "All connections fetched successfully", data: data});
    } catch (error) {
        return res.status(400).json({error: error.message, stack: error.stack});
    }
})

module.exports = router;