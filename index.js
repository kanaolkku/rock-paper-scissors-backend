const app = require("./app");
const config = require("./config/config");
const { startIoServer } = require("./websockets/websocketServer");
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
// instantiate socket io server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// start server with specified settings
startIoServer(io);

server.listen(config.PORT || 3001, () => {
  console.log("Server is running on port 3000");
});
