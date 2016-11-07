/**
 * CardController
 *
 * @description :: Server-side logic for managing cards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var async = require('async');
var util = require('util');

module.exports = {

  getUserCard:function(req,res){
    var opts = {
      userID :  req.param('userID',null),
      };
    UserCard.getCard(opts,function(err,card){
      if (err) return res.send(500,'{"msgNo":"9999","msgInfo":"服务出错，请您稍后再试"}');
      if (card=='') return res.send(404,'{"msgNo":"8888","msgInfo":"对不起，没有找到您要信息"}');
      var str = JSON.stringify(card) ;
      result = util.format('{"msgNo":"0000","msgInfo":"查询到了信息","data":%s}',str);
      res.send(result);
    })
  }

};

