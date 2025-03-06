const express = require('express');
const validation = require("../utils/validation");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const User = require("../models/user");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const {firstName, lastName, emailId, password, middleName, age, gender, skills, about, imageURL} = req.body;
    try {
      const validFields = ["firstName", "lastName", "emailId", "password", "middleName", "age", "gender", "skills", "about", "imageURL"];
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
        imageURL: imageURL
      });
  
      await user.save();
      return res.status(200).json({response: "User created successfully", user});
    } catch (err) {
      return res.status(400).json({response:"Error while creating user", error: err.message, stack: err.stack});
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
    res.cookie("token", token, {maxAge: 86400000});
    return res.status(200).json({response:"Login successfull"});
  } catch (err) {
    return res.status(400).json({response:"Error while login", error: err.message, stack:err.stack});  
  }
})

router.post('/logout', (req, res)=> {
  res.cookie("token", "", {maxAge: 0});
  return res.status(200).send("User logout successfully");
});

module.exports = router;