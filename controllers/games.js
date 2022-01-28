const gamesRouter = require('express').Router();
const { getGames } = require("../websockets/websocketClient")
//return recently ended games
gamesRouter.get("/recent", (req, res, next) => {
  getGames().recentGames
  res.json(getGames().recentGames);
})
// return live games
gamesRouter.get("/live", (req, res, next) => {
  res.json(getGames().ongoingGames);
})

module.exports = gamesRouter;