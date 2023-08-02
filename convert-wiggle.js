// Convert Wiggle csv files to displayable data on the map
const fs = require("fs");
const { parse } = require("csv-parse");

function convert_Wiggle(nameFile,action,upload){
const WIFI=[];
data = `"Name","Address","Signal Level","Channel","Security","WPS Support","Time","Longitude","Latitude"`;
data=data+"\n";

   if(action=="file"){fs.appendFile("wifi/"+nameFile,data,(err)=>{});}
   fs.createReadStream("wifi/"+nameFile+".txt")
   .pipe(parse({ delimiter: ",", from_line: 2,quote: '' }))
   .on("data", function (row){
     if(row[10]=="WIFI"){WIFI.push(row);}
   })
   .on('end', () => {
     WIFI.forEach((e)=>{
      let WPS;
      let SECURITY;
      e[1]=e[1]!=""?e[1]:"Empty";
      if(e[2].includes("[WPS]")){WPS="WPS";}else{ WPS="NO";}

      switch (true) {
         case e[2].includes("WPA3"):
            SECURITY="WPA3";
           break;
         case e[2].includes("WPA2"):
            SECURITY="WPA2";
           break;
         case e[2].includes("WPA"):
            SECURITY="WPA";
           break;
         case e[2].includes("WEP"):
            SECURITY="WEP";
           break;
         case !e[2].includes("WPA3") || !e[2].includes("WPA2") || !e[2].includes("WPA") || !e[2].includes("WEP"):
            SECURITY="NONE";
           break;
       }

     ligne=`"${e[1]}","${e[0]}","${e[5]}","${e[4]}","${SECURITY}","${WPS}","${e[3]}","${e[7]}","${e[6]}"`
     ligne=ligne+"\n"
     if(action=="file"){fs.appendFile("wifi/"+nameFile,ligne,(err)=>{});}
      else{fs.appendFile("wifi/"+upload,ligne,(err)=>{});}
     })
     fs.unlink("wifi/"+nameFile+".txt",(err)=>{});
   });
  }

 module.exports = { convert_Wiggle };
