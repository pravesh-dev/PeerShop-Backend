const express = require("express");
const router = express.Router();
const addressModel = require("../models/address-model");

router.post("/create", async (req, res) => {
    let { name, email, contact, pincode, locality, address, state, district, landmark, alternateContact, addressType } = req.body;
    console.log(name, email, contact, pincode, locality, address, state, district, landmark, alternateContact, addressType);
  res.send("this is message");
});
module.exports = router;
