const mailjet = require('node-mailjet')
//MJ_API_KEY , MJ_API_SECRET
const transporter = mailjet.connect(`${process.env.MJ_API_KEY}`, `${process.env.MJ_API_SECRET}`)

module.exports = function sendMail(email, title,html,callback) {
    
    const request = transporter
        .post("send")
        .request({
            FromEmail:`${process.env.SENDER_EMAIL}`,    
            FromName:'My Shop',    
            Subject: title,
            "Html-Part": html,
            Recipients: [{ Email: email }]
        })
    request
        .then((result) => {
            callback()
        })
        .catch((err) => {
            callback(err)
        })
}