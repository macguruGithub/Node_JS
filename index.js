const express = require('express')
const app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));


var mysql = require('mysql');

var con = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Password21#$",
    database: "custom_schema"
});

function handle_db(req, res, sql,params){
    con.getConnection(function (err) {
        if (err) throw err;
        con.query(sql, params, function (err, result, fields) {
            //con.releaseConnection()
            if (err) throw err;
            res.json(result)
        });
    });
}


app.get('/', function (req, res) {
    var sql = "select * from books";
    handle_db(req,res,sql,[])
    
})

app.post('/api/book', function (req, res) {
    var id = req.body.id;
    var name = req.body.name;
    var stu_roll = req.body.studentRoll;
    var sql = "INSERT INTO books  VALUES (?, ?, ?)";
    var params = [id,name,stu_roll]
    handle_db(req,res,sql,params)
});


var listener = app.listen(3000,() =>{
    console.log("Listening on port "+listener.address().port);
})