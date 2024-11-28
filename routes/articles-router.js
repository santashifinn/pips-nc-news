const articlesRouter = require("express").Router();

const {
  getArticles,
  getArticleById,
  updateVotes,
  postArticle,
  deleteArticle,
} = require("../controllers/articles.controller");
const {
  getCommentsByArticle,
  postComment,
} = require("../controllers/comments.controller");

articlesRouter.get("/", getArticles);

articlesRouter.get("/:articles_id", getArticleById);

articlesRouter.post("/", postArticle);

articlesRouter.get("/:articles_id/comments", getCommentsByArticle);

articlesRouter.post("/:article_id/comments", postComment);

articlesRouter.patch("/:article_id", updateVotes);

articlesRouter.delete("/:article_id", deleteArticle);

module.exports = articlesRouter;
