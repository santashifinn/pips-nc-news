const {
  selectArticles,
  selectArticleById,
  changeVotes,
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

exports.updateVotes = (req, res, next) => {
  const newVotes = req.body;
  const article_id = req.params.article_id;
  const promises = [changeVotes(newVotes, article_id)];
  if (article_id) {
    promises.push(checkArticleExists(article_id));
  }
  Promise.all(promises)
    .then(([article]) => {
      return res.status(200).send(article);
    })
    .catch(next);
};
