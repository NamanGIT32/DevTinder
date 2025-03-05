const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const validation = require("./utils/validation");
const {userAuth} = require('./middlewares/auth')
const bcrypt = require("bcrypt")
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3000;

//middleware to parse JSON data
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post('/login', async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({response:"User profile fetched successfully", user});
  } catch (err) {
      return res.status(400).json({response:"error while fetching user", error:err.message, stack:err.stack})
  }
});

app.post('/sendConnectionRequest', userAuth, (req, res)=>{
  const user = req.user;
  res.send("connection request sent by: " + user.firstName);
})

app.patch("/updateUser/:id", async (req, res) => {
  const data = req.body;
  const userId = req.params.id;
  const canUpdateFields = [
    "firstName",
    "middleName",
    "lastName",
    "age",
    "gender",
    "skills",
    "imageURL",
  ];
  try {
    if (!Object.keys(data).every((field) => canUpdateFields.includes(field))) {
      throw new Error("Invalid field found to update");
    }
    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
  } catch (error) {
    return res.status(400).send("Error while updating user " + error);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully....");
    app.listen(PORT, () => {
      console.log("Server is started on port " + PORT);
    });
  })
  .catch((err) => console.error("Error in connecting database", err));
