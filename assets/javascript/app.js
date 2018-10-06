



//initialize the map on the screen 
var map;
var longlat;
var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
var address = '300 North Point PKWY, Alpharetta, GA'
var queryURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyBbMW1zoS4wDZPiww8JT1EDrUr0jfbeqw0'
while (address.includes(' ')) {
  address = address.replace(' ', '+')
}
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8
  })
  map.setCenter({ lat: 34.0848, lng: -84.2559 })
  map.setZoom(15)
  var myLatLng = { lat: 34.0848, lng: -84.2559 }


  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function (response) {
    longlat = response.results[0].geometry.location
    map.setZoom(12);
    map.setCenter(longlat)
    var marker = new google.maps.Marker({
      position: longlat,
      map: map,
      title: 'Party Destination!!!',
      icon: image
    });
  });

}






$(document).ready(function () {


  //initialize firebase
  var config = {
    apiKey: "AIzaSyCfxrNFR0IkXIzWEPrkJVR5UX0MGrqteL0",
    authDomain: "mikesproject-bd0c2.firebaseapp.com",
    databaseURL: "https://mikesproject-bd0c2.firebaseio.com",
    projectId: "mikesproject-bd0c2",
    storageBucket: "mikesproject-bd0c2.appspot.com",
    messagingSenderId: "911450662789"
  };
  firebase.initializeApp(config);

  //define global variables 
  var database = firebase.database()
  var dataTodoCounter = 0;
  var dataAssignedCounter = 0;



  //setup the Connections Child Ref
  var connectionsRef = database.ref("/connections");
  var connectedRef = database.ref(".info/connected");
  connectedRef.on("value", function (snap) {
    if (snap.val()) {
      var con = connectionsRef.push(true);
      con.onDisconnect().remove();
    }
  });






  //Zone-4 "to do list"
  $('#add-to-do-items').on('click', function () {
    console.log('inside the to do function')
    var toDoId = 'todo' + dataTodoCounter
    var toDoInstruction = $('#to-do-input').val().trim()
    $('#to-do-input').val('')
    database.ref('/toDoList').push({
      toDoId,
      toDoInstruction,
      dataTodoCounter
    })
  })

    database.ref('/toDoList').on('child_added', function (snapshot) {
      dataTodoCounter = snapshot.numChildren() + 1
      console.log('in the database update ref')
      if (snapshot.val() === null) {
        console.log('it was null')
        return
      } else {
        console.log('made it to else statement')
        console.log(snapshot.val().toDoInstruction)
        $('.todo-block').append('<p class="todoList" Data-todo =' + snapshot.val().toDoId + '> ' + snapshot.val().toDoInstruction + '</p>')
      }
    }, function (errorObject) {
      console.log('The Read Failed: ' + errorObject.code)
    })





  //on clicking a task move the to do into zone 5
  $('.todo-block').on('click', '.todoList', function () {
    console.log('you clicked a item from to do list')
    var tempDataVal = $(this).data('todo')
    var tempHtmlInfo = $(this).html()
    database.ref('/assigned').push({
      assignedId: tempDataVal,
      toDoInstruction: tempHtmlInfo,
      dataAssignedCounter
    })
  })

   $("#reset").click(function (e) {
            location.reload();
        });

  $("#submit").click(function (e) {
      $("#outputDiv").html("");
      var flickerAPI = "https://api.flickr.com/services/feeds/photos_public.gne?format=json&tags=" + $("#search").val();
      $.ajax({
          url: flickerAPI,
          dataType: "jsonp", // jsonp
          jsonpCallback: 'jsonFlickrFeed', // add this property
          success: function (result, status, xhr) {
              $.each(result.items, function (i, item) {
                  $("<img>").attr("src", item.media.m).appendTo("#outputDiv");
                  if (i === 10) {
                      return false;
                  }
              });
          },
          error: function (xhr, status, error) {
              console.log(xhr)
              $("#outputDiv").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
          }
      });
      
    });
})

