const express = require("express");
const productRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddlewares");
const productController = require("../controllers/productController");

productRouter.get("", productController.allProducts);
productRouter.post("", authMiddleware.isAuth, productController.addProduct);
productRouter.get("/:id", productController.product);
productRouter.put("/:id", productController.updateProduct);
productRouter.delete("/:id", productController.deleteProduct);
productRouter.get("/comments/:id", productController.getComments);



module.exports = productRouter;
