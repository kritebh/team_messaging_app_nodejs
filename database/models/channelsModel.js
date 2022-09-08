const mongoose = require('mongoose');

const channelsSchema = new mongoose.Schema({
    creator:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    tags:{
        type:[String],
        required:true,
    },
    members:{
        type:[String],
    }
},{timestamps:true})

const channelsModel = mongoose.model('channels',channelsSchema);
module.exports = channelsModel;