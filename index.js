const express = require('express')
const app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));


var mssql = require('mssql');

var config = {
    server: "35.205.19.223",
    user: "sqlserver",
    password: "sqlserver",
    database: "Suppliers"
};
function handle_db(req, res, sql,params){
    var dbConn = new mssql.ConnectionPool(config);
    dbConn.connect().then(function () {
        var request = new mssql.Request(dbConn);
        //request.input()
        if(params.length > 2){
            request.input('Shutdown_from', params[1])
            console.log(params[1],params[2],params[0])
            request.input('Shutdown_to', params[2])
            request.input('Vendor_Code', params[0])
        }
        request.query(sql).then(function (recordSet) {
            console.log(recordSet);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(recordSet)
            dbConn.close();
        }).catch(function (err) {
            console.log(err);
            dbConn.close();
        });
    }).catch(function (err) {
        console.log(err);
    });
    
}


app.get('/', function (req, res) {
    var sql = "select * from Suppliers.dbo.Supplier_info where Vendor_Code = '0000100111'";
    handle_db(req,res,sql,[])
    
})

app.post('/api/book', function (req, res) {
    var vendorCode = req.body.vendorCode;
    var shutdown_from = req.body.shutdownFrom;
    var shutdown_to = req.body.shutdownTo;
    //
    var sql = "update  Suppliers.dbo.Supplier_info set Shutdown_from = @Shutdown_from,Shutdown_to = @Shutdown_to where Vendor_Code in (@Vendor_Code)";
    var params = [vendorCode,shutdown_from,shutdown_to]
    handle_db(req,res,sql,params)
});


var listener = app.listen(3000,() =>{
    console.log("Listening on port "+listener.address().port);
})