var express = require('express');
var router = express.Router();
var AYLIENTextAPI = require('aylien_textapi');

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

router.get('/', function(req, res, next) {
  var text = 'Bandung, West Java. The Corruption Eradication Commission, better known as KPK, on Thursday launched the 2015 Anti-Corruption Festival, or Festa, in conjunction with the Bandung city government, to celebrate International Anti-Corruption Day. The festival will run until Friday. KPK acting chief Taufiqqurahman Ruki, National Police Chief Gen. Badrodin Haiti, House of Regional Representatives (DPD) Speaker Irman Gusman and Attorney General H.M. Prasetyo were to be joined by Political, Legal and Security Affairs Minister Luhut Panjaitan, Justice and Human Rights Minister Yasonna Laoly, Health Minister Nina Moeloek and Industry Minister Saleh Husin at the event. The KPK\'s Ruki opened the event on Thursday with a speech calling on the House to reconsider intentions to revise the KPK law, or "face the anti-corruption community." He pointed to three key aspects to the fight against corruption — human, cultural and systematic — and said that systematic aspect were the most important, as they reflects policies and laws. “We do not name someone as a suspect because we hold a grudge against that particular person or because we are driven by political motives," he said. "We do so in the name of the law." “Graft is a crime against humanity as it is proven to bring injustice and poverty and we have to eradicate it," Luhut said. "The country\'s leaders, whether at the central or regional government level, have to be good role models in fighting graft. I would like everyone to work together for a graft-free Indonesia." Bandung was selected to host the event as the city has the highest level of public engagement, infrastructure capability and corruption prevention, compared to other cities, KPK deputy chief Adnan Pandu Praja said. The KPK hopes Festa will encourage more Indonesians to join the fight against corruption by beginning in their own neighborhood. The festival will feature theater performances, live music and other events.';
  var textapi = new AYLIENTextAPI({
    application_id: "211c366a",
    application_key: "07f274bd39adf054d2df5bae339bff96"
  });
  textapi.summarize({
    'text': text,
    'title': "intro",
    'sentences_number': 2
  }, function(error, response) {
    console.log(error);
    console.log(response);
    if (error === null) {
      response.sentences.forEach(function(s) {
        console.log(s);
      });
    }
  });
  textapi.sentiment({
    'text': 'John is a very bad football player!'
  }, function(error, response) {
    if (error === null) {
      console.log(response['polarity']);
    }
  });
  
  console.log("dasdasdasd");
  res.render('index', { title: 'Express' });
});



module.exports = router;
