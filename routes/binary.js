var https = require('https');
var express = require('express');
var router = express.Router();
var result;

(function (message_id, callback) {
    var send_options = {
        host: 'api.line.me',
        path: '/v2/bot/message/7088818412449/content',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": " Bearer {" + "v66RZEdHXdQouvfhAFohg5PcFtRxc5cG7RCEFdtkjJoRLi4i/FKYD0lTpGid4ma4R/43QL+1jvI5dmUdGb/06DlbYfZX/ajkord5VQrazV8CUs894liV3ZZ8BQDDK1RYZAkGEhkp4rKS9OOTkWlojAdB04t89/1O/w1cDnyilFU=}" // ←ここに自分のトークンを入れる(LINE Developersで発行したやつ)
        },
        method: 'GET'
    };

    var req = https.request(send_options, function (res) {
        var data = [];
        var str = "";
        var num = Number();
        res.on('data', function (chunk) {
            data.push(new Buffer(chunk));
        }).on('error', function (err) {
            console.log(err);
        }).on('end', function () {
            result = Buffer.concat(data);
        });
    });
    req.end();
}());

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('binary', { content: JSON.stringify(result) });
});

module.exports = router;