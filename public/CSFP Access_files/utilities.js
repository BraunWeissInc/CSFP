var getRandomString = function(e){
  var text = "";
  var possible = "0123456789";

  for (var i = 0; i < 2; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
    return text;

};
