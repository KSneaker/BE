const { db } = require("../db");
const con = db();
exports.checkVoucher = (req, res) => {
    const { voucherCode } = req.params;
    // Thực hiện truy vấn SQL để kiểm tra mã giảm giá trong cơ sở dữ liệu
    const sql = 'SELECT * FROM voucher WHERE code = ? AND expiration_date > NOW()';
    con.query(sql, [voucherCode], (err, results) => {
        if (err) {
            console.error('Error executing SQL:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (results.length > 0) {
                // Mã giảm giá hợp lệ
                res.json({ valid: true, data: results[0] });
            } else {
                // Mã giảm giá không hợp lệ
                res.json({ valid: false, message: 'Mã giảm giá hết hạn hoặc không tồn tại!' });
            }
        }
    });
};
exports.checkVoucher2 = (req, res) => {
    const discountCode = req.params.code;
    const brandName = req.params.brand;

    connection.query(
        'SELECT discounts.*, GROUP_CONCAT(brands.name) AS applicable_brands ' +
        'FROM discounts ' +
        'JOIN discount_brands ON discounts.id = discount_brands.discount_id ' +
        'JOIN brands ON discount_brands.brand_id = brands.id ' +
        'WHERE discounts.code = ?',
        [discountCode],
        (err, results) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                if (results.length > 0) {
                    const applicableBrands = results[0].applicable_brands.split(',');
                    if (applicableBrands.includes(brandName)) {
                        res.json({ isValid: true, discount: results[0] });
                    } else {
                        res.json({ isValid: false, message: 'Discount not applicable for this brand.' });
                    }
                } else {
                    res.json({ isValid: false, message: 'Invalid discount code.' });
                }
            }
        }
    );
}
exports.getAllVouchers = (req, res) => {
    const sql = 'SELECT * FROM voucher';
    con.query(sql, (err, response) => {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: response });
        }
    });
}
exports.postVoucher = (req, res) => {
    let sql = `INSERT INTO Voucher SET ?`;
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
exports.putVoucher = (req, res) => {
    const { body } = req;
    let sql = `UPDATE Voucher SET ? WHERE id = ${body.id}`;
    // console.log(body, 'body')
    con.query(sql, body, function (err) {
        if (err) {
            res.send({ status: "error", message: err });
        } else {
            res.send({ status: "success", data: body });
        }
    });
};