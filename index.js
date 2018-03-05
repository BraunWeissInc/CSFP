var express = require('express');
var path = require('path');
var mysql = require('mysql');
var _ = require('lodash');
var app = express();
var schedule = require('node-schedule');



app.listen(3000);

app.use('/', express.static('public'))


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
app.get('/checkBox', function(request, response){

    const { checkBoxType, id, checked  } = request.query;
    const query = `UPDATE RandomNum SET ${checkBoxType}='${checked}' where id='${id}'`;

    console.log("### checkbox api get");

    connectDatabase(query).then(function(result){
      console.log("inside connect database");
      console.log(result);
        response.json(result);
    });
});
// app.get('/RcheckBox', function(request, response){
//
//     const { checkBoxType, id, checked  } = request.query;
//     const query = `UPDATE RandomNum SET ${checkBoxType}='${checked}' where RandomNumcol='${id}'`;
//
//     console.log("### checkbox api get");
//
//     connectDatabase(query).then(function(result){
//       console.log("inside connect database");
//       console.log(result);
//         response.json(result);
//     });
// });

app.get('/getPrintStatus', function(request, response){

    // const query = 'SELECT * FROM statusTable WHERE Date(`Date`)=Date(NOW())';
    var date = new Date().toString().slice(0, 15);
    const query = `SELECT * FROM statusTable WHERE Date = '${date}'`;

    connectDatabase(query).then(function(result){
        response.json(result);
    });
});


app.get('/search', function(request, response){

  const searchParam = Object.keys(request.query)[0];
  const searchString = request.query[searchParam];

  if (!searchString.length)
    return;

  const query = `SELECT * FROM login WHERE ${searchParam} like '%${searchString}%'`;
  connectDatabase(query).then(function(result){

    var responseData = result.map((field) => {
      return _.get(field,searchParam);
    });

    response.json(responseData);
  });

});
app.get('/searchl', function(request, response){

  const searchlParam = Object.keys(request.query)[0];
  const searchlString = request.query[searchlParam];

  if (!searchlString.length)
    return;

  const query = `SELECT * FROM login WHERE ${searchlParam} like '%${searchlString}%'`;
  connectDatabase(query).then(function(result){

    var responseData = result.map((field) => {
      return _.get(field,searchlParam);
    });

    response.json(responseData);
  });

});

app.get('/printRandom', function(request, response){
  var date = new Date().toString().slice(0, 15);


  const query = `SELECT login.case, login.CaseAge, login.ChildrenInHousehold, login.AdultsInHousehold, login.SeniorsInHousehold, RandomNum.FirstName, RandomNum.LastName, RandomNum.Date, RandomNum.RandomNumcol, RandomNum.ColdOrder, RandomNum.grocery FROM login JOIN RandomNum USING(FirstName,LastName) WHERE printPress = 'false' AND Date = '${date}'`;

  connectDatabase(query).then(function(result){
    response.json(result);
  });

});


app.get('/excel', function(request, response){
  var date = new Date().toString().slice(0, 15)

  const query = `SELECT login.case, RandomNum.FirstName, RandomNum.LastName, RandomNum.Date FROM login JOIN RandomNum  USING(FirstName,LastName) WHERE Date = '${date}' UNION SELECT * FROM ManualEntry`;

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

    const query = `INSERT INTO RandomNum ( FirstName, LastName, Date, RandomNumcol,printPress) VALUES('${FirstName}', '${LastName}', '${Date}', '${RandomNumcol}', '${printPress}')`;

    connectDatabase(query).then(function(result){
        response.json(result);
    });
});
// app.delete('/truncateData', function(request, response){
//
//     var date = new Date().toString().slice(0, 15);
//     When(date === Fri) {
//       const query = `TRUNCATE TABLES RandomNum, statusTable `;
//     }
//     connectDatabase(query).then(function(result){
//         response.json(result);
//     });
// });
app.get('/deleteData', function(request, response){
    var date = new Date().toString().slice(0, 15);
    // const { FirstName,LastName,Date,RandomNumcol,printPress } = request.query;
    const query = `DELETE FROM ManualEntry WHERE Date = '${date}'`;

    connectDatabase(query).then(function(result){
        response.json(result);
    });
});

app.get('/schedule', function(request, response){

console.log("schedule touched");

var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = 5;
rule.hour = 17;
rule.minute = 17;

var j = schedule.scheduleJob(rule, function(){
  console.log('schedule is triggered');

  const query1 = `TRUNCATE TABLE RandomNum`;
  const query2 = `TRUNCATE TABLE statusTable`;

  connectDatabase(query1).then(function(result){
      // response.json(result);
      console.log("randomNum is truncated");
  });
  connectDatabase(query2).then(function(result){
      // response.json(result);
      console.log("statusTable is StatusTable");

  });

  // response.json({"asdf": "asdf"});

});

response.json({ "true": "true"});
});

app.get('/submit', function(request, response){

    const { FirstName,LastName } = request.query;
    var date = new Date().toString().slice(0, 15);


    const query = `INSERT INTO ManualEntry (FirstName, LastName, Date) VALUES('${FirstName}', '${LastName}', '${date}' )`;

    connectDatabase(query).then(function(result){
        response.json(result);
    });
});
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
