const express = require('express');
const router = express.Router();

const userController = require("../controllers/userauth");
const userinspection=require("../controllers/userinspection");
const userdashboard=require("../controllers/userdash");


router.post('/login', userController.postLogin);

router.post('/signup', userController.postSignup);

router.post('/logout', userController.postLogout);

router.post('/generate', userinspection.generatePDF);

router.get('/inspectionReport',userinspection.inspectionReport);

router.get('/form', userdashboard.takeoffForm);

router.post('/form', userdashboard.takeoffAndLand);

router.post('/grid', userdashboard.grid);

router.get('/home', userdashboard.dashboard);

router.get('/settakeoff', userdashboard.settakeoff);

module.exports = router;