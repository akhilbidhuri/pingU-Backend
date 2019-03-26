var express = require('express');
var router = express.Router();
//var AYLIENTextAPI = require('aylien_textapi');
var socket = require('socket.io');


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var dbo=null;
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  dbo = db.db("mydb");
});

router.post('/regcomp', function(req, res, next) {
  var colname = req.body.compname;
  var email = req.body.email;
  var name = req.body.name;
  var password = req.body.password;
  console.log(colname);
  dbo.collection("user").findOne({'email':email}, function(err, result) {
    if (err) throw err;
    if(result)
    {
      res.send({"status":"Duplicate Found"});
      console.log("check",result);
    }
    else
    {
      dbo.createCollection(colname, function(err, res) {
        if (err) throw err;
        console.log("Collection created!");
      });
      var obj = {'name':name,'email':email,'company':colname,'password':password,'type':'hr'};
      dbo.collection("user").insertOne(obj, function(err, res) {
      if (err) throw err;
      console.log(obj);
      });
      res.send({"status":"Representative Added"});
    }
    //ddb.close();
  });
});

router.post('/reguser', function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var type = req.body.type;
  dbo.collection("user").findOne({'email':email}, function(err, result) {
    if (err) throw err;
    if(result)
    {
      res.send({"status":"Duplicate Found"});
      console.log("check",result);
    }
    else
    {
      var obj = {'name':name,'email':email,'type':type,'password':password};
      dbo.collection("user").insertOne(obj, function(err, res) {
        if (err) throw err;
      });
      res.send({"status":"Employee Added"});
    }
    //ddb.close();
  });
  
});

router.post('/login', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  dbo.collection("user").findOne({'email':email}, function(err, result) {
    if (err) throw err;
    if(result && result['password']==password)
    {
      result['password']=0;
      res.send(result);
    }
    else
    {
      res.send({"status":"Password or email mismatch"});
    }
    //ddb.close();
  });
});

router.post('/group', function(req, res, next) {
  var gid = req.body.gid;
  var company = req.body.company;
  console.log(company);
  dbo.collection(company).find({'gid':'oneorigin'}).toArray(function(err, result) {
    if (err) throw err;
    if(result)
    {
      res.send(result);
    }
    else
    {
      res.send({"status":"Password or email mismatch"});
    }
    //ddb.close();
  });
});




router.get('/connect', function(req, res, next) {

  var server = req.app.get('server');
  var io = socket(server);
  //console.log(io);
  console.log('called');
  io.on('connect',function(socket){
    console.log('made socket connection',socket.id);
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
    socket.on('chat',function(data){
      console.log("server",data);
      dbo.collection('Ymedia').insertOne({'message':data.message,'from':data.handle,'gid':'oneorigin'},function(err, result) {
        //ddb.close();
        console.log("stored");
      });
      io.emit('chat',data);
    });
  });
  res.send({"status":"Password or email mismatch"});
});

router.post('/team', function(req, res, next) {
  var role = req.body.role;
  var company = req.body.company;
  dbo.collection("user").find({'role':role,'company':company}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    if(result)
    {
      res.send(result);
      console.log("check",result);
    }
    else
    {
      res.send({"status":"false"});
    }   //ddb.close();
  });
});


module.exports = router;