const checkRole = require("../middlewares/checkRole");
const checkAuth = require("../middlewares/checkAuth");
const express = require("express");
const router = express.Router();
const GameController = require("../controllers/game"); // Assurez-vous d'avoir un contrôleur de jeu approprié
const translationMiddleware = require("../middlewares/traduction");

// Créer une nouvelle partie
router.post("/create", translationMiddleware, checkAuth, GameController.createGame);

// Rejoindre une partie existante
router.post("/join/:gameId",/* middlewares */ translationMiddleware, checkAuth, GameController.joinGame);

// Item route : GET : fetch an user
router.get("", /* middlewares */ translationMiddleware, checkAuth, GameController.getGame);

// Item route : DELETE ALL : delete all games
router.delete("/delete", /* middlewares */translationMiddleware, checkAuth, checkRole("admin"), GameController.deleteAll);

// Item route : DELETE : delete a game
router.delete("/end/:gameId", /* middlewares */ translationMiddleware, checkAuth, GameController.deleteOne);

// Jouer 
router.post("/play/:gameId", translationMiddleware, checkAuth, GameController.makeMove);

module.exports = router;
