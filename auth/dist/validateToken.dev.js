"use strict";

var jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  var authHeader = req.headers["authorization"];
  console.log(authHeader);
  var token;

  if (authHeader) {
    token = authHeader.split(" ")[1];
  } else {
    token = null;
  }

  if (token == null) return res.sendStatus(401);
  console.log("Token found");
  jwt.verify(token, process.env.SECRET, function (err, user) {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};