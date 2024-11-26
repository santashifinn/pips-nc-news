const {
  selectArticles,
  selectArticleById,
  selectCommentsByArticle,
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

exports.getCommentsByArticle = (req, res, next) => {
  const article_id = req.params.articles_id;
  const promises = [selectCommentsByArticle(article_id)];
  if (article_id) {
    promises.push(checkArticleExists(article_id));
  }
  Promise.all(promises)
    .then((comments) => {
      return res.status(200).send({ comments });
    })
    .catch(next);
};
