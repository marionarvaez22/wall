const Mysql         = require('mysql');
const Constants     = require("./constants");

var connection      = Mysql.createConnection(Constants.DATABASE);

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;
