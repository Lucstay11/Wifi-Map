var tourStops = [];
var wifi = [];
var WPA3=0;
var WPA2=0;
var WPA=0;
var WEP=0;
var OPEN=0;


socket.on("nb_live",(nb)=>{
   nb_live.textContent=nb;
})
   
socket.on("list_wifi_file",(file)=>{
   list = document.querySelectorAll(".listfilewifi");
   if(file.length>0){
   btndwn.style.display="block";
   btndwn.href=`/${file[0]}`;
   for(i=0;i<=file.length-1;i++){
    list.forEach(liste => {
      liste.innerHTML+=`<option value="${file[i]}">${file[i].replace(".csv", '')}</option>`;
    });
    }
   }else{
      list.forEach(liste => {
         liste.innerHTML+=`<option>No database saved</option>`;
         btndwn.style.display="none";
       });
   }
   })

  socket.on("csv",(WIFI)=>{
    var WPA3=0;
    var WPA2=0;
    var WPA=0;
    var WEP=0;
    var OPEN=0;
   tourStops.push([{name_file:WIFI[0].name_file}]);
   nb_capture.textContent=WIFI.length-1;
   for(i=1;i<WIFI.length-1;i++){
       boxwifidb.innerHTML+=`
       <tr class="box-wifi">
       <td><p>${WIFI[i]['Name']}</p><br><img height="20" src="img/channel.png">${WIFI[i]['Channel']}</td>
       <td><p>${WIFI[i]['Address'].toUpperCase()}</p></td>
       <td><p style="color:black;">${WIFI[i]['Security']}</p></td>
       <td><p style="color:black;"><img height="20" src="img/level.gif">${WIFI[i]['Signal Level']}</p></td>
       <td><p style="color:black;">${WIFI[i]['WPS Support']}</p></td>
       <td><p style="color:black;"><img height="20" src="img/calender.png">${WIFI[i]['Time']}</p><button name="${WIFI[i]['Longitude']}" value="${WIFI[i]['Latitude']}" class="goposition btn btn-success btn-sn"><img height="20" src="img/streetview.png"></button></td>
       </tr>
      `;
      switch(WIFI[i]['Security']){
         case "WPA3":
            WPA3++;
         break;;
         case "WPA2":
            WPA2++;
         break;;
         case "WPA":
            WPA++;
         break;;
         case "WEP":
            WEP++;
         break;;
         case "NONE":
            OPEN++;
         break;;
       }
        
          wifi.push([{ssid: WIFI[i]['Name'], mac: WIFI[i]['Address'], signal_level: WIFI[i]['Signal Level'], channel: WIFI[i]['Channel'], security: WIFI[i]['Security'],wps: WIFI[i]['WPS Support'], time_capture: WIFI[i]['Time'], lat: WIFI[i]['Latitude'], long: WIFI[i]['Longitude']}]);

         }
         nb_wpa3.textContent=WPA3;
         nb_wpa2.textContent=WPA2;
         nb_wpa.textContent=WPA;
         nb_wep.textContent=WEP;
         nb_open.textContent=OPEN;

         setTimeout(()=>{
            for(i=0;i<wifi.length;i++){
            tourStops.push([{ lat: +wifi[i][0].lat, lng: +wifi[i][0].long },wifi[i][0].ssid,wifi[i][0].mac,wifi[i][0].signal_level,wifi[i][0].channel,wifi[i][0].security,wifi[i][0].wps,wifi[i][0].time_capture]);
            }
            initMap();
            map.style.opacity="1";
            loadwififile.style.display="none";
            },1000)  
})