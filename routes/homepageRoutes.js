const express = require("express");
const homepageRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddlewares");
const homepageController = require("../controllers/homepageController");

homepageRouter.get("/hot", homepageController.hotProduct);
homepageRouter.get("/:brand", homepageController.brandProduct);


module.exports = homepageRouter;

