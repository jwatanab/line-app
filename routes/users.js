var express = require('express');
var router = express.Router();
var https = require('https');
var request = require('request');
(function () {
  var send_options = {
    host: 'api.line.me',
    path: '/v2/bot/profile/U20895ed8cf1ca5ad9b14f48bf7078e56',
    headers: {
      "Authorization": " Bearer{" + "v66RZEdHXdQouvfhAFohg5PcFtRxc5cG7RCEFdtkjJoRLi4i/FKYD0lTpGid4ma4R/43QL+1jvI5dmUdGb/06DlbYfZX/ajkord5VQrazV8CUs894liV3ZZ8BQDDK1RYZAkGEhkp4rKS9OOTkWlojAdB04t89/1O/w1cDnyilFU=}" // ←ここに自分のトークンを入れる(LINE Developersで発行したやつ)
    },
    method: 'GET'
  };

  var req = https.request(send_options, function (res) {
    var data = [];
    res.on('data', function () {

    }).on('error', function (err) {

    }).on('end', function () {

    });
  });
  req.end();
}());

var send_options = {
  url: 'https://api.line.me/v2/bot/profile/U20895ed8cf1ca5ad9b14f48bf7078e56',
  headers: {
    "Authorization": " Bearer {" + "v66RZEdHXdQouvfhAFohg5PcFtRxc5cG7RCEFdtkjJoRLi4i/FKYD0lTpGid4ma4R/43QL+1jvI5dmUdGb/06DlbYfZX/ajkord5VQrazV8CUs894liV3ZZ8BQDDK1RYZAkGEhkp4rKS9OOTkWlojAdB04t89/1O/w1cDnyilFU=}" // ←ここに自分のトークンを入れる(LINE Developersで発行したやつ)
  },
  method: 'GET'
};

request.get(send_options, function (err, res, body) {
  console.log();
});

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
