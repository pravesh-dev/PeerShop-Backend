const express = require("express");
const router = express.Router();
const msgModel = require("../models/user-msg-model");

router.post("/userMessage", async (req, res) => {
    let { name, email, message } = req.body;
    const createdUserMsg = await msgModel.create({
      name,
      email,
      message
    })
  res.send("this is message");
});
module.exports = router;
