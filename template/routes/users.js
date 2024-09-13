const { Router } = require("express");
const UserController = require("../controllers/users");
const router = new Router();
const checkAuth = require("../middlewares/checkAuth"); // Authenticates the user
const checkRole = require("../middlewares/checkRole"); // Checks the user's role

// Collection routes
router.get("", checkAuth, checkRole("admin"), UserController.cget);
router.post("/register", UserController.register);
// Item routes
router.get("/:id", checkAuth, UserController.iget);
router.patch("/:id", checkAuth, UserController.patch);
router.put("/:id", checkAuth, UserController.put);
router.delete("/:id", checkAuth, UserController.delete);

module.exports = router;