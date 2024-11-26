const {
  selectCommentsByArticle,
  insertComment,
} = require("../models/comments.model");
const { checkArticleExists } = require("../models/articles.model");

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

exports.postComment = (req, res, next) => {
  const newComment = req.body;
  const article_id = req.params.article_id;
  insertComment(newComment, article_id)
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch(next);
};
