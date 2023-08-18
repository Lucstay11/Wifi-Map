var country = [];
var tourStops = [];
var WPA3=0;
var WPA2=0;
var WPA=0;
var WEP=0;
var OPEN=0;
var action_query="csv";
var stockage_api=[];


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
            initMap("csv");
            map.style.opacity="1";
            loadwififile.style.display="none";
            },10)  
})


searchwifi.addEventListener("input",(e)=>{
   boxwifidb.innerHTML="";
   var wifi = e.target.value;
   var filtername = filterdbname.value;
   var filtersecurity = filterdbsecurity.value;
   var filterwps = filterdbwps.value
   var filtercountry = filterdbcountry.value;
   var filterpostal = filterdbpostal.value;
   var filterstreet = filterdbstreet.value;
   var filterstreetnb = filterdbstreetnumber.value
   if(action_query=="csv"){
   socket.emit("search_db",[wifi,filtername,filtersecurity,filterwps,filtercountry,filterpostal,filterstreet,filterstreetnb,{viewtable:"all",indextable: btnfirstlengthdb.textContent,actiontable: "",action:"csv"}]);
   wifinbfound.textContent="0 found"
   }
   btnlastlengthdb.style.display="none"; 
})

socket.on("wifi_database",(wifi,size,table,method,idapi,totalsecapi)=>{
   if(method=="api" && idapi=="error"){
       infoapi.textContent="Api error: too many queries today!";
       loaddb.style.display="none";
      return  
   }
   if(method=="api" && stockage_api.length==0){tourStops=[];boite_ext=[];boite_int=[];}

   wifisize=method=="api"?wifi[0].length:wifi.length;
   indexwifi=method=="api"?Math.round(size/100):Math.round(wifi.length/20);
   wifisize=wifisize>20?20:wifisize;
   wifisize=method=="api"?wifi[0].length:wifisize;
   boxwifidb.innerHTML="";
   for(i=0;i<wifisize;i++){
      if(boxnavapi.style.display=="none"){
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
      }else{
        if(boxnavapi.style.display=="none"){return}
        let lat = wifi[0][i].trilat;
        let long = wifi[0][i].trilong;
        let ssid = wifi[0][i].ssid.toUpperCase();
        let netid = wifi[0][i].netid.toUpperCase();
        let channel = wifi[0][i].channel;
        let security = wifi[0][i].encryption.toUpperCase();
        security = security=="None"?"NONE":security;
        let firsttime = wifi[0][i].firsttime.slice(0, -8);
        let lasttime = wifi[0][i].lasttime.slice(0, -8);
        let lastupdt = wifi[0][i].lastupdt.slice(0, -8);
        let adress = `${wifi[0][i].country}, ${wifi[0][i].region},${wifi[0][i].city},${wifi[0][i].postalcode}  ${wifi[0][i].road}  ${wifi[0][i].housenumber}`;
        tourStops.push([{ lat: +lat, lng: +long },ssid,netid,channel,security,firsttime,lasttime,lastupdt,adress]);
        boxwifidb.innerHTML+=`
        <tr class="box-wifi">
        <td><p>${ssid}</p><br><img height="20" src="img/channel.png">${channel}</td>
        <td><p>${netid}</p></td>
        <td><p style="color:black;">${security}</p></td>
        <td><p style="font-size:0.8em;" class="text-primary">${firsttime}</p></td>
        <td><p style="font-size:0.8em;" class="text-primary">${lasttime}</p></td>
        <td><p style="font-size:0.8em;" class="text-primary">${lastupdt}</p></td>
         <td><img height="20" src="img/house.png">
         ${adress}
         <button name="${long}" value="${lat}" class="goposition btn btn-success btn-sn"><img height="20" src="img/streetview.png"></button>
         </td>
        </td> 
        </tr>
       `;
      }
   }

   if(table!="table"){
   wifinbfound.textContent=`${size} founds`;
   btnlastlengthdb.textContent=indexwifi;
   if(wifi.length>20||wifi[0].length>20){btnlastlengthdb.textContent++;btnlastlengthdb.style.display="block";}
   }
   if(method=="api" && btnfirstlengthdb.textContent > stockage_api.length){
      stockage_api.push(boxwifidb.innerHTML)
      btnlastlengthdb.name=idapi;
      loaddb.style.display="none";
      nb_wpa3.textContent=+nb_wpa3.textContent+totalsecapi[0];
      nb_wpa2.textContent=+nb_wpa2.textContent+totalsecapi[1];
      nb_wpa.textContent=+nb_wpa.textContent+totalsecapi[2];
      nb_wep.textContent=+nb_wep.textContent+totalsecapi[3];
      nb_open.textContent=+nb_open.textContent+totalsecapi[4];
      setTimeout(()=>{
      initMap("api");
      },10)
   }
})

function searchapi(){
   stockage_api=[];
   nb_wpa3.textContent=0;
   nb_wpa2.textContent=0;
   nb_wpa.textContent=0;
   nb_wep.textContent=0;
   nb_open.textContent=0;
   var filtername = filterdbname.value;
   var filtersecurity = filterdbsecurity.value;
   var filterwps = filterdbwps.value
   var filtercountry = filterdbcountry.value;
   var filterpostal = filterdbpostal.value;
   var filterstreet = filterdbstreet.value;
   var filterstreetnb = filterdbstreetnumber.value
   if(searchwifi.value==""){return}
   loaddb.style.display="block";
   socket.emit("search_db",[searchwifi.value,filtername,filtersecurity,filterwps,filtercountry,filterpostal,filterstreet,filterstreetnb,{viewtable:"all",indextable: btnfirstlengthdb.textContent,actiontable: "",action:"api"}]);

}

function show_page_db(action){
   var filtername = filterdbname.value;
   var filtersecurity = filterdbsecurity.value;
   var filterwps = filterdbwps.value
   var filtercountry = filterdbcountry.value;
   var filterpostal = filterdbpostal.value;
   var filterstreet = filterdbstreet.value;
   var filterstreetnb = filterdbstreetnumber.value
   if(action=="next"){
      if(btnfirstlengthdb.textContent!=btnlastlengthdb.textContent && btnlastlengthdb.style.display!="none"){
         if(action_query=="csv"){
         socket.emit("search_db",[searchwifi.value,filtername,filtersecurity,filterwps,filtercountry,filterpostal,filterstreet,filterstreetnb,{viewtable:"table",indextable: btnfirstlengthdb.textContent,actiontable: "plus",action:"csv"}]);
         }else{
            if(btnfirstlengthdb.textContent < stockage_api.length){
            boxwifidb.innerHTML=stockage_api[btnfirstlengthdb.textContent];
            }
            else{
               loaddb.style.display="block";   
               socket.emit("search_db",[searchwifi.value,filtername,filtersecurity,filterwps,filtercountry,filterpostal,filterstreet,filterstreetnb,{viewtable:"table",indextable: btnfirstlengthdb.textContent,actiontable: "plus",action:"api",idnextpage: btnlastlengthdb.name}]);
            }
         }
         btnfirstlengthdb.textContent++;
      }
   }else{
      if(btnfirstlengthdb.textContent!=1){
      btnfirstlengthdb.textContent--;
      if(action_query=="csv"){
      socket.emit("search_db",[searchwifi.value,filtername,filtersecurity,filterwps,filtercountry,filterpostal,filterstreet,filterstreetnb,{viewtable:"table",indextable: btnfirstlengthdb.textContent,actiontable: "min",action:"csv"}]);
      }else{
            boxwifidb.innerHTML=stockage_api[btnfirstlengthdb.textContent-1];
        }
    }
   }
}

function change_status_db(){
    if(boxnavapi.style.display=="none"){
      nb_wpa3.textContent=0;
      nb_wpa2.textContent=0;
      nb_wpa.textContent=0;
      nb_wep.textContent=0;
      nb_open.textContent=0;
      wifinbfound.textContent="";
      searchwifi.value="";
      action_query="api";
      boxnavapi.style.display="block";
      boxnavcsv.style.display="none";
      boxheadapi.style.display="block";
      boxheadcsv.style.display="none";
      contboxstatus.classList.add("bg-gradient-success");
      statusboxnav.classList.remove("bg-gradient-success");
      statusboxnav.classList.add("bg-gradient-primary");
      document.querySelector("#statusboxnav > img").src="img/database.png";
      boxfilterlocation.style.display="block";
      btnsearchdb.style.display="block";
      infotablecsv.style.display="none";
      infotableapi.style.display="block";
      displayboxcountry()
    }else{
      wifinbfound.textContent="";
      searchwifi.value="";
      action_query="csv";
      boxnavapi.style.display="none";
      boxnavcsv.style.display="block";
      boxheadapi.style.display="none";
      boxheadcsv.style.display="block";
      contboxstatus.classList.remove("bg-gradient-success");
      statusboxnav.classList.remove("bg-gradient-primary");
      statusboxnav.classList.add("bg-gradient-success");
      document.querySelector("#statusboxnav > img").src="img/world.png";
      boxfilterlocation.style.display="none";
      btnsearchdb.style.display="none";
      infotablecsv.style.display="block";
      infotableapi.style.display="none";
      btnlastlengthdb.style.display="none";
      infoapi.textContent="";
      loaddb.style.display="none";  
      socket.emit("change_csv",selectcsv.value);
    }
    boxwifidb.innerHTML="";
}