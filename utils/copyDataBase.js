const fs = require("fs");
const Game = require("../models/game");
const config = require('../config/copyDbConfig.json');
const { findWinner } = require("./rockPaperScissors");
const mongoose = require("mongoose");
const { addGametoPlayer } = require("./dbHelper")
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// get data from Reaktor's api, cursor points to the page we want to get data from
const getData = (cursor = "/rps/history") => {
  const data = fetch(`https://bad-api-assignment.reaktor.com${cursor}`)
    .then(data => data.json())
    .then(data => data)
    .catch(err => console.log(err.message))
  return data;
}

// copies most recent data from Reaktor's to keep the server up to date after a restart
const getAllData = async () => {
  // starting page
  let cursor = "/rps/history";
  let counter = 0;
  //the starting page of the previous run to tell the function when to stop
  const previousStartPage = config.previousStart;

  while (cursor) {
    // used to track where the function left off at in case the program ran out of memory or crashed for some reason
    config.previousLast = cursor;
    // gets the data from the page
    const gameData = await getData(cursor);
    // update cursor for the next fetch
    cursor = gameData.cursor;
    // attempt to push each game to MongoDB db
    gameData.data.forEach(game => {
      // create a new game based on the data
      const dbGame = new Game({
        _id: new mongoose.Types.ObjectId(),
        gameId: game.gameId,
        time: game.t,
        playerA: game.playerA,
        playerB: game.playerB,
        winner: findWinner(game.playerA, game.playerB)
      });

      // save the game
      dbGame.save()
        .then(() => {
          // create references to the game for the player
          addGametoPlayer(game.playerA.name, game._id);
          addGametoPlayer(game.playerB.name, game._id);
        })
        .catch(err => {
          console.log(err.message)
          if (!err.message.includes("duplicate key error")) {
            console.log(err.message);
          }
        });

    });

    // sets the starting cursor of this run. it is 11, because the historical data on Reaktors side gets updated evenly across the first 10-11 pages
    if (counter === 11) {
      config.previousStart = gameData.cursor;
      fs.writeFileSync("./config/copyDbConfig.json", JSON.stringify(config, null, 4), (err) => console.log(err))
    }
    //if we hit the starting page of the last run, break to avoid wasting resources
    if (gameData.cursor === previousStartPage) {
      break;
    }

    // set the next cursor of the last page visited. used while trying to copy their entire historical data to MongoDB
    config.previousNext = cursor;
    fs.writeFileSync("./config/copyDbConfig.json", JSON.stringify(config, null, 4), (err) => console.log(err));
    counter++
  }
  console.log("db successfully updated")
}

module.exports = {
  getAllData
}