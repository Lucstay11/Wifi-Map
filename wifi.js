// Console display of the total number of wifi networks and their security
const fs = require("fs");
const { parse } = require("csv-parse");
const folderPath = 'wifi/';

function displayAllWifi() {
    let WPA3 = 0;
    let WPA2 = 0;
    let WPA = 0;
    let WEP = 0;
    let OPEN = 0;
    let total = 0;

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
      })
      .on('end', () => {
        console.log('WPA3: ' + WPA3);
        console.log('WPA2: ' + WPA2);
        console.log('WPA: ' + WPA);
        console.log('WEP: ' + WEP);
        console.log('OPEN: ' + OPEN);
        console.log('Total all Wifi: ' + total);
      });
    })
  })
}

function display_wifi(action, name,socket) {
  if (action == "all") {
      displayAllWifi();
  }else if(action == "file") {
    let WPA3 = 0;
    let WPA2 = 0;
    let WPA = 0;
    let WEP = 0;
    let OPEN = 0;
    let total = 0;
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
        WIFI.push(data)
      })
      .on('end', () => {
        const TotalSecurity = [WPA3, WPA2, WPA, WEP, OPEN];
        io.to(socket.id).emit("csv",[WIFI,TotalSecurity])
      });  
    }
    
    else if(action=="query"){
      var result = [];
      
      for(i=1;i<WIFI.length;i++){
        filter=name[1]=="SSID"?WIFI[i][0]:WIFI[i][1];
        var regex = /+$name[0]+/i;
          if(regex.test(name[0])){
            result.push(WIFI[i])
          }
         }
       if(result.length>0){
       io.to(socket.id).emit("wifi_database",result)
       }
     }
}



module.exports = { display_wifi };

