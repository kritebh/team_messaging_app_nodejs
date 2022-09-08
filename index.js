const express = require('express')
const app = express();
const session = require('express-session')
require("dotenv").config();
app.use("/static",express.static(__dirname+"/static"))


//Database Setup
const db = require('./database')
db.init()


// EJS Setup
app.set('view engine', 'ejs');

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on ${process.env.port} port`)
})

//Middleware
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
}))
app.use(express.json());




app.get("/",(req,res)=>{
    if(req.session.isLoggedin){
        res.render("chat/mainScreen.ejs",{username:req.session.user.username});
    }
    else{
        res.redirect("/login")
    }

})


/***************** Authentication and Authorization *************/

const auth = require("./routes/auth")
app.use(auth);


/****************** Channels Routes ****************/

const channels = require("./routes/channels")

app.use("/channels",channels)


/********************* Posts Route ******************/
const posts = require("./routes/posts")

app.use("/posts",posts)

/********************************* Notification Route ***************/
const notification = require("./routes/notifications")
app.use("/notify",notification)

/*************************  Dashboard *************************/

const dashboard = require("./routes/dashboard")

app.use("/dashboard",dashboard)