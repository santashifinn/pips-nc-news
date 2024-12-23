const db = require("../db/connection");

exports.selectCommentsByArticle = (article_id, limit = 10, p) => {
  let sqlQuery = `SELECT * FROM comments
      WHERE comments.article_id = ${article_id}
      ORDER BY created_at DESC `;
  if (limit) {
    sqlQuery += `LIMIT ${limit} `;
  }
  if (p) {
    sqlQuery += `OFFSET (${p}-1) * ${limit} `;
  }
  return db.query(sqlQuery).then(({ rows }) => {
    return rows;
  });
};

exports.insertComment = (comment, article_id) => {
  const { username, body } = comment;
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`,
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeComment = (comment_id) => {
  return db.query(
    `DELETE FROM comments
      WHERE comment_id = $1`,
    [comment_id]
  );
};

exports.changeCommentVotes = (newVotes, comment_id) => {
  const alteredVotes = newVotes.inc_votes;
  return db
    .query(
      `UPDATE comments
      SET votes = votes + $1
      WHERE comment_id = $2
      RETURNING *;`,
      [alteredVotes, comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not found",
        });
      }
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

exports.totalCommentCount = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments
      WHERE comments.article_id = $1;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows.length;
    });
};
