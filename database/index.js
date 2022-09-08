const mongoose = require('mongoose')
module.exports.init = function (){
    let url = process.env.MONGO_URL
    mongoose.connect(url).then(function()
  {
    console.log("db is connected")
  })
}