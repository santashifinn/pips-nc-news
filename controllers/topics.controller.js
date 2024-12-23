const { selectTopics, addTopic } = require("../models/topics.model");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  const newTopic = req.body;
  addTopic(newTopic)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
