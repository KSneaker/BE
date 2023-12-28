const express = require("express");
const wishlistRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddlewares");
const wishlistController = require("../controllers/wishlistController");

wishlistRouter.get("/:userId", wishlistController.getWishlist);
wishlistRouter.delete("/:wishlistID", wishlistController.deleteWishlist);
wishlistRouter.post("", wishlistController.postWishlist);
wishlistRouter.post("/check-wishlist", wishlistController.checkWishlist);

module.exports = wishlistRouter;

