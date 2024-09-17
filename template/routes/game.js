const checkRole = require("../middlewares/checkRole");
const checkAuth = require("../middlewares/checkAuth");
const express = require("express");
const router = express.Router();
const GameController = require("../controllers/game"); // Assurez-vous d'avoir un contrôleur de jeu approprié
const translationMiddleware = require("../middlewares/traduction");
const apiVersion = require("../middlewares/checkVersion");

// Créer une nouvelle partie
router.post("/create", checkAuth, apiVersion, translationMiddleware, (req, res, next) => {
  GameController.createGame(req, res, (err, game) => {
    if (err) {
      next(err);
    } else {
      res.location(`/games/${game.id}`);
      res.json({
        ...game,
        _links: {
          self: { href: `/games/${game.id}` },
          createGame: { href: `/games`, method: "POST" },
          joinGame: { href: `/games/${game.id}/join`, method: "PUT" },
          deleteGame: { href: `/games/${game.id}/end`, method: "DELETE" },
          play: { href: `/games/${game.id}/play`, method: "POST" }
        }
      });
    }
  });
});

// Rejoindre une partie existante
router.post("/join/:gameId",checkAuth, apiVersion, translationMiddleware, (req, res, next) => {
  GameController.joinGame(req, res, (err, game) => {
    if (err) {
      next(err);
    } else {
      res.json({
        ...game,
        _links: {
          self: { href: `/games/${game.id}` },
          createGame: { href: `/games`, method: "POST" },
          joinGame: { href: `/games/${game.id}/join`, method: "PUT" },
          deleteGame: { href: `/games/${game.id}/end`, method: "DELETE" },
          play: { href: `/games/${game.id}/play`, method: "POST" }
        }
      });
    }
  });
});

// Item route : GET : get all games
router.get("/all",checkAuth, apiVersion, translationMiddleware, (req, res, next) => {
  GameController.getGame(req, res, (err, games) => {
    if (err) {
      next(err);
    } else {
      res.json({
        _embedded: games,
        _links: {
          self: { href: `/games` },
          createGame: { href: `/games`, method: "POST" }
        }
      });
    }
  });
});

// Item route : DELETE ALL : delete all games
router.delete("/delete", apiVersion, translationMiddleware, (req, res, next) => {
    GameController.deleteAll(req, res, (err, data) => {
      if (err) {
        next(err);
      } else {
        res.json({
          message: "Toutes les parties ont été supprimées",
          _links: {
            self: { href: `/games` },
            createGame: { href: `/games`, method: "POST" },
            getAllGames: { href: `/games`, method: "GET" }
          }
        });
      }
    });
  });
  
  // Item route : DELETE : delete a game
  router.delete("/end/:gameId", apiVersion, translationMiddleware, (req, res, next) => {
    GameController.deleteOne(req, res, (err, data) => {
      if (err) {
        next(err);
      } else {
        res.json({
          message: "La partie a été supprimée",
          _links: {
            self: { href: `/games` },
            createGame: { href: `/games`, method: "POST" },
            getAllGames: { href: `/games`, method: "GET" }
          }
        });
      }
    });
  });
  
  // Jouer 
  router.post("/play/:gameId", checkAuth, apiVersion, translationMiddleware,  (req, res, next) => {
    GameController.makeMove(req, res, (err, game) => {
      if (err) {
        next(err);
      } else {
        res.json({
          ...game,
          _links: {
            self: { href: `/games/${game.id}` },
            createGame: { href: `/games`, method: "POST" },
            joinGame: { href: `/games/${game.id}/join`, method: "PUT" },
            deleteGame: { href: `/games/${game.id}/end`, method: "DELETE" },
            play: { href: `/games/${game.id}/play`, method: "POST" }
          }
        });
      }
    });
  });  

module.exports = router;