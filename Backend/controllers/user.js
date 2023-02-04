const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const User = require("../models/user");
const Drone = require('../models/drone');
const createTokens  = require("../middleware/auth");
const jlol = require("jsonwebtoken");

const dotenv = require('dotenv');

dotenv.config();

exports.getLogin = (req, res, next) => {
    const token = req.cookies["access-token"];
    if (token) {
        console.log("token exists")
    }
    console.log("user login");
};

exports.getSignup = (req, res, next) => {
    const token = req.cookies["access-token"];
    if (token) {
        console.log("token exists")
    }
    console.log("user register");
};

exports.dashboard = async(req, res, next) => {
    // const token = req.cookies["access-token"];
    // const data = jlol.verify(token, "jwtsecretplschange");
    //uid=data.id;
    uid=req.body.uid
    let user = await User.findOne({_id:uid});
    console.log(user)
    Drone.find({ userId: req.body.uid }).then((drones) => {
        const company = user.company;
        console.log(drones[0].serial)
    })
}

exports.postLogin = (req, res, next) => {
    const userName = req.body.username;
    const password = req.body.password;
    User.findOne({ userName: userName })
        .then((user) => {
            if (!user) {
                return res.redirect("/login");
            }
            bcrypt
                .compare(password, user.password)
                .then((doMatch) => {
                    if (doMatch) {
                        const accessToken = createTokens(user);
                        res.cookie("access-token", accessToken, {
                            maxAge: 60 * 60 * 24 * 30 * 1000,
                            httpOnly: true,
                        });
                        console.log(accessToken)
                    }
                    res.redirect("/login");
                })
                .catch((err) => {
                    console.log(err);
                    res.redirect("/login");
                });
        })
        .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const userName = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const company = req.body.company;
    const confirmPassword = req.body.confirmPassword;
    if (password == confirmPassword) {
        User.findOne({ userName: userName,email:email })
            .then((userDoc) => {
                if (userDoc) {
                    return res.redirect("/signup");
                }
                return bcrypt
                    .hash(password, 12)
                    .then((hashedPassword) => {
                        const user = new User({
                            userName: userName,
                            password: hashedPassword,
                            company: company,
                            email: email,
                        });
                        return user.save();
                    })
                    .then((result) => {
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: process.env.gmailuser,
                                pass: process.env.gmailpass
                            }
                        })
                    
                        const mailOptions = {
                            from: process.env.gmailuser,
                            to: email,
                            subject: `Welcome to Flynovate ${company}`,
                            html: '<h1>You successfully signed up!</h1>'
                        }
                    
                        transporter.sendMail(mailOptions)
                        console.log()
                        res.redirect("/login");
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        console.log("diff");
        return res.redirect("/signup");
    }
};

exports.postLogout = (req, res, next) => {
    res.clearCookie("access-token");
    console.log(logout)
};