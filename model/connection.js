'use strict'
var mongodb = require('mongodb');
const shortid = require('shortid');

var dotenv = require('dotenv');
dotenv.config();


var MongoClient = mongodb.MongoClient;

module.exports = {
    insert : function(e,cb){
                    var myObj = {};
                    myObj["original_url"] = e;
                    myObj["shortened_url"] = shortid.generate();
                    
                    MongoClient.connect(process.env.url,function(err,db){
                      if(err) throw err;
                      else{
                        db.collection('customers').insertOne(myObj,function(err,result){
                          if(err) {cb(err); db.close();}
                          else {
                            var ob = {};
                            ob['original_url'] = myObj['original_url'];
                            ob['shortened_url'] = myObj['shortened_url'];
                            cb(JSON.stringify(ob));
                            db.close()
                          }
                        })
                      }
                      db.close();
                    })  
                  },
    findOriginalUrl : function(e,cb){
                      
                      var query = {};
                      query["original_url"] = e;
                      
                      
                       MongoClient.connect(process.env.url,function(err,db){
                          if(err) throw err;
                          db.collection('customers').find(query).count(function(err,count){
                            if(count>0){
                              db.collection('customers').find(query,{id: 0}).toArray(function(err,docs){
                                
                                cb(count,docs);
                              })
                            }else{
                              cb(count,null);
                              db.close();
                            }
                            
                          })
                        });
                      
                  },
  getOriginalUrl : function(e,cb){
    
    var query = {};
    query["shortened_url"] = e;
    MongoClient.connect(process.env.url,function(err,db){
      
      if(err) throw err;
      db.collection('customers').find(query).count(function(err,count){
        console.log(count);
        if(count==0){
          
          cb(0);
          db.close();
        }else{
          db.collection('customers').find(query,{_id: 0, 'original_url': 1}).toArray(function(err,result){
            cb(result);
            db.close();
          });
        }
      })
    })
  }
    
}