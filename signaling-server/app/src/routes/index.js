const express = require("express");
const ApiResponse = require("../models/api-response");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res
    .send(
      new ApiResponse.Builder().setMessage("Hello World").ok().build().toJSON()
    )
    .status(200);
});

module.exports = router;
