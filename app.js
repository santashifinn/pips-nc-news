const express = require("express");
const app = express();
const cors = require("cors");
const apiRouter = require("./routes/api-router");
const topicsRouter = require("./routes/topics-router");
const articlesRouter = require("./routes/articles-router");
const usersRouter = require("./routes/users-router");
const commentsRouter = require("./routes/comments-router");
const {
  generalErrorHandler,
  postgresErrorHandler,
  customErrorHandler,
} = require("./errors");

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);
app.use("/api/topics", topicsRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/users", usersRouter);

app.all("*", generalErrorHandler);

app.use(postgresErrorHandler);

app.use(customErrorHandler);

module.exports = app;
