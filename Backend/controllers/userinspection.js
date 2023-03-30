const User = require("../models/user");
const Drone = require("../models/drone");
const { createReport } = require("docx-templates");
const jlol = require("jsonwebtoken");
const aws = require("../awsfinal");
const dotenv = require("dotenv");
const path = require("path");
const axios = require("axios");
const ERRORS = require("../models/error");
const puppeteer = require("puppeteer");
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
  const templatePath = path.join(__dirname, "../utils/inspection.docx");
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
  var imgs = [];
  let htmlString = '<html><head><title>PDF REOPRT</title></head><body><h1>PDF Report</h1><div id="company-name"></div><div id="subject"></div>';
  for (var j in urls) {
    response = await axios.get(urls[j], { responseType: 'arraybuffer' });
    myimg = { width: 4, height: 4, data: response.data, extension: '.jpg' };
    imgs.push(myimg);
    const dataUri = `data:image/jpeg;base64,${response.data.toString('base64')}`;
    htmlString += `<img src="${dataUri}" alt="Image ${j}" width="150px" height ="150px" /><br>`;
  }
  htmlString += '</body></html>';

  pdfData = {
    companyName: user.company.toUpperCase(),
    date: Date(),
    subject: "Thermal Inspection",
    images: imgs,
  };
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // const filePath = path.join(__dirname, "../template.html");
  // await page.goto(filePath);
  await page.setContent(htmlString);
  await page.emulateMediaType("screen");
  await page.evaluate(async(pdfData) => {
    const companyNameEl = document.querySelector("#company-name");
    companyNameEl.textContent = pdfData.companyName;
    const subjectEl = document.querySelector("#subject");
    subjectEl.textContent = pdfData.subject;
  }, pdfData);
  const pdfBuffer = await page.pdf({ format: "A4" });
  if (!pdfBuffer) {
    console.error("Error generating PDF");
  }
  await aws.uploadPDF(pdfBuffer,uid)
  var userReports = await aws.getPDF(uid);
  var numberOfFiles = userReports.length;
  await browser.close();
  res.status(200).send({ report: userReports, reportcount: numberOfFiles });
};
