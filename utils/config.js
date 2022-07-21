require("dotenv").config();

let PORT = process.env.PORT || 3003;

const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.REACT_APP_TEST_MONGODB_URI
    : process.env.REACT_APP_MONGODB_URI;

module.exports = {
  MONGODB_URI,
  PORT,
};
