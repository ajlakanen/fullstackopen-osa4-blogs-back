const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const personsRouter = require("./controllers/persons");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

const morgan = require("morgan");

logger.info("connecting to", config.MONGODB_URI);

const url = config.MONGODB_URI;
mongoose
  .connect(url)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(express.json());
app.use(cors());
app.use(express.static("build"));
app.use(middleware.requestLogger);
app.use(morgan("tiny", { skip: (req) => req.method === "POST" }));

app.use("/api/persons", personsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

morgan.token("data", (req) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :data",
    { skip: (req) => req.method !== "POST" }
  )
);

module.exports = app;
