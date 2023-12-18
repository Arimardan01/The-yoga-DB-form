const mongoose = require("mongoose");
require("dotenv").config();
const url= 'mongodb+srv://arimardan2003:Rparihar01@cluster0.mfz5asa.mongodb.net/yoga?retryWrites=true&w=majority'


mongoose.connect(
  url,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err) => {
    if (!err) {
      console.log("MongoDB Connection Succeeded.");
    } else {
      console.log("Error in DB connection : " + err);
    }
  }
);

require("./userModel");
