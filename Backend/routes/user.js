const express = require('express');
const router = express.Router();

const userController = require("../controllers/userauth");
const userinspection=require("../controllers/userinspection");
const userdashboard=require("../controllers/userdash");


router.post('/login', userController.postLogin);

router.post('/signup', userController.postSignup);
router.post('/generate', userinspection.generatePDF);

router.get('/inspectionReport',userinspection.inspectionReport);

router.get('/form', userdashboard.takeoffForm);

router.post('/form', userdashboard.takeoffAndLand);

router.get('/home', userdashboard.dashboard);

router.get('/settakeoff', userdashboard.settakeoff);

router.post('/set', userdashboard.set);

router.post('/verifyotp',userController.verifyotp);

router.post('/resendotp',userController.resendotp);

router.post('/sendotp',userController.sendotp);

module.exports = router;