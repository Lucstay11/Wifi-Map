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
      var totalfind=null;
      if(name[0]!=""){
      for(i=1;i<WIFI.length;i++){
        filter=name[1]=="SSID"?WIFI[i][0]:WIFI[i][1];

        let regex = new RegExp('\\b' + name[0].replace(/\s+/g, '.*') + '\\b', 'i');
        let find = WIFI[i].find(e => regex.test(e.toLowerCase()) || e.toLowerCase().startsWith(name[0].toLowerCase()));
        if(find){
          if (result.length === 0 || result[result.length - 1].length === 10) {
            // Si le tableau WIFI est vide ou si le dernier sous-tableau a déjà 10 valeurs, ajoute un nouveau sous-tableau
            result.push([WIFI[i]]);
          } else {
            // Sinon, ajoute les valeurs au dernier sous-tableau
            result[result.length - 1].push(...WIFI[i]);
          }
          totalfind++;
         }
       }
      }
       if(result.length>0){
       io.to(socket.id).emit("wifi_database",result,totalfind)
       }
     }
}



module.exports = { display_wifi };

