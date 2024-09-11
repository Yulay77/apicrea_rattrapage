const {Game} = require("../models");

module.exports = async (req, res, next) => {

        const { /*gameId,*/playerId, move } = req.headers.authorization;

       /* // Recherchez la partie par son ID
        const game = activeGames[gameId];

        // Vérifiez si la partie existe
        if (!game) {
            res.status(404).json({ error: 'La partie n\'a pas été trouvée.' });
            return; // Arrêtez la requête ici
        }*/

        // Vérifiez si c'est le tour du joueur
        if (game.currentTurn!== playerId) {
            res.status(400).json({ error: 'Ce n\'est pas votre tour.' });
            return; // Arrêtez la requête ici
        }

        // Vérifiez si la case est libre
        if (game.board[move]!== " ") {
            res.status(400).json({ error: 'Cette case est déjà occupée.' });
            return; // Arrêtez la requête ici
        }

        // Si toutes les vérifications passent, passez au prochain middleware
       next();
    };
