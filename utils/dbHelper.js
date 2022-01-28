const Player = require("../models/player");

//checks if a player exists, if it doesnt, creates a new player. then it pushes the game reference to the player's games array
const addGametoPlayer = (name, gameId) => {
  Player.findOneAndUpdate({ name: name }, { $push: { games: gameId } }, { new: true, upsert: true })
    .then(docs => console.log("game added"))
    .catch(err => console.log(err))
}

module.exports = {
  addGametoPlayer
}