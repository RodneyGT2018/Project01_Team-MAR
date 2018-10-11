
//initialize the map on the screen before document ready
var map;
var longlat;
var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8
  })
};


//initialize firebase




$(document).ready(function () {

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

  //setup the Connections Child Ref
  var connectionsRef = database.ref("/connections");
  var connectedRef = database.ref(".info/connected");
  connectedRef.on("value", function (snap) {
    if (snap.val()) {
      var con = connectionsRef.push(true);
      con.onDisconnect().remove();
    }
  });

  //This will be the function that kicks off once an event host has filled out the initial event page.  The eventAdmin object is a place holder and will need to be constructed from user input
  $('#submit-finish-btn').on('click', function () {


    var getHostName = $("#host-name").val().trim();
    var getHostEmail = $("#host-email").val().trim();
    var getHostPhone = $("#host-phone").val().trim();
    var getEventName = $("#event-name").val().trim();
    var getEventDate = $("#event-date").val().trim();
    var getEventTime = $("#event-time").val().trim();
    var getEventAddress = $("#event-address").val().trim();
    var itemsNeeded = $("#items-needed-1").val().trim();

    var initialRequirement = [];
    $("#step-4 .row").each(function (item) {
      var name = $(this).find('.item-name').val().trim();
      var number = Number($(this).find('.item-number').val());
      initialRequirement.push({
        item: [name, number]
      });
    });

    var eventAdmin = {
      name: getHostName,
      address: getEventAddress,
      eventName: getEventName,
      emailAddress: getHostEmail,
      phoneNum: getHostPhone,
      eventDate: getEventDate,
      eventTime: getEventTime,
      initialRequirement: initialRequirement
    }

    var email = eventAdmin.emailAddress
    var password = 'test1234'

    // if (email.length < 4) {
    //   alert('Please enter an email address.');
    //   return;
    // }
    // if (password.length < 4) {
    //   alert('Please enter a password.');
    //   return;
    // }

    // firebase.auth().onAuthStateChanged(function(user) {
    //   console.log(user.email)

    //   })

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
      // [END_EXCLUDE]
    });

    // var thisPerson = firebase.auth().currentUser
    // thisPerson.updateProfile({
    //   displayName: eventAdmin.name
    // }).then(function() {
    //   console.log('update successful')
    // }).catch(function(error) {
    //   console.log('update fail')
    // });




    console.log(initialRequirement);
    database.ref('/Host').set({
      eventAdmin
    });
<<<<<<< HEAD

  
=======
>>>>>>> origin/master

    var eventGuest = {
      initialRequirement: eventAdmin.initialRequirement,
    }

    //reset count of all items in eventGuest.initialRequirement
    for (var i = 0; i < eventGuest.initialRequirement.length; i++) {
      eventGuest.initialRequirement[i].item[1] = 0
    }

    database.ref('/Guests').set({
      eventGuest

    });
  });




  function captureCurrentUserInfo(snapshot) {

    var thisPerson = firebase.auth().currentUser
    thisPerson.updateProfile({
      displayName: snapshot.eventAdmin.name
    })
    firebase.auth().onAuthStateChanged(function (user) {
      console.log(user.email)
      console.log(user.displayName)



      database.ref('Guests/info').set({
        name: user.displayName,
        email: user.email
      })
    })
  }


  //update the DOM with Event Plan and Host related info and MAP
  database.ref('/Host').on('value', function (snapshot) {


    var doesHostExist = snapshot.val().eventAdmin
    if (doesHostExist === null) {
      return
    } else {

      captureCurrentUserInfo(snapshot.val())


      $('#party-name').text(snapshot.val().eventAdmin.eventName)
      $('#party-date').text(snapshot.val().eventAdmin.eventDate)
      $('#party-time').text(snapshot.val().eventAdmin.eventTime)
      $('#party-date').text(snapshot.val().eventAdmin.eventDate)
      $('#event-location').text(snapshot.val().eventAdmin.address)
      //update the DOM with required items needed at the party
      $('.responsive-table-body-req').empty()
      for (var i = 0; i < snapshot.val().eventAdmin.initialRequirement.length; i++) {

        if (snapshot.val().eventAdmin.initialRequirement[i].item[1] > 0) {
          $('.responsive-table-body-req').append(
            `
            <tr>
              <td>${snapshot.val().eventAdmin.initialRequirement[i].item[0]}</td>
              <td>${snapshot.val().eventAdmin.initialRequirement[i].item[1]}</td>
              <td> <a class="btn-floating btn-small waves-effect waves-light green"><i class="material-icons req-items" Data-orgitem=${i}>add</i></a></td>
            </tr>  

          `
          )
        }
      }
      var temp = snapshot.val().eventAdmin.amendedRequirement
      if (typeof temp !== 'undefined') {
        for (var j = 0; j < temp.length; j++) {
          if (snapshot.val().eventAdmin.amendedRequirement[j].hostAddedLineItemQty > 0) {
            $('.responsive-table-body-req').append(
              `
            <tr>
              <td>${snapshot.val().eventAdmin.amendedRequirement[j].hostAddedLineItem}</td>
              <td>${snapshot.val().eventAdmin.amendedRequirement[j].hostAddedLineItemQty}</td>
              <td> <a class="btn-floating btn-small waves-effect waves-light green"><i class="material-icons req-items" Data-amenitem=${j}>add</i></a></td>
            </tr>  

          `
            )
          }
          i++
        }
      }




      //update/zoom map on to new event plan address 
      var address = snapshot.val().eventAdmin.address
      while (address.includes(' ')) {
        address = address.replace(' ', '+')
      }
      var queryURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyBbMW1zoS4wDZPiww8JT1EDrUr0jfbeqw0'
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
  }, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
  })




  //update DOM with Guest related info
  database.ref('/Guests').on('value', function (snapshotGuests) {
    $('.responsive-table-body-res').empty()



    var doesGuestsExist = snapshotGuests.val().eventGuest.initialRequirement
    console.log(doesGuestsExist)

    if (doesGuestsExist === null) {
      return
    }
    else {
      for (var i = 0; i < snapshotGuests.val().eventGuest.initialRequirement.length; i++) {
        if (snapshotGuests.val().eventGuest.initialRequirement[i].item[1] > 0) {
          $('.responsive-table-body-res').append(
            `
            <tr>
              <td>${snapshotGuests.val().eventGuest.initialRequirement[i].item[0]} </td>
              <td>${snapshotGuests.val().eventGuest.initialRequirement[i].item[1]}</td>      
           </tr>  

            `
          )
        }
      }
    }

    temp = snapshotGuests.val().eventGuest.amendedRequirement
    console.log(temp)
    if (typeof temp !== 'undefined') {
      for (var i = 0; i < snapshotGuests.val().eventGuest.amendedRequirement.length; i++) {
        if (snapshotGuests.val().eventGuest.amendedRequirement[i].hostAddedLineItemQty > 0) {
          $('.responsive-table-body-res').append(
            `
            <tr>
                <td>${snapshotGuests.val().eventGuest.amendedRequirement[i].hostAddedLineItem} </td>
                <td>${snapshotGuests.val().eventGuest.amendedRequirement[i].hostAddedLineItemQty}</td>
           </tr>  

            `
          )
        }
      }
    }
  }, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
  })







  $('.responsive-table-body-req').on('click', '.req-items', function () {
    var tempDataVal = $(this).data('orgitem')
    console.log(tempDataVal)
    if (typeof tempDataVal !== 'undefined') {
      return database.ref('/Host').once('value').then(function (snapshot) {
        console.log(snapshot.val())
        var newQty = snapshot.val().eventAdmin.initialRequirement[tempDataVal].item[1] - 1
        //updating quantity of items still needed on the "to do" side after choice made by user
        database.ref('Host/eventAdmin/initialRequirement/' + tempDataVal + '/item').update({
          1: newQty
        })
        debugger
        return database.ref('Guests').once('value').then(function (snapshotGuest) {
          var newQtyGuest = snapshotGuest.val().eventGuest.initialRequirement[tempDataVal].item[1] + 1
          
<<<<<<< HEAD
//         }
//       }
//     })


//     //update/zoom map on to new event plan address 
//     var address = snapshot.val().address
//     while (address.includes(' ')) {
//       address = address.replace(' ', '+')
//     }
//     var queryURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyBbMW1zoS4wDZPiww8JT1EDrUr0jfbeqw0'
//     $.ajax({
//       url: queryURL,
//       method: 'GET'
//     }).then(function (response) {
//       longlat = response.results[0].geometry.location
//       map.setZoom(12);
//       map.setCenter(longlat)
//       var marker = new google.maps.Marker({
//         position: longlat,
//         map: map,
//         title: 'Party Destination!!!',
//         icon: image
//       });
//     });
//   })



//   $('.todo-block').on('click', '.org-req-items', function () {
//     var tempDataVal = $(this).data('item')
//     // tempDataVal = tempDataVal.parseFloat()
//     console.log(tempDataVal)

//     return database.ref('/Host').once('value').then(function (snapshot) {
//       console.log(snapshot.val())
//       var newQty = snapshot.val().eventAdmin.initialRequirement[tempDataVal].item[1] - 1
//       //updating quantity of items still needed on the "to do" side after choice made by user
//       database.ref('Host/eventAdmin/initialRequirement/' + tempDataVal + '/item').update({
//         1: newQty
//       })
//       // function to show subtracted items to bring in zone 4.  Each click above subtracts from pre-defined total and shows the remaining items to bring in the database and To-Do list area
//       database.ref('/Host').on('child_added', function (snapshot) {
//         $('.todo-block').empty()
//         for (var i = 0; i < snapshot.val().initialRequirement.length; i++) {
//           if (snapshot.val().initialRequirement[i].item[1] > 0) {
//             $('.todo-block').append(
//               `
//                 <p class="org-req-items" Data-item=${i} >${snapshot.val().initialRequirement[i].item[0]}      QTY: ${snapshot.val().initialRequirement[i].item[1]}</p>
//               `
//             )
//           }
//         }
//       })


//       return database.ref('Guests').once('value').then(function (snapshotGuest) {
//         var newQtyGuest = snapshotGuest.val().eventGuest.initialRequirement[tempDataVal].item[1] + 1
//         //updating quantity of items still needed on the "to do" side after choice made by user
//         database.ref('Guests/eventGuest/initialRequirement/' + tempDataVal + '/item').update({
//           1: newQtyGuest
//         })
//         database.ref('/Guests').on('value', function (snapshotGuests) {
//           $('.assigned-block').empty()
//           for (var i = 0; i < snapshotGuest.val().eventGuest.initialRequirement.length; i++) {

//             if (snapshotGuests.val().eventGuest.initialRequirement[i].item[1] > 0) {
//               $('.assigned-block').append(
//                 `
//                   <p class="org-req-items-assigned" Data-item=${i} >${snapshotGuests.val().eventGuest.initialRequirement[i].item[0]}      QTY: ${snapshotGuests.val().eventGuest.initialRequirement[i].item[1]}</p>
//                 `
//               )
//             }
//           }
//         })
//       })


//     })
//   })




// //ITEMS BEING ADDED BY USERS NEEDS WORK.  ITEM/QTY NEED TO BE CAPTURED AND PUSHED INTO THE GUEST OBJECT UNDER A NEW CHILD CALLED GUEST ADVISED (or something of that nature to distinguish between what was asked by the party host and what the guest decided to bring on their own)


//   //Zone-4 "to do list" (submit button)
//   $('#add-to-do-items').on('click', function () {
//     console.log('Guest is trying to volunteer a new item to bring ')
//     //Capture input item name 
//     var guestAddedLineItem = $('#to-do-input').val().trim()
//     //capture input Qty
//     var guestAddedLineItemQty = 5
     
//     return database.ref('Guests/guestAdded').once('value').then(function(snapshotGuestsAdded){
     
//     var numExistingRecords = snapshotGuestsAdded.numChildren()
//     console.log(numExistingRecords)
   
    

//     if(typeof numExistingRecords === 'undefined' ){
//         numExistingRecords = 0
//         database.ref('Guests/guestAdded/'+ numExistingRecords).set({
//           guestAddedLineItem,
//           guestAddedLineItemQty
//         })
//     }else {
//         database.ref('Guests/guestAdded/'+ numExistingRecords).set({
//           guestAddedLineItem,
//           guestAddedLineItemQty
//         })
           
//     }
//     })
    
 
//   })


//   // database.ref('/toDoList').on('child_added', function (snapshot) {
//   //   dataTodoCounter = snapshot.numChildren() + 1
//   //   console.log('in the database update ref')
//   //   if (snapshot.val() === null) {
//   //     console.log('it was null')
//   //     return
//   //   } else {
//   //     console.log('made it to else statement')
//   //     console.log(snapshot.val().toDoInstruction)
//   //     $('.todo-block').append('<p class="todoList" Data-todo =' + snapshot.val().toDoId + ' Data-qty=' + snapshot.val().quantityRequiredEst + '> ' + snapshot.val().toDoInstruction + '</p>')
//   //   }
//   // }, function (errorObject) {
//   //   console.log('The Read Failed: ' + errorObject.code)
//   // })

//   //on clicking a task move the to do into zone 5
//   $('.todo-block').on('click', '.todoList', function () {
//     console.log('you clicked a item from to do list')
//     var tempDataVal = $(this).data('todo')
//     var tempHtmlInfo = $(this).html().trim()
//     var quantityAssigned = $(this).data('qty') - 1
//     console.log(quantityAssigned)

//     database.ref('/assigned/' + tempHtmlInfo).set({
//       assignedId: tempDataVal,
//       toDoInstruction: tempHtmlInfo,
//       quantityAssigned
//     })

//     //updating quantity of items still needed on the "to do" side after choice made by user
//     database.ref('toDoList/' + tempHtmlInfo).update({
//       quantityRequiredEst: 1
//     })
//   })


//   database.ref('/assigned').on('child_added', function (snapshot) {
//     dataAssignedCounter = snapshot.numChildren() + 1
//     console.log('in the database assigned Ref')
//     if (snapshot.val() === null) {
//       console.log('it was null')
//       return
//     } else {
//       console.log('made it to else statement')
//       console.log(snapshot.val().toDoInstruction)
//       $('.assigned-block').append('<p class="assigned-tasks" Data-qty = ' + snapshot.val().quantityAssigned + 'Data-assigned =' + snapshot.val().assignedId + '> ' + snapshot.val().toDoInstruction + '</p>')
//     }
//   }, function (errorObject) {
//     console.log('The Read Failed: ' + errorObject.code)
  // })
=======
          // var userObject = {
          //   item: snapshotGuest.val().eventGuest.initialRequirement[tempDataVal].item[0],
          //   Qty: newQtyGuest
          // }
          //updating quantity of items still needed on the "to do" side after choice made by user
          database.ref('Guests/eventGuest/initialRequirement/' + tempDataVal + '/item').update({
            1: newQtyGuest
          })
        })
      })
    }
    else {
      tempDataVal = $(this).data('amenitem')
      return database.ref('/Host').once('value').then(function (snapshot) {
        var newQty = snapshot.val().eventAdmin.amendedRequirement[tempDataVal].hostAddedLineItemQty - 1
        database.ref('Host/eventAdmin/amendedRequirement/' + tempDataVal).update({
          hostAddedLineItemQty: newQty
        })
        debugger
        return database.ref('Guests').once('value').then(function (snapshotGuest) {
          var newQtyGuest = snapshotGuest.val().eventGuest.amendedRequirement[tempDataVal].hostAddedLineItemQty + 1
          // var userObject = {
          //   item: snapshotGuest.val().eventGuest.initialRequirement[tempDataVal].item[0],
          //   Qty: newQtyGuest
          // }
          database.ref('Guests/eventGuest/amendedRequirement/' + tempDataVal).update({
            hostAddedLineItemQty: newQtyGuest
          })
        })
      })
    }
  })



  //Zone-4 Add "to do list" by Host (this is amendment to his/her original list)
  $('#submit-item-name').on('click', function () {
    console.log('Host added a new Item to bring')


    //Capture input item name 
    var hostAddedLineItem = $('#add-item-name').val().trim()
    //clear input field
    $('#to-do-input').val('')
    //capture input Qty
    var hostAddedLineItemQty = $('#add-item-qty').val().trim()
    $('#add-item-qty').val('')

    return database.ref('Host/eventAdmin/amendedRequirement').once('value').then(function (snapshotHostAdded) {

      console.log(snapshotHostAdded)
      var numExistingRecords = snapshotHostAdded.numChildren()
      console.log(numExistingRecords)


      if (typeof numExistingRecords === 'undefined') {
        numExistingRecords = 0
        database.ref('Host/eventAdmin/amendedRequirement/' + numExistingRecords).set({
          hostAddedLineItem,
          hostAddedLineItemQty
        })
        database.ref('Guests/eventGuest/amendedRequirement/' + numExistingRecords).set({
          hostAddedLineItem,
          hostAddedLineItemQty: 0
        })
      } else {
        database.ref('Host/eventAdmin/amendedRequirement/' + numExistingRecords).set({
          hostAddedLineItem,
          hostAddedLineItemQty
        })
        database.ref('Guests/eventGuest/amendedRequirement/' + numExistingRecords).set({
          hostAddedLineItem,
          hostAddedLineItemQty: 0
        })
      }
    })
  })


  // //Flicker Section
  // function JavaScriptFetch() {
  //   var script = document.createElement('script');
  //   script.src = "https://api.flickr.com/services/feeds/photos_public.gne?format=json&tags=" + document.getElementById("search").value;;
  //   document.querySelector('head').appendChild(script);
  // }

  // function jsonFlickrFeed(data) {
  //   var image = "";
  //   data.items.forEach(function (element) {
  //     image += "<img src=\"" + element.media.m + "\"/>";
  //   });

  //   document.getElementById("outputDiv").innerHTML = image;
  // }

  // $("#submit").click(function (e) {
  //   $("#outputDiv").html("");

  // });
>>>>>>> origin/master

});
