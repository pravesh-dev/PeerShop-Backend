const express = require("express");
const router = express.Router();
const addressModel = require("../models/address-model");
const userModel = require('../models/user-model');

// Creating an address
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

// Sending all address for the user
router.post('/data', async(req, res)=>{
    const {email} = req.body;
    let user = await userModel.findOne({email}).populate('address');
    res.send(user.address)
})

// Deleting the address
router.post('/delete', async(req, res)=>{
  const {addressId, userId} = req.body;
  console.log(addressId, userId)
})
module.exports = router;
