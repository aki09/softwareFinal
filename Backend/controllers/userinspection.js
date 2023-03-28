const User = require("../models/user");
const Drone = require("../models/drone");
const { createReport } = require("docx-templates");
const jlol = require("jsonwebtoken");
const aws = require("../awsfinal");
const dotenv = require("dotenv");
const path = require("path");
const axios = require("axios");
const ERRORS = require("../models/error");
const fs = require("fs");
dotenv.config();

exports.inspectionReport = async (req, res, next) => {
  const token = req.query.cookieValue;
  if (!token) {
    return res.status(401).send("Authentication token missing");
  }
  try {
    const data = jlol.verify(token, process.env.usersecret);
    uid = data.id;
    let user = await User.findOne({ _id: uid });
    companyn = user._id;
    var userReports = await aws.getPDF(companyn);
    var numberOfFiles = userReports.length;
    res.status(200).send({ report: userReports, reportcount: numberOfFiles });
  } catch (error) {
    res.status(401).send("Invalid authentication token");
  }
};

exports.generatePDF = async (req, res, next) => {
  //var template = fs.readFileSync(path.join(__dirname, '../../utils/inspection.docx'));
  const token = req.body.cookieValue;
  if (!token) {
    return res.status(401).send("Authentication token missing");
  }
  const data = jlol.verify(token, process.env.usersecret);
  uid = data.id;
  let user = await User.findOne({ _id: uid });
  var userid = user._id;
  var returnedData = await aws.getImg(userid);
  var names = returnedData.map((data) => data.name);
  var urls = returnedData.map((data) => data.url);
  var pdfData = [];
  var errorsByDrone = [];
  for (var key in names) {
    await Drone.find({ userId: uid }).then(async (drones) => {
      for (var i in drones) {
        await ERRORS.find({
          userId: userid,
          folder: key,
        }).then((errors) => {
          errorsByDrone.push({
            droneId: drones[i]._id.toString(),
            count: errors.length,
          });
        });
      }
    });
  }
  pdfData.push({
    companyName: user.company.toUpperCase(),
    date: Date(),
    subject: "Thermal Inspection",
    images: urls,
  });
  // fs.writeFileSync('output.pdf', pdf);
  res.send({ message: "success" });
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
  //

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
};
