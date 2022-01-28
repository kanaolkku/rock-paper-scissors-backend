const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  gameId: {
    type: String,
    required: true,
    unique: true
  },
  playerA: {
    name: String,
    played: String,
  },
  playerB: {
    name: String,
    played: String,
  },
  time: {
    type: Number,
  },
  winner: {
    type: String
  }
})



module.exports = mongoose.model('Game', gameSchema);