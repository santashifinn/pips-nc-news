const {
  selectCommentsByArticle,
  insertComment,
  checkCommentExists,
  removeComment,
  changeCommentVotes,
  totalCommentCount,
} = require("../models/comments.model");
const { checkArticleExists } = require("../models/articles.model");

exports.getCommentsByArticle = (req, res, next) => {
  const article_id = req.params.articles_id;
  const limit = req.query.limit;
  const p = req.query.p;
  const promises = [
    selectCommentsByArticle(article_id, limit, p),
    totalCommentCount(article_id),
  ];
  if (article_id) {
    promises.push(checkArticleExists(article_id));
  }
  Promise.all(promises)
    .then(([comments, total_count]) => {
      return res.status(200).send({ comments, total_count });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const newComment = req.body;
  const article_id = req.params.article_id;
  insertComment(newComment, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  const promises = [];
  if (comment_id) {
    promises.push(checkCommentExists(comment_id));
    promises.push(removeComment(comment_id));
  }
  Promise.all(promises)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.updateCommentVotes = (req, res, next) => {
  const newVotes = req.body;
  const comment_id = req.params.comment_id;
  const promises = [changeCommentVotes(newVotes, comment_id)];
  if (comment_id) {
    promises.push(checkCommentExists(comment_id));
  }
  Promise.all(promises)
    .then(([comment]) => {
      return res.status(200).send({ comment });
    })
    .catch(next);
};
