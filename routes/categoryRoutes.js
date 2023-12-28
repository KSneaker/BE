const express = require("express");
const categoryRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddlewares");
const categoryController = require("../controllers/categoryController");

categoryRouter.get("", categoryController.getCategory);

module.exports = categoryRouter;

