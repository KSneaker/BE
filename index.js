const bodyParser = require("body-parser");
const express = require("express");
var cors = require("cors");
const app = express();
const multer = require("multer");
const path = require("path");
const deleteAllFilesInDir = require("./utils/deleteFile");
const { db } = require("./db");
const authRouter = require("./routes/authRoutes");
const dotenv = require("dotenv");
const authMiddleware = require("./middlewares/authMiddlewares");
const productRouter = require("./routes/productRoutes");
const sizeRouter = require("./routes/sizeRoutes");
const homepageRouter = require("./routes/homepageRoutes");
const allProductsRouter = require("./routes/allProductsRoutes");
const brandRouter = require("./routes/brandRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const cartRouter = require("./routes/cartRoutes");
const thumbRouter = require("./routes/thumbRoutes");
const wishlistRouter = require("./routes/wishlistRoutes");
const ordersRouter = require("./routes/ordersRoutes");
const voucherRouter = require("./routes/voucherRoutes");
const paymentRouter = require("./routes/paymentRoutes");
app.use(express.json());
const port = process.env.PORT || 8080;

const con = db();
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });
dotenv.config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.listen(80, function () {
  console.log("CORS-enabled web server listening on port 80");
});
app
  .route("/user")
  .get(authMiddleware.isAuth, function (req, res) {
    let sql = "SELECT * FROM user";
    con.query(sql, (err, response) => {
      if (err) {
        res.send({ status: "error", message: err });
      } else {
        res.send({ status: "success", data: response });
      }
    });
  })
  .post(function (req, res) {
    let sql = `INSERT INTO user SET ?`;
    const { body } = req;
    if (!body.ID) {
      res
        .status(400)
        .send({ status: "error", message: "Dữ liệu đầu vào không tồn tại." });
    } else {
      con.query(sql, body, function (err) {
        if (err) {
          res.send({ status: "error", message: err });
        } else {
          res.send({ status: "success", data: body });
        }
      });
    }
  });

app
  .route("/user/:id")
  .get(authMiddleware.isAuth, function (req, res) {
    const { id } = req.params;
    let sql = "SELECT * FROM user WHERE id = ?";
    con.query(sql, id, (err, response) => {
      if (err) throw err;
      const data =
        response && Array.isArray(response)
          ? response.find((el) => el.id == id)
          : null;
      if (data) {
        res.send({ status: "success", data: data });
      } else {
        res.send({ status: "error", message: "AccountID không tồn tại." });
      }
    });
  })
  .put(function (req, res) {
    let sql = `UPDATE user SET ? WHERE id = ?`;
    const { body, params } = req;
    const { id } = params;
    if (!body.id) {
      res
        .status(400)
        .send({ status: "error", message: "id vào không tồn tại." });
    } else {
      con.query(sql, [body, id], function (err) {
        if (err) {
          res.send({ status: "error", message: err });
        } else {
          res.send({ status: "success", data: body });
        }
      });
    }
  })
  .delete(function (req, res) {
    const { id } = req.params;
    let sql = `DELETE FROM user WHERE id = ? `;
    con.query(sql, id, function (err) {
      if (err) {
        res.send({ status: "error", message: err });
      } else {
        res.send({ status: "success", data: id });
      }
    });
  });


app.get("/profile", authMiddleware.isAuth, async (req, res) => {
  res.send(req.user);
});
app.use("/auth", authRouter);
app.use("/home", homepageRouter);
app.use("/allProducts", allProductsRouter);
app.use("/brand", brandRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/thumb", thumbRouter)
app.use("/size", sizeRouter)
app.use("/wishlist", wishlistRouter)
app.use("/cart", cartRouter)
app.use("/orders", ordersRouter)
app.use("/voucher", voucherRouter)
app.use("/payment", paymentRouter)

app.get('/chart', (req, res) => {
  let sql =
    `SELECT sum(ODDT.price * ODDT.quantity) AS total, brand.name 
    FROM ksneaker.orders OD 
    LEFT JOIN order_details ODDT ON OD.id = ODDT.order_id 
    LEFT JOIN product ON ODDT.product_id = product.id 
    LEFT JOIN brand ON product.brand_id = brand.id 
    WHERE OD.status = 4 OR OD.status = 6 GROUP BY brand.name ;`

  con.query(sql, (err, response) => {
    if (err) {
      res.send({ status: "error", message: err });
    } else {
      res.send({ status: "success", data: response });
    }
  });
})
app.listen(port);
console.log("Server started at http://localhost:" + port);
