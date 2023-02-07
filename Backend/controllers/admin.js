const Admin = require('../models/admin');
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Drone = require('../models/drone');
const createTokens  = require("../middleware/admincreatetoken");


exports.getHome = async(req, res, next) => {
    let drones=await Drone.find();
    console.log(drones)
};

exports.postLogin = (req, res, next) => {
    const userName = req.body.username;
    const password = req.body.password;
    Admin.findOne({ userName: userName })
        .then((admin) => {
            if (!admin) {
                console.log("No admin found")
            }
            bcrypt
                .compare(password, admin.password)
                .then((doMatch) => {
                    if (doMatch) {
                        const accessToken = createTokens(admin);
                        res.cookie("access-token", accessToken, {
                            maxAge: 60 * 60 * 24 * 30 * 1000,
                            httpOnly: true,
                        });
                        console.log(accessToken)
                    }
                    res.send({admin:admin})
                })
                .catch((err) => {
                    res.redirect("/adminlogin");
                });
        })
        .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const userName = req.body.username;
    const name = req.body.name;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (password == confirmPassword) {
        Admin.findOne({ userName: userName })
            .then((userDoc) => {
                if (userDoc) {
                    console.log("Admin already exists")
                    return res.redirect("/adminlogin");
                }
                return bcrypt
                    .hash(password, 12)
                    .then((hashedPassword) => {
                        const admin = new Admin({
                            userName: userName,
                            password: hashedPassword,
                            Name: name,
                        });
                        return admin.save();
                    })
                    .then((result) => {
                        console.log("acha")
                        res.redirect("/adminlogin");
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
    }
};

exports.postLogout = (req, res, next) => {
    res.clearCookie("access-token");
    console.log(logout)
};
