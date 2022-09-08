const moment = require("moment")
function formatMessage(username,text,t){
    return { username,
    text,
    time:moment(t).format('DD MMM, YY h:mm a')
    }
}

module.exports = formatMessage