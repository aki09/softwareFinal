const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const User = require("../models/user");
const Drone = require('../models/drone');
const createTokens  = require("../middleware/auth");
const { createReport } = require('docx-templates');
const jlol = require("jsonwebtoken");
const firebase = require('../firebase')
const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');
const ERRORS = require('../models/error');
const fs = require('fs');
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
    const token = req.cookies["access-token"];
    const data = jlol.verify(token, "jwtsecretplschange");
    uid=data.id;
    let user = await User.findOne({_id:uid});
    let drones=await Drone.find({ userId: uid })
    console.log(drones)
}

exports.takeoffForm = (req, res, next) => {
    const drone_id = req.query.drone_id;
    var action = req.query.action;
    if (action === 'land') {
        Drone.findById(drone_id).then((drone) => {
            drone.takeOffStatus = false;
            drone.save().then((result) => {
            });
        })
        res.redirect('/');
    } else if (action === 'takeoff') {
        console.log(drone_id)
    }
}

exports.inspectionReport = async (req, res, next) => {
    const token = req.cookies["access-token"];
    const data = jlol.verify(token, "jwtsecretplschange");
    uid=data.id;
    let user = await User.findOne({_id:uid});
    companyn=user.companyname;
    var userReports = await firebase.getPDF(companyn)
    var numberOfFiles = userReports.length;
    console.log("inspection")
}

exports.takeoffAndLand = (req, res, next) => {
    var id = req.body.drone_id;
    var lon_1 = req.body.lon_1;
    var lat_1 = req.body.lat_1;
    var lon_2 = req.body.lon_2;
    var lat_2 = req.body.lat_2;
    var lon_3 = req.body.lon_3;
    var lat_3 = req.body.lat_3;
    var lon_4 = req.body.lon_4;
    var lat_4 = req.body.lat_4;
    var lat_ch=req.body.lat_ch;
    var lon_ch=req.body.lon_ch;
    var gridCoords = [];
    gridCoords.push(
        { lat: lat_1, lng: lon_1 },
        { lat: lat_2, lng: lon_2 },
        { lat: lat_3, lng: lon_3 },
        { lat: lat_4, lng: lon_4 }
    );
    let latimin=gridCoords[0].lat
    let longimin=gridCoords[0].lng
    for(let i=1;i<4;i++)
    {
        latimin=Math.min(latimin,gridCoords[i].lat)
        longimin=Math.min(longimin,gridCoords[i].lng)
    }
    let latimax=gridCoords[0].lat
    let longimax=gridCoords[0].lng
    for(let i=1;i<4;i++)
    {
        latimax=Math.max(latimax,gridCoords[i].lat)
        longimax=Math.max(longimax,gridCoords[i].lng)
    }
    if(lat_ch==undefined)
    {
        lat_ch=0.00005;
    }
    if(lon_ch==undefined)
    {
        lon_ch=0.0001;
    }
    Drone.findById(id).then((drone) => {
        console.log(drone.takeOffStatus);
        drone.area = [];
        drone.area.push(
            { lat: lat_1, lon: lon_1 },
            { lat: lat_2, lon: lon_2 },
            { lat: lat_3, lon: lon_3 },
            { lat: lat_4, lon: lon_4 },
            { lat: lat_ch, lon: lon_ch}
        );
        drone.takeOffStatus = true;
        drone.save().then((result) => {
        });
    })
    res.redirect('/');
}

exports.grid = async (req, res, next) => {
    var id = req.body.drone_id;
    var lon_1 = req.body.lon_1;
    var lat_1 = req.body.lat_1;
    var lon_2 = req.body.lon_2;
    var lat_2 = req.body.lat_2;
    var lon_3 = req.body.lon_3;
    var lat_3 = req.body.lat_3;
    var lon_4 = req.body.lon_4;
    var lat_4 = req.body.lat_4;
    var lat_ch=req.body.lat_ch;
    var lon_ch=req.body.lon_ch;
    var gridCoords = [];
    gridCoords.push(
        { lat: lat_1, lng: lon_1 },
        { lat: lat_2, lng: lon_2 },
        { lat: lat_3, lng: lon_3 },
        { lat: lat_4, lng: lon_4 }
    );
    let latimin=gridCoords[0].lat
    let longimin=gridCoords[0].lng
    for(let i=1;i<4;i++)
    {
        latimin=Math.min(latimin,gridCoords[i].lat)
        longimin=Math.min(longimin,gridCoords[i].lng)
    }
    let latimax=gridCoords[0].lat
    let longimax=gridCoords[0].lng
    for(let i=1;i<4;i++)
    {
        latimax=Math.max(latimax,gridCoords[i].lat)
        longimax=Math.max(longimax,gridCoords[i].lng)
    }
    if(lat_ch==undefined)
    {
        lat_ch=0.00005;
    }
    if(lon_ch==undefined)
    {
        lon_ch=0.0001;
    }
    res.render('customer/grid',{drone_id: id,gridCoords:gridCoords,latimax:latimax,longimax:longimax,lat_ch:lat_ch,lon_ch:lon_ch})
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
                    res.redirect("/home");
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
        User.findOne({ userName: userName })
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

exports.generatePDF = async (req, res, next) => {
    var template = fs.readFileSync(path.join(__dirname, '../utils/inspection.docx'));
    const token = req.cookies["access-token"];
    const data = jlol.verify(token, "jwtsecretplschange");
    uid=data.id;
    let user = await User.findOne({_id:uid});
    var reportUser =user.userName;
    var returnedData = await firebase.getImg(reportUser)
    var imgLinks = returnedData[0]
    var imageFiles = returnedData[1]
    var pdfData = [];
    console.log(reportUser)
    for (var key in imgLinks) {
        var errorsByDrone = [];
        var imgs = [];
        await Drone.find({ userId: uid }).then(async (drones) => {
            for (var i in drones) {
                await ERRORS.find({ userId: uid, droneId: drones[i]._id, folder: key }).then((errors) => {
                    console.log(errors)
                    errorsByDrone.push({
                        'droneId': drones[i]._id.toString(),
                        'count': errors.length
                    })
                })
            }
            for (var j in imgLinks[key]) {
                url = imgLinks[key][j].url;
                response = await axios.get(url, { responseType: 'arraybuffer' });
                buff = Buffer.from(response.data, "utf-8");
                myimg = { width: 6, height: 6, data: buff, extension: '.jpg' };
                imgs.push(myimg);
            }
            pdfData.push(
                {
                    'companyName': (user.company).toUpperCase(),
                    'date': Date(),
                    'subject': 'Thermal Inspection',
                    'errors': errorsByDrone,
                    'images': imgs
                }
            )
        })
    }

    for (pdf in pdfData) {
        const buffer = await createReport({
            template,
            data: pdfData[pdf],
            cmdDelimiter: ['{', '}'],
        });
        var filename = 'report.docx';
        fs.writeFileSync(path.join(__dirname, `../utils/${filename}`), buffer)
        await firebase.uploadPDF(path.join(__dirname, `../utils/${filename}`), user.company)
    }
    await firebase.moveImages(imageFiles, reportUser)
    res.redirect('/');
}