const { db } = require("../db");
const con = db();
exports.hotProduct = (req, res) => {
    let sql =
        `SELECT id, title, price, discount, thumbnail, description FROM product where discount >= 50 limit 4`
    con.query(sql, (err, response) => {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: response });
        }
    });
};
exports.brandProduct = (req, res) => {
    const { brand } = req.params;
    // console.log(brand)
    let sql =
        `SELECT product.id, product.title, product.price, product.discount, product.thumbnail, product.description FROM product join brand where product.brand_id = brand.id and brand.name=  '${brand}' limit 4`
    con.query(sql, brand, (err, response) => {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: response });
        }
    });
};