const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const { connectionRequestModel } = require("../models/request");
const { connection } = require("mongoose");
const router = express.Router();

const userSafeInfo =
  "firstName middleName lastName age imageURL gender skills about";

// API to remove connection
router.post("/remove/:connectionId", userAuth, async (req, res) => {
  try {
    const { connectionId } = req.params;
    const connection = await connectionRequestModel.findById(connectionId);
    if (!connection) {
      throw new Error("Connection not found");
    }
    await connectionRequestModel.findByIdAndDelete(connectionId);
    return res
      .status(200)
      .json({ response: "Connection removed succussfully" });
  } catch (error) {
    return res
      .status(400)
      .json({
        message: "Error while removing request",
        error: error.message,
        stack: error.stack,
      });
  }
});

// API to get ignored connections
router.get("/getIgnoredConnections", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const getAllConnections = await connectionRequestModel
      .find({ fromUserId: loggedInUserId, status: "ignored" })
      .populate("toUserId", userSafeInfo);
    const data = getAllConnections.map((connection) => {
      return { connectionId: connection._id, user: connection.toUserId };
    });
    return res
      .status(200)
      .json({
        response: "All Ignored connections fetched successfully",
        data: data,
      });
  } catch (error) {
    return res.status(400).json({ error: error.message, stack: error.stack });
  }
});

// API to remove the ignored conneection(so that we can again connect him)
router.post("/removeIgnoredConnection/:connectionId", userAuth, async (req, res) => {
  try {
    const { connectionId } = req.params;
    const connection = await connectionRequestModel.findById(connectionId);
    if (!connection) {
      throw new Error("Connection not found");
    }
    await connectionRequestModel.findByIdAndDelete(connectionId);
    return res
      .status(200)
      .json({ response: "Connection removed succussfully" });
  } catch (error) {
    return res
      .status(400)
      .json({
        message: "Error while removing request",
        error: error.message,
        stack: error.stack,
      });
  }
});

module.exports = router;
