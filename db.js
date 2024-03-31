const mysql = require("mysql");

exports.db = () => {
  // connect mysql
  const con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "ksneaker",
    multipleStatements: true
  });
  con.connect(function (err) {
    if (err) throw err;
  });
  return con;
};
