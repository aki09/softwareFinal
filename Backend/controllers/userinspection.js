const User = require("../models/user");
const Drone = require('../models/drone');
const { createReport } = require('docx-templates');
const jlol = require("jsonwebtoken");
const firebase = require('../firebase')
const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');
const ERRORS = require('../models/error');
const fs = require('fs');
dotenv.config();

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