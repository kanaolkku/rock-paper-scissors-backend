const config = require('./config/config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const gamesRouter = require('./controllers/games')
const playersRouter = require('./controllers/players')
const { getAllData } = require("./utils/copyDataBase")

// connect to mongoose
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log("conencted to Mongo")
  })
  .catch(() => {
    console.log("error connecting to Mongo ", error.message);
  });

//update game data after restart
getAllData();
// use middlewares
app.use(express.json());
app.use(cors());
app.use("/players", playersRouter)
app.use("/games", gamesRouter)

//default page with details of the endpoints
app.get("/", (req, res, next) => {
  res.send("/games/recent for recent game data. <br/>/games/live for live game data <br/>/players/:name for player data")
})

module.exports = app;
