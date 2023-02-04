const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();

const MONGOURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@flynovate-website.bqwpz.mongodb.net/database?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB !!");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;
