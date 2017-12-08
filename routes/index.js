const express = require('express');
const router = express.Router();
const https = require('https');
const request = require('request');
const ejs = require('ejs');
const async = require('async');
const kintone = require('kintone');

const token = "prqZ0aqGgAiOe60lqlyLCEExPLaci0D0zBDizW13";
const api = new kintone("parknet.cybozu.com", { token: token });

let
  send_options = {},
  req = {},
  json = {},
  data = new Array(),
  content = new Array(),
  record = new Array(),
  acStr = new Array(),
  imgObject = new Array(),
  result = new Array(),
  index = {},
  functions = function () { },
  profileContent;

index = {
  name: "",
  text: "",
  create_at: "",
  object: ""
}

async.waterfall([
  function (callback) {
    api.records.get({ app: 26 }, (err, res) => {
      for (let i in res.records) {
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
      for (let i in record) {
        content[i] = JSON.parse(record[i]);
      }
      callback(null, content);
    });
  },
  function (content, callback) {
    functions = content.map(it => done => {
      send_options = {
        "url": 'https://api.line.me/v2/bot/profile/' + it.name,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": " Bearer {" + "v66RZEdHXdQouvfhAFohg5PcFtRxc5cG7RCEFdtkjJoRLi4i/FKYD0lTpGid4ma4R/43QL+1jvI5dmUdGb/06DlbYfZX/ajkord5VQrazV8CUs894liV3ZZ8BQDDK1RYZAkGEhkp4rKS9OOTkWlojAdB04t89/1O/w1cDnyilFU=}" // ←ここに自分のトークンを入れる(LINE Developersで発行したやつ)
        },
        method: 'GET'
      };
      request.get(send_options, function (err, res, body) {
        json = JSON.parse(body);
        it.name = json.displayName;
        done(null, it);
      });
    });
    callback(null, content, functions);
  },
  function (content, functions, callback) {
    async.series(functions, (err, results) => {
      if (err) console.error(err);
      callback(null, content, results);
    });
  },
  function (content, nameObject, callback) {
    functions = nameObject.map(it => done => {
      if (String(it.object).indexOf('__LINE_TOKEN__') === 0) {
        it.object = "__LINE_TOKEN__";
        done(null, it);
        return;
      }
      send_options = {
        host: 'api.line.me',
        path: `/v2/bot/message/${it.object}/content`,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": " Bearer {v66RZEdHXdQouvfhAFohg5PcFtRxc5cG7RCEFdtkjJoRLi4i/FKYD0lTpGid4ma4R/43QL+1jvI5dmUdGb/06DlbYfZX/ajkord5VQrazV8CUs894liV3ZZ8BQDDK1RYZAkGEhkp4rKS9OOTkWlojAdB04t89/1O/w1cDnyilFU=}",
        },
        method: 'GET',
      };
      req = https.request(send_options, res => {
        data = [];
        res
          .on('data', chunk => {
            data.push(new Buffer(chunk));
          })
          .on('error', err => { done(err, null) })
          .on('end', () => {
            result = Buffer.concat(data);
            it.object = JSON.stringify(result);
            done(null, it);
          });
      });
      req.end();
      return;
    });
    callback(null, content, nameObject, functions);
  },
  function (content, nameObject, functions, callback) {
    async.series(functions, (err, results) => {
      if (err) console.error(err);
      callback(null, content, nameObject, results);
    });
  },
  function (content, nameObject, imgObject, callback) {
    callback(imgObject);
  }
],
  function (object) {
    profileContent = object;
  }
);

router.get('/', function (req, res, next) {
  res.render('index', {
    content: profileContent
  });
});

module.exports = router;