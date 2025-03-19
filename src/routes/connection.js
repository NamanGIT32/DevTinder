const express = require('express');
const { userAuth } = require('../middlewares/userAuth');
const { connectionRequestModel } = require('../models/request');
const router = express.Router();

// API to remove connection 
router.post("/remove/:connectionId", userAuth, async (req, res)=> {
    try {
        const {connectionId} = req.params;
        const connection = await connectionRequestModel.findById(connectionId);
        if(!connection){
            throw new Error("Connection not found");
        }
        await connectionRequestModel.findByIdAndDelete(connectionId);
        return res.status(200).json({response: "Connection removed succussfully"});
    } catch (error) {
        return res.status(400).json({message:"Error while removing request", error: error.message, stack: error.stack});
    }
});


module.exports = router;