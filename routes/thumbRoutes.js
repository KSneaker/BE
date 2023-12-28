const express = require("express");
const thumbRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddlewares");
const thumbController = require("../controllers/thumbController");

thumbRouter.get("/:id", thumbController.getThumb)


module.exports = thumbRouter;
