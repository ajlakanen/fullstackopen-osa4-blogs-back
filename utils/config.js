require("dotenv").config();

const MONGOPWD = process.env.REACT_APP_MONGODB_PASSWORD;
const MONGODB_URI_PROD = `mongodb+srv://fullstackopen:${MONGOPWD}@cluster0.b9jhy.mongodb.net/bloglist?retryWrites=true&w=majority`;
const MONGODB_URI_TEST = `mongodb+srv://fullstackopen:${MONGOPWD}@cluster0.b9jhy.mongodb.net/testbloglist?retryWrites=true&w=majority`;
let PORT = process.env.PORT || 3003;

const MONGODB_URI =
  process.env.NODE_ENV === "test" ? MONGODB_URI_TEST : MONGODB_URI_PROD;

module.exports = {
  MONGODB_URI,
  PORT,
};
