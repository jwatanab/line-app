var https = require('https');
var express = require('express');
var router = express.Router();
var result;

(function (message_id, callback) {
    var send_options = {
        host: 'api.line.me',
        path: '/v2/bot/message//content',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": " Bearer {" + "}" // ←ここに自分のトークンを入れる(LINE Developersで発行したやつ)
        },
        method: 'GET'
    };

    var req = https.request(send_options, function (res) {
        var data = [];
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
    console.log(result);
    res.render('binary', { content: result });
});

module.exports = router;