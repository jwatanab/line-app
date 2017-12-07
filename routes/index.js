const express = require('express');
const router = express.Router();
const https = require('https');
const request = require('request');
const ejs = require('ejs');
const async = require('async');
const kintone = require('kintone');
const co = require('co');

const token = "";
const api = new kintone("", { token: token });
const imgResult = [];
const profileContent = [];

async.waterfall([
  function (callback) {
    var content = [];
    api.records.get({ app: 26 }, (err, res) => {
      var index = { name: "", text: "", create_at: "", object: "" }, record = [];
      for (var i in res.records) {
        if (res.records[i]["name"]["value"]) {
          index.name = res.records[i]["name"]["value"];
        } else {
          index.name = "__LINE_TOKEN__";
        }
        //更新時間を格納
        if (res.records[i]["create_at"]["value"]) {
          index.create_at = res.records[i]["create_at"]["value"];
        } else {
          index.create_at = "__LINE_TOKEN__";
        }
        //テキストを格納
        if (res.records[i]["index"]["value"]) {
          index.text = res.records[i]["index"]["value"];
        } else {
          index.text = "__LINE_TOKEN__";
        }
        //画像オブジェクト格納
        if (res.records[i]["object"]["value"]) {
          index.object = res.records[i]["object"]["value"];
        } else {
          index.object = "__LINE_TOKEN__";
        }
        record[i] = JSON.stringify(index);
      }
      i = 0;
      for (var i in record) {
        content[i] = JSON.parse(record[i]);
      }
      callback(null, content);
    });
  },
  function (content, callback) {
    var acStr = [];
    for (let i in content) {
      if (String(content[i].name).indexOf("__LINE_TOKEN__") !== 0) {
        var send_options = {
          "url": 'https://api.line.me/v2/bot/profile/' + content[i].name,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": " Bearer {" + "}"
          },
          method: 'GET'
        };

        request.get(send_options, function (err, res, body) {
          var json = JSON.parse(body);
          acStr.unshift(json.displayName);
          if (acStr.length == content.length - 1) callback(null, content, acStr);
        });
      } else {
        acStr.unshift("__LINE_TOKEN__");
        if (acStr.length == content.length) callback(null, content, acStr);
      }
    }
  },
  function (content, nameObject, callback) {
    var imgObject = [];
    for (let i in content) {
      if (String(content[i].object).indexOf("__LINE_TOKEN__") !== 0) {
        var send_options = {
          host: 'api.line.me',
          path: '/v2/bot/message/' + content[i].object + '/content',
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": " Bearer {" + "}"
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
            var result = Buffer.concat(data);
            imgObject.push(result);
            send_options.path = '/v2/bot/message/' + content[i].object + '/content';
            if (imgObject.length == 9) {
              callback(null, content, nameObject, imgObject);
            }
          });
        });
        req.end();
      }
    }
  },
  function (content, nameObject, imageObject, callback) {
    for (let i in content) {
      if (String(nameObject[i]).indexOf("__LINE_TOKEN__") !== 0) {
        content[i].name = nameObject[i];
      }
    }
    profileContent[0] = content, imgResult[0] = imgObject;
  }]
);

router.get('/', function (req, res, next) {
  res.render('index', {
    content: profileContent[0]
  });
});

router.get('/binary', function (req, res, next) {
  res.render('binary', {
    object: JSON.stringify(imgResult[0])
  })
})

module.exports = router;