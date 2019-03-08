var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var dbo=null;
var ddb = null;
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  dbo = db.db("mydb");
  ddb = db;
});
/* GET home page. */
router.post('/regcomp', function(req, res, next) {
  res.send('hello world');
  var colname = req.body.compname;
  var email = req.body.email;
  var name = req.body.name;
  var password = req.body.password;
  console.log(colname);
  dbo.createCollection(colname, function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    ddb.close();
    console.log("Connection closed!");
  });
  var obj = {'name':name,'email':email,'company':colname,'password':password};
  dbo.collection("user").insertOne(obj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    ddb.close();
  });
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



module.exports = router;
