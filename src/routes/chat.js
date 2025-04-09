const express = require('express');
const { userAuth } = require('../middlewares/userAuth');
const { Chat } = require('../models/chat');

const router = express.Router();

// Route to get all the chats of users.
router.get('/getChat/:targetUserId', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const {targetUserId} = req.params;
         // Prevent self-chat queries
         if (userId.toString() === targetUserId) {
            return res.status(400).json({ message: "You cannot chat with yourself" });
        }

        const chats = await Chat.findOne({
            participants: {$all: [userId, targetUserId]}
        }).populate("participants", "firstName lastName").populate("messages.senderId", "firstName lastName imageURL");
        if(!chats){
            return res.status(200).json({message: "No chats exists between users", chats: chats});
        };

        return res.status(200).json({message: "Chats fetched successfully",  chats: chats});
    } catch (error) {
        return res.status(400).json({message: "error while fetching chats", error: error.message, stack: error.stack});
    }
});

module.exports = router;