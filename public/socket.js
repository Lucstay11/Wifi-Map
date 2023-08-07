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
    btnlastlengthdb.textContent=Math.round(WIFI[0].length/20+1);
    wifisize=WIFI[0].length>=20?20:WIFI[0].length;
     for(i=1;i<wifisize;i++){
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
   var wifi = e.target.value;
   var filtername = filterdbname.value;
   var filtersecurity = filterdbsecurity.value;
   var filterwps = filterdbwps.value
   socket.emit("search_db",[wifi,filtername,filtersecurity,filterwps,"all",""]);
   // if(wifi.length=="0" || boxwifidb.innerHTML==""){wifinbfound.textContent="0 found"}
   wifinbfound.textContent="0 found"
   btnlastlengthdb.style.display="none";
})

socket.on("wifi_database",(wifi,size,table)=>{
   wifisize=wifi.length>20?20:wifi.length;
   btnlastlengthdb.style.display="block";
   boxwifidb.innerHTML="";
   for(i=0;i<wifisize;i++){
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
   if(table!="table"){
   wifinbfound.textContent=`${size} founds`;
   btnlastlengthdb.textContent=Math.round(wifi.length/20);
   if(wifi.length>20){btnlastlengthdb.textContent++}
   }
})

function show_db(action){
   var wifi = searchwifi.value;
   var filtername = filterdbname.value;
   var filtersecurity = filterdbsecurity.value;
   var filterwps = filterdbwps.value

   if(action=="next"){
      if(btnfirstlengthdb.textContent!=btnlastlengthdb.textContent){
      socket.emit("search_db",[wifi,filtername,filtersecurity,filterwps,"table",btnfirstlengthdb.textContent,"plus"]);
      btnfirstlengthdb.textContent++;
      }
   }else{
      if(btnfirstlengthdb.textContent!=1){
      btnfirstlengthdb.textContent--;
      socket.emit("search_db",[wifi,filtername,filtersecurity,filterwps,"table",btnfirstlengthdb.textContent,"min"]);
      }
   }
}