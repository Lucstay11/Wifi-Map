onst express = require("express");
const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const upload = require("express-fileupload");
const fs = require("fs");
const parse= require("csv-parser");
const PORT=2222;
const path = require("path");
const WifiFiles = path.join(__dirname,"wifi");
const { display_wifi } = require('./wifi');
const { convert_Wiggle } = require('./convert-wiggle');
var WifiFile=""; // Enter a file if you prefer to manually display this database at startup -> exemple.csv

app.use(upload());
app.use(express.static('public'));
app.get('/',(req,res)=>{
     res.sendFile(`${__dirname}/public/index.html`);
});

app.get("/:file(*)",(req,res)=>{
  res.download(req.params.file,{root:WifiFiles},(err)=>{
    if(err){
      res.status(500).send("<p>Erreur file</p>")
     }});
})

io.on("connection",(socket)=>{
     io.emit("nb_live",socket.server.engine.clientsCount);
     var WIFI = [{name_file:WifiFile}];
     fs.readdir(WifiFiles, (err, fichiers) => {
      io.to(socket.id).emit("list_wifi_file",fichiers)
     })

socket.on("change_csv",(file)=>{
   WIFI = [{name_file: file}];
  fs.createReadStream('wifi/'+file)
  .pipe(parse({
    separator: ',',
    mapHeaders: ({ header }) => header.trim()
  }))
  .on('data', (data) => WIFI.push(data))
  .on('end', () => {
     io.to(socket.id).emit("csv",WIFI)
  });
})

fs.readdir(WifiFiles, (err, files) => {
   WifiFile=files[0]
  if(files.length>0){
fs.createReadStream('wifi/'+WifiFile)
  .pipe(parse({
    separator: ',',
    mapHeaders: ({ header }) => header.trim()
  }))
  .on('data', (data) => WIFI.push(data))
  .on('end', () => {
     io.to(socket.id).emit("csv",WIFI)
  });
 }
})

   socket.on("disconnect",()=>{
    io.to(socket.id).emit("nb_live",socket.server.engine.clientsCount);
   })
});

app.post('/upload-file',(req,res)=>{
    if(req.files){
      var file = req.files.file
      var filename = req.files.file.name
       file.mv("./wifi/"+filename+".txt",(err)=>{
             if(err){
               console.log(err)
              }else{
                convert_Wiggle(filename,"file","")
                res.redirect('/');
              }
        })
     }
})
app.post('/upload-wifi',(req,res)=>{
  if(req.files){
    var file = req.files.file
    var fileupload = req.files.file.name
    var filename = req.body.namefile
    if(req.files){
     file.mv("./wifi/"+filename+".txt",(err)=>{
           if(err){
             console.log(err)
            }else{
              convert_Wiggle(fileupload,"wifi",filename)
              console.log(filename)
              res.redirect('/');
            }
      })
     }
   }
})
app.post('/delete',(req,res)=>{
  if(req.body.file){
    var filename = req.body.file
    fs.unlink("wifi/"+filename,(err)=>{});
    res.redirect('/');
   }
})

server.listen(PORT,()=>{
console.log("server start: "+PORT);
});

display_wifi(WifiFile);
