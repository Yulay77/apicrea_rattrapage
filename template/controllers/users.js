const { User } = require("../models");

module.exports = {
  cget: async (req, res, next) => {
    const users = await User.findAll();
    res.status(200).json({
      "_links": {
        "self": { "href": "/users" },
        "create": { "href": "/users", "method": "POST" }
      },
      "users": users
    });
  },
  register: async (req, res, next) => {
    const { email } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    try {
      const user = await User.create(req.body);
      res.status(201).json({
        "_links": {
          "self": { "href": `/users/${user.id}` },
          "update": { "href": `/users/${user.id}`, "method": "PATCH" },
          "delete": { "href": `/users/${user.id}`, "method": "DELETE" },
          "login": { "href": "/security/login", "method": "POST" },
          "games": { "href": "/game", "method": "GET" },
          "create game": { "href": "/game/create", "method": "POST" },
          "join game": { "href": "/game/join/id", "method": "POST" }
        },
        "user": user
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },
  iget: async (req, res, next) => {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.json({
        "_links": {
          "self": { "href": `/users/${user.id}` },
          "update": { "href": `/users/${user.id}`, "method": "PATCH" },
          "delete": { "href": `/users/${user.id}`, "method": "DELETE" },
          "login": { "href": "/security/login", "method": "POST" },
          "games": { "href": "/game", "method": "GET" },
          "create game": { "href": "/game/create", "method": "POST" },
          "join game": { "href": "/game/join/id", "method": "POST" }
        },
        "user": user
      });
    } else {
      res.sendStatus(404);
    }
  },
  patch: async (req, res, next) => {
    try {
      const [nbUpdated, users] = await User.update(req.body, {
        where: {
          id: req.params.id,
        },
        individualHooks: true,
        returning: true,
      });
      console.log(nbUpdated, users);
      if (users.length) {
        res.json({
          "_links": {
            "self": { "href": `/users/${user.id}` },
            "update": { "href": `/users/${user.id}`, "method": "PATCH" },
            "delete": { "href": `/users/${user.id}`, "method": "DELETE" },
            "login": { "href": "/security/login", "method": "POST" },
            "games": { "href": "/game", "method": "GET" },
            "create game": { "href": "/game/create", "method": "POST" },
            "join game": { "href": "/game/join/id", "method": "POST" }
          },
          "user": users[0]
        });
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  },
  put: async (req, res, next) => {
    const nbDeleted = await User.destroy({
      where: {
        id: req.params.id,
      },
    });
    try {
      req.body.id = req.params.id;
      const user = await User.create(req.body);
      res.status(!nbDeleted ? 201 : 200).json({
        "_links": {
          "self": { "href": `/users/${user.id}` },
          "update": { "href": `/users/${user.id}`, "method": "PATCH" },
          "delete": { "href": `/users/${user.id}`, "method": "DELETE" },
          "login": { "href": "/security/login", "method": "POST" },
          "games": { "href": "/game", "method": "GET" },
          "create game": { "href": "/game/create", "method": "POST" },
          "join game": { "href": "/game/join/id", "method": "POST" }
        },
        "user": user
      });
    } catch (error) {
      next(error);
    }
  },
  delete: async (req, res, next) => {
    const nbDeleted = await User.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!nbDeleted) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  }
};