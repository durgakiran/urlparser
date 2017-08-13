var express = require('express');
var controller = require('./controller/controller.js');
var app = express();


app.listen(3000,listen);
function listen(){
    console.log("i am listening.....");
}



app.get('/',function(req,res){
    console.log(1);
    res.end("hello");
});
app.get('/new/*',controller.createandinsert);
app.get('/*',controller.redirect);