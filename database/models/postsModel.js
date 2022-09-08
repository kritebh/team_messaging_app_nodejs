const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema({
    postCreator:{
        type:String,
        required:true,
    },
    channelId:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
},{timestamps:true})

const postsModel = mongoose.model('posts',postsSchema);
module.exports = postsModel;