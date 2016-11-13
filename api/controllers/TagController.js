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
    TagList.getAllTagList(function(err,tagList){
      if (err) {return res.send(500,'{"msgNo":"9999","msgInfo":"failed"}');}
      var str = JSON.stringify(tagList) ;
      tagList = util.format('{"msgNo":"0000","msgInfo":"success","data":%s}',str);
      res.send(tagList);
    })
  },

  getServantList : function (req,res) {
    var tag = req.param('tag','');


    var tag = [{tagID:1},{tagID:2},{tagID:3,value:4}];


    //todo price

    //TagList.query('select sum(price) from tag where tagID=',function (err,sumPrice){
    //
    //});

    //Tag.getSumPrice(tag,function (err,tagList){
    //  if (err) {return res.send(500,'{"msgNo":"9999","msgInfo":"failed"}');}
    //  var str = JSON.stringify(tagList) ;
    //  tagList = util.format('{"msgNo":"0000","msgInfo":"success","data":%s}',str);
    //  res.send(tagList);
    //})
    //
    Tag.getServantByTag(tag,function(err,tagList){
      if (err) {return res.send(500,'{"msgNo":"9999","msgInfo":"failed"}');}
      var str = JSON.stringify(tagList) ;
      tagList = util.format('{"msgNo":"0000","msgInfo":"success","data":%s}',str);
      res.send(tagList);
    })

    //todo wight


  }


};

