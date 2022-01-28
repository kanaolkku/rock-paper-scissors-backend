const gamesRouter = require("express").Router();
const { getGames } = require("../websockets/websocketClient");
//return recently ended games
gamesRouter.get("/recent", (req, res) => {
  getGames().recentGames;
  res.json(getGames().recentGames);
});
// return live games
gamesRouter.get("/live", (req, res) => {
  res.json(getGames().ongoingGames);
});

module.exports = gamesRouter;
