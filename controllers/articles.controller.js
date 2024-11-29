const {
  selectArticles,
  selectArticleById,
  changeVotes,
  checkArticleExists,
  addArticle,
  removeArticle,
  totalArticleCount,
} = require("../models/articles.model");
const { checkTopicExists } = require("../models/topics.model");

exports.getArticles = (req, res, next) => {
  const sort_by = req.query.sort_by;
  const order = req.query.order;
  const topic = req.query.topic;
  const limit = req.query.limit;
  const p = req.query.p;
  const promises = [
    selectArticles(topic, sort_by, order, limit, p),
    totalArticleCount(topic, sort_by, order),
  ];
  if (topic) {
    promises.push(checkTopicExists(topic));
  }
  Promise.all(promises)
    .then(([articles, total_count]) => {
      return res.status(200).send({ articles, total_count });
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
      return res.status(200).send({ article });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const newArticle = req.body;
  addArticle(newArticle)
    .then((article_id) => {
      return selectArticleById(article_id).then((article) => {
        res.status(201).send({ article });
      });
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  const promises = [];
  if (article_id) {
    promises.push(checkArticleExists(article_id));
    promises.push(removeArticle(article_id));
  }
  Promise.all(promises)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
