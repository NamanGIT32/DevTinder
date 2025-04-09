const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength:3,
      maxLength:15,
    },
    middleName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 10,
    },
    gender: {
      type: String,
      validate: {
        validator: function (value) {
          return ["male", "female", "other"].includes(value);
        },
        message: "Gender should be male/female/other",
      },
    },
    skills: {
      type: [String],
    },
    about: {
      type: String,
    },
    imageURL: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    status:{
      type: String,
      enum: ["online", "offline"],
      default:"offline"
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
