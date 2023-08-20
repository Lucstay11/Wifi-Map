// Console display of the total number of wifi networks and their security
const fs = require("fs");
const { parse } = require("csv-parse");
const fetch = require("node-fetch");
const folderPath = 'wifi/';
require('colors');

function displayAllWifi() {
    let WPA3 = 0;
    let WPA2 = 0;
    let WPA = 0;
    let WEP = 0;
    let OPEN = 0;
    let total = 0;
    let lastdatecapture = "";

    fs.readdir(folderPath, (err, files) => {
    files.forEach((file) => {
    fs.createReadStream(folderPath + file)
      .pipe(parse({ delimiter: ',', from_line: 2 }))
      .on('data', function (row) {
        total++;
        console.log(row);
        switch (row[4]) {
          case 'WPA3':
            WPA3++;
            break;
          case 'WPA2':
            WPA2++;
            break;
          case 'WPA':
            WPA++;
            break;
          case 'WEP':
            WEP++;
            break;
          case 'NONE':
            OPEN++;
            break;
        }
        lastdatecapture = row[6];
      })
      .on('end', () => {
        console.log('WPA3 :'.bgBlue +" "+ WPA3.toString().bgGreen);
        console.log('WPA2 :'.bgBlue +" "+ WPA2.toString().bgGreen);
        console.log('WPA  :'.bgBlue +" "+ WPA.toString().bgGreen);
        console.log('WEP  :'.bgBlue +" "+ WEP.toString().bgGreen);
        console.log('OPEN :'.bgBlue +" "+ OPEN.toString().bgGreen);
        console.log("Total all Wifi : ".bgYellow + total.toString().bgYellow);
        console.log("Last capture at : ".bgMagenta + lastdatecapture.bgRed)
      });
    })
  })
}

function display_wifi(action, name,socket,method) {
  if (action == "all") {
      displayAllWifi();
  }else if(action == "file") {
    let WPA3 = 0;
    let WPA2 = 0;
    let WPA = 0;
    let WEP = 0;
    let OPEN = 0;
    let total = 0;
    let lastdatecapture = "";
    WIFI = [{name_file: name}];
    
    fs.createReadStream(folderPath + name)
      .pipe(parse({
       separator: ',',
       from_line: 2,
       mapHeaders: ({ header }) => header.trim()
      }))
      .on('data', function (data) {
        total++;
        switch (data[4]) {
          case 'WPA3':
            WPA3++;
            break;
          case 'WPA2':
            WPA2++;
            break;
          case 'WPA':
            WPA++;
            break;
          case 'WEP':
            WEP++;
            break;
          case 'NONE':
            OPEN++;
            break;
        }
        lastdatecapture = data[6].split(" ")[1]+" "+data[6].split(" ")[0];
        WIFI.push(data)
      })
      .on('end', () => {
        const TotalSecurity = [WPA3, WPA2, WPA, WEP, OPEN];
        io.to(socket.id).emit("csv",[WIFI,TotalSecurity,lastdatecapture])
      });  
    }
    
    else if(action=="query"){
      var result = [];
      var totalfind = null;
      if(method=="api"||method=="csv"){
      var filtersecurity = name[2]
      var filterwps = name[3]
      var filtercountry = name[4]
      var filterpostal = name[5]
      var filterstreet = name[6]
      var filterstreetnb = name[7]
      var firstwifi = name[8].actiontable=="plus"?name[8].indextable*20:name[8].indextable*10;
      var lastwifi = name[8].actiontable=="plus"?name[8].indextable*20+20:name[8].indextable*20;
      var actiontable = name[8].viewtable=="all"?"all":"table";
      firstwifi=firstwifi==10?1:firstwifi;
      }

       if(method=="csv"){

      for(i=1;i<WIFI.length;i++){
        filter=name[1]=="SSID"?WIFI[i][0]:WIFI[i][1];
        let regex = new RegExp('\\b' + name[0].replace(/\s+/g, '.*') + '\\b', 'i');
        let find = WIFI[i].find(e => regex.test(e.toLowerCase()) || e.toLowerCase().startsWith(name[0].toLowerCase()));

        if(find){
          if(filtersecurity=="" && filterwps=="All"){
            result.push(WIFI[i])
            totalfind++
           }else if(filtersecurity!=""){
             if(WIFI[i][4]==filtersecurity){
              result.push(WIFI[i])
              totalfind++
              }
             }
           else if(filterwps!="All"){
            if(WIFI[i][5]==filterwps){
              result.push(WIFI[i])
              totalfind++
            }
           }
        }
       }
      }else{
        var idnextpage;
        var url = "https://api.wigle.net/api/v2/network/search?ssid=homespot";
        actiontable="allstartup";
        if(method=="api"){
        var actiontable = name[8].viewtable=="all"?"all":"table";
        if(name[8].actiontable=="plus"){var idnextpage=`&searchAfter=${name[8].idnextpage}`}else{idnextpage=""}
        const research = name[1]=="SSID"?`&ssid=${name[0]}`:`&netid=${name[0]}`;
        var url = `https://api.wigle.net/api/v2/network/search?country=${filtercountry}&postalCode=${filterpostal}&${research}&encryption=${filtersecurity}&road=${filterstreet}&houseNumber=${filterstreetnb}${idnextpage}`;
        }

        const username = 'AID29fc21c646b4104e1cada5b468dc0aeb';
        const password = '5d9590ecc1c1cbdc5d4447670f4b64fe';
        const headers = {
        'Accept': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
        };

       fetch(url, { method: 'GET', headers })
      .then(response => response.json())
      .then(data => {
            if(data.success==false){
             io.to(socket.id).emit("wifi_database",result,totalfind,actiontable,"api","error")
                return;
             }
             let WPA3 = 0;
             let WPA2 = 0;
             let WPA = 0;
             let WEP = 0;
             let OPEN = 0;
             for(i=0;i<=data.results.length-1;i++){
             switch (data.results[i].encryption){
              case 'wpa3':
                WPA3++;
                break;
              case 'wpa2':
                WPA2++;
                break;
              case 'wpa':
                WPA++;
                break;
              case 'wep':
                WEP++;
                break;
              case 'none':
                OPEN++;
                break;
            }
           }
           const TotalSecurity = [WPA3, WPA2, WPA, WEP, OPEN];
           idnextpage=data.searchAfter;
           totalfind=data.totalResults
           result.push(data.results)
           io.to(socket.id).emit("wifi_database",result,totalfind,actiontable,"api",idnextpage,TotalSecurity)
      })
      }

       if(result.length>0){
        if(actiontable=="all"){
          io.to(socket.id).emit("wifi_database",result,totalfind,actiontable,"csv")
        }else{
          tabres=[];
          for(i=firstwifi;i<lastwifi;i++){
            tabres.push(result[i])
           }
           io.to(socket.id).emit("wifi_database",tabres,totalfind,actiontable,"csv")
        }
       }
     }
}



module.exports = { display_wifi };

