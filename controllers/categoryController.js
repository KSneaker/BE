const { db } = require("../db");
const con = db();
exports.getCategory = (req, res) => {
    let sql =
        `select * from category`
    con.query(sql, (err, response) => {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: response });
        }
    });
};