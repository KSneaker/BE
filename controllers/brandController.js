const { db } = require("../db");
const con = db();
exports.getBrand = (req, res) => {
    let sql =
        `select distinct brand.* from brand, product where brand.id = product.brand_id`
    con.query(sql, (err, response) => {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: response });
        }
    });
};
exports.postBrand = (req, res) => {
    let sql = `INSERT INTO brand SET ?`;
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
exports.putBrand = (req, res) => {
    const { body } = req;
    let sql = `UPDATE Brand SET ? WHERE id = ${body.id}`;
    // console.log(body, 'body')
    con.query(sql, body, function (err) {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: body });
        }
    });
};
exports.deleteBrand = (req, res) => {
    const { id } = req.params;
    let sql = `DELETE FROM brand WHERE id ='${id}'`
    // console.log(id)
    con.query(sql, id, (err, response) => {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: response });
        }
    });
};