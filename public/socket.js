var tourStops = [];
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
    tourStops = [];
    boite_ext=[];
    boite_int=[];
    nb_wpa3.textContent="";
    nb_wpa2.textContent="";
    nb_wpa.textContent="";
    nb_wep.textContent="";
    nb_open.textContent="";
    nb_wpa3.textContent=WIFI[1][0];
    nb_wpa2.textContent=WIFI[1][1];
    nb_wpa.textContent=WIFI[1][2];
    nb_wep.textContent=WIFI[1][3];
    nb_open.textContent=WIFI[1][4];
    tourStops.push([{name_file:WIFI[0][0].name_file}]);
    nb_capture.textContent=WIFI[0].length-1;
     for(i=1;i<10;i++){
       boxwifidb.innerHTML+=`
       <tr class="box-wifi">
       <td><p>${WIFI[0][i][0]}</p><br><img height="20" src="img/channel.png">${WIFI[0][i][3]}</td>
       <td><p>${WIFI[0][i][1].toUpperCase()}</p></td>
       <td><p style="color:black;">${WIFI[0][i][4]}</p></td>
       <td><p style="color:black;"><img height="20" src="img/level.gif">${WIFI[0][i][2]}</p></td>
       <td><p style="color:black;">${WIFI[0][i][5]}</p></td>
       <td><p style="color:black;"><img height="20" src="img/calender.png">${WIFI[0][i][6]}</p><button name="${WIFI[0][i][7]}" value="${WIFI[0][i][8]}" class="goposition btn btn-success btn-sn"><img height="20" src="img/streetview.png"></button></td>
       </tr>
      `;
      }

         setTimeout(()=>{
            for(i=1;i<WIFI[0].length-1;i++){
            tourStops.push([{ lat: +WIFI[0][i][8], lng: +WIFI[0][i][7] },WIFI[0][i][0],WIFI[0][i][1],WIFI[0][i][2],WIFI[0][i][3],WIFI[0][i][4],WIFI[0][i][5],WIFI[0][i][6]]);
            }
            initMap();
            map.style.opacity="1";
            loadwififile.style.display="none";
            },1000)  
})


searchwifi.addEventListener("input",(e)=>{
   boxwifidb.innerHTML="";
   var wifi = e.target.value
   var filter = filterdb.value
   socket.emit("search_db",[wifi,filter]);
})

socket.on("wifi_database",(wifi)=>{
   for(i=0;i<wifi.length;i++){
      boxwifidb.innerHTML+=`
      <tr class="box-wifi">
      <td><p>${wifi[i][0]}</p><br><img height="20" src="img/channel.png">${wifi[i][3]}</td>
      <td><p>${wifi[i][1].toUpperCase()}</p></td>
      <td><p style="color:black;">${wifi[i][4]}</p></td>
      <td><p style="color:black;"><img height="20" src="img/level.gif">${wifi[i][2]}</p></td>
      <td><p style="color:black;">${wifi[i][5]}</p></td>
      <td><p style="color:black;"><img height="20" src="img/calender.png">${wifi[i][6]}</p><button name="${wifi[i][7]}" value="${wifi[i][8]}" class="goposition btn btn-success btn-sn"><img height="20" src="img/streetview.png"></button></td>
      </tr>
     `;
      }
})