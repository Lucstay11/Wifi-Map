// Console display of the total number of wifi networks and their security
const fs = require("fs");
const { parse } = require("csv-parse");
const folderPath = 'wifi/';
function display_wifi(name){
  
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
     });
   });
   
}

module.exports = { display_wifi };

