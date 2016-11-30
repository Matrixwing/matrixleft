/**
 * TagController
 *
 * @description :: Server-side logic for managing tags
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var async = require('async');
var util = require('util');

module.exports = {
  getTagList : function(req,res){
    Tag.getAllListGoupByType(function(err,tagList){
      if (err) {return res.send(500,'{"msgNo":"9999","msgInfo":"failed"}');}
      var str = JSON.stringify(tagList) ;
      tagList = util.format('{"msgNo":"0000","msgInfo":"success","data":%s}',str);
      res.send(tagList);
    })
  },

  getServantList : function (req,res) {
    console.log('req.body',req.body);
    var tag = JSON.parse(req.param('tag','')) ;
    if(tag=='') {
      tag = [{tagID: 0}, {tagID: 1}, {tagID: 2}, {tagID: 3}];
    }
    var limit = req.param('limit',0);
    var start = (req.param('start',1)-1)*limit;
    var tagParam={
      tag : tag,
      start :start,    //分页需要的起始条数
      limit :limit,
    };

    console.log(tagParam);
    if(tagParam.tag==''){
      return res.send('{"msgNo":"9999","msgInfo":"参数不正确"}');
    }
    Tag.getServantList(tagParam,function(err,tagList){
      if (err) {return res.send(500,'{"msgNo":"9999","msgInfo":"服务出错"}');}
      var str = JSON.stringify(tagList) ;
      tagList = util.format('{"msgNo":"0000","msgInfo":"成功","data":%s}',str);
      res.send(tagList);
    })
  }
};

