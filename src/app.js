const express = require("express");
require("dotenv").config();
const connectDB = require("./config/database");
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
const connectionRouter = require('./routes/connection');
const cookieParser = require('cookie-parser');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 3000;
// middleware to parse JSON data
app.use(express.json());
// middleware to parse cookies
app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:5173",
  credentials: true
}));

// defining the routes
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/request', requestRouter);
app.use('/user', userRouter);
app.use('/connection', connectionRouter);

connectDB()
  .then(() => {
    console.log("Database connected successfully....");
    app.listen(PORT, () => {
      console.log("Server is started on port " + PORT);
    });
  })
  .catch((err) => console.error("Error in connecting database", err));  
