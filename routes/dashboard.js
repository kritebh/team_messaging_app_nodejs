const express = require("express")
const router = express.Router()

const usersModel = require("../database/models/userModel")
const postModels = require("../database/models/postsModel")
const channelsModel = require("../database/models/channelsModel")


router.get("/", (req, res) => {
    if (req.session.isLoggedin) {
        res.render("dashboard/dashboard.ejs")
    }
    else {
        res.redirect("/")
    }

})

router.get("/trendingchannels", (req, res) => {

    if(req.session.isLoggedin){
        let payload = {
            channels: []
        }
        //Channels having most number of post
        postModels.aggregate([{ $group: { _id: "$channelId", count: { $sum: 1 } } }, { $sort: { count: -1 } }]).limit(5).then(data => {
            let allChannelsId = []
            let channelName = []
            data.forEach(c => {
                allChannelsId.push(c._id)
            })
            channelsModel.find().where('_id').in(allChannelsId).then(channelsList => {
                allChannelsId.forEach(cid => {
                    channelsList.forEach(cl => {
                        let idToMatch = String(cl._id)
                        // console.log(cid, idToMatch)
                        if (cid === idToMatch) {
                            channelName.push(cl.name)
                        }
                    })
                })
    
                channelsList.forEach((cl, i) => {
                    payload.channels.push({ channelName: channelName[i], postCount: data[i].count })
                })
                // console.log(payload)
                res.json(payload)
            })
        })  
    }
    else{
        res.sendStatus(403)
    }

})



router.get("/trendingtags", (req, res) => {

    if(req.session.isLoggedin){
        let payload = {
            tags: []
        }
    
        let allUsersWithCount = {}
        let allTags = []
        channelsModel.find({}, { tags: 1, _id: 0 }).then(tags => {
    
            tags.forEach(tag => {
                for (let i = 0; i < tag.tags.length; i++) {
                    allTags.push(tag.tags[i])
                }
            })
    
            allTags.forEach(t => {
    
                if (allUsersWithCount[t]) {
                    let earlyValue = allUsersWithCount[t]
                    allUsersWithCount[t] = ++earlyValue;
                }
                else {
                    allUsersWithCount[t] = 1;
                }
            })
    
            // console.log(allUsersWithCount)
            allUsersWithCount = Object.entries(allUsersWithCount).sort((a, b) => b[1] - a[1]).map(el => el[0])
    
            let loopEnd = allUsersWithCount.length <= 5 ? allUsersWithCount.length : 5
            for (let i = 0; i < loopEnd; i++) {
                payload.tags.push(allUsersWithCount[i])
            }
            res.json(payload)
        })
    }
    else{
        res.sendStatus(403)
    }



})



router.get("/trendingregions", (req, res) => {

    if(req.session.isLoggedin){
        let payload = {
            region: []
        }
    
        let allUsersWithCount = {}
        let allRegion = []
        usersModel.find({}, { region: 1, _id: 0 }).then(regions => {
    
            regions.forEach(region => {
                allRegion.push(region.region)
            })
    
            allRegion.forEach(t => {
    
                if (allUsersWithCount[t]) {
                    let earlyValue = allUsersWithCount[t]
                    allUsersWithCount[t] = ++earlyValue;
                }
                else {
                    allUsersWithCount[t] = 1;
                }
            })
    
            // console.log(allUsersWithCount)
            allUsersWithCount = Object.entries(allUsersWithCount).sort((a, b) => b[1] - a[1]).map(el => el[0])
    
            let loopEnd = allUsersWithCount.length <= 5 ? allUsersWithCount.length : 5
            for (let i = 0; i < loopEnd; i++) {
                payload.region.push(allUsersWithCount[i])
            }
            res.json(payload)
        })  
    }
    else{
        res.redirect("/")
    }


})




router.get("/trendingusers", (req, res) => {

    if(req.session.isLoggedin){
        let payload = {
            users: []
        }
    
        let allUsersWithCount = {}
        let allUsers = []
        postModels.find({}, { postCreator: 1, _id: 0 }).then(creator => {
    
            creator.forEach(c => {
                allUsers.push(c.postCreator)
            })
    
            allUsers.forEach(t => {
    
                if (allUsersWithCount[t]) {
                    let earlyValue = allUsersWithCount[t]
                    allUsersWithCount[t] = ++earlyValue;
                }
                else {
                    allUsersWithCount[t] = 1;
                }
            })
    
            console.log(allUsersWithCount)
            allUsersWithCount = Object.entries(allUsersWithCount).sort((a, b) => b[1] - a[1]).map(el => el[0])
    
            let loopEnd = allUsersWithCount.length <= 5 ? allUsersWithCount.length : 5
            for (let i = 0; i < loopEnd; i++) {
                payload.users.push(allUsersWithCount[i])
            }
            res.json(payload)
        })  
    }
    else{
        res.redirect("/")
    }

})

module.exports = router