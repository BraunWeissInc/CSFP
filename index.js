var express = require('express');
var path = require('path');
var mysql = require('mysql');
var app = express();
// var tableToCsv = require('node-table-to-csv');
// var json2xls= require('json2xls');
// var nodeExcel = require('excel-export');

app.listen(3000);

app.use('/', express.static('public'))

//app.get('/',function(request,response) {
//    response.sendFile(path.join(__dirname + '/login.html'));
//});
// app.use(json2xls.middleware);
// app.get('/Excel', function(request, response){
//   const query = `SELECT login.case, login.CaseAge, login.ChildrenInHousehold, login.AdultsInHousehold, login.SeniorsInHousehold, RandomNum.* FROM login JOIN RandomNum USING(FirstName,LastName)`;
//   connectDatabase(query).then(function(result){
//     response.json(result);
//     response.xsl('data.xlsx', jsonArr);
//   });


// });
app.get('/admin', function(request, response){
    const { UserName,Password } = request.query;
    const query = `SELECT * FROM AdminTable where UserName='${UserName}' AND Password='${Password}'`;

    connectDatabase(query).then(function(result){
        response.json(result);
        response.sendFile(path.join(__dirname + '/index.html'));
    });
});


app.get('/user', function(request, response){
    const { FirstName,LastName } = request.query;
    const query = `SELECT * FROM login where FirstName='${FirstName}' AND LastName='${LastName}'`;

    connectDatabase(query).then(function(result){
        response.json(result);
        response.sendFile(path.join(__dirname + '/index.html'));
    });
});

app.get('/updatedate', function(request, response){

    const { FirstName,LastName } = request.query;
    const date = new Date().toString().slice(0, 15);

    const query = `UPDATE login SET LastAssistanceDate='${date}' where FirstName='${FirstName}' AND LastName='${LastName}'`;

    connectDatabase(query).then(function(result){
        response.json(result);
    });
});

app.get('/updatePrintStatus', function(request, response){

    var date = new Date().toString().slice(0, 15);
    const query = `INSERT INTO statusTable (Date, printPress) VALUES ('${date}', 'true')`;

    connectDatabase(query).then(function(result){
        response.json(result);
    });
});

app.get('/getPrintStatus', function(request, response){

    // const query = 'SELECT * FROM statusTable WHERE Date(`Date`)=Date(NOW())';
    var date = new Date().toString().slice(0, 15);
    const query = `SELECT * FROM statusTable WHERE Date = '${date}'`;

    connectDatabase(query).then(function(result){
        response.json(result);
    });
});


app.get('/printRandom', function(request, response){
  var date = new Date().toString().slice(0, 15);

  const query = `SELECT login.case, login.CaseAge, login.ChildrenInHousehold, login.AdultsInHousehold, login.SeniorsInHousehold, RandomNum.* FROM login JOIN RandomNum USING(FirstName,LastName) WHERE printPress = 'false' AND Date = '${date}'`;

  connectDatabase(query).then(function(result){
    response.json(result);
  });

});
app.get('/excel', function(request, response){
  var date = new Date().toString().slice(0, 15)

  const query = `SELECT login.case, login.CaseAge, login.ChildrenInHousehold, login.AdultsInHousehold, login.SeniorsInHousehold, RandomNum.FirstName, RandomNum.LastName, RandomNum.Date FROM login JOIN RandomNum USING(FirstName,LastName) WHERE Date = '${date}'`;

  connectDatabase(query).then(function(result){
    response.json(result);
  });

});
app.get('/printSequence', function(request, response){
  var date = new Date().toString().slice(0, 15);

  const query = `SELECT login.case, login.CaseAge, login.ChildrenInHousehold, login.AdultsInHousehold, login.SeniorsInHousehold, RandomNum.FirstName, RandomNum.LastName, RandomNum.Date, RandomNum.id, RandomNum.ColdOrder, RandomNum.grocery FROM login JOIN RandomNum USING(FirstName,LastName) WHERE printPress = 'true' AND Date = '${date}'`;

  connectDatabase(query).then(function(result){
    response.json(result);
  });

});

app.get('/insertdate', function(request, response){

    const { FirstName,LastName,Date,RandomNumcol,printPress } = request.query;
    // console.log("##### insert date");
    // console.log(request.query);


    const query = `INSERT INTO RandomNum (FirstName, LastName, Date, RandomNumcol,printPress) VALUES('${FirstName}', '${LastName}', '${Date}', '${RandomNumcol}', '${printPress}')`;

    connectDatabase(query).then(function(result){
        response.json(result);
    });
});
// app.get('/insert', function(request, response){
//
//     const { FirstName,LastName } = request.query;
//
//     const query = `INSERT INTO sequenceNum (FirstName, LastName, Date) VALUES('${FirstName}', '${LastName}', '${new Date()}' )`;
//
//     connectDatabase(query).then(function(result){
//         response.json(result);
//     });
// });
// var size = item.length;
function connectDatabase(query) {

    const config = {
        host     : "127.0.0.1",
        user     : "Kanulka",
        password : "password",
        database : "CSFP"
    };

    return new Promise(function(resolve, reject) {
        var connection = mysql.createConnection(config);
        connection.connect();
        connection.query(query, function (error, result, fields) {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
        connection.end();

    });
}
