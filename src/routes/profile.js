const express = require('express');
const router = express.Router();
const {userAuth} = require('../middlewares/userAuth');
const { validateFieldsToEdit } = require('../utils/validation');
const User = require('../models/user');

router.get("/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({response:"User profile fetched successfully", data: user});
  } catch (err) {
      return res.status(400).json({response:"error while fetching user", error:err.message, stack:err.stack})
  }
});

router.get('/getTargetUserProfile/:targetUserId', userAuth, async (req, res)=> {
  try {
    const {targetUserId} = req?.params;
    const targetUser = await User.findById(targetUserId);
    if(!targetUser){
      throw new Error("User does not exist");
    }
    return res.status(200).json({response: "User details fetched successfully", data: targetUser});
  } catch (error) {
    return res.status(400).json({response: "Error while getting user profile", error: error.message, stack: error.satck});
  }
})

router.patch('/edit', userAuth, async (req, res) => {
  try {
    const {firstName, middleName, lastName, emailId, age, gender, skills, about, imageURL} = req.body;
    const validFields = ["firstName", "middleName", "lastName", "emailId", "age", "gender", "skills", "about", "imageURL"];
    const isValidFields = Object.keys(req.body).every((field) => validFields.includes(field));
    if(!isValidFields){
      throw new Error("Invalid field found");
    }
    validateFieldsToEdit(req);
    const updatedUserObject = {
      firstName: firstName,
      lastName: lastName,
      middleName: middleName,
      emailId: emailId,
      age: age,
      gender: gender,
      skills: skills,
      about: about,
      imageURL: imageURL
    }
    const user = req.user;
    const updatedUser = await User.findOneAndUpdate({emailId:user.emailId}, updatedUserObject, {runValidators:true, returnDocument: 'after'});
    req.user = updatedUser
    return res.status(200).json({response: "user updated successfully", data: updatedUser});
  } catch (error) {
    return res.status(400).json({message:"something went wrong", error: error.message, stack: error.stack});
  }
})

module.exports = router;