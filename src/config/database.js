const mongoose = require("mongoose");

const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://namanpaliwal95:devtinder@namastenode.rj5c7.mongodb.net/devTinder");
};


module.exports  = connectDB; 