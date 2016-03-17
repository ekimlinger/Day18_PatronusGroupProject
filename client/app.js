var peopleArray = [];
var patronusArray = [];
var peopleAndPatroniArray = [];

$(document).ready(function(){

  $('.person-submit').on('click', personSubmit);
  $('.patronus-submit').on('click', patronusSubmit);
  $('.comboButton').on('click', personPatronusComboSubmit);
});


function personSubmit(event){
  event.preventDefault();
  var person={};
  $.each($("#people-form").serializeArray(), function(i, field){
      person[field.name] = field.value;
    });
    console.log(person);
  $.ajax({
    type:"POST",
    url:"/people",
    data: person,
    success: function(data){
      console.log("germy didnt wear green");
    }
  });
}
function patronusSubmit(event){
  event.preventDefault();
  var patronus={};
  $.each($("#patronus-form").serializeArray(), function(i, field){
      patronus[field.name] = field.value;
    });
    $.ajax({
      type:"POST",
      url:"/patronus",
      data: patronus,
      success: function(data){
        $("body").append("<h2> HI HI HI HI </h2>");
      }
    });

}

function refreshPeople(){
  $.ajax({
    type: "GET",
    url: "/people",
    success: function(data){
        console.log(data);
        displayPeople(data);
    }
  });
}

function refreshPatronus(){
  $.ajax({
    type: "GET",
    url: "/people",
    success: function(data){
        console.log(data);
        displayPeople(data);
    }
  });
}


function personPatronusComboSubmit(){
    $.ajax({
      type:"POST",
      url:"/people",
      data: patronus,
      success: function(){
        console.log("germy's patronus is a pile of poo");
      }
    });

}
