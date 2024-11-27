const db = require("../db/connection");

exports.selectArticles = (sort_by = "created_at", order = "DESC") => {
  const validSortBy = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];
  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  let sqlQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments
      ON articles.article_id = comments.article_id
      GROUP BY articles.article_id `;
  if (sort_by) {
    sqlQuery += `ORDER BY ${sort_by} `;
  }
  if (order) {
    sqlQuery += `${order} `;
  }
  return db.query(sqlQuery).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE articles.article_id = $1;`, [
      article_id,
    ])
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

exports.changeVotes = (newVotes, article_id) => {
  const alteredVotes = newVotes.inc_votes;
  return db
    .query(
      `UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *;`,
      [alteredVotes, article_id]
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

exports.checkArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Not found",
        });
      }
    });
};
