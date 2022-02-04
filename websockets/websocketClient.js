const { addGametoPlayer } = require("../utils/dbHelper");
const Game = require("../models/game");
const { findObjectIndexFromArray } = require("../utils/arrayService");
const { findWinner } = require("../utils/rockPaperScissors");
const WebSocketClient = require("websocket").client;
const mongoose = require("mongoose");
const client = new WebSocketClient();

// connect to Reaktor's api
client.connect("ws://bad-api-assignment.reaktor.com/rps/live");

// define arrays for live games and recent games
let ongoingGames = [];
let recentGames = [];

// when connected to api
client.on("connect", (connection) => {
  console.log("connected to api");

  connection.on("message", (message) => {
    // parse the message and create an object from its data
    const msg = JSON.parse(JSON.parse(message.utf8Data));
    //add properties ended and winner
    const liveObj = {
      ...msg,
      ended: false,
      winner: "",
    };

    //if the type is GAME_BEGIN add it to the live game array
    if (msg.type === "GAME_BEGIN") {
      //remove type, no need for it anymore
      delete liveObj.type;
      ongoingGames.push(liveObj);
    } else {
      //find index of the game in the ongoingGames array (sometimes the game is already live before the server was up)
      const indexOfGame = findObjectIndexFromArray(
        ongoingGames,
        "gameId",
        msg.gameId
      );
      if (indexOfGame !== -1) {
        // game has ended and the game was in our array

        // remove game from ongoing games after 5 seconds
        setTimeout(() => {
          const gameToRemoveIndex = findObjectIndexFromArray(
            ongoingGames,
            "gameId",
            msg.gameId
          );
          ongoingGames.splice(gameToRemoveIndex, 1);
        }, 5000);

        // pop the oldest game in the array
        if (recentGames.length >= 10) {
          recentGames.pop();
        }

        // find game and add it to the recent games array
        const foundGame = ongoingGames[indexOfGame];
        foundGame.ended = true;
        foundGame.winner = findWinner(msg.playerA, msg.playerB);
        recentGames.unshift(foundGame);
      }
      // create new game document
      const game = new Game({
        _id: new mongoose.Types.ObjectId(),
        gameId: msg.gameId,
        time: msg.t,
        ended: true,
        playerA: msg.playerA,
        playerB: msg.playerB,
        winner: findWinner(msg.playerA, msg.playerB),
      });

      // save new game and add game references to the players
      game
        .save()
        .then(() => {
          addGametoPlayer(game.playerA.name, game._id);
          addGametoPlayer(game.playerB.name, game._id);
        })
        .catch((err) => console.log(err));
    }
  });

  // on disconnect try to reconnect
  connection.on("close", () => {
    console.log("disconnected, attempting to reconnect");
    setTimeout(() => {
      client.connect("ws://bad-api-assignment.reaktor.com/rps/live");
    }, 2000);
  });

  connection.on("error", () => {
    console.log("error, attempting to reconnect");
    setTimeout(() => {
      client.connect("ws://bad-api-assignment.reaktor.com/rps/live");
    }, 2000);
  });
});

// gets ongoign and live games for other modules to use
const getGames = () => {
  return {
    ongoingGames,
    recentGames,
  };
};

module.exports = {
  getGames,
};
