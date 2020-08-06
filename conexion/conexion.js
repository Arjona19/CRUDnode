var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'us-cdbr-east-02.cleardb.com',
    user     : 'be6abcdb612529',
    password : 'f8880b7e',
    database:'heroku_e12b52604cab367'
});

connection.connect(
    (err) => {
        if (!err) {
            console.log("Conexion establecida");
        } else {
            console.log("Conexion fallida");
        }
    }
);

module.exports = connection;