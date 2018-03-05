$(document).ready(function(){
    $('#next2').hide();
    $('#next1').hide();
    $('#back').hide();
    $('#logout').hide();
    $('#myform').hide();
    $('#adminLogin').hide();
    $('#peopleVisited').hide();
    $('#print').hide();
    $('#show').hide();
    $('#token').hide();
    $("#peopleBefore").hide();
    $("#randomData").hide();
    $("#beforeVisited").hide();
    $('#shuffledResult').hide();
    $('#sequenceDisplay').hide();
    $('#sequenceData').hide();
    $('#randomDisplay').hide();
    $('#verification').hide();
    $('#excel').hide();
    $('#excelPrint').hide();
    $('#select').show();
    $('#excelValue').hide();
    $('#manualEntry').hide();
    $('#formEntry').hide();
    $('#form').hide();
    $("#logoutClient").hide();


    $("#Admin").click(function(event){
        $('#logo').hide();
        $('#select').hide();
        $('#adminLogin').show();
    });

    $("#customer").click(function(event){
        $('#logo').hide();
        $('#select').hide();
        $('#myform').show();
        $('#FirstName').empty();
        $('#LastName').empty();
        $('#logOutTxt').hide();
        $('#logoutClient').hide();
    });

    $("#myform").submit(function(e) {
        e.preventDefault();
        var FirstName = $("#FirstName").val();
        var LastName = $("#LastName").val();
        // var Name= $('#FirstName').val()+$('#LastName').val();
        var dataString = 'FirstName='+FirstName+'&LastName='+LastName;

        $.ajax({
          type: "GET",
          url: "/user",
          data: dataString,
          success: function(data){
             $('#login').hide();
              //debugger;
              if (data.length){
                  var fields = ['FirstName',
                                'LastName',
                                'Dependant',
                                'ChildrenInHousehold',
                                'SeniorsInHousehold',
                                'AdultsInHousehold',
                                'LastAssistanceDate'];
                  var html = '';

                  fields.map(function(item){
                      html += `<li class="list-group-item">${item}:${data[0][item]}</li>`;
                  });

                  $('#loggedin').html(html);

                 } else {

                    $('#loggedin').html('<h2 style="text-align:center;"> No data found</h2>');
                    $('#logoutClient').show();
                }

            var date = new Date();
            // var d = date.slice(0,3);
            var LastAssistanceDate = new Date(data[0]['LastAssistanceDate']);


            if ( date.getFullYear() !== LastAssistanceDate.getFullYear() ) {
              // $("#next1").show();
              $('#verification').show();
            }
            else if ( date.getMonth() !== LastAssistanceDate.getMonth() ) {
              // $("#next1").show();
              $('#verification').show();
            }
            else {
              $('#logOutTxt').text( " Please see Admin.");
              $('#logOutTxt').css({fontSize: "30px"});
              $("#logoutClient").show();
            }
          }
        });
    });

    $("#adminLogin").submit(function(event){
        event.preventDefault();
        var UserName = $("#UserName").val();
        var Password = $("#Password").val();

        var dataString = 'UserName='+UserName+'&Password='+Password;

        $.ajax({
          type: "GET",
          url: "/Admin",
          data: dataString,
          success: function(data){
            if(data.length){
              $('#next2').hide();
              $('#next1').hide();
              $('#select').hide();
              $('#myform').hide();
              $('#logout').hide();
              $("#adminLogin").hide();
              $("#manualEntry").hide();
              $('#beforeVisited').show();
              $('#print').show();
              $('#logout').show();
            }
            else {
              $('#adminLogin').hide();
              $('#loggedin').html('<h2 style="text-align:center;"> Invalid login.</h2>');
              $('#logout').show();
             }
            }
        });
    });

    $("#print").click(function(printPress){
        updatePrintStatus();
        showRandomData();
    });

    $('#show').click(function(e){
      $.get('/getPrintStatus', function(data,status){
        var printPress = false;

        if( data.length && data[0].hasOwnProperty('printPress')){
          printPress = data[0].printPress;
        }
        //showSequenceData();
        if (printPress) {
          showSequenceData();
        }
        else {
          showRandomData();
        }
      });
    });

    function updatePrintStatus () {
      $.get('/updatePrintStatus', function(data,status){
        console.log('print status updated');
      });
    }

    function showRandomData() {
      $.ajax({
        type: "GET",
        url: '/printRandom',
        success: function(data){
          var fields = ['FirstName','LastName','ChildrenInHousehold','AdultsInHousehold','SeniorsInHousehold','Date','RandomNumcol','ColdOrder','grocery'];
          // var visitedCount = $("#beforeVisited").val();
          //var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
          // var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
          // var slicedData = data.slice(0, 100);
          // var Coldorder = '';
          // var grocery = '';
          var sortData = _.sortBy(data, 'RandomNumcol');
          // var ColdOrder = $('#cold').text('<input type="checkbox" class= "checkList1"/>');
          // var grocery = $('#items').text('<input type="checkbox" class= "checkList2"/>');

          sortData.map(function(item){
            $('#randomBody').append('<tr class= "table table-bordered table-striped"><td>' +item.FirstName + '</td><td>' +item.LastName+ '</td><td>' +item.ChildrenInHousehold+ '</td><td>' +item.AdultsInHousehold+ '</td><td>' +item.SeniorsInHousehold+ '</td><td>' +(item.ChildrenInHousehold+item.AdultsInHousehold+item.SeniorsInHousehold)+ '</td><td>' +item.Date+ '</td><td>' +item.RandomNumcol+
            '</td><td><input type="checkbox" class= "checkList1"/>'
            +item.ColdOrder+'</td><td><input type="checkbox" class= "checkList2"/>' +item.grocery+
            '</td></tr>');
            // <input type="checkbox" class= "checkList1"/>
          });
          $('#print').hide();
          $('#show').hide();
          $('#excel').hide();
          $("#peopleVisited").hide();
          // $('#printRandom').show();
          $('#randomData').show();
          $('#shuffledResult').show();
          $('#back').show();
          $('#sequenceData').hide();
          $('#excelValue').hide();
          $('#excelResult').hide();
          $('#excelPrint').hide();


       }
     });
    }

    function showSequenceData() {
      $.ajax({
        type: "GET",
        url: "/printSequence",
        success: function(data){
          var date = new Date().toString().slice(0, 15);
          var sortData = _.sortBy(data, 'id');
          // var ColdOrder = $('#cold1') .text('<input type="checkbox" class= "checkList1"/>');
          // var grocery = $('#items1').text('<input type="checkbox" class= "checkList2"/>');

          // var fields = ['case','FirstName','LastName','CaseAge','ChildrenInHousehold','AdultsInHousehold','SeniorsInHousehold','Date','Id','ColdOrder','grocery'];
          // console.log(data)
          sortData.map(function(item){
            var isColdOrderChecked = (item.ColdOrder === 'true') ? 'checked' : '';
            var isGroceryChecked = (item.grocery === 'true') ? 'checked' : '';

            $('#seqBody').append(`<tr class="table table-bordered table-striped"><td>${item.FirstName} </td><td>${item.LastName}</td><td>${item.ChildrenInHousehold}</td><td> ${item.AdultsInHousehold}</td><td> ${item.SeniorsInHousehold} </td><td>  ${item.ChildrenInHousehold+item.AdultsInHousehold+item.SeniorsInHousehold}</td><td>${item.Date} </td><td>${item.id}</td><td><input type="checkbox" data-id="${item.id}" name="coldOrderCheckbox" ${isColdOrderChecked} /> </td><td><input type="checkbox" data-id="${item.id}" name= "groceryCheckbox" ${isGroceryChecked} /></td></tr>`)

          });
          $('#print').hide();
          $('#show').hide();
          $('#excel').hide();
          $('#manualData').hide();
          $('#sequenceData').show();
          $('#Result').show();
          $('#back').show();
          $('#randomData').hide();
          $('#excelValue').hide();
          $('#excelResult').hide();
          $('#excelPrint').hide();
        }
      });
    }

    $('#seqBody').on("click", "input[type='checkbox']", function(e) {
      console.log(e.target);
      var checkBoxType = e.target.name;  // coldorder
      var id = e.target.dataset.id;  // 1
      var checked = e.target.checked; //true

      // write ajax call and send above variables to server
      $.ajax({
        type: "GET",
        url: "/checkBox",
        data: {
          checkBoxType : checkBoxType,
          id : id,
          checked : checked
        },
        success: function(data) {
          console.log("checkbox updated");
        }
      });

      // server will access these variables and sql query will run and update database

    });

    $('#manualData').click(function(e){
      $('#formEntry').show();
      $('#form').show();
      $('#print').hide();
      $('#show').hide();
      $('#excel').hide();
      $('#back').show();
      $('#excelValue').hide();
      $('#manualEntry').hide();

    });

    $('#next1').click(function(event){
      $('#loggedin').hide();
      $('#verification').show();
    });

    $('#yes').click(function(event){
      $('#next1').hide();
      $('#next2').show();
      $('#logout').hide();
    });

    $('#no').click(function(event){
      $('#next1').hide();
      $('#next2').hide();
      $('#logout').show();
    });

    $("#next2").click(function(event){
      var FirstName = $("#FirstName").val();
      var LastName = $("#LastName").val();

      var dataString = 'FirstName='+FirstName+'&LastName='+LastName;

      $.ajax({
        type: "GET",
        url: "/updatedate",
        data: dataString,
        success: function(data){
          $('#verification').hide();
          $('#loggedin').hide();
          $('#next2').hide();
          $('#logout').hide();
          $('#token').show();
        }
      });
    });

    $('#excel').click(function(e){

      $.ajax({
        type: "GET",
        url: "/excel",
        success: function(data){
          // var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
         data.map(function(item){
            $('#excelBody').append('<tr class= "table table-bordered table-striped"><td>' +item.case+ '</td><td>' +item.FirstName + '</td><td>' +item.LastName+ '</td><td>' +item.Date+ '</td></tr>');
          });
          $('#print').hide();
          $('#show').hide();
          $('#excel').hide();
          $('#back').show();
          $('#excelValue').show();
          $('#excelResult').show();
          $('#excelPrint').show();
          $('#sequenceData').hide();
          $('#randomData').hide();
          $("#manualEntry").hide();
        }
      });
    });

    $('#excelPrint').click(function() {
      $('#excelResult').table2csv({
        separator: ',',
        newline: '\n',
        quoteFields: true,
        delivery: 'download',
        filename: 'table.csv'
      });
      $.ajax({
        type: "GET",
        url: "/deleteData"
      });
      $('#excelResult').table2csv('output',{appendTo: '#out'});
      $('#excelPrint').hide();
    });

    $("#tokenNum").click(function(e){
      e.preventDefault();
      // var case =$("#case").val();
      var FirstName = $("#FirstName").val();
      var LastName = $("#LastName").val();
      var date = new Date().toString().slice(0, 15);
      var randomString = getRandomString(2);
      // var printPressButton = $('printPress').val();
      // var empty =  ;
      // var checkbox = new array();
      $.get('/getPrintStatus',function(data,status){
        var printPress = false;
        if( data.length && data[0].hasOwnProperty('printPress')){
          printPress = data[0].printPress;
        }

        var dataString = 'FirstName='+FirstName+'&LastName='+LastName+'&Date='+date+'&RandomNumcol='+randomString+'&printPress='+printPress;

        $.ajax({
          type: "GET",
          url: "/insertdate",
          data: dataString,
          success: function(data){
              // console.log(data);
            $('#randomnumber').show();
            $('#token').hide();
            $('#logoutClient').show();
            // var visitedCount = $("#Visited").val();
             $('#randomnumber').html(`<h2 style="text-align:center;">You are successfully registered to shop today. </h2><h1>Thank You</h1>`);
          }
        });

      });
    });

    $('#formSubmit').click(function(e){
      e.preventDefault();
      var FirstName = $("#name").val();
      var LastName = $("#Lastname").val();

      var dataString = 'FirstName='+FirstName+'&LastName='+LastName;
      $.ajax({
        type: "GET",
        url: "/submit",
        data: dataString,
        success: function(data){
          // console.log(data);

          $('#formEntry').text( "Information is stored");
          $('#formEntry').css({fontSize: "30px"});
          $('#back').show();
          $('#formEntry').show();
        }
      });
    });

    $("#logoutClient").click(function(event){
      $('#myform').show();
      $("#login").show();
      $('#loggedin').hide();
      $('#FirstName').val('');
      $('#LastName').val('');
      $('#logoutClient').hide();
      $('#randomnumber').hide();
    });


    $("#logout").click(function(event){
        window.location.reload(true);
    });

    $("#back").click(function(event){
      $('#print').show();
      $('#show').show();
      $('#excel').show();
      
      $('#excelPrint').hide();
      $('#excelValue').hide();
      $('#randomData').hide();
      $("#manualEntry").show();
      $('#sequenceData').hide();
      $('#back').hide();
      $('#seqBody').empty();
      $('#excelBody').empty();
      $('#randomBody').empty();
      $('#formEntry').hide();
      // $('#formEntry').empty();
      // $('#manualEntry').empty();



     });

});
