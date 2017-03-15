
var express = require('express');
var app = express();
var util = require('util');
var bodyParser = require('body-parser');

/*

  questionData = {
    "ip.add.ress": {
      name: "jon",
      question: "age?",
      answers: {
        "ip.add.ress": "40"
      }
    }
  };

*/

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

var allData = {};

/*
app.get('/', function (req, res) {
  res.send('Hello World! ' + req.ip);
  console.log("Root called");
});
*/

//Send the user data to each requestion client:
app.get('/data', function(req, res) {
  return res.status(200).json(allData);
});

app.post('/answer', function(req, res) {
  var userIp = getUsableIp(req);
  var answeringToIp = req.body.answeringToIp;
  var answer = req.body.answer;
  
  console.log("Received answer: userIp: ", userIp, " answeringToIp: ", answeringToIp, " answer: ", answer, "\nexisting data: ", util.inspect(allData));

  var answers = allData[answeringToIp].answers;
  var existingAnswer = answers[userIp];
  
  if (typeof existingAnswer === 'undefined') {
    answers[userIp] = answer;
  } else {
    console.log("Attempted double post by ip: ", userIp);
  }
  
  return res.status(200).json(allData);
});

app.post('/', function(req, res) {
  var userIp = getUsableIp(req);

  console.log("Received initial request.  userIp: ", userIp);
  
  var responseData = {
    yourIp: userIp,
    allData: allData
  };
  
  return res.status(200).json(responseData);
});

app.post('/newuser', function(req, res) {
  var name = req.body.name;
  var question = req.body.question;
  var userIp = getUsableIp(req);
  
  console.log("Received new user data.  name: ", name, " question: ", question, " userIp: ", userIp);
  
  var existingQuestion = allData[userIp];
  if (typeof existingQuestion === 'undefined') {
    allData[userIp] = {
      name: name,
      question: question,
      answers: {}
    }
  }
  
  return res.status(200).json(allData);
});

function getUsableIp(req) {
  return slugifyIp(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
}

function slugifyIp(ip) {
  return "ip" + ("-" + ip).replace(/\D+/g,"-");
}

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});





