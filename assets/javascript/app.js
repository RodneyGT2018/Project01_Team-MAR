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
var database = firebase.database()


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

  $(document).ready(function(){
    var i = 0

  //Zone-4 "to do list"
  $('#add-to-do-items').on('click', function() {
    console.log('inside the to do function')
    var newDiv = $('<div>')
    newDiv.attr('data-todo','todo'+[i])
    newDiv.addClass('todoList')
    newDiv.text($('#to-do-input').val().trim())
    $('.todo-block').append(newDiv)
    $('#to-do-input').val('')
    i++
  })

  $('.todo-block').on('click', '.todoList', function(){
    console.log('you clicked a item from to do list')
    var tempDataVal = $(this).data('todo')
    var tempHtmlInfo = $(this).html()
    var newDiv = $('<div>')
    newDiv.attr('data-assigned',tempDataVal)
    newDiv.addClass('assigned-tasks')
    newDiv.text(tempHtmlInfo)
    $('.assigned-block').append(newDiv)
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
