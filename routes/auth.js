const express = require("express")
const router = express.Router()

const userModel = require("../database/models/userModel");
const sendMail = require("../utils/sendMail");
const token = require("../utils/encryptDecrypt");
const encrypt = token.encrypt
const decrypt = token.decrypt
const sha256 = token.sha256

//Login Endpoint
router.get('/login', (req, res) => {
    if (req.session.isLoggedin) {
        res.redirect("/");
    }
    else {
        res.render("auth/login.ejs", { message: {} });
    }
})


//Login Endpoint
router.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    userModel.findOne({ username: username, password: sha256(password) }).then((user) => {
        if (user === null) {
            messageData={
                message:"Username/Password is not correct",
                class:"text-danger",
            }
            res.render("auth/login.ejs", { message: messageData });
        }
        else if (!user.isVerified) {
            messageData={
                message:"Please Verify Your Email Before Login",
                class:"text-danger",
            }
            res.render("auth/login.ejs", { message: messageData });
        }
        else {
            req.session.isLoggedin = true;
            req.session.user = user;
            res.redirect("/");
        }
    })
})


// Signup Endpoint
router.route("/signup")
    .get((req, res) => {
        if (req.session.isLoggedin) {
            res.redirect("/");
        }
        else {
            messageData={
                message:"",
                class:"",
            }
            res.render("auth/signup.ejs", { message:messageData});
        }
    })
    .post((req, res) => {
        const username = req.body.username
        const email = req.body.email
        const region = req.body.region
        const password = req.body.password

        userModel.create({ username: username, email: email, region: region, password: sha256(password), isVerified: false }, (err) => {
            if (err) {
                // console.log("entering here")
                messageData={
                    message:"Email already exist 😐😐",
                    class:"text-danger",
                }
                res.render("auth/signup.ejs", { message: messageData });
            }
            else {
                let currentTimeInEncrypted = sha256(Date.now().toString());
                let encryptedEmail = encrypt(username);
                let url = currentTimeInEncrypted + encryptedEmail;
                let html = `<p>Click the Link to verify Your Account</p>` + `<a href="http://${process.env.HOST}:${process.env.PORT}/verify/${url}"> Click Here</a>`

                sendMail(email, "Verify Account For Chat", html, (err) => {   //sending email for verification upon signup
                    if (err) {
                        messageData={
                            message:"Unable to send Email 😫😫",
                            class:"text-danger",
                        }
                        res.render("auth/signup.ejs", { message: messageData });
                    }
                    else {
                        messageData={
                            message:"Verification Email has been sent successfully Please check your Email 👍",
                            class:"text-success",
                        }
                        res.render("auth/signup.ejs", { message: messageData });
                    }
                })
            }
        })
    })
// Verify Endpoint Upon Signup 
router.get("/verify/:id", (req, res) => {
    let encryptedEmail = req.params.id.slice(64)
    let decryptedEmail = decrypt(encryptedEmail);
    // console.log(decryptedEmail)
    userModel.find({ username: decryptedEmail }).then(user => {
        // console.log(user)
        if (user.length === 0) {
            messageData={
                message:"Email signature mismatched 🤐🤐",
                class:"text-danger",
            }
            res.render("auth/verify.ejs", { message: messageData });
        }
        else {
            userModel.updateOne({ username: decryptedEmail }, { isVerified: true }, (err, data) => {
                if (err) {
                    messageData={
                        message:"Email signature mismatched 🤐🤐, Please Contact Us",
                        class:"text-danger",
                    }
                    res.render("auth/verify.ejs", { message: messageData });
                }
                else {
                    messageData={
                        message:"You have successfully verified your Email 🤗🤗",
                        class:"text-success",
                    }
                    res.render("auth/verify.ejs", { message: messageData });
                }
            });
        }
    })

})



//Change Password Endpoint
router.get("/changepassword", (req, res) => {
    if (req.session.isLoggedin) {
        res.render("auth/changePassword.ejs", { message: {} })
    }
    else {
        res.redirect("/");
    }
})

router.post("/changepassword", (req, res) => {

    if (req.session.isLoggedin) {
        let user = req.session.user;
        let newPassword1 = req.body.password1
        let newPassword2 = req.body.password2

        if (newPassword1 !== newPassword2) {

            messageData={
                message:"Both Password doesn't match 🙃🙃",
                class:"text-danger"
            }

            res.render("auth/changePassword.ejs", { message: messageData })
        }
        else {
            userModel.updateOne({ username: user.username }, { password: sha256(newPassword1) }, (err, data) => {
                if (err) {
                    console.log(err)
                }
                else {
                    messageData={
                        message:"Password Updated Successfully 🎊🎉",
                        class:"text-success"
                    }
        
                    res.render("auth/changePassword.ejs", { message: messageData })
                }
            })
        }
    }
    else {
        res.redirect("/")
    }
})


//Forgot Password Form Render Endpoint 
router.get("/forgot", (req, res) => {
    if (req.session.isLoggedin) {
        res.redirect("/changepassword");
    }
    else {
        res.render("auth/forgotPasswordSendMail.ejs", { message: {} })
    }
})

// Endpoint to handle sending Email for reset password
router.post("/forgot", (req, res) => {
    let email = req.body.email
    userModel.findOne({ email: email }).then(user => {
        if (user === null) {
            messageData={
                message:"Email is not registered ☹☹",
                class:"text-danger"
            }

            res.render("auth/forgotPasswordSendMail.ejs", { message: messageData })
        }
        else {
            let currentTimeInEncrypted = encrypt(Date.now().toString());
            let encryptedEmail = encrypt(email);
            let url = currentTimeInEncrypted + encryptedEmail;
            let html = `<p>Click Below to reset your password</p>` + `<a href="http://${process.env.HOST}:${process.env.PORT}/forgotpassword/${url}"> Reset Password</a>`
            sendMail(email, "Reset Password - Chat App", html, (err) => {
                if (err) {
                    console.log(err)
                }
                else {
                    messageData={
                        message:"Email Sent Successfully 👍👍",
                        class:"text-success"
                    }
        
                    res.render("auth/forgotPasswordSendMail.ejs", { message: messageData })
                }
            })
        }
    })
})


//Endpoint to handle reset password link in Email
router.get("/forgotpassword/:id", (req, res) => {
    let encryptedTime = req.params.id.slice(0, 13)
    let decryptedTimeInNumber = Number(decrypt(encryptedTime))
    let encryptedEmail = req.params.id.slice(13)
    let decryptedEmail = decrypt(encryptedEmail);
    if (decryptedTimeInNumber + 43200000 > Date.now()) {
        userModel.findOne({ email: decryptedEmail }).then(user => {
            res.render("auth/resetPassword.ejs", { message: "", username: user.username });
        })
    }
    else {
        messageData={
            message:"Verification Link has been Expired, Please Request Again",
            class:"text-danger"
        }

        res.render("auth/forgotPasswordSendMail.ejs", { message: messageData })
    }
})

//Endpoint to handle reset password Form
router.post("/resetpassword", (req, res) => {
    let username = req.body.username
    let password1 = req.body.password1
    let password2 = req.body.password2

    if (password1 !== password2) {
        messageData={
            message:"Both Password Should Match, Try Again",
            class:"text-danger"
        }

        res.render("auth/resetPassword.ejs", { message: messageData ,username:username})
    }
    else {
        userModel.updateOne({ username: username }, { password: sha256(password1) }, (err) => {
            if (err) {
                console.log(err);
                messageData={
                    message:"Some Error Occurred Contact Us",
                    class:"text-danger"
                }
        
                res.render("auth/resetPassword.ejs", { message: messageData })
            }
            else {
                messageData={
                    message:"Password Reset Successfully Done",
                    class:"text-success"
                }
        
                res.render("auth/login.ejs", { message: messageData })
            }
        })
    }
})


//Check If User is login
router.get("/checklogin", (req, res) => {
    if (req.session.isLoggedin) {
        res.sendStatus(200);
    }
    else {
        res.sendStatus(403);
    }
})




//Logout Endpoint
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
})

module.exports = router;