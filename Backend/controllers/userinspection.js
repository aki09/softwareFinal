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
  console.log(urls[1])
  for (var j in urls) {
    response = await axios.get(urls[j], { responseType: 'arraybuffer' });
    buff = Buffer.from(response.data, "utf-8");
    myimg = { width: 4, height: 4, data: buff, extension: '.jpg' };
    imgs.push(myimg);
  }
  pdfData = {
    companyName: user.company.toUpperCase(),
    date: Date(),
    subject: "Thermal Inspection",
    images: imgs,
  };
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const filePath = path.join(__dirname, "../template.html");
  await page.goto(filePath);
  await page.emulateMediaType("screen");
  await page.evaluate(async(pdfData) => {
    const companyNameEl = document.querySelector("#company-name");
    companyNameEl.textContent = pdfData.companyName;
    const subjectEl = document.querySelector("#subject");
    subjectEl.textContent = pdfData.subject;
    const imagesEl = document.querySelector("#images");
    for (let i = 0; i < pdfData.images.length; i++) {
      const img = pdfData.images[i];
      const imgEl = document.createElement("img");
      imgEl.src = `data:image/${img.extension};base64,${img.data.toString("base64")}`;
      imgEl.style.width = `${img.width}in`;
      imgEl.style.height = `${img.height}in`;
      imagesEl.appendChild(imgEl);
    }
  }, pdfData);
  const pdfBuffer = await page.pdf({
    path: "example.pdf",
    format: "A4",
    printBackground: true,
  });
  if (!pdfBuffer) {
    console.error("Error generating PDF");
  }
  await browser.close();
  res.send({ message: "success" });
};

// pdfData.images.forEach((url) => {
    //   const img = document.createElement("img");
    //   img.src = 'https://detection-results123.s3.ap-south-1.amazonaws.com/6156272d93d079ba45eab3af/array2/panel1.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIATLAOEO6AE3ZHGYX4%2F20230330%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20230330T024603Z&X-Amz-Expires=900&X-Amz-Signature=1869082669cf23dcee82a3ff1a3034c67881a15da52066b120106ab420b6c78b&X-Amz-SignedHeaders=host&x-id=GetObject';
    //   imagesEl.appendChild(img);
    //   console.log(`Added image: ${url}`);;
    // });
