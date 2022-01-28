const playerRouter = require("express").Router();
const Player = require("../models/player");

// return players based on the name param
playerRouter.get("/:name", (req, res) => {
  const name = req.params.name;
  Player.find({ name: name })
    .populate("games")
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err.message));
});

module.exports = playerRouter;
