const express = require("express");
const router = express.Router();
const addressModel = require("../models/address-model");
const userModel = require('../models/user-model');

router.post("/create", async (req, res) => {
    let { name, email, contact, pincode, locality, address, state, district, landmark, alternateContact, addressType } = req.body;
    let findUser = await userModel.findOne({email});
    if (!findUser) {
        return res.status(404).json({
          success: false,
          message: "User is not registered",
        });
      }
      else{
          const createdAddress = await addressModel.create({
              name, contact, pincode, locality, address, state, district, landmark, alternateContact, addressType, user: findUser._id
            })
            findUser.address.push(createdAddress._id);
            await findUser.save();
        }
  res.send("this is message");
});
module.exports = router;
