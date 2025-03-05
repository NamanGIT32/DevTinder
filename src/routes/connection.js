const express = require('express');
const router = express.Router();
const {userAuth} = require('../middlewares/auth');
router.post('/sendConnectionRequest', userAuth, (req, res)=>{
    const user = req.user;
    res.send("connection request sent by: " + user.firstName);
  })

module.exports = router;