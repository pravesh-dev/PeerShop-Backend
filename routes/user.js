const express = require("express");
const router = express.Router();
const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

// User registration route
router.post("/userCreate", async (req, res) => {
  const { name, email, contact, password } = req.body;

  try {
    // Check if email is already registered
    const findEmail = await userModel.findOne({ email });
    if (findEmail) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // Generate salt and hash for the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create the user in MongoDB
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

    // Send response with user data and token
    res.status(201).json({
      success: true,
      user: {
        name: createdUser.name,
        email: createdUser.email,
        contact: createdUser.contact,
        token,
      },
    });
  } catch (err) {
    // Catch and handle errors
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
});

// User login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const findEmail = await userModel.findOne({ email });
    if (!findEmail) {
      return res.status(404).json({
        success: false,
        message: "User is not registered",
      });
    }

    // Compare the saved hash with the password submitted by the user
    const isMatch = await bcrypt.compare(password, findEmail.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token for secure authentication
    const token = jwt.sign({ email }, config.get("SECRET"), {
      expiresIn: "15d",
    });

    // Send response with user data and token
    res.status(200).json({
      success: true,
      user: {
        name: findEmail.name,
        email: findEmail.email,
        contact: findEmail.contact,
        gender: findEmail.gender,
        token,
      },
    });
  } catch (err) {
    // Catch and handle errors
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
});

// User update route
router.post("/update", async (req, res) => {
  const { name, oldEmail, newEmail, contact, gender } = req.body;
  try {
    const findOldEmail = await userModel.findOne({ email: oldEmail });
    if (!findOldEmail) {
      return res.status(404).json({
        success: false,
        message: "User is not registered",
      });
    }

    const findNewEmail = await userModel.findOne({ email: newEmail });
    if (findNewEmail && oldEmail != newEmail) {
      res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    } else {
      let updateUser = await userModel.findOneAndUpdate(
        { email: oldEmail },
        { email: newEmail, name, contact, gender }
      );

      // Send response with user data and token
      res.status(200).json({
        success: true,
        user: {
          name: name,
          email: newEmail,
          contact: contact,
          gender: gender,
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
});

//  Delete Account

router.post("/delete", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const findEmail = await userModel.findOne({ email });
    if (!findEmail) {
      return res.status(404).json({
        success: false,
        message: "User is not registered",
      });
    }

    // Compare the saved hash with the password submitted by the user
    const isMatch = await bcrypt.compare(password, findEmail.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    // deleting user
    let deleteUser = await userModel.deleteOne({email});
    res.status(200).json({
      success: true,
      message: "Successfully deleted the account",
    });
  } catch (err) {
    // Catch and handle errors
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;
