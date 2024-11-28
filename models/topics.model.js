const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.addTopic = (newTopic) => {
  const { slug, description } = newTopic;
  return db
    .query(
      `INSERT INTO topics (slug, description)
      VALUES ($1, $2)
      RETURNING *;`,
      [slug, description]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.checkTopicExists = (topic) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Not found",
        });
      }
    });
};
