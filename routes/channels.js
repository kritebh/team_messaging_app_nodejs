const express = require("express")
const router = express.Router()
const channelsModel = require("../database/models/channelsModel")
const userModel = require("../database/models/userModel")



//Get All Channels From Database
router.get("/", (req, res) => {

    if (req.session.isLoggedin) {
        channelsModel.find({ members: { $elemMatch: { $eq: req.session.user.username } } }).then(channels => {
            res.json({ channels: channels, user: req.session.user.username })
        })
    }
    else {
        res.redirect("/")
    }

})


// Create A New Channel
router.post("/createchannel", (req, res) => {
    // console.log(req.body)

    if (req.session.isLoggedin) {
        channelsModel.findOne({ creator: req.session.user.username, name: req.body.channelname }).then(channel => {
            if (channel) {
                res.sendStatus(409)
            }
            else {
                let allTags = req.body.channeltags.split(",")
                allTags = allTags.map(t => {
                    return t.trim()
                })

                channelsModel.create({ creator: req.session.user.username, name: req.body.channelname, description: req.body.channeldescription, tags: allTags, members: [req.session.user.username] }, err => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(500)
                    }
                    else {
                        res.sendStatus(200)
                    }
                })

            }
        })

    }
    else {
        res.sendStatus(403)
    }


})


// Delete A Channel
router.get("/delete/:id", (req, res) => {

    if(req.session.isLoggedin){
        channelsModel.deleteOne({ _id: req.params.id }).then(err => {
            console.log(err)
            res.sendStatus(200);
        })  
    }
    else{
        res.sendStatus(403)
    }

})

router.get("/getone/:id", (req, res) => {

    if(req.session.isLoggedin){
        let dataToSend = {
            _id: "",
            channelcreator: "",
            channelName: "",
            channelDescription: "",
            members: []
        }
    
        channelsModel.findOne({ _id: req.params.id }).then(channel => {
            dataToSend._id = channel._id
            dataToSend.channelcreator = channel.creator
            dataToSend.channelName = channel.name
            dataToSend.channelDescription = channel.description
            dataToSend.members = channel.members
            res.json({ data: dataToSend })
        })  
    }
    else{
        res.sendStatus(403)
    }

})

//Route for autocomplete
router.post("/getmember", (req, res) => {

    if(req.session.isLoggedin){
        let data = req.body.data.trim()
        // console.log(data)
        userModel.find({ username: { $regex: new RegExp('^' + data + '.*', 'i') } }).limit(1).then(members => {
            // console.log(members)
            res.json({ members: members })
        })  
    }
    else{
        res.sendStatus(403)
    }

})

router.post("/accept", (req, res) => {
    // console.log(req.body)

    if(req.session.isLoggedin){
        channelsModel.updateOne({ creator: req.body.creator, name: req.body.channelName }, { $push: { members: req.session.user.username } }).then(err => {
            console.log(err)
            res.sendStatus(200)
        })  
    }
    else{
        res.sendStatus(403)
    }
})



module.exports = router;