const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const InitiateMongoServer = require("./config/db");
const user = require("./routes/user");
const admin=require("./routes/admin")
const cors = require('cors');
const session=require('express-session')
const errorController = require('./controllers/error');
const dotenv = require('dotenv');
dotenv.config();
InitiateMongoServer();
const app = express();
const PORT = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
const firebase = require('./firebase').initialize()
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(cors());
app.use(session({
    secret:process.env.SECRET_KEY,
    cookie:{maxAge:60000},
    resave:false,
    saveUninitialized:false
  }))
  app.get("/", (req, res) => {
    res.json({ message: "Welcome" });
  });
app.use(cookieParser());
app.use(user);
app.use('/admin',admin);
app.use(errorController.get404);

app.listen(PORT, (req, res) => {
    console.log(`Server Started at PORT ${PORT}`);
});
  