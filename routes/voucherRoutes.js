const express = require("express");
const voucherRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddlewares");
const voucherController = require("../controllers/voucherController");

voucherRouter.get("/check-voucher/:voucherCode", voucherController.checkVoucher)
// voucherRouter.get("/check-voucher/:voucherCode", voucherController.checkVoucher2)
voucherRouter.get("", voucherController.getAllVouchers)
voucherRouter.post("", voucherController.postVoucher)
voucherRouter.put("/:id", voucherController.putVoucher)

module.exports = voucherRouter;