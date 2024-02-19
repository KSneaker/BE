const express = require("express");
const productRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddlewares");
const productController = require("../controllers/productController");

productRouter.get("/comments", productController.allComments);
productRouter.get("/comments/:id", productController.getComments);
productRouter.post("/comment", productController.postComment);
productRouter.get("", productController.allProducts);
productRouter.post("", authMiddleware.isAuth, productController.addProduct);
productRouter.post("/image", productController.addImageProduct);
productRouter.get("/image", productController.getImageProduct);
productRouter.delete("/image/:filename", productController.deleteImageProduct);
productRouter.get("/:id", productController.product);
productRouter.put("/:id", productController.updateProduct);
productRouter.delete("/:id", productController.deleteProduct);





module.exports = productRouter;
