const { selectUsers, selectUserByUsername } = require("../models/users.model");

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  const username = req.params.username;
  selectUserByUsername(username)
    .then((user) => {
      return res.status(200).send({ user });
    })
    .catch(next);
};
