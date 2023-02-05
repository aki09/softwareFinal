const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const InitiateMongoServer = require("./config/db");
const user = require("./routes/user");
const admin=require("./routes/admin")
const session=require('express-session')
const errorController = require('./controllers/error');
const dotenv = require('dotenv');
dotenv.config();
InitiateMongoServer();
const app = express();
const PORT = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
const firebase = require('./firebase').initialize()

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));

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
app.use(admin);
app.use(errorController.get404);

app.listen(PORT, (req, res) => {
    console.log(`Server Started at PORT ${PORT}`);
});
  