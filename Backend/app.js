const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const user = require("./routes/user");
const admin = require("./routes/admin");
const https=require("https")
const fs = require("fs");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));

const allowedOrigins = ["http://localhost:8000", "*"];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.use(
  session({
    secret: process.env.SECRET_KEY,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);
app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});
app.use(cookieParser());
app.use(user);
app.use("/adm", admin);
app.set("view engine", "ejs");

// MongoDb Server
const MONGOURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@flynovate-website.bqwpz.mongodb.net/database?retryWrites=true&w=majority`;
mongoose.set("strictQuery", false);

const server = require("http").createServer(app);
const io = require("socket.io")(server);

// // Socket and Connection

const httpserver=https
  .createServer(
    {
      cert: fs.readFileSync("certificate.crt"),
      key: fs.readFileSync("private.key"),
    },
    app
  )
  .listen(4000, () => {
    console.log("Https server is runing at port 4000");
  });
const httpsio = require("socket.io")(httpserver);

mongoose.connect(
  MONGOURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) throw err;

    console.log("Connected to MongoDB");

    io.on("connection", (socket) => {
      socket.handshake.headers.origin = "*";
      socket.emit("connected", { message: "Connected to server" });

      // Listen for socket disconnections
      socket.on("disconnect", () => {});
    });
    io.on("error", (err) => {
      console.log("socket.io error:", err);
    });
    const droneCollection = mongoose.connection.collection("drones");
    const ChangeStream = droneCollection.watch();

    const errorCollection = mongoose.connection.collection("errorlists");
    const newStream = errorCollection.watch();

    ChangeStream.on("change", (change) => {
      const update = change.updateDescription.updatedFields;
      const id = change.documentKey._id;
      const droneId = String(id);
      if (update.takeOffStatus != undefined) {
        io.emit("takeoff", { takeoff: update.takeOffStatus, id: droneId });
      }

      if (update.battery != undefined) {
        io.emit("battery", { battery: update.battery, id: droneId });
      }

      // if (update.videoStreamStatus != undefined) {
      //   io.emit("videoStreamStatus", { videoStreamStatus: update.videoStreamStatus, id: droneId })
      // }
      if (update["location.lat"] != undefined) {
        const lat = update["location.lat"];
        io.emit("locationlat", { location: lat, id: droneId });
      }

      if (update["location.lon"] != undefined) {
        const lon = update["location.lon"];
        io.emit("locationlon", { location: lon, id: droneId });
      }

      if (update.location != undefined) {
        io.emit("location", { location: update.location, id: droneId });
      }

      if (update.error != undefined) {
        io.emit("error", { error: update.error, id: droneId });
      }
    });
    newStream.on("change", (change) => {
      io.emit("errorlist", { error: change.fullDocument });
    });

    // Start the server
    server.listen(3000, () => {
      console.log("Server listening on port 3000");
    });
  }
);
