var express = require('express');
var router = express.Router();
var request = require('request');

var newestQuestions_URL = "https://api.stackexchange.com/2.2/questions?pagesize=10&order=desc&sort=creation&tagged=android&site=stackoverflow&filter=!6KPPZ6Q3qlbEa";
var mostVotedQuestionsLastWeek_URL = "https://api.stackexchange.com/2.2/questions?pagesize=10&fromdate=" + getLastWeekUnixTime() + "&todate=" + getNowUnixTime() + "&order=desc&sort=votes&tagged=android&site=stackoverflow&filter=!6KPPZ6Q3qlbEa";


/* GET home page. */
router.get('/', function (req, res, next) {
  var sentVars = {
    title: 'Stack OverFlow 10 Questions'
  }
  // get 10 newest quastions 
  httpGetRequest(newestQuestions_URL, (newestQuestions) => {
    sentVars.newestQuestions = newestQuestions.items;
    // get 10 most voted questions
    httpGetRequest(mostVotedQuestionsLastWeek_URL, (mostVotedQuestionsLastWeek) => {
      sentVars.mostVotedQuestionsLastWeek = mostVotedQuestionsLastWeek.items;
      res.render('index', sentVars);
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


function getNowUnixTime() {
  var now = new Date();
  var unixTimeStamp = Math.floor(now.getTime() / 1000);
  return unixTimeStamp;
}


function getLastWeekUnixTime() {
  var today = new Date();
  var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
  var unixTimeStamp = Math.floor(lastWeek.getTime() / 1000);
  return unixTimeStamp;
}




module.exports = router;
