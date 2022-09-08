function handleChat(username, postId,socket) {
  const messageForm = document.getElementById("msgform")
  const messageInput = document.getElementById("msginput")
  const messagecontainer = document.getElementById("messagecontainer")


  messagecontainer.innerHTML = ""

  socket.emit("join room", postId)

  //Loading All Messages Of Specific Post
  // socket.emit("load", { postId: postId })

  messageForm.addEventListener("submit", (e) => {
    e.preventDefault()
    socket.emit("chatMessage", { username: username, postId: postId, message: messageInput.value, time: Date.now() })
    messageInput.value = ""
  })

}

function loadAllPreviousMessages(postId){
  let request = new XMLHttpRequest()
  request.open("get",`http://localhost:3000/posts/load/${postId}`)
  request.send()
  request.addEventListener("load",()=>{
    let unparsedData = JSON.parse(request.responseText)
    unparsedData.messages.forEach(message=>{
      let formattedMessage =  formatMessage(message.sender,message.message,message.time)
      outputMessage(formattedMessage)
      console.log(message)
    })
  })
}

function formatMessage(username,text,t){
  return { username,
  text,
  time:moment(t).format('DD MMM, YY h:mm a')
  }
}

function outputMessage(msg) {
  let earlyMessages = messagecontainer.innerHTML
  // let earlyMessages = ""
  messagecontainer.innerHTML = ""

  earlyMessages += `<div class="direct-chat-msg">
<div class="direct-chat-info clearfix"> 
  <span class="direct-chat-name pull-left">${msg.username}</span> 
  <span class="direct-chat-timestamp pull-right">${msg.time}</span>
</div>
<div class=""> ${msg.text} </div>
</div>`

  messagecontainer.innerHTML = earlyMessages
  messagecontainer.scrollTop = messagecontainer.scrollHeight
}