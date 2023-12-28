const { db } = require("../db");
const con = db();

exports.getSize = (req, res) => {
    const { id } = req.params;
    let sql =
        `SELECT size,quantity FROM product_sizes WHERE product_id = ${id}`;
    con.query(sql, id, (err, response) => {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: response });
        }
    });
};

exports.addSize = (req, res) => {
    let sql = `INSERT INTO product_sizes SET ?`;
    const size = req.body;
    con.query(sql, size, function (err, result) {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: result });
        }
    })
};

exports.updateSize = (req, res) => {
    const { body } = req;
    const { product_id, ...other } = body
    const size = { ...other }

    let sql = `UPDATE product_sizes SET ? WHERE product_id = ${body.product_id} and size =${body.size} `;
    // console.log(body, 'body')
    con.query(sql, size, function (err) {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: size });
        }
    });
}