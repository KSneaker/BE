const express = require("express");
const allProductsRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddlewares");
const allProductsController = require("../controllers/allProductsController");

allProductsRouter.get("", allProductsController.allProducts);
allProductsRouter.get("/hot", allProductsController.allHot);
allProductsRouter.get("/:brand", allProductsController.allBrand);


module.exports = allProductsRouter;

