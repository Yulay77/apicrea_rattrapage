require("dotenv").config();
const { db } = require("./models");

db.sync({ alter: true })
  .then(() => console.log("Database synced"))
  .then(() => db.close());


  // pour update la base de donnée : "node migrate.js" dans le terminal

  