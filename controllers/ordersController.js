const { db } = require("../db");
const con = db();
exports.getOrder = (req, res) => {
    let sql = `
    SELECT orders.id,orders.order_code,orders.order_date,orders.total_money, orders.payment_method, orders.status,
    JSON_OBJECT( 'user_id',user_id, 'fullname',fullname, 'email',email, 'phone_number',phone_number, 'address',address, 'note',note) as information ,
    JSON_ARRAYAGG(JSON_OBJECT('title',product.title,'thumbnail',product.thumbnail,'quantity', order_details.quantity, 'size', order_details.size,'price',order_details.price))  as detail
    FROM  order_details,orders,product where orders.id = order_details.order_id and order_details.product_id  = product.id
  
   GROUP BY order_details.order_id
   ORDER BY id DESC ;
      `;
    con.query(sql, (err, response) => {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: response });
        }
    });
};
exports.putOrder = (req, res) => {
    const { body } = req;
    let sql = `UPDATE orders SET ? WHERE order_code = '${body.order_code}'`;
    con.query(sql, body, function (err) {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: body });
        }
    });
};
exports.postOrder = (req, res) => {
    let sql = `INSERT INTO orders SET ?`;
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

exports.postOrderDetails = (req, res) => {
    let sql = `INSERT INTO order_details SET ?`;
    const { body } = req;
    con.query(sql, body, function (err, result) {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", id: result.insertId, data: body });
        }
    })
};
exports.decreaseQuantity = (req, res) => {
    const { product_id, size } = req.body;
    let sql = `UPDATE product_sizes SET quantity = quantity - 1 WHERE product_id = ${product_id} and size = ${size}`;
    con.query(sql, [product_id, size], function (err, result) {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", id: result.insertId, data: sql });
        }
    })
}
