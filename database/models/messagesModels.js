const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    postid:{
        type:String,
        required:true,
    },
    sender:{
        type:String,
        required:true,
    },
    message:{
        type:String,
        required:true,
    },
    time:{
        type:Number,
        required:true,
        default:Date.now()
    },
},{timestamps:true})

const messageModel = mongoose.model('messages',messageSchema);
module.exports = messageModel;