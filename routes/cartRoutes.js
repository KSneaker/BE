const express = require("express");
const cartRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddlewares");
const cartController = require("../controllers/cartController");

cartRouter.get("/:userId", cartController.getCart);
cartRouter.delete("/:cartID", cartController.deleteCart);
cartRouter.post("", cartController.postCart);
cartRouter.post("/decrease", cartController.decreaseCart);
cartRouter.post("/increase", cartController.increaseCart);
cartRouter.post("/check-cart", cartController.checkCart);
cartRouter.post("/check-stock", cartController.checkStock);

module.exports = cartRouter;

