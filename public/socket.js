var country = ["US", "DE", "GB", "CA", "NL", "AU", "JP", "RU", "FR", "ES", "PL", "CN", "IT", "CH", "BR", "SE", "BE", "CZ", "AR", "MX", "DK", "UA", "HU", "NO", "AT", "FI", "NZ", "TW", "PT", "SG", "GR", "RO", "ID", "IN", "ZA", "CL", "KR", "TR", "TH", "PH", "BG", "IE", "MY", "SK", "HR", "AE", "LT", "BY", "LV", "RS", "KZ", "SI", "VN", "IL", "EE", "CO", "TT", "BO", "CR", "SA", "PE", "IS", "UY", "LU", "GE", "IR", "BD", "PY", "VE", "JO", "CY", "MT", "DO", "BA", "EC", "PA", "QA", "GT", "EG", "PK", "KW", "AM", "MA", "KH", "OM", "ME", "UZ", "MD", "SV", "AL", "DZ", "MK", "IQ", "NG", "LB", "TN", "HN", "NP", "JE", "KE", "BH", "KG", "MN", "LK", "NI", "MC", "BS", "YE", "SY", "GI", "AD", "MM", "JM", "XK", "KY", "BM", "FO", "BB", "GH", "CU", "LA", "GM", "BZ", "TZ", "LI", "ET", "SM", "IM", "SR", "GG", "AZ", "PS", "ZM", "FJ", "MU", "SN", "NA", "KN", "GL", "BN", "AO", "LC", "CI", "LY", "FM", "ML", "UG", "ZW", "CV", "SD", "AF", "RW", "AG", "NE", "DJ", "SC", "GA", "GD", "BF", "VG", "PG", "BW", "HT", "MZ", "VU", "SO", "TM", "DM", "BI", "TJ", "GY", "VA", "TD", "WS", "TC", "SZ", "MG", "CK", "GN", "TL", "BJ", "VC", "CM", "TG", "MR", "PW", "MV", "LS", "MH", "BT", "TO", "KP", "CD", "MW", "GQ", "CG", "LR", "FK", "SB", "SS", "KM", "SL", "CF", "KI", "EH", "ER", "GW", "MS", "GS", "AI", "ST", "TK"];
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

socket.on("csv",(WIFI,API)=>{
    console.log(API)
    nb_total_wifi_api.textContent=API
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
    nb_last_capture.textContent=WIFI[2];
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
       <td><p style="color:black;"><img height="20" src="img/calender.png">${WIFI[0][i][6]}</p></td>
       <td><button name="${WIFI[0][i][7]}" value="${WIFI[0][i][8]}" class="goposition btn btn-success btn-sn"><img height="20" src="img/streetview.png"></button></td>
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
   socket.emit("search_db",[wifi,filtername,filtersecurity,filterwps,"all",""],"api");
   wifinbfound.textContent="0 found"
   btnlastlengthdb.style.display="none";
})

socket.on("wifi_database",(wifi,size,table,API)=>{
   console.log(API)
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
      <td><p style="color:black;"><img height="20" src="img/calender.png">${wifi[i][6]}</p></td>
      <td><button name="${wifi[i][7]}" value="${wifi[i][8]}" class="goposition btn btn-success btn-sn"><img height="20" src="img/streetview.png"></button></td>
      </tr>
     `;
      }
   if(table!="table"){
   wifinbfound.textContent=`${size} founds`;
   btnlastlengthdb.textContent=Math.round(wifi.length/20);
   if(wifi.length>20){btnlastlengthdb.textContent++}
   }
})

function show_page_db(action){
   var wifi = searchwifi.value;
   var filtername = filterdbname.value;
   var filtersecurity = filterdbsecurity.value;
   var filterwps = filterdbwps.value

   if(action=="next"){
      if(btnfirstlengthdb.textContent!=btnlastlengthdb.textContent && btnlastlengthdb.style.display!="none"){
      socket.emit("search_db",[wifi,filtername,filtersecurity,filterwps,"table",btnfirstlengthdb.textContent,"plus"],"api");
      btnfirstlengthdb.textContent++;
      }
   }else{
      if(btnfirstlengthdb.textContent!=1){
      btnfirstlengthdb.textContent--;
      socket.emit("search_db",[wifi,filtername,filtersecurity,filterwps,"table",btnfirstlengthdb.textContent,"min"],"api");
      }
   }
}

function change_status_db(){
    if(boxnavapi.style.display=="none"){
      boxnavapi.style.display="block";
      boxnavcsv.style.display="none";
      boxheadapi.style.display="block";
      boxheadcsv.style.display="none";
      contboxstatus.classList.add("bg-gradient-success");
      statusboxnav.classList.remove("bg-gradient-success");
      statusboxnav.classList.add("bg-gradient-primary");
      document.querySelector("#statusboxnav > img").src="img/database.png";
      boxfilterlocation.style.display="block";
      displayboxcountry()
    }else{
      boxnavapi.style.display="none";
      boxnavcsv.style.display="block";
      boxheadapi.style.display="none";
      boxheadcsv.style.display="block";
      contboxstatus.classList.remove("bg-gradient-success");
      statusboxnav.classList.remove("bg-gradient-primary");
      statusboxnav.classList.add("bg-gradient-success");
      document.querySelector("#statusboxnav > img").src="img/world.png";
      boxfilterlocation.style.display="none";
    }
    boxwifidb.innerHTML="";
}