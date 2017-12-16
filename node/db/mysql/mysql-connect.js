var mysql = require('mysql');
var pool = mysql.createPool({
  host: '10.37.129.3',
  user: 'root',
  password: 'root',
  database: 'note-online'
});

module.exports = pool;
