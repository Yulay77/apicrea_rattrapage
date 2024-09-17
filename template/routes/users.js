const { Router } = require("express");
const UserController = require("../controllers/users");
const router = new Router();
const checkAuth = require("../middlewares/checkAuth"); // Authenticates the user
const checkRole = require("../middlewares/checkRole"); // Checks the user's role
const apiVersion = require("../middlewares/checkVersion");

// Collection routes
router.get("/everyone", checkAuth, apiVersion, checkRole("admin"), UserController.cget);
router.post("/register", apiVersion, UserController.register);
// Item routes
router.get("/:id", checkAuth, apiVersion, UserController.iget);
router.patch("/:id", checkAuth, apiVersion, UserController.patch);
router.put("/:id", checkAuth, apiVersion, UserController.put);
router.delete("/:id", checkAuth, apiVersion, UserController.delete);

module.exports = router;