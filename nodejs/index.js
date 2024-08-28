const express = require("express");

const app = express(); 

app.get("/", function(req, res){
    res.sendFile(__dirname + "site.html");
});

app.get("/sobre", function(req, res){
    res.send("Minha pagina sobre");
});

app.get("/blog", function(req, res){
    res.send("Meu blog");
});

app.listen(3000, function(){
   console.log("servidor rodando em http://localhost:3000/") 
});