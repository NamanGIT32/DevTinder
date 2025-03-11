const express = require('express');
const router = express.Router();
const {userAuth} = require('../middlewares/userAuth');
const User = require('../models/user')
const {connectionRequestModel} = require('../models/request.js');

// API to send connection request [includes both status: interested and ignored]
router.post('/send/:status/:toUserId', userAuth, async (req, res)=> {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    if(!["interested", "ignored"].includes(status)){
      throw new Error("Invalid status found");
    }

    const userExist = await User.findById(toUserId);
    if(!userExist) throw new Error("user not exist");

    const existingRequest = await connectionRequestModel.findOne({$or: [{fromUserId, toUserId}, {fromUserId: toUserId, toUserId: fromUserId}]});
    if(existingRequest){
      throw new Error("request already sent");
    }

    const newConnectionRequest = new connectionRequestModel({fromUserId, toUserId, status});
    // using pre middleware to check for connection request to itself before save
    await newConnectionRequest.save();
    return res.status(200).json({response: "connection request sent successfully", data: newConnectionRequest});
  } catch (error) {
    return res.status(400).json({error: error.message, stack: error.stack});
  }
});

// API to review connection request [includes both status: accepted and rejected]
router.post('/review/:status/:requestId', userAuth, async (req, res) => {
  try {
    const {status, requestId} = req.params;
    const loggedInUserId = req.user._id;

    if(!["accepted", "rejected"].includes(status)){
      throw new Error("Invalid status found");
    }

    const connectionRequest = await connectionRequestModel.findOne({
      _id: requestId,
      toUserId: loggedInUserId,
      status: "interested"
    });

    if(!connectionRequest){
      throw new Error("invalid request ");
    }

    connectionRequest.status = status;
    await connectionRequest.save();
    return res.status(200).json({response: "connection request reviewed successfully", data: connectionRequest});
  } catch (error) {
    return res.status(400).json({error: error.message, stack: error.stack});
  }
});

module.exports = router;