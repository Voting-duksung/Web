// 데이터베이스 설정

var mysql = require('mysql');

var db = mysql.createConnection({
    host     : 'voting.ckgxyexnuchs.ap-northeast-2.rds.amazonaws.com',
    user     : 'voting',
    password : 'chain2121!',
    database : 'voting'
});

module.exports = db;