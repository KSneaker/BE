const { db } = require("../db");
const con = db();


exports.allProducts = (req, res) => {
    let sql = `
        SELECT   product.id, product.brand_id,product.category_id, product.title,
            product.price, product.discount, product.thumbnail, product.description,
            JSON_ARRAYAGG(JSON_OBJECT('quantity', quantity, 'size', size)) AS size_quantity
        FROM product_sizes
        JOIN product ON product.id = product_sizes.product_id
        JOIN brand ON product.brand_id = brand.id
        GROUP BY product_id;
        `;
    con.query(sql, (err, response) => {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: response });
        }
    });
}

exports.addProduct = (req, res) => {
    let sql = `INSERT INTO product SET ?`;
    const { body } = req;
    console.log('body', body)
    con.query(sql, body, function (err, result) {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", id: result.insertId, data: body });
        }
    })
}


exports.updateProduct = (req, res) => {
    const { body } = req;
    let sql = `UPDATE product SET ? WHERE id = ${body.id}`;
    con.query(sql, body, function (err) {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: body });
        }
    });
}
exports.deleteProduct = (req, res) => {
    const { id } = req.params;
    let sql = `
DELETE FROM product WHERE id ='${id}'; 
DELETE FROM product_sizes WHERE product_id ='${id}'
`
    // console.log(id)

    con.query(sql, id, (err, response) => {

        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: response });
        }
    });
}


exports.product = (req, res) => {
    const { id } = req.params;
    let sql = `
      SELECT product.id,title, brand_id, price, discount, thumbnail, description,  SUM(quantity) AS total_stock
      FROM product_sizes
      JOIN product ON product.id = product_sizes.product_id
      Where product.id =${id}
      GROUP BY product_id ;
    `
    // let sql = `
    // SELECT product.*, avg(reviews.rating) as avg_rating
    // FROM product
    // JOIN reviews on product.id = reviews.product_id
    // Where product.id = ${id}
    // GROUP BY product_id

    // `
    con.query(sql, id, (err, response) => {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: response });
        }
    });
}
exports.getComments = (req, res) => {
    const { id } = req.params;
    let sql = `
    select r.*,u.fullname from reviews r
    join user u on r.user_id = u.id
    where product_id ='${id}'
`
    // console.log(id)

    con.query(sql, id, (err, response) => {

        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: response });
        }
    });
};