const User = require("../models/user");
const Drone = require("../models/drone");
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
    if (!userReports) {
      return res.status(200).send({ report: [], reportcount: 0 });
    }
    var numberOfFiles = userReports.length;
    res.status(200).send({ report: userReports, reportcount: numberOfFiles });
  } catch (error) {
    res.status(401).send("Invalid authentication token");
  }
};

exports.generatePDF = async (req, res, next) => {
  const token = req.body.cookieValue;
  if (!token) {
    return res.status(401).send("Authentication token missing");
  }
  const data = jlol.verify(token, process.env.usersecret);
  uid = data.id;
  let user = await User.findOne({ _id: uid });
  var userid = user._id;
  var returnedData = await aws.getImg(userid);
  if (!returnedData) {
    var userReports = await aws.getPDF(uid);
    if (!userReports) {
      return res.status(200).send({ report: [], reportcount: 0 });
    }
    var numberOfFiles = userReports.length;
    return res.status(200).send({ report: userReports, reportcount: numberOfFiles });
  }
  var names = returnedData.map((data) => {
    const [_, arrayno, panelno] = data.name.split('/');
    return {
      name: data.name,
      arrayno: arrayno.split('array')[1],
      panelno: panelno.split('panel')[1].split('.')[0]
    }
  });
  const getDefects = (data) => {
    const defects = {};
    data.forEach(({ name }) => {
      const [, arrayno, panelno] = name.split('/');
      if (!defects[arrayno]) {
        defects[arrayno] = {
          arrayno: `${arrayno.split('array')[1]}`,
          total: 0,
        };
      }
      defects[arrayno].total++;
    });
  
    const sortedDefects = Object.values(defects).sort((a, b) => a.arrayno - b.arrayno);
    return sortedDefects;
  };
  
  const defects = getDefects(returnedData);
  var urls = returnedData.map((data) => data.url);
  var errorsByDrone = [];
  for (var key in names) {  
    var err = await ERRORS.findOne({ folder: names[key].name,userId:userid });
    if (err) {
      errorsByDrone.push({arrayno:names[key].arrayno,panelno:names[key].panelno,noer:err.number_of_errors});
    }
  }
  pdfData = {
    companyName: user.company.toUpperCase(),
    date: Date(),
    subject: "Thermal Inspection",
  };
  var imgs = [];
  const imagePath = path.join(__dirname, '../front.png');
  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString('base64');
  const dataUri = `data:image/png;base64,${base64Image}`;

  let htmlString= `<html><head><title>PDF REPORT</title></head><body><img src="${dataUri}" alt="Image " style="display: block; width: 100%; height: 100%;object-fit: cover;" /><div style="position: absolute;top: 37%;left: 12%"><h3 id="company-name" style="color: white;text-transform: uppercase;font-family: Arial, Helvetica, sans-serif;font-size: 1.5rem;font-weight: 500;">User</h3></div></div>`
  // htmlString+=`<div style="position: relative; padding: 1em; color: #050049; font-family: Arial, Helvetica, sans-serif;"><div style="border-bottom: 3px solid #000; text-align: center;"> <h3 id="company-name" style="margin: 0.5em auto; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; font-size: 1.8rem;">${pdfData.companyName}</h3><h5 style="margin: 0 auto; text-transform: uppercase; font-weight: 500; font-size: 1.2rem; letter-spacing: 0.1em;">Thermal Inspection Report</h5><span id="date" style="display: block; margin: 0.5em auto;">Date of Inspection: ${pdfData.date.split("GMT")[0]}</span></div><div style="text-align: left;"><h1 style="text-transform: uppercase;margin:1rem 0;">Defect Overview</h1><table style="width: 100%;border-collapse: separate; border-spacing: 0px 5px;"><thead style="color: #050049; font-size: 1.3rem;border-bottom: 2px solid #050049;"><th style="padding: 5px;border-right: 2px solid #050049;">Sno.</th><th style="padding: 5px;border-right: 2px solid #050049;">Array Number</th><th style="padding: 3px;">Number of Defected Panels</th></thead><tbody style="border-bottom: 2px solid #050049;">`
  // var ctotal=0;
  // for (var i in defects) {
  //   htmlString+=`<tr style="font-size:1.5rem;"><td style="text-align: center; padding: 5px;border-right: 2px solid #050049;">${parseInt(i) + 1}</td><td style="text-align: center; padding: 5px;border-right: 2px solid #050049;">${defects[i].arrayno}</td><td style="text-align: center; padding: 3px;">${defects[i].total}</td></tr>`
  //   ctotal+=defects[i].total;
  // }
  // htmlString+=`<tr></tr></tbody><tfoot style=" color: #050049; font-size: 1.5rem;border-top: 2px solid #050049;"><td style="text-align: center; padding: 5px;border-right: 2px solid #050049;" colspan="2">Total No. of Defects:</td><td style="text-align: center; padding: 5px;">${ctotal}</td></tfoot></table></div></div>`
  htmlString += `
  <div style="position: relative; padding: 1em; color: #050049; font-family: Arial, Helvetica, sans-serif;">
    <div style="border-bottom: 3px solid #000; text-align: center;">
      <h3 id="company-name" style="margin: 0.5em auto; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; font-size: 1.8rem;">${pdfData.companyName}</h3>
      <h5 style="margin: 0 auto; text-transform: uppercase; font-weight: 500; font-size: 1.2rem; letter-spacing: 0.1em;">Thermal Inspection Report</h5>
      <span id="date" style="display: block; margin: 0.5em auto;">Date of Inspection: ${pdfData.date.split("GMT")[0]}</span>
    </div>
    <div style="text-align: left;">
      <h1 style="text-transform: uppercase;margin:1rem 0;">Defect Overview</h1>
      <hr color="#050049" size="2">
      <table style="width: 100%; border-collapse: collapse;">
        <thead style="color: #050049; font-size: 1.3rem">
          <th style="padding: 5px; border: 1px solid #050049;">Sno.</th>
          <th style="padding: 5px; border: 1px solid #050049;">Array Number</th>
          <th style="padding: 3px; border: 1px solid #050049;">Number of Defected Panels</th>
        </thead>
        <tbody>
  `;
  var ctotal = 0;
  for (var i in defects) {
    htmlString += `
      <tr style="font-size: 1.5rem;">
        <td style="text-align: center; padding: 5px; border: 1px solid #050049;">${parseInt(i) + 1}</td>
        <td style="text-align: center; padding: 5px; border: 1px solid #050049;">${defects[i].arrayno}</td>
        <td style="text-align: center; padding: 5px; border: 1px solid #050049;">${defects[i].total}</td>
      </tr>
    `;
    ctotal += defects[i].total;
  }
  htmlString += `
        </tbody>
        <tfoot style=" color: #050049; font-size: 1.5rem;">
          <td style="text-align: center; padding: 8px; border: 1px solid #050049;" colspan="2">Total No. of Defects:</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #050049;">${ctotal}</td>
        </tfoot>
      </table>
    </div>
  </div>
`;
  htmlString += `<div style="page-break-after: always;"></div>`;
  for (var j in urls) {
    response = await axios.get(urls[j], { responseType: 'arraybuffer' });
    myimg = { width: 4, height: 4, data: response.data, extension: '.jpg' };
    imgs.push(myimg);
    const dataUri = `data:image/jpeg;base64,${response.data.toString('base64')}`;
    htmlString += `<div style="position: relative; font-family: Arial, Helvetica, sans-serif; padding: 1rem 2rem; width: 30%; margin: 0 auto"><h4 style="display: block; font-size: 1.5rem; color: #050049; text-align: left">DEFECT DETAILS</h4><div style="display: flex; flex-direction: column; align-items: center ">`;
    htmlString += `<img src="${dataUri}" alt="Image ${j}" style="display:block; margin: 10px; width:700px;height:480px;margin-bottom: 1rem"/>`;
    htmlString += `<div style="padding: 2rem 3rem; border: 2px solid #050049; border-radius: 30px; width: 150px; text-align: center;">`;
    htmlString += `Array No: ${errorsByDrone[j].arrayno}<br />`;
    htmlString += `</div>`;
    htmlString += `<div style="padding: 2rem 3rem; border: 2px solid #050049; border-radius: 30px; width: 150px; margin-top: 1rem; text-align: center">`;
    htmlString += `Panel No: ${errorsByDrone[j].panelno}<br />`;
    htmlString += `</div>`;
    htmlString += `<div style="padding: 2rem 3rem; border: 2px solid #050049; border-radius: 30px; width: 150px; margin-top: 1rem; text-align: center">`;
    htmlString += `No. of Errors: ${errorsByDrone[j].noer}<br />`;
    htmlString += `</div>`;
    htmlString += `</div></div>`;
    htmlString += `<div style="display: flex; justify-content: space-between; margin-top: 9rem; color: #050049; font-size: 1.30em;">`;
    htmlString += `<div style="flex-grow: 3;margin-left:1rem">Flynovate: Driven By Future</div><div style="margin-right:1rem">page | ${parseInt(j) + 1}</div></div>`;
    htmlString += `<div style="page-break-after: always;"></div>`;
  }
  
  htmlString += '</body></html>';
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.emulateMediaType("screen")
  await page.setContent(htmlString);;
  await page.evaluate(async(pdfData) => {
    const companyNameEl = document.querySelector("#company-name");
    companyNameEl.textContent = pdfData.companyName;
  }, pdfData);
  const pdfBuffer = await page.pdf({ format: "A4",printBackground:true});
  if (!pdfBuffer) {
    console.error("Error generating PDF");
  }
  await aws.uploadPDF(pdfBuffer,uid);
  await aws.deleteiamges(uid);
  await ERRORS.deleteMany({userId:userid});
  var userReports = await aws.getPDF(uid);
  var numberOfFiles = userReports.length;
  await browser.close();
  res.status(200).send({ report: userReports, reportcount: numberOfFiles });
};
