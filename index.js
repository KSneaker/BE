const bodyParser = require("body-parser");
const express = require("express");
var cors = require("cors");
const app = express();
const multer = require("multer");
const path = require("path");
const deleteAllFilesInDir = require("./utils/deleteFile");
const moment = require('moment');
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
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
const { createServer } = require("http");
const { Server } = require("socket.io");


app.use(express.json());
const port = process.env.PORT || 8080;

const con = db();

dotenv.config();
app.use(bodyParser.urlencoded({ extended: true, limit: '200mb' }));
app.use(bodyParser.json({ limit: '200mb' }));
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"]
  }
  /* options */
});

io.on("connection", (socket) => {
  console.log(`connected: ${socket.id}`)
  socket.on("disconnect", () => {
    console.log("disconnect", socket.id)
  })
});

httpServer.listen(80, function () {
  console.log("CORS-enabled web server listening on port 80");
});
// app.listen(80, function () {
//   console.log("CORS-enabled web server listening on port 80");
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },

  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + moment().format('YYYYMMDDHHmmss') + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), (req, res) => {
  const { filename } = req.file;
  // const imagePath = path.join(__dirname, '/uploads/', filename);
  // res.json({ filename: filename });
  res.send(filename);
});
app.post('/uploadMultiple', upload.array('image', 10), (req, res) => {
  const filename = req.files;
  console.log(req.file)
  // const imagePath = path.join(__dirname, '/uploads/', filename);
  // res.json({ filename: filename });
  res.send(filename);
});
app.get('/image/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, 'uploads', filename);
  res.sendFile(imagePath);
});
app.delete('/image/:filename', (req, res) => {
  const filename = req.params.filename;
  fs.unlink(`uploads/${filename}`, (err) => {
    if (err) {
      res.send({ status: err });
    } else {
      res.send({ status: "success" });
    }
  });
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
  .route("/user/:username")
  .get(authMiddleware.isAuth, function (req, res) {
    const { id } = req.params;
    let sql = "SELECT * FROM user WHERE username = ?";
    con.query(sql, id, (err, response) => {
      if (err) throw err;
      const data =
        response && Array.isArray(response)
          ? response.find((el) => el.id == id)
          : null;
      if (data) {
        const { password, ...other } = data
        res.send({ status: "success", data: { ...other } });
      } else {
        res.send({ status: "error", message: "Account không tồn tại." });
      }
    });
  })
  .put(function (req, res) {
    const { body, params } = req;
    const { username } = params;
    let sql = `UPDATE user SET ? WHERE username = ?`;
    con.query(sql, [body, username], function (err) {
      if (err) {
        res.send({ status: "error", message: err });
      } else {
        res.send({ status: "success", data: body, sql: sql });
      }
    });
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

app.get('/chart',)
app.listen(port);
console.log("Server started at http://localhost:" + port);
