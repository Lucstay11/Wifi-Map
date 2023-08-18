var Wifi_Security = ["WPA3","WPA2","WPA","WEP","NONE"];
var boite_ext =[];
var boite_int =[];
var dateNow = new Date().toLocaleDateString('en-CA');
var date_verif = "";
var markerCluster;

function initMap(View){ // display wifi file csv or wifi api 

 const sv = new google.maps.StreetViewService();

    if(tourStops.length<=0){var lat=+53.1156333;var long=+49.1679065;var zoom=1;} // If capture is empty display normal maps!
     else{ var lat=tourStops[tourStops.length-1][0].lat;var long=tourStops[tourStops.length-1][0].lng;var zoom=tourStops.length>300?6:8;} // Else display the last signal captured on the maps
    const Map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: lat, lng: long},
    zoom: zoom,
    styles
    });

  const marker_wifi_protected = {
    url: "img/blue-marker.png",
    size: new google.maps.Size(100, 70),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 0),
  };
  const marker_wifi_open = {
    url: "img/green-marker.png",
    size: new google.maps.Size(100, 70),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 0),
  };
  const marker_wifi_wep = {
    url: "img/red-marker.png",
    size: new google.maps.Size(100, 70),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 0),
  };

   const infoWindow = new google.maps.InfoWindow();

  const panorama = new google.maps.StreetViewPanorama(
    document.getElementById("streetview"),
    {
      //addressControl: false,
      position: { lat: lat, lng: long },
      pov: {
        heading: 34,
        pitch: 10,
      },
      motionTrackingControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      addressControlOptions: {
        position: google.maps.ControlPosition.BOTTOM
        }

    }
  );


function display_marker(){
  if(View==""){View=boxnavapi.style.display=="none"?"csv":"api";}
 if(View=="csv"){
  tourStops.forEach(([position,SSID,MAC_ADRESS,SIGNAL,CHANNEL,SECURITY,WPS,DATE], i) => {
      if(i==tourStops.length-1){ var last="Last WI-FI captued!";}
              else{var last="";}
      var icon_marker=SECURITY=="NONE"?marker_wifi_open:marker_wifi_protected;
      if(SECURITY=="WEP"){icon_marker=marker_wifi_wep;}
      var icon_security=SECURITY=="NONE"?"open-wifi.png":"lock.png";
          date_verif=wifidate.value==""?dateNow:wifidate.value;
    if(Wifi_Security.includes(SECURITY)){
       if(DATE.split(" ")[0]<=date_verif){
        if(SECURITY=="NONE"){SECURITY="Open"}
      const markersignal_map = new google.maps.Marker({
      position,
      Map: Map,
      icon: icon_marker,
      animation: google.maps.Animation.DROP,
      title:`
      <div style="height:200px;width:200px;">
      <p class="text-warning" style="font-size:0.9em;text-align:center;">${last}</p>
      <p style="text-align:center;color:black;font-weight:900;"><img height="30" src="img/wifi-gauge.png"> ${SSID}</p>
         <p style="text-align:center;">${MAC_ADRESS.toUpperCase()}</p>
        <p style="font-size:0.7em;text-align:center;"><img height="20" src="img/infrastructure.png"></p>
        <hr>
      <div style="display:flex;justify-content:space-between;">
      <p><img height="30" src="img/${icon_security}">${SECURITY}</p>
      <p style="color:black;"><img height="20" src="img/level.gif">${SIGNAL}</p>
      <p><img height="20" src="img/channel.png"> ${CHANNEL}</p>
      </div><br>
        <div style="display:flex;">
         <p><img height="20" src="img/active.png">${WPS}</p>
        </div>
        <hr>
      <p style="text-align:center;"><img height="20" src="img/calender.png">Capture Date</p>
        <p style="text-align:center;">${DATE}</p>
      </div>
      `,
       label: {
        text: `${SSID}`,
        color: 'white',
        fontSize: "10px"
       },
      optimized: false,
    });

    boite_ext.push(markersignal_map);

   markersignal_map.addListener("click", (event) => {
       infoWindow.close();
       Map.setZoom(20);
       Map.setCenter(markersignal_map.getPosition());
      infoWindow.setContent(markersignal_map.getTitle());
      infoWindow.open(markersignal_map.getMap(), markersignal_map);
    });
  }  
 }
});

tourStops.forEach(([position,SSID,MAC_ADRESS,SIGNAL,CHANNEL,SECURITY,WPS,DATE], i) => {
      if(i==tourStops.length-1){ var last="Last WI-FI captued!";}
        else{var last="";}
      var icon_marker=SECURITY=="None"?marker_wifi_open:marker_wifi_protected;
      if(SECURITY=="WEP"){icon_marker=marker_wifi_wep;}
      var icon_security=SECURITY=="None"?"open-wifi.png":"lock.png";
      SECURITY=SECURITY=="None"?"Open":SECURITY;

      
    if(Wifi_Security.includes(SECURITY)){
    const markersignal_map = new google.maps.Marker({
      position,
      Map: panorama,
      icon: icon_marker,
      animation: google.maps.Animation.DROP,
      title:`
      <div style="height:150px;width:200px;">
      <p class="text-warning" style="font-size:0.9em;text-align:center;">${last}</p>
      <p style="text-align:center;color:black;font-weight:900;"><img height="30" src="img/wifi-gauge.png"> ${SSID}</p>
         <p style="text-align:center;">${MAC_ADRESS.toUpperCase()}</p>
        <p style="font-size:0.7em;text-align:center;"><img height="20" src="img/infrastructure.png"></p>
        <hr>
      <div style="display:flex;justify-content:space-between;">
      <p><img height="30" src="img/${icon_security}">${SECURITY}</p>
      <p style="color:black;"><img height="20" src="img/level.gif">${SIGNAL}</p>
      <p><img height="20" src="img/channel.png"> ${CHANNEL}</p>
      </div><br>
        <div style="display:flex;">
         <p><img height="20" src="img/active.png">${WPS}</p>
        </div>
        <hr>
      <p style="text-align:center;"><img height="20" src="img/calender.png">Capture Date</p>
        <p style="text-align:center;">${DATE}</p>
      </div>
      `,
       label: {
        text: `${SSID}`,
        color: 'white',
        fontSize: "10px"
       },
      optimized: false,
    });
       
    boite_int.push(markersignal_map);
    //Map.setStreetView(panorama);

   markersignal_map.addListener("click", (event) => {
       infoWindow.close();
       Map.setZoom(18);
       Map.setCenter(markersignal_map.getPosition());
       infoWindow.setContent(markersignal_map.getTitle());
       infoWindow.open(markersignal_map.getMap(), markersignal_map);

    });
    }
  });

}else{
  tourStops.forEach(([position,SSID,MAC_ADRESS,CHANNEL,SECURITY,FIRSTTIME,LASTTIME,LASTUPDT,ADRESS], i) => {
    var icon_marker=SECURITY=="NONE"?marker_wifi_open:marker_wifi_protected;
    if(SECURITY=="WEP"){icon_marker=marker_wifi_wep;}
    var icon_security=SECURITY=="NONE"?"open-wifi.png":"lock.png";
    date_verif=date_verif==""?dateNow:date_verif;

  if(Wifi_Security.includes(SECURITY)){
     if(true){
      if(SECURITY=="NONE"){SECURITY="Open"}
    const markersignal_map = new google.maps.Marker({
    position,
    Map: Map,
    icon: icon_marker,
    animation: google.maps.Animation.DROP,
    title:`
    <div style="height:200px;width:200px;">
    <p class="text-warning" style="font-size:0.9em;text-align:center;">Last seen ${LASTTIME}</p>
    <p style="text-align:center;color:black;font-weight:900;"><img height="30" src="img/wifi-gauge.png"> ${SSID}</p>
       <p style="text-align:center;">${MAC_ADRESS}</p>
      <p style="font-size:0.7em;text-align:center;"><img height="20" src="img/infrastructure.png"></p>
      <hr>
    <div style="display:flex;justify-content:space-between;">
    <p><img height="30" src="img/${icon_security}">${SECURITY}</p>
    <p><img height="20" src="img/channel.png"> ${CHANNEL}</p>
    <p style="color:black;"><img height="20" src="img/level.gif"></p>
    </div><br>
      <div style="display:flex;">
       <p><img height="20" src="img/house.png">${ADRESS}</p>
      </div>
      <hr>
    <p style="text-align:center;"><img height="20" src="img/calender.png">Capture Date</p>
      <p style="text-align:center;"><span class="text-warning">First time:</span> ${FIRSTTIME}</p>
      <p style="text-align:center;"><span class="text-warning">Last update:</span> ${LASTUPDT}</p>
    </div>
    `,
     label: {
      text: `${SSID}`,
      color: 'white',
      fontSize: "10px"
     },
    optimized: false,
  });

  boite_ext.push(markersignal_map);

 markersignal_map.addListener("click", (event) => {
     infoWindow.close();
     Map.setZoom(20);
     Map.setCenter(markersignal_map.getPosition());
    infoWindow.setContent(markersignal_map.getTitle());
    infoWindow.open(markersignal_map.getMap(), markersignal_map);
  });
}  
}
});

tourStops.forEach(([position,SSID,MAC_ADRESS,CHANNEL,SECURITY,FIRSTTIME,LASTTIME,LASTUPDT,ADRESS], i) => {
    var icon_marker=SECURITY=="NONE"?marker_wifi_open:marker_wifi_protected;
    if(SECURITY=="WEP"){icon_marker=marker_wifi_wep;}
    var icon_security=SECURITY=="None"?"open-wifi.png":"lock.png";
    SECURITY=SECURITY=="NONE"?"Open":SECURITY;

    
  if(Wifi_Security.includes(SECURITY)){
  const markersignal_map = new google.maps.Marker({
    position,
    Map: panorama,
    icon: icon_marker,
    animation: google.maps.Animation.DROP,
    title:`
    <div style="height:200px;width:200px;">
    <p class="text-warning" style="font-size:0.9em;text-align:center;"> Last seen ${LASTTIME}</p>
    <p style="text-align:center;color:black;font-weight:900;"><img height="30" src="img/wifi-gauge.png"> ${SSID}</p>
       <p style="text-align:center;">${MAC_ADRESS}</p>
      <p style="font-size:0.7em;text-align:center;"><img height="20" src="img/infrastructure.png"></p>
      <hr>
    <div style="display:flex;justify-content:space-between;">
    <p><img height="30" src="img/${icon_security}">${SECURITY}</p>
    <p><img height="20" src="img/channel.png"> ${CHANNEL}</p>
    <p style="color:black;"><img height="20" src="img/level.gif"></p>
    </div><br>
      <div style="display:flex;">
       <p><img height="20" src="img/house.png">${ADRESS}</p>
      </div>
      <hr>
    <p style="text-align:center;"><img height="20" src="img/calender.png">Capture Date</p>
      <p style="text-align:center;"><span class="text-warning">First time:</span> ${FIRSTTIME}</p>
      <p style="text-align:center;"><span class="text-warning">Last time:</span> ${LASTUPDT}</p>
    </div>
    `,
     label: {
      text: `${SSID}`,
      color: 'white',
      fontSize: "10px"
     },
    optimized: false,
  });
     
  boite_int.push(markersignal_map);
//Map.setStreetView(panorama);

 markersignal_map.addListener("click", (event) => {
     infoWindow.close();
     Map.setZoom(18);
     Map.setCenter(markersignal_map.getPosition());
     infoWindow.setContent(markersignal_map.getTitle());
     infoWindow.open(markersignal_map.getMap(), markersignal_map);

  });
  }
});

 if(filterdbcountry.value==""){
 Map.setZoom(2);
 }else{
 Map.setZoom(6);
 }
}
markerCluster = new MarkerClusterer(Map, boite_ext,{maxZoom: 18,gridSize: 20,imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

}
display_marker();

Btnviewallmarker.addEventListener("click",ViewAllMarkers);
Btnhideallmarker.addEventListener("click",HideAllMarkers);

 function ViewAllMarkers(){
  for (let i in boite_ext) {
    boite_ext[i].setMap(Map);
  }
  markerCluster.addMarkers(boite_ext);

  for (let i = 0; i < boite_ext.length; i++) {
    boite_ext[i].setMap(panorama);
  }
  Btnviewallmarker.style.display="none";
  Btnhideallmarker.style.display="block";
}
function HideAllMarkers(){
    for (let i in boite_ext){
      boite_ext[i].setMap(null);
    }
    markerCluster.clearMarkers();
    for (let i = 0; i < boite_int.length; i++) {
      boite_int[i].setMap(null);
    }
  Btnviewallmarker.style.display="block";
  Btnhideallmarker.style.display="none";
}

document.querySelectorAll(".view-security").forEach(box => {
  box.addEventListener('click', (etat) => {
      switch (box.textContent) {
          case "WPA3":
              if (etat.target.style.textDecoration !== "none") {
                  Wifi_Security = Wifi_Security.filter((element) => element !== "WPA3");
              } else {
                  Wifi_Security.push("WPA3");
              }
              boite_ext=[];
              HideAllMarkers();
              display_marker();
              break;
          case "WPA2":
              if (etat.target.style.textDecoration !== "none") {
                  Wifi_Security = Wifi_Security.filter((element) => element !== "WPA2");
              } else {
                  Wifi_Security.push("WPA2");
              }
              boite_ext=[];
              HideAllMarkers();
              display_marker();
              break;
          case "WPA":
              if (etat.target.style.textDecoration !== "none") {
                  Wifi_Security = Wifi_Security.filter((element) => element !== "WPA");
              } else {
                  Wifi_Security.push("WPA");
              }
              boite_ext=[];
              HideAllMarkers();
              display_marker();
              break;
          case "WEP":
              if (etat.target.style.textDecoration !== "none") {
                  Wifi_Security = Wifi_Security.filter((element) => element !== "WEP");
              } else {
                  Wifi_Security.push("WEP");
              }
              boite_ext=[];
              HideAllMarkers();
              display_marker();
              break;
          case "OPEN":
              if (etat.target.style.textDecoration !== "none") {
                  Wifi_Security = Wifi_Security.filter((element) => element !== "NONE");
              } else {
                  Wifi_Security.push("NONE");
              }
              boite_ext=[];
              HideAllMarkers();
              display_marker();
              break;
      }
  });
});

setTimeout(()=>{
google.maps.event.trigger(Map, 'resize');
},5000)

wifidate.addEventListener('change',(etat)=>{
  boite_ext=[];
  HideAllMarkers();
  display_marker();
 })

 //TODO REGLER PROBLEME DE NaN
 btngoposition = document.querySelectorAll(".goposition");
 btngoposition.forEach(markers=>{
   markers.addEventListener("click", (e) => {
     let lat = e.target.value;
     let long = e.target.name;

     infoWindow.close();
     Map.setZoom(20);
     map.style.border = "solid 1px lightgreen";
     const newPosition = new google.maps.LatLng({ lat: +lat, lng: +long });
     panorama.setPosition(newPosition);
     Map.setCenter({ lat: +lat, lng: +long });
     setTimeout(() => {
       map.style.border = "solid 0px lightgreen";
     }, 1000);
   });
   
 })

 
Map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(locationBtn);
locationBtn.addEventListener("click", () => {
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        Map.setCenter(pos);
        infoWindow.setPosition(pos);
        infoWindow.setContent('<div class="bg-warning"><img height="40" src="img/position.png"></div>');
        infoWindow.open(Map);
        //panorama.setPosition(pos);
        //Map.setStreetView(panorama);
        Map.setZoom(19);
       
      },
      () => {
        handleLocationError(true, infoWindow, Map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, Map.getCenter());
  }
});
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
infoWindow.setPosition(pos);
infoWindow.setContent(
  browserHasGeolocation
    ? "Error: The Geolocation service failed."
    : "Error: Your browser doesn't support geolocation."
);
infoWindow.open(Map);

}

selectcsv.addEventListener('change',(etat)=>{
  if(etat.target.value!==tourStops[0][0].name_file){
   loadwififile.style.display="block";
   wifi=[];
   streetview.style.display="none";
   map.style.height="80%";
   etatsview.textContent="Active Street View";
   map.style.border="solid 0px green";
   boxwifidb.innerHTML="";
   nb_capture.textContent="";
   searchwifi.value="";
   wifinbfound.textContent="";
   socket.emit("change_csv",etat.target.value);
  }
 })

//Control street view panel
    function street_view(){
        if(streetview.style.display=="block"){
           streetview.style.display="none";
           map.style.height="80%";
           etatsview.textContent="Active Street View";
           map.style.border="solid 0px green";
          }else{
          streetview.style.display="block";
          map.style.height="60%";
          etatsview.textContent="Disable Street View";
          map.style.border="solid 2px lightgreen";
          }
    }

$(document).ready(function () {
    $('#example').DataTable();
  });

//Important: For the proper functioning I have to put all the interactive functions of the Map in the main function initMap()