const { db } = require("../db");
const con = db();
exports.getThumb = (req, res) => {
    const { id } = req.params;
    let sql =
        `SELECT galery.thumbnail ,product.id FROM galery,product WHERE product.id = galery.product_id and product.id =${id}`
    con.query(sql, id, (err, response) => {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: response });
        }
    });
}