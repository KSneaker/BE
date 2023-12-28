const { db } = require("../db");
const con = db();
exports.getCart = (req, res) => {
    const { userId } = req.params;
    let sql =
        `SELECT cart.user_id,
        product.id as product_id,
        product.brand_id,
          cart.id,cart.quantity, cart.size, product.title,product.price , product.discount,product.thumbnail
            FROM  cart JOIN product ON cart.product_id= product.id  WHERE cart.user_id =  ${userId}`;
    con.query(sql, userId, (err, response) => {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: response });
        }
    });
};
exports.deleteCart = (req, res) => {
    const { cartID } = req.params;
    let sql = `DELETE FROM cart WHERE id ='${cartID}'`
    // console.log(id)
    con.query(sql, cartID, (err, response) => {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: response });
        }
    });
};
exports.postCart = (req, res) => {
    let sql = `INSERT INTO cart SET ?`;
    const { body } = req;
    // console.log('body', body)
    con.query(sql, body, function (err, result) {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", id: result.insertId, data: body });
        }
    })
};

exports.increaseCart = (req, res) => {
    const { cartID } = req.body;
    let sql = `UPDATE cart SET quantity = quantity + 1 WHERE id = ${cartID}`;
    con.query(sql, cartID, function (err, result) {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", id: result.insertId, data: result });
        }
    })
};

exports.decreaseCart = (req, res) => {
    const { cartID } = req.body;
    let sql = `UPDATE cart SET quantity = quantity - 1 WHERE id = ${cartID}`;
    con.query(sql, cartID, function (err, result) {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", id: result.insertId, data: sql });
        }
    })
};

exports.checkCart = (req, res) => {
    const { product_id, user_id, size } = req.body;
    // console.log(product_id, user_id)
    let sql = `SELECT * FROM cart  where cart.product_id = ${product_id} and cart.size =${size} and cart.user_id =  ${user_id}`;
    con.query(sql, [product_id, size, user_id], function (err, result) {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: result });
        }
    })
};