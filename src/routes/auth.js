const express = require('express');
const validation = require("../utils/validation");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const User = require("../models/user");

const router = express.Router();

router.post("/signup", async (req, res) => {
    const { firstName, lastName, emailId, password} = req.body;
    try {
      validation(req);
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = new User({
        firstName: firstName,
        lastName: lastName,
        emailId: emailId,
        password: hashedPassword,
        imageURL:"https://cdn-icons-png.flaticon.com"
      });
  
      await user.save();
      res.send("User created successfully");
    } catch (err) {
      return res.status(402).json({response:"Error while creating user", error: err.message});
    }
  });
  
router.post('/login', async (req, res) => {
  const {emailId, password} = req.body;
  try {
    const user = await User.findOne({emailId: emailId});
    if(!user){
      throw new Error("Invalid credentials");
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
      throw new Error("Invalid credentials");
    }
    const token = jwt.sign({id:user._id}, "secretDevTinder", {expiresIn:"1d"});
    res.cookie("token", token);
    return res.status(200).json({response:"Login successfull"});
  } catch (err) {
    return res.status(400).json({response:"Error while login", error: err.message, stack:err.stack});  
  }
})

module.exports = router;