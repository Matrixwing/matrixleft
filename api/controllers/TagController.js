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
    var tag = req.param('tag','');
    console.log(tag);

    var tag = [{tagID:0},{tagID:21,value:166}];


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
    Tag.getServantList(tag,function(err,tagList){
      if (err) {return res.send(500,'{"msgNo":"9999","msgInfo":"failed"}');}
      var str = JSON.stringify(tagList) ;
      tagList = util.format('{"msgNo":"0000","msgInfo":"success","data":%s}',str);
      res.send(tagList);
    })

    //todo wight


  }


};

