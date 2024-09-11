const { Model, DataTypes } = require("sequelize");

module.exports = function GameModelGenerator(connection) {
    class Game extends Model {}
    
    Game.init(
        {
            id: {
                type: DataTypes.STRING,
                unique: true,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            player1: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: {
                        args: [36, 36], // UUIDs ont une longueur de 36
                        msg: "L'ID du joueur 1 doit être un UUID valide."
                    }
                }
            },
            player2: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: {
                        args: [36, 36], // UUIDs ont une longueur de 36
                        msg: "L'ID du joueur 2 doit être un UUID valide."
                    }
                }
            },
            board: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: false,
                defaultValue: [" ", " ", " ", " ", " ", " ", " ", " ", " "], // Tableau aplati
                validate: {
                    len: {
                        args:9,
                        msg: "Le plateau de jeu à eu une erreur à l'initialisation."}
                },
            },
            currentTurn: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: {
                        args: [36, 36], // UUIDs ont une longueur de 36
                        msg: "L'ID du joueur actuel doit être un UUID valide."
                    }
                }
            },
        },
        {
            sequelize: connection,
        }
    );
    
    return Game;
    }