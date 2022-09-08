const express = require("express")
const router = express.Router()
const postsModel = require("../database/models/postsModel")
const messagesModels = require("../database/models/messagesModels")

router.get("/post/:id", (req, res) => {
    if (req.session.isLoggedin) {
        console.log("Post url hits")
        console.log(req.params.id)

        postsModel.find({ channelId: req.params.id }).then(data => {
            res.json({ data: data })
        })
    }
    else {
        res.redirect("/")
    }
})


router.post("/create", (req, res) => {
    if (req.session.isLoggedin) {
        let data = req.body
        console.log(data)
        postsModel.create({ postCreator: req.session.user.username, channelId: data.channelId, title: data.title }).then(err => {
            console.log(err)
            res.sendStatus(200)
        })
    }
    else {
        res.redirect("/")
    }
})


// Load All Previous Messages In Chat
router.get("/load/:postid", (req, res) => {
    if (req.session.isLoggedin) {
        messagesModels.find({ postid: req.params.postid }).then(allmessage => {
            res.json({ messages: allmessage })
        })
    }
    else {
        res.redirect("/")
    }
})

module.exports = router