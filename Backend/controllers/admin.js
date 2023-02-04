const Admin = require('../models/admin');
const bcrypt = require("bcrypt");
const createTokens  = require("../middleware/auth3");
const validateToken  = require("../middleware/auth4");

exports.getLogin = (req, res, next) => {
    const token = req.cookies["access-token"];
    if (token) {
        console.log("token exists")
    }
    console.log("admin login");
};

exports.getHome = (req, res, next) => {
    console.log("admin home");
};

exports.postLogin = (req, res, next) => {
    const userName = req.body.username;
    const password = req.body.password;
    Admin.findOne({ userName: userName })
        .then((admin) => {
            if (!admin) {
                return res.redirect("/adminlogin");
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
                    res.redirect("/adminlogin");
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
