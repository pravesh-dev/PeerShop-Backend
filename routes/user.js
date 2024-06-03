const express = require("express");
const router = express.Router();
const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

router.post("/userCreate", async (req, res) => {
  const { name, email, contact, password, confirmPassword } = req.body;

  //  checking if user already registered with current email
  let findEmail = await userModel.findOne({ email });

  // if email exists the user can not register
  if (findEmail) {
    return res
      .status(409)
      .json({ success: false, message: "Email is not valid" });
  } else {
    try {
      // Generate salt and hash for the password
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      // create the user in mongodb
      const createdUser = await userModel.create({
        name,
        email,
        contact,
        password: hash,
      });

      // Generate JWT token for secure authentication
      const token = jwt.sign({ email }, config.get("SECRET"), {
        expiresIn: "15d",
      });

      // Set token in cookie in browser
      res.cookie("token", token, {
        httpOnly: true,
        // secure: true, // Uncomment when using HTTPS
        sameSite: "lax",
      });

      //  Sending response status and data to frontend
      res.status(201).json({
        success: true,
        user: {
          name: createdUser.name,
          email: createdUser.email,
          contact: createdUser.contact,
        },
      });
    } catch (err) {
      // Catching the error
      res.status(500).json({
        success: false,
        message: "Server Error",
        error: err.message,
      });
    }
  }
});
router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    // secure: true, // Uncomment when using HTTPS
    sameSite: "lax",
    expires: new Date(0), // set the cookie to expire immediately
  });

  //  Sending response status and data to frontend
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const findEmail = await userModel.findOne({ email });
  if (findEmail) {
    try{
      // Comparing the saved has with the password submitted by user
      bcrypt.compare(password, findEmail.password, (err, result) => {
        if (result) {
          // Generate JWT token for secure authentication
          const token = jwt.sign({ email }, config.get("SECRET"), {
            expiresIn: "15d",
          });
  
          // Set token in cookie in browser
          res.cookie("token", token, {
            httpOnly: true,
            // secure: true, // Uncomment when using HTTPS
            sameSite: "lax",
          });
  
          //  Sending response status and data to frontend
          res.status(200).json({
            success: true,
            user: {
              name: findEmail.name,
              email: findEmail.email,
              contact: findEmail.contact,
            },
          });
        } else {
          res.status(401).json({
            success: false,
            message: "Something wrong with email or password"
          })
        }
      });
    }catch(err){
      // Catching the error
      res.status(500).json({
        success: false,
        message: "Server Error",
        error: err.message,
      });
    }
  }else{
    res.status(404).json({
      status: false, 
      message: "user is not registered",
    })
  }
});
module.exports = router;
