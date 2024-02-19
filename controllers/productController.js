const { db } = require("../db");
const con = db();


exports.allProducts = (req, res) => {
    let sql = `
        SELECT   product.id, product.brand_id,product.category_id, product.title, product.import_price,
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
    DELETE FROM order_details WHERE product_id= '${id}';
    DELETE FROM product_sizes WHERE product_id ='${id}';
    DELETE FROM galery WHERE product_id ='${id}';
    DELETE FROM product WHERE id ='${id}'; 
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

exports.addImageProduct = (req, res) => {
    let sql = `INSERT INTO galery SET ? `;
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

exports.getImageProduct = (req, res) => {
    let sql = `SELECT g.product_id, p.title, JSON_ARRAYAGG(JSON_OBJECT('thumbnail', g.thumbnail) )AS list_thumb from galery g join product p on g.product_id = p.id  GROUP BY g.product_id; `;
    con.query(sql, (err, response) => {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: response });
        }
    });
}

exports.deleteImageProduct = (req, res) => {
    const { filename } = req.params
    // console.log(filename)
    let sql = `delete from galery where thumbnail = ?`;
    con.query(sql, filename, (err, response) => {
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
    select r.*,u.fullname, u.avatar from reviews r
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
exports.postComment = (req, res) => {
    const { body } = req;
    console.log(body)
    let sql = `INSERT INTO reviews SET ? `;
    con.query(sql, body, function (err, result) {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: body });
        }
    })
};
exports.allComments = (req, res) => {
    let sql = ` select * from reviews `
    con.query(sql, (err, response) => {

        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: response });
        }
    });
};