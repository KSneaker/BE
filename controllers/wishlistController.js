const { db } = require("../db");
const con = db();
exports.getWishlist = (req, res) => {
    const { userId } = req.params;
    let sql =
        `SELECT  product.*, wishlist.id as wishlist_id FROM product, wishlist  where product.id = wishlist.product_id and wishlist.user_id = ${userId}`;
    con.query(sql, userId, (err, response) => {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: response });
        }
    });
};
exports.deleteWishlist = (req, res) => {
    const { wishlistID } = req.params;
    let sql = `DELETE FROM wishlist WHERE id ='${wishlistID}'`
    // console.log(id)
    con.query(sql, wishlistID, (err, response) => {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: response });
        }
    });
};
exports.postWishlist = (req, res) => {
    let sql = `INSERT INTO wishlist SET ?`;
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

exports.checkWishlist = (req, res) => {
    const { product_id, user_id } = req.body;
    // console.log(product_id, user_id)
    let sql = `SELECT * FROM wishlist  where product_id = ${product_id}  and user_id =  ${user_id}`;
    con.query(sql, [product_id, user_id], function (err, result) {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: result });
        }
    })
};