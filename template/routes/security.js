const { Router } = require("express");
const SecurityController = require("../controllers/security");
const router = new Router();
const apiVersion = require("../middlewares/checkVersion");

// Collection route : GET : list users
router.post("/login", apiVersion, SecurityController.login);
module.exports = router;