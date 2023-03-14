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
    const token = req.query.cookieValue;
    if (!token) {
        return res.status(401).send("Authentication token missing");
    }
    try {
        const data = jlol.verify(token, process.env.usersecret);
        uid=data.id;
        let user = await User.findOne({_id:uid});
        companyn=user.company;
        var userReports = await firebase.getPDF(companyn)
        var numberOfFiles = userReports.length;
        res.status(200).send({ report:userReports,reportcount:numberOfFiles });
    }catch (error) {
        res.status(401).send("Invalid authentication token");
    }
}

exports.generatePDF = async (req, res, next) => {
    var template = fs.readFileSync(path.join(__dirname, '../utils/inspection.docx'));
    const token = req.body.cookieValue;
    if (!token) {
        return res.status(401).send("Authentication token missing");
    }
    const data = jlol.verify(token, process.env.usersecret);
    uid=data.id;
    let user = await User.findOne({_id:uid});
    res.send({message:"success"})
    // var reportUser =user.userName;
    // var returnedData = await firebase.getImg(reportUser)
    // var imgLinks = returnedData[0]
    // var imageFiles = returnedData[1]
    // var pdfData = [];
    // console.log(reportUser)
    // for (var key in imgLinks) {
    //     var errorsByDrone = [];
    //     var imgs = [];
    //     await Drone.find({ userId: uid }).then(async (drones) => {
    //         for (var i in drones) {
    //             await ERRORS.find({ userId: uid, droneId: drones[i]._id, folder: key }).then((errors) => {
    //                 console.log(errors)
    //                 errorsByDrone.push({
    //                     'droneId': drones[i]._id.toString(),
    //                     'count': errors.length
    //                 })
    //             })
    //         }
    //         for (var j in imgLinks[key]) {
    //             url = imgLinks[key][j].url;
    //             response = await axios.get(url, { responseType: 'arraybuffer' });
    //             buff = Buffer.from(response.data, "utf-8");
    //             myimg = { width: 6, height: 6, data: buff, extension: '.jpg' };
    //             imgs.push(myimg);
    //         }
    //         pdfData.push(
    //             {
    //                 'companyName': (user.company).toUpperCase(),
    //                 'date': Date(),
    //                 'subject': 'Thermal Inspection',
    //                 'errors': errorsByDrone,
    //                 'images': imgs
    //             }
    //         )
    //     })
    // }

    // for (pdf in pdfData) {
    //     const buffer = await createReport({
    //         template,
    //         data: pdfData[pdf],
    //         cmdDelimiter: ['{', '}'],
    //     });
    //     var filename = 'report.docx';
    //     fs.writeFileSync(path.join(__dirname, `../utils/${filename}`), buffer)
    //     await firebase.uploadPDF(path.join(__dirname, `../utils/${filename}`), user.company)
    // }
    // await firebase.moveImages(imageFiles, reportUser)
}