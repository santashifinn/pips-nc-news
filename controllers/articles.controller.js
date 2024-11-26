const {
  selectArticles,
  selectArticleById,
  checkArticleExists,
} = require("../models/articles.model");

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      return res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const article_id = req.params.articles_id;
  selectArticleById(article_id)
    .then((article) => {
      return res.status(200).send({ article });
    })
    .catch(next);
};
