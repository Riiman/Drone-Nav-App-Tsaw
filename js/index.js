var map;
var markers = [];
var infoWindow;

var pathAr = [];


    // map options
    function initMap(){
        var options = {
            zoom:8,
            center: {lat: 28.7041, lng: 77.1025} 
        }
        // new map created
        map = new 
        google.maps.Map(document.getElementById('map'), options);
        
        infoWindow = new google.maps.InfoWindow();
        

        //var deleteMenu = new DeleteMenu();

        // poly = new google.maps.Polyline({
        //     strokeColor: '#000000',
        //     strokeOpacity: 1.0,
        //     strokeWeight: 3
        //   });
        

        // searchStoresFn();
        showDronesMarker(drones);
        
    
    }

    function clearLocations() {
        infoWindow.close();
        for(var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers.length = 0;
    }


// function updateDroneStatus(latlng, markers){
//     //    changing the lat lng of the existing control
//     document.querySelector('#change-loaction-btn').addEventListener('click', function(){
        
//         var latlng = new google.maps.LatLng(28.7041, 76.2231);
//         marker.setPosition(latlng);
//         clearLocations();
//         showDronesMarker();
//     });


// }

function showDronesMarker(drones) {
    var bounds = new google.maps.LatLngBounds(); //zooms out the map accordingly 
    for(var [index, drone] of drones.entries()) {
        var droneId = drone['id'];
        var name = drone['name'];
        var location = drone['locationName'];
        var accuracy = drone['GPS-accuracy'];
        var signalStrength = drone['signalStrength'];
        var batteryLevel = drone['batteryLevel'];
        var latlng = new google.maps.LatLng(
            drone['coordinates']['latitude'],
            drone['coordinates']['longitude']
        );
        bounds.extend(latlng);
        createMarker(latlng, droneId, location, name, accuracy, signalStrength,  batteryLevel, index+1);

    }
    map.fitBounds(bounds);

}


function createMarker(latlng, droneId, location, name, accuracy, signalStrength,  batteryLevel, index){
    var html = `<div class="drone-info-window">
                    <div class="drone-name">
                        ${name}
                    </div>

                    <div class="drone-id">
                        <div class="icon">
                            <i class="fas fa-id-card"></i>  
                        </div>
                        ${droneId}
                    </div>

                    <div class="drone-battery">
                        <div class="icon">    
                            <i class="fas fa-battery-three-quarters"></i>  
                        </div>    
                        ${batteryLevel}%
                   </div>
                </div>`;
    
    var marker = new google.maps.Marker({
        map:map,
        position:latlng,
        label: index.toString(),
        icon: 'https://i.imgur.com/v67B4tD.png'
    });
    
    markers.push(marker);
    console.log(marker.label);

    google.maps.event.addListener(marker , 'mouseover', function(){
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
    google.maps.event.addListener(marker , 'mouseout', function(){
        infoWindow.close();
    });

    google.maps.event.addListener(marker , 'click', function(){
        var content = `DroneID: ${droneId}<br>
                       Drone Name: ${name}<br>
                       Battery Level: ${batteryLevel}<br>
                       GPS Accuracy: ${accuracy}<br>
                       Signal Strength: ${signalStrength}<br>`;
        document.querySelector('.drone-static-info').innerHTML=content;
        document.querySelector('.drone-controller').style.display='flex';

    //  


         //close button for closing the contol panel
                document.querySelector('#close-control-btn').addEventListener('click', closeController);
            
                
                var flightPath;
                
                var listener1;
                var interval = null;
                
                document.querySelector('#add-path-btn').onclick = function () {
                    var path = [];
                    path.push(latlng);
                    let i = 2;

                    
                      listener1 = map.addListener('click', function(mapsMouseEvent) {
                            //Get the lat lng of the click event 
                        path.push(mapsMouseEvent.latLng);
                        
                        interval = setInterval(function () {        
                            var vertex = new google.maps.Marker({
                                map:map,
                                position: mapsMouseEvent.latLng,
                                
                            });
                    
                            flightPath = new google.maps.Polyline({
                                path: path,
                                geodesic: true,
                                strokeColor: '#0000FF',
                                strokeOpacity: 1.0,
                                strokeWeight: 2
                                });
                            
                            flightPath.setMap(map);
                              i = i+1;  
                            });
                            
                          console.log(i);  
                        }, 10);
                        
                        
                        pathAr.push(
                            {
                                Id: droneId,
                                pathArray: path      
                            }   
                        );

                };

                document.querySelector('#terminate-path-btn').onclick = function () {
                    
                    google.maps.event.clearInstanceListeners(map);
                    document.querySelector('.drone-controller').style.display='None';
                    clearInterval(interval);
                    alert("Path successfully added for drone");
                    console.log(pathAr);
                    
                };




                // document.getElementById('#delete-vertex-btn').onclick = function() {
                    
                    
                //     google.maps.event.addListener(flightPath, 'rightclick', function(e) {
                //         // Check if click was on a vertex control point
                //         if (e.vertex == undefined) {
                //           return;
                //         }
                //         deleteMenu.open(map, flightPath.getPath(), e.vertex);
                //       });
                // };

                
    });
}






function closeController(){
    document.querySelector('.drone-controller').style.display='None';
}

