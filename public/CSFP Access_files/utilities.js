var getRandomString = function(e){
  var text = "";
  var possible = "0123456789";

  for (var i = 0; i < 2; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
    return text;

};
// var seq = "";
// for (var i = visitedCount; i > visitedCount;i++){
//   seq += seq+1;
// }
// var  printPressButton = function(e){
//   var printPress = false;
//   if ($(#'print') == OnClick){
//     printPress = true;
//   }
//   else{
//     printPress =false;
//   }
//
// };
