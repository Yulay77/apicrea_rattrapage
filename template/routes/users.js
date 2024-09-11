const { Router } = require("express");
const UserController = require("../controllers/users");
const router = new Router();
const checkAuth = require("../middlewares/checkAuth");
const checkRole = require("../middlewares/checkRole");

// Collection route : GET : list users
router.get("", checkAuth, checkRole("admin"), UserController.cget);
// Collection route : POST : create an user
router.post("", /* middlewares */ UserController.post);

// Item route : GET : fetch an user
router.get("/:id", /* middlewares */ UserController.iget);
// Item route : PATCH : modify an user
router.patch("/:id", /* middlewares */ UserController.patch);
// Item route : PUT : replace an user
router.put("/:id", /* middlewares */ UserController.put);
// Item route : DELETE : delete an user
router.delete("/:id", /* middlewares */ UserController.delete);
module.exports = router;