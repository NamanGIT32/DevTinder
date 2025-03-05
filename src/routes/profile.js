const express = require('express');
const router = express.Router();
const {userAuth} = require('../middlewares/auth');
router.get("/view", userAuth, async (req, res) => {
    try {
      const user = req.user;
      return res.status(200).json({response:"User profile fetched successfully", user});
    } catch (err) {
        return res.status(400).json({response:"error while fetching user", error:err.message, stack:err.stack})
    }
  });

module.exports = router;