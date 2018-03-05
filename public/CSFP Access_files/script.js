$(document).ready(function(){
  $('#body').load('views/main.html');

  window.updatePrintStatus = function () {
    $.get('/updatePrintStatus', function(data,status){
      console.log('print status updated');
    });
  }


  window.showRandomData = function() {
    $.ajax({
      type: "GET",
      url: '/printRandom',
      success: function(data){
        var date = new Date().toString().slice(0,15);
        var sortData = _.sortBy(data, 'RandomNumcol');
        sortData.map(function(item){
          var isColdOrderChecked = (item.ColdOrder === 'true') ? 'checked' : '';
          var isGroceryChecked = (item.grocery === 'true') ? 'checked' : '';

          $('#randomBody').append(`<tr class= "table table-bordered table-striped"><td> ${item.FirstName} </td><td> ${item.LastName} </td><td> ${item.ChildrenInHousehold} </td><td> ${item.AdultsInHousehold} </td><td> ${item.SeniorsInHousehold} </td><td> ${item.ChildrenInHousehold+item.AdultsInHousehold+item.SeniorsInHousehold} </td><td> ${item.Date} </td><td> ${item.RandomNumcol}
          </td><td><input type="checkbox" data-id="${item.RandomNumcol}" name="coldOrder" ${isColdOrderChecked} />
          </td><td><input type="checkbox" data-id="${item.RandomNumcol}" name="grocery" ${isGroceryChecked} /> </td></tr>`)
        });
     }
   });
  }

  window.showSequenceData = function () {
    $.ajax({
      type: "GET",
      url: "/printSequence",
      success: function(data){
        var date = new Date().toString().slice(0, 15);
        var sortData = _.sortBy(data, 'id');
        sortData.map(function(item){
          var isColdOrderChecked = (item.ColdOrder === 'true') ? 'checked' : '';
          var isGroceryChecked = (item.grocery === 'true') ? 'checked' : '';

          $('#seqBody').append(`<tr class="table table-bordered table-striped"><td> ${item.FirstName} </td><td> ${item.LastName} </td><td> ${item.ChildrenInHousehold} </td><td> ${item.AdultsInHousehold} </td><td> ${item.SeniorsInHousehold} </td><td>  ${item.ChildrenInHousehold+item.AdultsInHousehold+item.SeniorsInHousehold} </td><td> ${item.Date} </td><td> ${item.id} </td><td><input type="checkbox" data-id="${item.id}" name="coldOrder" ${isColdOrderChecked} /> </td><td><input type="checkbox" data-id="${item.id}" name= "grocery" ${isGroceryChecked} /> </td></tr>`)

        });
      }
    });
  }

  window.goBack = function () {
    $('#body').load('views/admin/admin.html', function () {
      $('#show').show();
      $('#excel').show();
      $('#manualData').show();
    });
  }

});
