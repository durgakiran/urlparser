'use strict'
var express = require('express');
const urlRegex = require('url-regex');

var app = express();
var connection = require('../model/connection.js');

module.exports = {
  createandinsert : function(req,res){
  var reqpath = new Buffer(req.path);
  reqpath = reqpath.toString('utf-8',5,reqpath.length);
  
   
    if(reqpath && urlRegex({exact: true}).test(reqpath)){
      
      connection.findOriginalUrl(reqpath,function(count,docs){
        if(count==0){
          connection.insert(reqpath,function(x){console.log('insert is working'); res.end(x)});
          
        }else{
          res.end(JSON.stringify(docs));
        }
      });
    }else{
      res.end("bad url");
    }
  },
  
  redirect : function(req,res){
    
    var reqpath = new Buffer(req.path);
    reqpath = reqpath.toString('utf-8',1,reqpath.length);
    
    connection.getOriginalUrl(reqpath,function(x){
      if(x==0){
        res.end("{'error': 'url doesnot exist'}");
      }else{
        var loc = x[0]['original_url'];
        var reg = /http/;
        if(!reg.test(loc)){ loc = "http://" + loc}
        
        res.redirect(loc);
        
      }
    });
  }

    
    
    
}