const express = require("express");
const sizeRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddlewares");
const sizeController = require("../controllers/sizeController");

sizeRouter.get("/:id", sizeController.getSize);
sizeRouter.post("", sizeController.addSize);
sizeRouter.put("", sizeController.updateSize);

module.exports = sizeRouter;
