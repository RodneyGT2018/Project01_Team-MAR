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

        



function JavaScriptFetch() {
  var script = document.createElement('script');
  script.src = "https://api.flickr.com/services/feeds/photos_public.gne?format=json&tags=" + document.getElementById("search").value;;
  document.querySelector('head').appendChild(script);
}

function jsonFlickrFeed(data) {
  var image = "";
  data.items.forEach(function (element) {
      image += "<img src=\"" + element.media.m + "\"/>";
  });

  document.getElementById("outputDiv").innerHTML = image;
}

$(document).ready(function () {
  
  $("#submit").click(function (e) {
      $("#outputDiv").html("");

  });
});

