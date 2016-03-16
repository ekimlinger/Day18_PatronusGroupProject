$(document).ready(function(){



  console.log("Queen Enema");


});


function personButton(){
  var person={};
  $.each($("#peoples_patronus").serializeArray(), function(i, field){
      person[field.name] = field.value;
    });
    
}
