const { NOT } = require("sequelize/lib/deferrable");
const { Game } = require("../models");
const uuid = require("uuid");
const i18n = require("i18n");

// Stockage des parties en cours
const activeGames = {};

module.exports = {
  getGame: async (req, res, next) => {
    try {
      const gamesFound = await Game.findAll({
        where: {
          player2: null,
        },
      });
      res.json(gamesFound);
    } catch (error) {
      next(error);
    }
  },
  createGame: async (req, res, next) => {
    try {
      const creatorId = req.body.creatorId; 
      const gameId = generateGameId(); 
      const newGame = {
        id: gameId,
        player1: creatorId, 
        board: [" ", " ", " ", " ", " ", " ", " ", " ", " "], 
        currentTurn: creatorId,
      };
      activeGames[gameId] = newGame;
      await Game.create(newGame); // Ajouter la nouvelle partie à la base de données
      res.status(201).json(newGame); // Envoyer la nouvelle partie au client
    } catch (error) {
      next(error);
    }
  },
  joinGame: async (req, res, next) => {
    try {
      const gameId = req.params.gameId; // Récupérez gameId à partir des paramètres de la requête
      const playerId = req.body.playerId; // Récupérez playerId à partir du corps de la requête

      // Recherchez la partie par son ID
      const game = await Game.findByPk(gameId);

      // Si la partie n'existe pas, retournez une erreur
      if (!game) {
        const gameNotFound = i18n.__({ phrase: 'game.gameNotFound', locale: req.locale });
        return res
          .status(404)
          .json(gameNotFound);
      }

      if (game.player2) {
        const gameFull = i18n.__({ phrase: 'game.gameFull', locale: req.locale });
        return res.status(403).json(gameFull);
      }

      // Si la partie existe, mettez à jour le joueur 2
      await Game.update(
        { player2: playerId },
        {
          where: {
            id: gameId,
          },
        }
      );

      // Mettez à jour la partie dans activeGames
      if (activeGames[gameId]) {
        activeGames[gameId].player2 = playerId;
      }

      if (game.player2) {
        await Game.update(
          { currentTurn: game.player1 },

          {
            where: {
              id: gameId,
            },
          }
        );

        activeGames[gameId].currentTurn = game.player1; 
      }
      gameJoined = i18n.__({ phrase: 'game.gameJoined', locale: req.locale });
      res.json(gameJoined);
    } catch (error) {
      next(error);
    }
  },
  deleteAll: async (req, res, next) => {
    try {
      await Game.destroy({
        where: {},
        truncate: true, // Cette option supprime toutes les lignes et réinitialise les compteurs d'auto-incrémentation
      });

      // Réinitialisez l'objet activeGames
      for (let prop in activeGames) {
        if (activeGames.hasOwnProperty(prop)) {
          delete activeGames[prop];
        }
      }
      allGamesDeleted = i18n.__({ phrase: 'game.allGamesDeleted', locale: req.locale });
      res.json(allGamesDeleted);
    } catch (error) {
      next(error);
    }
  },
  deleteOne: async (req, res, next) => {
    try {
      const gameId = req.params.gameId;
      const playerId = req.body.playerId; // Récupérez l'identifiant du joueur depuis les paramètres de la requête
  
      // Recherchez la partie par son ID
      const game = await Game.findByPk(gameId);
  
      // Si la partie n'existe pas, retournez une erreur
      if (!game) {
        gameNotFound = i18n.__({ phrase: 'game.gameNotFound', locale: req.locale });
        return res
          .status(404)
          .json(gameNotFound);
      }
  
      // Vérifiez si le joueur fait partie de la partie
      console.log(playerId);
      if (playerId !== game.player1 && playerId !== game.player2) {
        notAutorizedDeleteGame = i18n.__({ phrase: 'game.notAutorizedDeleteGame', locale: req.locale });
        return res
          .status(403)
          .json(notAutorizedDeleteGame);
      }
  
      await Game.destroy({
        where: {
          id: gameId,
        },
      });
      delete activeGames[gameId];
      gameEnded = i18n.__({ phrase: 'game.gameEnded', locale: req.locale });
      res.json(gameEnded);
    } catch (error) {
      next(error);
    }
  },

  makeMove: async (req, res, next) => {
    try {
      const gameId = req.params.gameId; // Récupérez gameId à partir des paramètres de la requête

      const playerId = req.body.playerId; // Récupérez playerId à partir du corps de la requête

      const move = req.body.move; // Récupérez le mouvement à partir du corps de la requête

      // Recherchez la partie par son ID

      const game = await Game.findByPk(gameId);

      // Si la partie n'existe pas, retournez une erreur

      if (!game) {
        gameMakeMoveNotFound = i18n.__({ phrase: 'game.gameMakeMoveNotFound', locale: req.locale });
        return res
          .status(404)
          .json(gameMakeMoveNotFound);
      }

      // Si le joueur n'est pas un joueur de cette partie, vous ne pouvez pas jouer
      if (playerId !== game.player1 && playerId !== game.player2) {
        gameNotAPlayer = i18n.__({ phrase: 'game.gameNotAPlayer', locale: req.locale });
        return res
          .status(403)
          .json(gameNotAPlayer);
      }

      // S'il n'y a pas de joueur 2, vous ne pouvez pas jouer
      if (!game.player2) {
        waitingAnotherPlayer = i18n.__({ phrase: 'game.waitingAnotherPlayer', locale: req.locale });
        return res.status(403).json(waitingAnotherPlayer);
      }


      // Vérifiez si c'est le tour du joueur

      if (game.currentTurn !== playerId) {
        gameNotYourTurn = i18n.__({ phrase: 'game.gameNotYourTurn', locale: req.locale });
        console.log(game.currentTurn);
        return res.status(403).json(gameNotYourTurn);
      }

      // Vérifier si la case est déjà remplie

      if (game.board[move] !== " ") {
        moveAlreadyMade = i18n.__({ phrase: 'game.moveAlreadyMade', locale: req.locale });
        return res.status(403).json(moveAlreadyMade);
      }

      // Mettez à jour le plateau de jeu
      const board = game.board;
      board[move] = playerId === game.player1 ? "X" : "O";
      // Vérifiez si le jeu est terminé
      const winner = checkWinner(board, playerId === game.player1 ? "X" : "O");
      if (winner) {
        await Game.update(
          { winner: winner},
          {
            where: {
              id: gameId,
            },
          }
        );
        winnerFound = i18n.__({ phrase: 'game.winner', locale: req.locale });
        res.json(winnerFound);
      } else {
        // Mettez à jour le tour actuel

        game.currentTurn =
          playerId === game.player1 ? game.player2 : game.player1;

        await Game.update(
          { board: board, currentTurn: game.currentTurn },
          {
            where: {
              id: gameId,
            },
          }
        );
        moveMade = i18n.__({ phrase: 'game.moveMade', locale: req.locale });
        res.json(moveMade);
      }
    } catch (error) {
      next(error);
    }
  },
};
//Devrait être dans le dossier middlewares
const checkWinner = (board, currentPlayer) => {
  // Vérifiez les lignes
  for (let i = 0; i < 3; i++) {
    if (board[i] === board[i + 1] && board[i + 1] === board[i + 2]) {
      if (board[i] === (currentPlayer === "X" ? "X" : "O")) {
        return currentPlayer;
      }
    }
  }

  // Vérifiez les colonnes
  for (let col = 0; col < 3; col++) {
    if (
      board[col] === board[col + 3] &&
      board[col + 3] === board[col + 6]
    ) {
      if (board[col] === (currentPlayer === "X" ? "X" : "O")) {
        return currentPlayer;
      }
    }
  }
  // Vérifiez les diagonales
  if (board[0] === board[4] && board[4] === board[8]) {
    if (board[0] === (currentPlayer === "X" ? "X" : "O")) {
      return currentPlayer;
    }
  }

  if (board[2] === board[4] && board[4] === board[6]) {
    if (board[2] === (currentPlayer === "X" ? "X" : "O")) {
      return currentPlayer;
    }
  }

  // Si personne n'a gagné, retournez null
  return null;
};
function generateGameId() {
  return uuid.v4();
}
