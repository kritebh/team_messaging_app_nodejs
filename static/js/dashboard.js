/* Frontend Code For Dashboard */


let trendingChannelsContainer = document.getElementById("trendingchannel")
let trendingTagsContainer = document.getElementById("trendingtags")
let trendingRegionsContainer = document.getElementById("trendingregions")
let trendingUsersContainer = document.getElementById("trendingusers")


function onLoad(){
    loadTrendingChannels();
    loadTrendingTags();
    loadTrendingRegions();
    loadTrendingUsers();
}

onLoad()

function loadTrendingChannels(){

    let request = new XMLHttpRequest()
    request.open("get","http://localhost:3000/dashboard/trendingchannels")
    request.send()
    request.addEventListener("load",()=>{
        let unparsedData = JSON.parse(request.responseText)
        let allTrendingChannels = unparsedData.channels
        console.log(allTrendingChannels)
        trendingChannelsContainer.innerHTML = ""
        allTrendingChannels.forEach(ch=>{
            trendingChannelsContainer.innerHTML+=`<li class="list-group-item text-capitalize"># ${ch.channelName}  (Post- ${ch.postCount})</li>`
        })

    })

}


function loadTrendingTags(){
    let request = new XMLHttpRequest()
    request.open("get","http://localhost:3000/dashboard/trendingtags")
    request.send()
    request.addEventListener("load",()=>{
        let unparsedData = JSON.parse(request.responseText)
        let allTrendingTags = unparsedData.tags
        trendingTagsContainer.innerHTML = ""
        allTrendingTags.forEach(t=>{
            trendingTagsContainer.innerHTML+=`<li class="list-group-item ">${t}</li>`
        })

    })
}

function loadTrendingRegions(){
    let request = new XMLHttpRequest()
    request.open("get","http://localhost:3000/dashboard/trendingregions")
    request.send()
    request.addEventListener("load",()=>{
        let unparsedData = JSON.parse(request.responseText)
        let allTrendingRegions = unparsedData.region
        trendingRegionsContainer.innerHTML = ""
        allTrendingRegions.forEach(t=>{
            trendingRegionsContainer.innerHTML+=`<li class="list-group-item ">${t}</li>`
        })

    })
}

function loadTrendingUsers(){
    let request = new XMLHttpRequest()
    request.open("get","http://localhost:3000/dashboard/trendingusers")
    request.send()
    request.addEventListener("load",()=>{
        let unparsedData = JSON.parse(request.responseText)
        let allTrendingUsers = unparsedData.users
        trendingUsersContainer.innerHTML = ""
        allTrendingUsers.forEach(t=>{
            trendingUsersContainer.innerHTML+=`<li class="list-group-item">${t}</li>`
        })

    })
}