const {Router} = require("express");
const TicTacToeController = require("../controllers/tictactoe");
const router = new Router();
const checkAuth = require("../middlewares/checkAuth");

//Pour lancer une partie de TicTacToe
router.post("/tictactoe/start", TicTacToeController.start);

//Pour faire un mouvement dans une partie de TicTacToe
router.post("/tictactoe/move", checkAuth, TicTacToeController.makeMove);

//Pour obtenir le statut d'une partie de TicTacToe
router.get("/tictactoe/status", checkAuth, TicTacToeController.getGameStatus);



module.exports = router;
