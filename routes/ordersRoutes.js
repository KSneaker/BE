const express = require("express");
const ordersRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddlewares");
const ordersController = require("../controllers/ordersController");

ordersRouter.get("", ordersController.getAllOrders);
ordersRouter.get("/:userId", ordersController.getUserOrders);
ordersRouter.post("", ordersController.postOrder);
ordersRouter.post("/order-details", ordersController.postOrderDetails);
ordersRouter.post("/decrease", ordersController.decreaseQuantity);
ordersRouter.put("/:order_code", ordersController.putOrder);
ordersRouter.get('/chart/order', ordersController.getChartOrder)
ordersRouter.get('/chart/countOrder', ordersController.getCountOrder)
ordersRouter.get('/chart/profit', ordersController.getProfit)
module.exports = ordersRouter;
