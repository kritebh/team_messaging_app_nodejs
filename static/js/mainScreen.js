/* MainScreen Frontend Code*/

// Code For Creating  Channel 

const createChannelBtn = document.getElementById("addChannel")
const messageNode = document.getElementById("message");
const LeftPanelDiv = document.getElementById("leftpanel")


// Create Channel (Create Operation)
createChannelBtn.addEventListener("click", (e) => {
    const channelName = document.getElementById("channelname")
    const channelDescription = document.getElementById("channeldescription")
    const channelTags = document.getElementById("channeltags")
    if (channelName.value === "") {
        messageNode.innerHTML = "Channel Name can't be empty"
    }
    else if (channelDescription.value === "") {
        messageNode.innerHTML = "Channel Description can't be empty"
    }
    else {

        let payload =
        {
            "channelname": channelName.value,
            "channeldescription": channelDescription.value,
            "channeltags": channelTags.value
        }

        // console.log(payload)

        let request = new XMLHttpRequest();
        request.open("post", "http://localhost:3000/channels/createchannel", true);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.send(JSON.stringify(payload))
        request.addEventListener("load", () => {
            // console.log(request.responseText)
            // console.log(request.status)
            if (request.status === 200) {

                channelName.value = "";
                channelDescription.value = "";
                channelTags.value = "";

                messageNode.removeAttribute("class");
                messageNode.setAttribute("class", "text-success text-center")
                messageNode.innerHTML = "Channel Created Successfully"
                getChannel();
            }
            else if (request.status === 409) {
                messageNode.innerHTML = "This channel is already created"
            }

        })
    }

})

document.getElementById("modalclose").addEventListener("click", () => {
    messageNode.innerHTML = ""
    messageNode.removeAttribute("class");
    messageNode.setAttribute("class", "text-danger text-center")
})

// Get All Channel List And Append To The Left Panel (Read Operation)
function getChannel() {

    let request = new XMLHttpRequest();
    request.open("get", "http://localhost:3000/channels")
    request.send();

    request.addEventListener("load", () => {
        let allChannelHtml = "";
        let channels = JSON.parse(request.responseText)
        let allChannels = channels.channels
        allChannels.forEach(c => {
            allChannelHtml += addNewChannelToLeftPanel(c, channels.user);
        })

        LeftPanelDiv.innerHTML = allChannelHtml;
        addEventListenerToDeleteButton()
        addingEventListenerOnAllChannel();
    })

}

getChannel();

function addNewChannelToLeftPanel(channel, user) {
    let singleHTML = `<div class="d-flex justify-content-between mt-3 channel" id="r${channel._id}">
    <span class="pe-5 channelname w-100" id="${channel._id}">#${channel.name}</span>
    ${checkIfUserIsCreator(channel, user)}
</div>`
    return singleHTML
}

function checkIfUserIsCreator(channel, user) {
    if (channel.creator === user) {
        return `<i class="bi bi-trash3-fill text-danger delete" style="font-size:20px;" id="d${channel._id}"></i>`
    }
    else {
        return "";
    }
}



// Delete Channel  (delete operation)
function addEventListenerToDeleteButton() {
    let allDeleteNodes = document.querySelectorAll(".delete")
    allDeleteNodes.forEach(node => {
        node.addEventListener("click", (e) => {
            //Checking Again If User Wants To Delete The Channel
            e.stopPropagation()
            CustomConfirm({
                title: "Think again!",
                body: "Are You Sure To Delete?",
                btn_yes: "I'm Sure!",
                btn_no: 'NO'
            }, (confirmed) => {
                if (confirmed) {

                    let idOfChannelToDelete = (e.target.id).substr(1)
                    let request = new XMLHttpRequest()
                    request.open("get", `http://localhost:3000/channels/delete/${idOfChannelToDelete}`)
                    request.send()
                    request.addEventListener("load", () => {
                        if (request.status === 200) {
                            let toDeleteChannel = document.getElementById(`r${idOfChannelToDelete}`)
                            LeftPanelDiv.removeChild(toDeleteChannel)
                        }
                    })
                }
            })
        })
    })

}



/************* Opening A Single Channel On Right**********/

function addingEventListenerOnAllChannel() {
    let allChannelNodes = document.querySelectorAll(".channel")
    allChannelNodes.forEach(channel => {
        channel.addEventListener("click", (e) => {
            e.stopPropagation()
            let channelId = (e.target.id)

            let request = new XMLHttpRequest();
            request.open("get", `http://localhost:3000/channels/getone/${channelId}`)
            request.send()
            request.addEventListener("load", () => {
                if (request.status === 200) {

                    let dataUnparsed = JSON.parse(request.responseText)
                    let data = dataUnparsed.data

                    // Closing the previous chat session
                    // socket.close()

                    addDetailsOfChannelInCenterDiv(data)
                    addPostToCenterColumn(data);

                    addEventListenerToMemberButton()

                    autocomplete(data)
                    addDataToRightColumn(data)

                }
            })

        })
    })
}

function addDetailsOfChannelInCenterDiv(data) {
    let html = `<div class="text-center d-flex justify-content-between">
    <span class="fs-4">#${data.channelName}</span>
    <i class="bi bi-person-plus-fill" id="addmember" style="font-size:24px;"></i>
</div>
<div>
    ${data.channelDescription}
</div>`

    document.getElementById("channeldetails").innerHTML = html;
}


function addEventListenerToMemberButton() {


    let addMemberIcon = document.getElementById("addmember")

    addMemberIcon.addEventListener("click", (e) => {
        let centreDiv = document.getElementById("center")
        let currentClass = centreDiv.getAttribute("class")
        let currentGridSize = currentClass.split(" ")[0].at(-1)
        if (currentGridSize == 6) {
            centreDiv.removeAttribute("class");
            centreDiv.setAttribute("class", "col-md-9")
        }
        else if (currentGridSize == 9) {
            centreDiv.removeAttribute("class");
            centreDiv.setAttribute("class", "col-md-6 black-border")
        }
    })

}

function addDataToRightColumn(data) {
    let allMembers = data.members
    let allMembersHtml = ""

    for (let i = 0; i < allMembers.length; i++) {
        let singleHtml = `<div class="card p-2 mt-2 bg-body rounded">
        <div class="d-flex justify-content-between align-items-center">
            <div class="user d-flex flex-row align-items-center">
                <span>
                    <small class="font-weight-bold">@${allMembers[i]}</small>
                </span>
            </div>
        </div>
    </div>`
        allMembersHtml += singleHtml;
    }

    let rightDiv = document.getElementById("right")
    rightDiv.innerHTML = allMembersHtml;
    // console.log(rightDiv)
}




let searchBox = document.getElementById("searchmember")
let searchDiv = document.querySelector("#searchresult")

function autocomplete(data) {

    searchBox.addEventListener("keyup", (e) => {
        let request = new XMLHttpRequest()
        request.open("post", "http://localhost:3000/channels/getmember", true)
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.send(JSON.stringify({ data: e.target.value }))
        searchDiv.innerHTML = ""
        request.addEventListener("load", () => {
            let dataUnparsed = JSON.parse(request.responseText)
            let member = dataUnparsed.members

            searchDiv.innerHTML = `<button class="form-control member" id="${member[0].username}">@${member[0].username} </button>`

            addEventListenerToAutoSuggestion(data)
        })
    })

}


function addEventListenerToAutoSuggestion(data) {
    let allMemberNode = document.querySelectorAll(".member")
    allMemberNode.forEach(m => {
        m.addEventListener("click", (e) => {

            let payload = {
                receiver: e.target.id,
                channel: data.channelName,
                channelCreator: data.channelcreator
            }

            let request = new XMLHttpRequest()
            request.open("post", "http://localhost:3000/notify/add", true)
            request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            request.send(JSON.stringify({ data: payload }))

            request.addEventListener("load", () => {
                searchBox.value = ""
                if (request.status === 200) {
                    searchDiv.innerHTML = ""
                    searchBox.value = ""
                    swal(
                        {
                            text: `@${payload.receiver} has been invited to #${payload.channel}`,
                            icon: "success"
                        }
                    )
                }
                else {
                    swal(
                        {
                            text: `User Already Added`,
                            icon: "warning"
                        }
                    )
                }
            })

        })
    })
}

let notificationBellNode = document.getElementById("notificationbell")
let notificationCountNode = document.getElementById("notificationnumber")
let notificationModalBody = document.getElementById("notificationmodalbody")

notificationBellNode.addEventListener("click", showAllNotificationsOfUser)

function showAllNotificationsOfUser() {

    let request = new XMLHttpRequest()
    request.open("get", "http://localhost:3000/notify/allnotification")
    request.send()
    request.addEventListener("load", () => {
        if (request.status === 200) {
            let dataUnparsed = JSON.parse(request.responseText)
            let parsedData = dataUnparsed.data
            notificationCountNode.innerText = parsedData.length

            let allNotificationsHtml = ""

            parsedData.forEach(n => {
                allNotificationsHtml += addNotificationToModal(n)
            })


            //Fetching Notification for particular user and showing it into modal
            notificationModalBody.innerHTML = allNotificationsHtml

            // Adding EventListener To All Accept and Decline Button in Notification Modal
            addEventListenerToAllAcceptButton()
            addEventListenerToAllDeclineButton()
        }
    })


}

showAllNotificationsOfUser()

function addNotificationToModal(notification) {
    let html = `<div class="singlenotificationdiv mt-2" id="${notification._id}">
    <div class="text-center">
        <p>${notification.sender} Invited You To #${notification.channelName}</p>
    </div>
    <div class="row">
        <div class="col-md-5">
            <button class="btn btn-success btn-sm accept w-100" id="${notification.channelCreator}_${notification.channelName}">Accept</button>
        </div>
        <div class="col-md-2"></div>
        <div class="col-md-5">
            <button class="btn btn-danger btn-sm decline w-100" id="d${notification._id}">Decline</button>
        </div>
    </div>
    <hr>
</div>
`
    return html
}

function addEventListenerToAllAcceptButton() {
    let allAcceptButton = document.querySelectorAll(".accept")

    allAcceptButton.forEach(a => {
        a.addEventListener("click", (event) => {

            let dataSplit = (event.target.id).split("_")
            let payload = {
                creator: dataSplit[0],
                channelName: dataSplit[1],
            }

            let request = new XMLHttpRequest()
            request.open("post", "http://localhost:3000/channels/accept", true)
            request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            request.send(JSON.stringify(payload))
            request.addEventListener("load", () => {
                if (request.status === 200) {

                    // Removing Notification From Server and UI
                    let id = a.parentNode.parentNode.parentNode.id
                    deleteNotification(id);
                    getChannel(); // refreshing The channel Node
                }
            })

        })
    })
}


function addEventListenerToAllDeclineButton() {
    let allDeclineButton = document.querySelectorAll(".decline")

    allDeclineButton.forEach(d => {
        d.addEventListener("click", (event) => {
            // console.log("Decline",event.target.id)
            let id = (event.target.id).substr(1);
            deleteNotification(id)

        })
    })
}

function deleteNotification(id) {
    let request = new XMLHttpRequest()
    request.open("get", `http://localhost:3000/notify/delete/${id}`)
    request.send()
    request.addEventListener("load", () => {
        if (request.status === 200) {
            //Delete Notification From UI
            let toRemoveNode = document.getElementById(id)
            notificationModalBody.removeChild(toRemoveNode)
        }
    })
}

/**************************** Code For Posts ************************/

function addPostToCenterColumn(data) {

    // Unblocking the Search Post And Finding The Relevant Posts 

    let searchPostContainer =  document.getElementById("searchpostcontainer")
    searchPostContainer.classList.replace("d-none","d-block")

    let searchPostInput = document.getElementById("searchposts")

    searchPostInput.addEventListener("keyup",(event)=>{
        let typedText = event.target.value;
        let filteredText = typedText.toUpperCase()

        let allPosts = document.querySelectorAll(".post")

        allPosts.forEach(p=>{
            let postContent = p.innerText.trim().toUpperCase()

            if(postContent.includes(filteredText)){
                p.style.display = ""
            }
            else{
                p.style.display = "none"
            }
            
        })

    })


    // Creating And Handling Add Post Button
    let addPostButtonDiv = document.getElementById("addpostbutton")
    addPostButtonDiv.innerHTML = ""

    searchPostInput.style.display = ""

    let addPostButton = document.createElement("button");
    addPostButton.innerHTML = "Add Post"
    addPostButton.setAttribute("class", 'btn btn-outline-primary postbtn mb-3')
    addPostButton.setAttribute("data-bs-toggle", 'modal')
    addPostButton.setAttribute("data-bs-target", '#addpostmodal')
    addPostButtonDiv.appendChild(addPostButton)

    // Create New Post 
    let addPostModalButton = document.getElementById("addPost");
    let postTitleNode = document.getElementById("posttitle");
    let postMessageNode = document.getElementById("postmessage");
    addPostModalButton.onclick = function () {
        let payload = {
            channelId: data._id,
            title: postTitleNode.value
        }

        let request = new XMLHttpRequest()
        request.open("post", "http://localhost:3000/posts/create", true)
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.send(JSON.stringify(payload))
        request.addEventListener("load", () => {
            if (request.status === 200) {
                postTitleNode.value = ""
                postMessageNode.innerHTML = "Post Created Successfully"
                getAllPost(data._id)

            }
            else {
                postTitleNode.value = ""
            }
        })

        document.getElementById("postclose").addEventListener("click", () => {
            postMessageNode.innerHTML = ""
        })

    }

    // Fetch All Post From Specific Channel
    getAllPost(data._id)
}

function search(event){
    console.log(event.target.value)
}


function getAllPost(id) {
    let singlePostContainer = document.getElementById("singlepostcontainer")
    singlePostContainer.innerHTML = ""
    let allPostsHtml = ""
    let request = new XMLHttpRequest()
    request.open("get", `http://localhost:3000/posts/post/${id}`)
    request.send()
    request.addEventListener("load", () => {
        let dataUnparsed = JSON.parse(request.responseText)
        let allPostsInArray = dataUnparsed.data
        if (request.status === 200) {
            allPostsInArray.forEach(post => {
                allPostsHtml += addEachPostInCentreDiv(post)
            })
        }
        singlePostContainer.innerHTML = allPostsHtml

        addEventListenerToAllPostInSpecificChannel()

    })

}



function addEachPostInCentreDiv(post) {
    let html = `<div class="card shadow-sm p-3 mb-3 bg-body rounded post" id="${post._id}">
    <div class="d-flex justify-content-between align-items-center">
        <div class="user d-flex flex-row align-items-center">
            <span>
                <small class="font-weight-bold">${post.title}</small>
            </span>
        </div>
        <div>
            <small>by ${post.postCreator}</small>
            <small>on ${getDateInString(post.updatedAt)}</small>
        </div>    
    </div>
    </div>`

    return html
}


function getDateInString(date) {
    let convertedDate = moment(date).format("D MMM, YYYY")
    return convertedDate
}

function addEventListenerToAllPostInSpecificChannel() {
    let currentAllPosts = document.querySelectorAll(".post")
    currentAllPosts.forEach(p => {
        p.addEventListener("click", (e) => {
            let singlePostContainer = document.getElementById("singlepostcontainer")
            let addPostButtonDiv = document.getElementById("addpostbutton")
            let searchPosts = document.getElementById("searchposts")
            searchPosts.style.display = "none"

            addPostButtonDiv.innerHTML = p.innerText

            singlePostContainer.innerHTML = `
            <div class="row d-flex justify-content-center">
            <div class="col-md-12">
                <div class="box box-warning">
                    <div class="box-body">
                        <div class="direct-chat-messages" id="messagecontainer">
                        
                        </div>
                    </div>
                    <div class="box-footer">
                    <form action="#" method="post" id="msgform">
                    <div class="input-group">
                        <input type="text" name="message" id="msginput" placeholder="Type Message ..." class="form-control">
                        <span class="input-group-btn">
                            <button type="submit" class="btn btn-warning btn-flat">Send</button>
                        </span>
                    </div>
                </form>
                    </div>
                </div>
            </div>
        </div>`

            if (sessionStorage.getItem("room")) {
                socket.emit("leave room", sessionStorage.getItem("room"))
            }

            sessionStorage.setItem("room", p.id)

            let username = document.getElementById("username").innerText
            loadAllPreviousMessages(p.id)
            handleChat(username, p.id, socket)
        })
    })
}

//Initializing Socket.io

let socket = io("http://localhost:5000")

socket.on("message", msg => {
    console.log(msg);
    outputMessage(msg)
})

