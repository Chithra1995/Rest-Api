const express = require("express");
const router = express.Router();
const User = require("../model/usermodel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  res.status(200).json({
    Msg: "login get method",
  });
});

// router.post("/", (req, res) => {
//   console.log(req.body.name);
//   res.status(200).json({
//     Name: req.body.name,
//     Age: req.body.age,
//   });
// });
router.post("/", async (req, res) => {
  const login_user = await User.findOne({
    $or: [{ email: req.body.email }, { phone: req.body.email }],
  });
  if (login_user) {
    bcrypt.compare(req.body.password, login_user.password, (err, result) => {
      if (!result) {
        return res.status(500).json({
          Message: "Incorrect Password",
        });
      } else {
        const token = jwt.sign(
          {
            _id: login_user._id,
            username: login_user.username,
            email: login_user.email,
            phone: login_user.phone,
          },
          "This is dummy text",
          { expiresIn: "24h" }
        );
        res.status(200).json({
          token: token,
        });
      }
    });
    // console.log(login_user);
  } else {
    console.log("Invalid Username/password");
    res.status(500).json({
      Message: "Invalid User",
    });
  }
});
router.post("/signup", async (req, res) => {
  console.log(req.body.password);
  const exist_user = await User.findOne({
    $or: [{ email: req.body.email }, { phone: req.body.phone }],
  });
  if (exist_user) {
    console.log("This User is Already Exist");
    return res.status(500).json({
      Message: "This User is Already Exist",
    });
  } else {
    console.log("New User");
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      } else {
        const newuser = new User({
          _id: new mongoose.Types.ObjectId(),
          username: req.body.username,
          email: req.body.email,
          phone: req.body.phone,
          password: hash,
        });

        newuser
          .save()
          .then((result) => {
            res.status(200).json({
              newuser: result,
            });
          })
          .catch((err) => {
            res.status(500).json({
              error: err,
            });
          });
      }
    });
  }
});

module.exports = router;
