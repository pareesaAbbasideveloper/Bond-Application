const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
  },
  profession: {
    type: String,
  },
  socialMedia: {
    fb: String,
    insta: String,
    linkedIn: String,
  },
  profilePic: {
    type: String,
    default: null,
  },
  level: {
    type: Number,
    default: 0,
  },
  unburnedLog: {
    type: Number,
    default: 0,
  },
  burnedLog: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
