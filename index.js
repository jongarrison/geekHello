
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

var questionData = {};

/*
app.get('/', function (req, res) {
  res.send('Hello World! ' + req.ip);
  console.log("Root called");
});
*/

//Send the user data to each requestion client:
app.get('/data', function(req, res) {
  return res.status(200).json(questionData);
});

app.post('/answer', function(req, res) {
  var userIp = getUsableIp(req);
  var answeringToIp = req.body.answeringToIp;
  var answer = req.body.answer;
  
  console.log("Received answer: userIp: ", userIp, " answeringToIp: ", answeringToIp, " answer: ", answer, "\nexisting data: ", util.inspect(questionData));

  var answers = questionData[answeringToIp].answers;
  var existingAnswer = answers[userIp];
  
  if (typeof existingAnswer === 'undefined') {
    answers[userIp] = answer;
  } else {
    console.log("Attempted double post by ip: ", userIp);
  }
});

app.post('/', function(req, res) {
  
  console.log("Received initial user data: ", util.inspect(req.body));
  
  var name = req.body.name;
  var question = req.body.question;
  var userIp = getUsableIp(req);

  console.log("Received question.  name: ", name, " question: ", question, " userIp: ", userIp);

  var existingQuestion = questionData[userIp];
  if (typeof existingQuestion === 'undefined') {
  
    questionData[userIp] = {
      name: name,
      question: question,
      answers: {}
    }
  }
  
  var responseData = {
    yourIp: userIp
  };
  
  return res.status(200).json(responseData);
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





