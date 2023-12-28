const express = require("express");
const ordersRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddlewares");
const ordersController = require("../controllers/ordersController");

ordersRouter.get("", ordersController.getOrder);
ordersRouter.post("", ordersController.postOrder);
ordersRouter.post("/order-details", ordersController.postOrderDetails);
ordersRouter.post("/decrease", ordersController.decreaseQuantity);
ordersRouter.put("/:order_code", ordersController.putOrder);


module.exports = ordersRouter;
