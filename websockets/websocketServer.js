const { getGames } = require("./websocketClient");

// function to run when the server starts
const startIoServer = (ioServer) => {
  // logs when a user connects to the wesocket server
  ioServer.on("connection", () => {
    console.log("user connected");
  });

  //every second send an update of the live games
  setInterval(() => {
    ioServer.emit("live games", {
      data: {
        ongoingGames: getGames().ongoingGames,
      },
    });
  }, 1000);
  //every second send an update of the recently ended games
  setInterval(() => {
    ioServer.emit("recent history", {
      data: {
        recentGames: getGames().recentGames,
      },
    });
  }, 3000);
};

module.exports = {
  startIoServer,
};
