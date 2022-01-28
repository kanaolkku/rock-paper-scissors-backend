require("dotenv").config();
// environment variables
let PORT = process.env.PORT;
let MONGODB_URI = process.env.MONGODB_URI;

module.exports = {
  MONGODB_URI,
  PORT,
};
