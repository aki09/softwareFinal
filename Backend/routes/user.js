const express = require('express');
const router = express.Router();
const isAuth  = require("../middleware/auth2");

const userController = require("../controllers/user");

router.get('/login', userController.getLogin);

router.get('/signup', userController.getSignup);

router.post('/login', userController.postLogin);

router.post('/signup', userController.postSignup);

router.get('/home', userController.dashboard);

// router.get('/inspectionReport', userController.inspectionReport);

// router.get('/form', userController.takeoffForm);

// router.post('/form', userController.takeoffAndLand);

// router.post('/generate', userController.generatePDF);

// router.post('/grid', userController.grid);

module.exports = router;