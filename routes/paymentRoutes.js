
const express = require("express");
const paymentRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddlewares");
const paymentController = require("../controllers/paymentController");

paymentRouter.post('/create_payment_url', paymentController.createPaymentUrl)
paymentRouter.get('/vnpay_return', paymentController.returnPaymentUrl)

module.exports = paymentRouter;

