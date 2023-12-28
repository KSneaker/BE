const express = require("express");
const brandRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddlewares");
const brandController = require("../controllers/brandController");

brandRouter.get("", brandController.getBrand);
brandRouter.post("", brandController.postBrand);
brandRouter.put("/:id", brandController.putBrand);
brandRouter.delete("/:id", brandController.deleteBrand);

module.exports = brandRouter;

