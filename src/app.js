const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const validation = require("./utils/validation");
const bcrypt = require("bcrypt")

const app = express();
const PORT = 3000;

//middleware to parse JSON data
app.use(express.json());

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
    console.log(user);
    if(!user){
      throw new Error("Invalid credentials");
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
      throw new Error("Invalid credentials");
    }
    return res.status(200).json({response:"Login successfull"});
  } catch (err) {
    return res.status(400).json({response:"Error while login", error: err.message});
  }
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

app.get("/getUsers", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.send("error while getting users", error);
  }
});

app.get("/getUser", async (req, res) => {
  try {
    const user = await User.findOne({
      lastName: "kolhi",
    });
    res.send(user);
  } catch (error) {
    res.send("error while getting users", error);
  }
});

app.delete("/deleteUser", async (req, res) => {
  const { firstName } = req.body;
  try {
    const user = await User.find({ firstName: firstName });

    if (!user) return res.status(400).send("User not found");

    await User.findByIdAndDelete(user._id);
    res.status(200).send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Error while deleting user", err);
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
