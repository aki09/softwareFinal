const Admin = require('../models/admin');
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Drone = require('../models/drone');
const createTokens  = require("../middleware/admincreatetoken");
const jlol = require("jsonwebtoken");


exports.getHome = async(req, res, next) => {
    const token = req.query.cookieValue;
    const data = jlol.verify(token, "jwtsecretpls");
    uid=data.id;
    let admin = await Admin.findOne({_id:uid});
    let drones=await Drone.find();
    let users=await User.find();
    res.status(200).send({ admin:admin,drones:drones,users:users, message:"success" });
};

exports.removeuser=async(req, res, next) => {
    const drone_id=req.query.droneid;
    Drone.findById(drone_id).then((drone) => {
        drone.userId = null;
        drone.save().then((result) => {
        });
    })
    res.status(200).send({ message: "Deallocated Successful" });
}


exports.adduser=async(req, res, next) => {
    const token = req.query.cookieValue;
    const drone_id=req.query.droneid;
    const data = jlol.verify(token, "jwtsecretpls");
    uid=data.id;
    let admin = await Admin.findOne({_id:uid});
    let drone=await Drone.findById(drone_id);
    let users=await User.find();
    res.status(200).send({ drone:drone,users:users, message:"success" });
}

exports.allotdrone=async(req, res, next) => {
    const userid=req.query.userid;
    const drone_id=req.query.droneid;
    Drone.findById(drone_id).then((drone) => {
        drone.userId = userid;
        drone.save().then((result) => {
        });
    })
    res.status(200).send({ message:"success" });
}


exports.postLogin = (req, res, next) => {
    const userName = req.body.username;
    const password = req.body.password;
    Admin.findOne({ userName: userName })
        .then((admin) => {
            // if (!admin) {
            //     console.log("No admin found")
            // }
            bcrypt
                .compare(password, admin.password)
                .then((doMatch) => {
                    if (doMatch) {
                        const accessToken = createTokens(admin);
                        res.cookie("access-token", accessToken, {
                            maxAge: 60 * 60 * 24 * 30 * 1000,
                            httpOnly: true,
                        });
                        res.status(200).send({ admin: admin,access:accessToken, message: "admin logged in successfully" });
                    }
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
