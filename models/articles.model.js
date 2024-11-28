const db = require("../db/connection");

exports.selectArticles = (topic, sort_by = "created_at", order = "DESC") => {
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
      ON articles.article_id = comments.article_id `;
  const queryValues = [];
  if (topic) {
    sqlQuery += `WHERE articles.topic = $1 `;
    queryValues.push(topic);
  }
  sqlQuery += `GROUP BY articles.article_id `;
  if (sort_by) {
    sqlQuery += `ORDER BY ${sort_by} `;
  }
  if (order) {
    sqlQuery += `${order} `;
  }
  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count
      FROM articles
      LEFT JOIN comments
      ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`,
      [article_id]
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

exports.addArticle = (newArticle) => {
  const { author, title, body, topic, article_img_url } = newArticle;
  if (!article_img_url) {
    article_img_url =
      "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700";
  }
  return db
    .query(
      `INSERT INTO articles (author, title, body, topic, article_img_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;`,
      [author, title, body, topic, article_img_url]
    )
    .then(({ rows: [{ article_id }] }) => {
      return article_id;
    });
};

exports.removeArticle = (article_id) => {
  return db.query(
    `DELETE FROM articles
      WHERE article_id = $1`,
    [article_id]
  );
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
