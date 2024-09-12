const checkRole = require("../middlewares/checkRole");
const checkAuth = require("../middlewares/checkAuth");
const express = require("express");
const router = express.Router();
const GameController = require("../controllers/game"); // Assurez-vous d'avoir un contrôleur de jeu approprié
const translationMiddleware = require("../middlewares/traduction");

// Créer une nouvelle partie
router.post("/create", translationMiddleware, checkAuth, (req, res, next) => {
  GameController.createGame(req, res, (err, game) => {
    if (err) {
      next(err);
    } else {
      res.location(`/games/${game.id}`);
      res.json(game);
    }
  });
});

// Rejoindre une partie existante
router.post("/join/:gameId",/* middlewares */ translationMiddleware, checkAuth, (req, res, next) => {
  GameController.joinGame(req, res, (err, game) => {
    if (err) {
      next(err);
    } else {
      res.json(game);
    }
  });
});

// Item route : GET : fetch an user
router.get("", /* middlewares */ translationMiddleware, checkAuth, (req, res, next) => {
  GameController.getGame(req, res, (err, games) => {
    if (err) {
      next(err);
    } else {
      res.json(games);
    }
  });
});

// Item route : DELETE ALL : delete all games
router.delete("/delete", /* middlewares */translationMiddleware, checkAuth, checkRole("admin"), (req, res, next) => {
  GameController.deleteAll(req, res, (err) => {
    if (err) {
      next(err);
    } else {
      res.json({ message: "Toutes les parties ont été supprimées" });
    }
  });
});

// Item route : DELETE : delete a game
router.delete("/end/:gameId", /* middlewares */ translationMiddleware, checkAuth, (req, res, next) => {
  GameController.deleteOne(req, res, (err) => {
    if (err) {
      next(err);
    } else {
      res.json({ message: "La partie a été supprimée" });
    }
  });
});

// Jouer 
router.post("/play/:gameId", translationMiddleware, checkAuth, (req, res, next) => {
  GameController.makeMove(req, res, (err, game) => {
    if (err) {
      next(err);
    } else {
      res.json(game);
    }
  });
});

module.exports = router;