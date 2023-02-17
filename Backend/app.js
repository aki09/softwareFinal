const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const user = require("./routes/user");
const admin=require("./routes/admin")
const cors = require('cors');
const mongoose = require("mongoose");
const session=require('express-session')
const errorController = require('./controllers/error');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
const firebase = require('./firebase').initialize()

app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(cors({
  origin: 'http://localhost:8000',
  optionsSuccessStatus: 200
}));
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
//app.use(errorController.get404);
app.set('view engine', 'ejs');


// MongoDb Server
const MONGOURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@flynovate-website.bqwpz.mongodb.net/database?retryWrites=true&w=majority`;
mongoose.set("strictQuery", false);
mongoose
    .connect(MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((result) => {
      console.log("Database Connected")
    })
    .catch(err => {
        console.log('Error')
    });
const db=mongoose.connection;

// Socket and Connection
db.once('open', () => {
  app.listen(PORT, (req, res) => {
    console.log(`Server Started at PORT ${PORT}`);
  });
  const server = require('http').createServer(app)
  const io = require('socket.io')(server, { cors: { origin: '*' } })

  io.on('connection', (socket) => {
    console.log('a user connected');
  });
  const collection = db.collection('drones');
  const changeStream = collection.watch();

  const errorCollection = db.collection('errorlists');
  const newStream = errorCollection.watch();

  // changeStream.on('change', (change) => {
  //   const update = change.updateDescription.updatedFields;
  //   const id = change.documentKey._id;
  //   const droneId = String(id);
  //   if (update.takeOffStatus != undefined) {
  //     io.emit("takeoff", { takeoff: update.takeOffStatus, id: droneId })
  //   }

  //   if (update.battery != undefined) {
  //     io.emit("battery", { battery: update.battery, id: droneId })
  //     console.log("battery ran")
  //   }

  //   if (update.location != undefined) {
  //     io.emit("location", { location: update.location, id: droneId })
  //   }

  //   if (update.error != undefined) {
  //   io.emit("error", { error: update.error, id: droneId })
  //   }
  // })

  // newStream.on('change', (change) => {
  // console.log("HERE IS THE DATA")
  // io.emit("errorlist", { error: change.fullDocument})
  // console.log(change.fullDocument)
  // })
})