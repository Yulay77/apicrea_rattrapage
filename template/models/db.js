const Sequelize = require("sequelize");

const connection = new Sequelize(process.env.DATABASE_URL);

//const connection = new Sequelize('postgres://user:pass@example.com:5432/dbname')

connection.authenticate().then(() => console.log("Database connected"));

module.exports = connection;

