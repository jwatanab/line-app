var express = require('express');
var router = express.Router();
const http = require('http');
const ejs = require('ejs');
const kintone = require('kintone');

var token = "";
var api = new kintone("", { token: token });

var el = []

api.records.get({ app: 26 }, (err, res) => {
  var index = {
    name: "",
    text: "",
    create_at: "",
    object: ""
  }, record = [];
  for (var i in res.records) {
    //名前を格納
    if (res.records[i]["name"]["value"]) {
      index.name = res.records[i]["name"]["value"];
    }
    //更新時間を格納
    if (res.records[i]["create_at"]["value"]) {
      index.create_at = res.records[i]["create_at"]["value"];
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
    el[i] = JSON.parse(record[i]);
  }
});

router.get('/', function (req, res, next) {
  res.render('index', { content: el });
});

module.exports = router;