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
    $('#randomDisplay').hide();
    $('#verification').hide();
    $('#excel').hide();
    $('#excelPrint').hide();
    $('#select').show();
    $('#excelValue').hide();


    $("#Admin").click(function(event){
        $('#logo').hide();
        $('#select').hide();
        $('#adminLogin').show();
    });
    $("#customer").click(function(event){
        $('#logo').hide();
        $('#select').hide();
        $('#myform').show();
    });

    $("#myform").submit(function(e) {
        e.preventDefault();
        var FirstName = $("#FirstName").val();
        var LastName = $("#LastName").val();

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
                    $('#logout').show();
                }

            var date = new Date();
            // var d = date.slice(0,3);
            var LastAssistanceDate = new Date(data[0]['LastAssistanceDate']);

            //debugger;
            if ( date.getFullYear() !== LastAssistanceDate.getFullYear() ) {
              $("#next1").show();
            }
            else if ( date.getMonth() !== LastAssistanceDate.getMonth() ) {
              $("#next1").show();
            }
            else {
              $('#logOutTxt').text( "Sorry! You are not allowed to shop.");
              $('#logOutTxt').css({fontSize: "30px", background: "#e50d35"});
              $("#logout").show();
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
              //$('#printRandom').show();
              $('#beforeVisited').show();
              $('#print').show();
              // $('#show').show();
              // $('#excel').show();
              // $("#peopleBefore").show();
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
      // $('#excel').prop("disabled", false);
      // $('#print').prop("disabled", true);
      // $('#show').prop("disabled", false);
        updatePrintStatus();
        showRandomData();
    });

    $('#show').click(function(e){
      // $('#excel').prop("disabled", false);
      // $('#print').prop("disabled", false);
      // $('#show').prop("disabled", true);
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
          var fields = ['case','FirstName','LastName','CaseAge','ChildrenInHousehold','AdultsInHousehold','SeniorsInHousehold','Date','RandomNumcol','ColdOrder','grocery'];
          // var visitedCount = $("#beforeVisited").val();
          //var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
          // var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
          // var slicedData = data.slice(0, 100);
          var Coldorder = '';
          var grocery = '';
          var sortData = _.sortBy(data, 'RandomNumcol');
          // var sortData = _.sortBy(shuffledData, 'date');
          // var html = '';
// #randomData table tr:last
          sortData.map(function(item){
            $('#randomBody').append('<tr class= "table table-bordered table-striped"><td>' +item.case+ '</td><td>' +item.FirstName + '</td><td>' +item.LastName+ '</td><td>' +item.CaseAge+ '</td><td>' +item.ChildrenInHousehold+ '</td><td>' +item.AdultsInHousehold+ '</td><td>' +item.SeniorsInHousehold+'</td><td>' +item.Date+ '</td><td>' +item.RandomNumcol+ '</td><td><td></td></tr>');
          });
          $('#print').hide();
          $('#show').hide();
          $('#excel').hide();
          $("#peopleVisited").hide();
          // $('#printRandom').show();
          $('#randomData').show();
          $('#shuffledResult').show();
          $('#back').show();
          $('#sequenceDisplay').hide();
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
          // var fields = ['case','FirstName','LastName','CaseAge','ChildrenInHousehold','AdultsInHousehold','SeniorsInHousehold','Date','Id','ColdOrder','grocery'];
          // console.log(data)
          sortData.map(function(item){
            $('#seqBody').append('<tr class= "table table-bordered table-striped"><td>'+item.case+ '</td><td>' +item.FirstName + '</td><td>' +item.LastName+ '</td><td>' +item.CaseAge+ '</td><td>' +item.ChildrenInHousehold+ '</td><td>' +item.AdultsInHousehold+ '</td><td>' +item.SeniorsInHousehold+ '</td><td>' +item.Date+'</td><td>'+item.id+'</td><td><td></td></tr>');
          });
          $('#print').hide();
          $('#show').hide();
          $('#excel').hide();
          $('#sequenceDisplay').show();
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
      // $('#excel').prop("disabled", true);
      // $('#print').prop("disabled", false);
      // $('#show').prop("disabled", false);
      $.ajax({
        type: "GET",
        url: "/excel",
        success: function(data){
          // var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
         data.map(function(item){
            $('#excelBody').append('<tr class= "table table-bordered table-striped"><td>' +item.case+ '</td><td>' +item.FirstName + '</td><td>' +item.LastName+ '</td><td>' +item.CaseAge+ '</td><td>' +item.ChildrenInHousehold+ '</td><td>' +item.AdultsInHousehold+ '</td><td>' +item.SeniorsInHousehold+ '</td><td>' +item.Date+ '</td></tr>');
          });
          $('#print').hide();
          $('#show').hide();
          $('#excel').hide();
          $('#back').show();
          $('#excelValue').show();
          $('#excelResult').show();
          $('#excelPrint').show();
          $('#sequenceDisplay').hide();
          $('#randomData').hide();
        }
      });
    });
    $('#excelPrint').click(function() {
      $('#excelResult').table2csv({
        separator: ',',
        newline: '\n',
        quoteFields: true,
        // excludeColumns: 'th',
        // excludeRows: 'thead tr',
        delivery: 'download',
        filename: 'table.csv'
      });
      $('#excelResult').table2csv('output',{appendTo: '#out'});
      $('#excelPrint').hide();
    });
      $("#tokenNum").click(function(e){
        e.preventDefault();
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
              $('#logout').show();
              // var visitedCount = $("#Visited").val();
               $('#randomnumber').html(`<h2 style="text-align:center;">Hi, you are entered in the list. </h2><h1>Thank You</h1>`);
            }
          });

        });
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
      $('#sequenceDisplay').hide();
      $('#sequenceData').hide();
      $('#back').hide();
      $('#seqBody').empty();
      $('#excelBody').empty();
      $('#randomBody').empty();



     });


});
