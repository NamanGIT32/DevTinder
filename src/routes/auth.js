const express = require('express');
const {validation} = require("../utils/validation");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const User = require("../models/user");
const { userAuth } = require('../middlewares/userAuth');

const router = express.Router();

router.post("/signup", async (req, res) => {
  const {firstName, lastName, emailId, password, middleName, age, gender, skills, about, imageURL, status} = req.body;
    try {
      const validFields = ["firstName", "lastName", "emailId", "password", "middleName", "age", "gender", "skills", "about", "imageURL", "status"];
      const isValidField = Object.keys(req.body).every(field => validFields.includes(field));
      if(!isValidField){
        throw new Error("Invalid field found");
      }
      validation(req);
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = new User({
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        emailId: emailId,
        password: hashedPassword,
        age: age,
        gender: gender,
        skills: skills,
        about: about,
        imageURL: imageURL,
        status: status
      });
  
      await user.save();
      const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:"1d"});
      res.cookie("token", token, {maxAge: 86400000});
      return res.status(200).json({response: "User created successfully", data: user});
    } catch (err) {
      return res.status(400).json({response:"Error while creating user", error: err.message, stack: err.stack});
    }
  });
  
router.post('/login', async (req, res) => {
  const {emailId, password, status} = req.body;
  try {
    const user = await User.findOne({emailId: emailId});
    if(!user){
      throw new Error("Invalid credentials");
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
      throw new Error("Invalid credentials");
    }
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:"1d"});
    res.cookie("token", token, {maxAge: 86400000});
    user.status=status;
    await user.save();
    return res.status(200).json({response:"Login successfull", data: user});
  } catch (err) {
    return res.status(400).json({response:"Error while login", error: err.message, stack:err.stack});  
  }
})

router.post('/logout', userAuth, async (req, res)=> {
  const user = req.user;
  user.status="offline";
  await user.save();
  res.cookie("token", "", {maxAge: 0});
  return res.status(200).send("User logout successfully");
});

module.exports = router;