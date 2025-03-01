const mongoose= require('mongoose');

const userSchema= new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    middleName:{
        type: String,
    },
    lastName:{
        type: String,
        required: true
    },
    emailId:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        min:10
    },
    gender:{    
        type: String,
        validate:{
            validator:function(value){
                return ["male","female","other"].includes(value)
            },
            message:"Gender should be male/female/other"
        }
    },
    skills:{
        type: [String]
    },
    imageURL:{
        type: String,
        default:"https://cdn-icons-png.flaticon.com/512/149/149071.png"
    }
},{
    timestamps:true
});

const User= mongoose.model('User', userSchema);
module.exports= User;