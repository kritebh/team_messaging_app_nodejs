const express = require("express")
const channelsModel = require("../database/models/channelsModel")
const router = express.Router()
const notificationModel = require("../database/models/notificationModel")





router.post("/add", (req, res) => {

    if (req.session.isLoggedin) {
        let payload = req.body.data
        // console.log(payload)

        channelsModel.findOne({ creator: payload.channelCreator, name: payload.channel }).then(data => {
            let allMembers = data.members
            console.log(allMembers)
            let found = false;
            for (let i = 0; i < allMembers.length; i++) {
                console.log(allMembers[i])
                if (allMembers[i] === payload.receiver) {
                    found = true;
                    break;
                }
            }
            console.log(found)
            if (found) {
                res.sendStatus(409)
            }
            else {
                notificationModel.findOne({ sender: req.session.user.username, receiver: payload.receiver, channelName: payload.channel, channelCreator: payload.channelCreator }).then(data => {
                    if (data) {
                        res.sendStatus(409)
                    }
                    else {
                        notificationModel.create({ sender: req.session.user.username, receiver: payload.receiver, channelName: payload.channel, channelCreator: payload.channelCreator }).then(err => {
                            console.log(err)
                            res.sendStatus(200)
                        })
                    }
                })
            }

        })

    }
    else {
        res.redirect("/")
    }


})


router.get("/allnotification", (req, res) => {

    if (req.session.isLoggedin) {

        notificationModel.find({ receiver: req.session.user.username, isRead: false }).then(data => {
            // console.log(data)
            res.json({ data: data })
        })

    }
    else {
        res.redirect("/")
    }
})


router.get("/delete/:id", (req, res) => {
    // Delete Notifications from database
    // console.log(req.params.id)

    if (req.session.isLoggedin) {
        notificationModel.deleteOne({ _id: req.params.id }).then(err => {
            console.log(err)
            res.sendStatus(200)
        })
    }
    else {
        res.redirect("/")
    }


})


module.exports = router