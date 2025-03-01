const express = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require('./models/user'); 
const PORT= 3000;

//middleware to parse JSON data
app.use(express.json());

app.post('/signup', async (req, res) =>  {
  const {firstName, middleName, lastName, emailId, password, age, gender} = req.body;
  try {
    const user = new User({
      firstName:firstName,
      middleName:middleName,
      lastName:lastName,
      emailId:emailId,
      password:password,
      age:age,
      gender:gender
    })
    await user.save();
    res.send("User created successfully");
  } catch (error) {
    res.status(402).json({msg:"error while creating user", error});
  }
});

app.get('/getUsers', async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.send("error while getting users", error);
  }
});

app.get('/getUser', async (req, res) => {
  try {
    const user = await User.findOne({
      lastName:"kolhi"
      });
    res.send(user);
  } catch (error) {
    res.send("error while getting users", error);
  }
});

app.delete('/deleteUser', async (req, res) => {
  const {firstName} = req.body;
  try{
    const user= await User.find({firstName:firstName});
    
    if(!user) return res.status(400).send("User not found");
    
    await User.findByIdAndDelete(user._id);
    res.status(200).send("User deleted successfully");
  }
  catch(err){
    res.status(400).send("Error while deleting user", err);
  }
});


connectDB()
.then(()=> {
  console.log("Database connected successfully....")
  app.listen(PORT, ()=>{
    console.log("Server is started on port " + PORT);
});
})
.catch((err)=> console.error("Error in connecting database", err));

