var express = require('express');
var router = express.Router();
var request = require('request');


/* GET home page. */
router.get('/:id', function (req, res, next) {
  var sentVars = {
  }
  // get selected question's data
  var questions_URL = "https://api.stackexchange.com/2.2/questions/" + req.params.id + "?order=desc&sort=activity&site=stackoverflow&filter=!9Z(-wwYGT";
  httpGetRequest(questions_URL, (questions) => {
    question = questions.items[0];
    sentVars.title = question.title;
    question.creation_date_formatted = convertDate(question.creation_date)
    sentVars.question = questions.items[0];
    // get question's answers
    var answers_URL = "https://api.stackexchange.com/2.2/questions/" + req.params.id + "/answers?pagesize=10&order=desc&sort=activity&site=stackoverflow&filter=!-*jbN0RQENuP";
    httpGetRequest(answers_URL, (answers) => {
      // convert date type
      answers.items.forEach(element => {
        element.creation_date_formatted = convertDate(element.creation_date)
      });
      sentVars.answers = answers.items;
      // get question comments
      var questionComments_URL = "https://api.stackexchange.com/2.2/questions/" + req.params.id + "/comments?order=asc&sort=creation&site=stackoverflow&filter=!9Z(-x.Ecg";
      httpGetRequest(questionComments_URL, (questionComments) => {
        sentVars.questionComments = questionComments.items;
        // console.log(sentVars)
        res.render('question', sentVars);
      })
    })
  })
});


function httpGetRequest(URL, callback) {
  request({
    method: 'GET',
    uri: URL,
    gzip: true
  }, function (error, response, body) {
    //* workaround for issue with this particular apiUrl
    var firstChar = body.substring(0, 1);
    var firstCharCode = body.charCodeAt(0);
    if (firstCharCode == 65279) {
      console.log('First character "' + firstChar + '" (character code: ' + firstCharCode + ') is invalid so removing it.');
      body = body.substring(1);
    }
    //*/

    var parsedJson = JSON.parse(body);
    // console.log('parsedJson: ', parsedJson);
    callback(parsedJson)
  });

}

function convertDate(unix_timestamp) {
  var date = new Date(unix_timestamp * 1000);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();
  var year = date.getFullYear().toString();
  var month = date.getMonth().toString();
  var day = date.getDay().toString();

  var formattedTime = year + "-" + month + "-" + day + "       " + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  return formattedTime;
}

module.exports = router;
