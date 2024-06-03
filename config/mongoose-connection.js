const mongoose = require("mongoose");
const config = require("config");
mongoose
.connect(`${config.get("MONGO_URI")}/PeerShop`)
.then(() => {
  console.log("connected");
})
.catch(()=>{
    console.log('error while connecting the database')
})

module.exports = mongoose.connection;