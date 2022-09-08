const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    sender:{
        type:String,
        required:true,
    },
    receiver:{
        type:String,
        required:true,
    },
    channelName:{
        type:String,
        required:true,
    },
    channelCreator:{
        type:String,
        required:true
    },
    isRead:{
        type:Boolean,
        required:true,
        default:false
    },
},{timestamps:true})

const notificationModel = mongoose.model('notifications',notificationSchema);
module.exports = notificationModel;