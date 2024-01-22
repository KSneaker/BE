const { db } = require("../db");
const con = db();
exports.getAllOrders = (req, res) => {
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
exports.getUserOrders = (req, res) => {
    const { userId } = req.params;
    // console.log(req.params)
    let sql = `
    SELECT orders.id,orders.order_code,orders.order_date,orders.total_money, orders.payment_method, orders.status,
    JSON_OBJECT( 'user_id',user_id, 'fullname',fullname, 'email',email, 'phone_number',phone_number, 'address',address, 'note',note) as information ,
    JSON_ARRAYAGG(JSON_OBJECT('title',product.title,'thumbnail',product.thumbnail,'quantity', order_details.quantity, 'size', order_details.size,'price',order_details.price))  as detail
    FROM  order_details,orders,product where orders.id = order_details.order_id and order_details.product_id  = product.id and user_id = ${userId}
   GROUP BY order_details.order_id
   ORDER BY id DESC 
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

exports.getChartOrder = (req, res) => {
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
}
exports.getCountOrder = (req, res) => {
    let sql =
        `SELECT sum(ODDT.quantity) AS count, brand.name 
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
}
exports.getProfit = (req, res) => {
    let sql =
        `select ODDT.product_id, sum(ODDT.quantity) as total_quantity, 
        P.title, P.import_price,sum(ODDT.price  * ODDT.quantity) as total_sell,sum(ODDT.price * ODDT.quantity)- P.import_price * sum(ODDT.quantity)  as profit  
        from order_details ODDT join product P on ODDT.product_id = P.id join orders OD on OD.id= ODDT.order_id where OD.status = 4 OR OD.status = 6 group by product_id;`

    con.query(sql, (err, response) => {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: response });
        }
    });
}