const express = require("express");
const app = express();

const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const {
  getArticles,
  getArticleById,
  updateVotes,
} = require("./controllers/articles.controller");
const {
  getCommentsByArticle,
  postComment,
  deleteComment,
} = require("./controllers/comments.controller");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:articles_id", getArticleById);

app.get("/api/articles/:articles_id/comments", getCommentsByArticle);
app.post("/api/articles/:article_id/comments", postComment);
app.delete("/api/comments/:comment_id", deleteComment);

app.patch("/api/articles/:article_id", updateVotes);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502" || err.code === "23503") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    console.log(err);
    next(err);
  }
});

module.exports = app;
