require("dotenv").config();

const express = require("express");
const createError = require("http-errors");
const ApiResponse = require("./models/api-response");
const indexRouter = require("./routes/index");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.send(
    new ApiResponse.Builder()
      .setMessage(err.message)
      .setStatus(err.status)
      .build()
      .toJSON()
  );
});

module.exports = app;
