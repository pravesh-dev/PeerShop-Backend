const express = require("express");
const router = express.Router();
const addressModel = require("../models/address-model");
const userModel = require("../models/user-model");

// Creating an address
router.post("/create", async (req, res) => {
  let {
    name,
    email,
    contact,
    pincode,
    locality,
    address,
    state,
    district,
    landmark,
    alternateContact,
    addressType,
  } = req.body;
  try{
    let findUser = await userModel.findOne({ email });
  if (!findUser) {
    return res.status(404).json({
      success: false,
      message: "User is not registered",
    });
  } else {
    const createdAddress = await addressModel.create({
      name,
      contact,
      pincode,
      locality,
      address,
      state,
      district,
      landmark,
      alternateContact,
      addressType,
      user: findUser._id,
    });
    findUser.address.push(createdAddress._id);
    await findUser.save();
    res.status(200).json({
      success: true,
      message: "Successfully created the address",
    });
  }
  }catch(err){
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
});

// Sending all address for the user
router.post("/data", async (req, res) => {
  try{
    const { email } = req.body;
    let user = await userModel.findOne({ email }).populate("address");
    res.send(user.address);
  }catch(err){
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
});

// Deleting the address
router.post("/delete", async (req, res) => {
  try{

    const { addressId, userId } = req.body;
    console.log(addressId, userId);
    // deleting the address
    let findAddress = await addressModel.deleteOne({_id: addressId});
    
    // removing the id of deleted address from the user related to it
    let findUser = await userModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { address: addressId } }
    );
    
    // sending success response
    res.status(200).json({
      success: true,
      message: "Successfully deleted the address",
    });
  }catch(err){
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
});
module.exports = router;
