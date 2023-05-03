const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const sharedEmailRoutes = require("./routes/sharedEmail");
const sharedUserRoutes = require("./routes/sharedUser");

const addRequestId = require("express-request-id")();
const path = require("path");
const app = express();
require("dotenv").config();

app.use(bodyParser.json());
app.use(addRequestId);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, recapture_token, Recapture-Token"
  );
  next();
});
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.static(path.join(__dirname, "images")));
app.use(express.static(path.join(__dirname, "images/accommodation")));
app.use(express.static(path.join(__dirname, "files/invoices")));
app.use(express.static(path.join(__dirname, "files")));

app.use("/user-room", sharedUserRoutes);
app.use("/email-room", sharedEmailRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});
mongoose
  .connect(
    "mongodb://localhost:27017/debitors?readPreference=primary&appname=MongoDB%20Compass&ssl=false",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      ignoreUndefined: true,
      useFindAndModify: false,
    }
  )
  .then((_) => {
    console.log("starting server at 8080");
    app.listen(8080);
  })
  .catch((err) => console.log(err));
