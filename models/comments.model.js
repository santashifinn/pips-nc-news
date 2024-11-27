const db = require("../db/connection");

exports.selectCommentsByArticle = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments
      WHERE comments.article_id = $1
      ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertComment = (comment, article_id) => {
  const { username, body } = comment;
  return db
    .query(
      "INSERT INTO comments (author, body, article_id, votes) VALUES ($1, $2, $3, 0) RETURNING *;",
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.checkCommentExists = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Not found",
        });
      }
    });
};

exports.removeComment = (comment_id) => {
  return db
    .query(
      `DELETE FROM comments
      WHERE comment_id = $1`,
      [comment_id]
    )
};
