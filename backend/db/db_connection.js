const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose
    .connect("mongodb+srv://huraira:Usama10091@cluster0.hnawam1.mongodb.net/")
    .then(() => console.log("database connecteed successfully"))
    .catch(() => console.log("database connection Error"));
};

module.exports = connectDB;
