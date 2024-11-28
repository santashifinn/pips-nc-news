const commentsRouter = require("express").Router();

const {
  deleteComment,
  updateCommentVotes,
} = require("../controllers/comments.controller");

commentsRouter.delete("/:comment_id", deleteComment);

commentsRouter.patch("/:comment_id", updateCommentVotes);

module.exports = commentsRouter;
