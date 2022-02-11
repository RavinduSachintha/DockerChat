const mongoose = require("mongoose");

const username = process.env.MONGO_USERNAME || null;
const password = process.env.MONGO_PASSWORD || null;
const cluster = process.env.MONGO_CLUSTERNAME || null;
const dbname = process.env.MONGO_DBNAME || null;

const connString = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose.connect(connString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// When successfully connected
db.once("connected", function () {
  console.log("Database connected successfully");
});

// If the connection throws an error
db.on("error", console.error.bind(console, "Databse connection error: "));

// When the connection is disconnected
db.on("disconnected", function () {
  console.log("Database default connection disconnected");
});

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", function () {
  db.close(function () {
    console.log(
      "Database default connection disconnected through app termination"
    );
    process.exit(0);
  });
});

module.exports = mongoose;
