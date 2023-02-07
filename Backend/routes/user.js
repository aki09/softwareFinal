const express = require('express');
const router = express.Router();
const isAuth  = require("../middleware/userverify");

const userController = require("../controllers/userauth");
const userinspection=require("../controllers/userinspection");
const userdashboard=require("../controllers/userdash");

router.get('/login', userController.getLogin);

router.get('/signup', userController.getSignup);

router.post('/login', userController.postLogin);

router.post('/signup', userController.postSignup);

router.post('/logout', userController.postLogout);

router.post('/generate',isAuth, userinspection.generatePDF);

router.get('/inspectionReport', isAuth,userinspection.inspectionReport);

router.get('/form',isAuth, userdashboard.takeoffForm);

router.post('/form',isAuth, userdashboard.takeoffAndLand);

router.post('/grid',isAuth, userdashboard.grid);

router.get('/home',isAuth, userdashboard.dashboard);

module.exports = router;