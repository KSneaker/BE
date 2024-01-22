const { db } = require("../db");
const con = db();
exports.allHot = (req, res) => {
    let sql =
        ` SELECT product.id, product.title, product.price, product.discount, product.thumbnail, product.description, category.name as category, count(product.id) as count  FROM product join category on product.category_id = category.id join order_details on product.id = order_details.product_id group by  product.id order by(count(product.id)) DESC `
    con.query(sql, (err, response) => {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: response });
        }
    });
};
exports.allProducts = (req, res) => {
    let sql =
        `SELECT product.id, product.title, product.price,
       product.discount, product.thumbnail, product.description,
        category.name as category, brand.name as brand FROM product,category,brand 
        where product.category_id = category.id and product.brand_id = brand.id order by product.id ASC ;`

    con.query(sql, (err, response) => {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: response });
        }
    });
};
exports.allBrand = (req, res) => {
    const { brand } = req.params;
    // console.log(brand)
    let sql =
        // `SELECT product.id, title, price, discount, thumbnail, description FROM product join brand where product.brand_id = brand.id and brand.name=  '${brand}'`
        `SELECT product.id, product.title, product.price, product.discount, product.thumbnail, product.description, category.name as category FROM product,brand,category where product.brand_id = brand.id and product.category_id = category.id and brand.name= '${brand}'`
    con.query(sql, brand, (err, response) => {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: response });
        }
    });
};