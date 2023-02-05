const express = require('express');
const router = express.Router();
const isAuth  = require("../middleware/auth2");

const userController = require("../controllers/user");

router.get('/login', userController.getLogin);

router.get('/signup', userController.getSignup);

router.post('/login', userController.postLogin);

router.post('/signup', userController.postSignup);

router.post('/logout', userController.postLogout);

router.get('/home',isAuth, userController.dashboard);

router.get('/inspectionReport', isAuth,userController.inspectionReport);

router.get('/form',isAuth, userController.takeoffForm);

router.post('/form',isAuth, userController.takeoffAndLand);

router.post('/generate',isAuth, userController.generatePDF);

router.post('/grid',isAuth, userController.grid);

module.exports = router;