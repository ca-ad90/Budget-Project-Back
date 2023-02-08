const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const mDb = require("./db/db.config.js")

//Routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require("./routes/catalog")

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())
app.use((req, res, next) => {
  if (!req.hasOwnProperty("userData")) {
    req.userData = {}
  }
  if (!req.userData.hasOwnProperty("query")) {
    req.userData.query = {}
  }
  next()
})
app.use((req, res, next) => {
  console.log("req.url", req.url)
  next()
})
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/api", catalogRouter)


mongoose.connect(mDb.url, mDb.options)

const connection = mongoose.connection

connection.on("connected", console.log.bind(console, `Connected to database ${mDb.name}`)).on("error", console.error.bind(console, "MongoDB connection error"))


const PORT = process.env.PORT || 5051;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
