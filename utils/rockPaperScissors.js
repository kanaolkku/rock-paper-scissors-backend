
const rockPaperScissors = (hand1, hand2) => {
  // rock - paper
  if (hand1 === "ROCK" && hand2 === "PAPER" || hand2 === "ROCK" && hand1 === "PAPER") {
    //find PAPER winner and return 0 or 1 depending on the hand
    if (hand1 === "PAPER") {
      return 0
    } else {
      return 1
    }
  } else if (hand1 === "ROCK" && hand2 === "SCISSORS" || hand2 === "ROCK" && hand1 === "SCISSORS") {
    //find ROCK winner and return 0 or 1 depending on the hand
    if (hand1 === "ROCK") {
      return 0
    } else {
      return 1
    }
  } else if (hand1 === "PAPER" && hand2 === "SCISSORS" || hand2 === "PAPER" && hand1 === "SCISSORS") {
    //find SCISSORS winner and return 0 or 1 depending on the hand
    if (hand1 === "SCISSORS") {
      return 0
    } else {
      return 1
    }
  } else if (hand1 === "ROCK" && hand2 === "ROCK") {
    //return 2, which stands for draw
    return 2;
  } else if (hand1 === "PAPER" && hand2 === "PAPER") {
    //return 2, which stands for draw
    return 2;
  } else if (hand1 === "SCISSORS" && hand2 === "SCISSORS") {
    //return 2, which stands for draw
    return 2;
  } else {
    console.log("input error")
  }
}

// finds the winner of the rock paper scissors bout
findWinner = (playerA, playerB) => {
  const winner = rockPaperScissors(playerA.played, playerB.played);
  if (winner === 0) {
    return "playerA"
  } else if (winner === 1) {
    return "playerB"
  } else return "draw"

}

module.exports = {
  findWinner
}