const express = require("express");
const app = express();
const loginrouter = require("./router/user");
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://Chithra:Chithu1719@chithra.ljavi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
);
const bodyparse = require("body-parser");
app.use(
  bodyparse.urlencoded({
    extended: false,
  })
);
app.use(bodyparse.json());

//mongo db connection checking
// mongoose.connection.on("error", (err) => {
//   console.log("connection failed");
// });
// mongoose.connection.on("connected", (connect) => {
//   console.log("connection Success");
// });

//checking for app is running
// app.use((req, res) => {
//   res.status(200).json({
//     message: "Gayu",
//   });*
// });

app.use("/login", loginrouter);

module.exports = app;
