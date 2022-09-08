const express = require('express');
const app = express();
const server = require('http').createServer(app)
const io = require('socket.io')(server, { cors: { origin: "*" } })
const formatMessage = require("./utils/formatMessage")
require("dotenv").config();

// All Message in Mongo Database
const messagesModels = require("./database/models/messagesModels")
const db = require('./database')
db.init()


// messagesModels.deleteMany({}).then(err=>{
//   console.log(err)
// })

app.use("/static", express.static(__dirname + "/static"))

server.listen(`${process.env.CHAT_PORT}`, () => {
  console.log(`listening on port : ${process.env.CHAT_PORT}`);
});

app.get('/', (req, res) => {
  res.render("chat/chat.ejs")
});


io.on('connection', (socket) => {
  console.log('a user connected');
  console.log(socket.id)

  socket.on("disconnect", () => {
    console.log("User disconnected")
  })


  socket.on("chatMessage", data => {
    console.log(data);
    messagesModels.create({ postid: data.postId, sender: data.username, message: data.message, time: Number(data.time) }).then(err => {
      console.log(err)
      io.to(data.postId).emit("message", formatMessage(data.username, data.message, data.time))
    })
  })

  socket.on("join room", (roomName) => {
    console.log("Room joined",roomName)
    socket.join(roomName)

  })

  socket.on("leave room", roomName => {
    console.log("Room leaved",roomName)
    socket.leave(roomName)
  })

  //   socket.on('forceDisconnect', function(){
  //     socket.leave();
  // });

});


