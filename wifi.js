// Console display of the total number of wifi networks and their security
const fs = require("fs");
const { parse } = require("csv-parse");
const { api } = require('./api');
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
  let API_RESULT = ["salut"];
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
    var p=api("totalwifi")
    
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
        io.to(socket.id).emit("csv",[WIFI,TotalSecurity,lastdatecapture],p)
      });  
    }
    
    else if(action=="query"){
      var result = [];
      var totalfind = null;
      var filtersecurity = name[2]
      var filterwps = name[3]
      var firstwifi = name[6]=="plus"?name[5]*20:name[5]*10;
      var lastwifi = name[6]=="plus"?name[5]*20+20:name[5]*20;
      var actiontable = name[4]=="all"?"all":"table";
      firstwifi=firstwifi==10?1:firstwifi;

       if(method!="api"){

      for(i=1;i<WIFI.length;i++){
        filter=name[1]=="SSID"?WIFI[i][0]:WIFI[i][1];
        let regex = new RegExp('\\b' + name[0].replace(/\s+/g, '.*') + '\\b', 'i');
        let find = WIFI[i].find(e => regex.test(e.toLowerCase()) || e.toLowerCase().startsWith(name[0].toLowerCase()));

        if(find){
          if(filtersecurity=="All" && filterwps=="All"){
            result.push(WIFI[i])
            totalfind++
           }else if(filtersecurity!="All"){
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
        
      }

       if(result.length>0){
        if(actiontable=="all"){
          io.to(socket.id).emit("wifi_database",result,totalfind,actiontable,API_RESULT)
        }else{
          tabres=[];
          for(i=firstwifi;i<lastwifi;i++){
            tabres.push(result[i])
           }
           io.to(socket.id).emit("wifi_database",tabres,totalfind,actiontable)
        }
       }
     }
}



module.exports = { display_wifi };

