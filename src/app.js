const express = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require('./models/user'); 
const PORT= 3000;

app.use(express.json());
app.post('/signup', async (req, res) =>  {
  const {firstName, lastName} = req.body;
  try {
    const user = new User({
      firstName:firstName,
      lastName:lastName,
    })
    await user.save();
    res.send("User created successfully");
  } catch (error) {
    res.status
    (400).send("error while creating user", error);
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

