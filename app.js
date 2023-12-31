const express = require("express");
const app = require("express")();
const server = require("http").createServer(app);
global.io = require("socket.io")(server);
const upload = require("express-fileupload");
const fs = require("fs");
const ejs = require('ejs');
const PORT=2222;
const path = require("path");
const WifiFiles = path.join(__dirname,"wifi");
const { display_wifi } = require('./wifi');
const { convert_Wiggle } = require('./convert-wiggle');

app.use(upload());
app.use(express.static('public'));
 app.get('/',(req,res)=>{
   res.render(`${__dirname}/public/index.ejs`);
 });


app.get("/:file(*)",(req,res)=>{
  res.download(req.params.file,{root:WifiFiles},(err)=>{
    if(err){
      res.status(500).send("<p>Erreur file</p>")
     }});
})

io.on("connection",(socket)=>{
     io.emit("nb_live",socket.server.engine.clientsCount);
     fs.readdir(WifiFiles, (err, fichiers) => {
      io.to(socket.id).emit("list_wifi_file",fichiers)
     })

socket.on("change_csv",(file)=>{
  display_wifi("file",file,socket)
})
socket.on("search_db",(wifi)=>{
  display_wifi("query",wifi,socket,wifi[8].action)
})

//Display the api wifi at the startup on the client web
 display_wifi("query","adv",socket,"startup")
   
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

display_wifi("all");
