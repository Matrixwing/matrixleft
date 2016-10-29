/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var async = require('async');
var util = require('util');
module.exports = {
  /*
   *响应微信登录
   */
  logIn: function(req,res){

    //获取参数
    var opts = {
      code : req.param('code',''),
      stat : req.param('state',''),
    };

    // 1,从微信获取openid 2，根据openid查是否注册，若没有注册则拉取用户资料然后再写入，3若成功，重定向url带openid

    async.waterfall([
      function(cb){
        cb(null,opts);
      },
      UserLogIn.getWebAccessTokenByCode,
      UserLogIn.validateRegisterByOpenID,
    ],function (err,result){
      if (err != null ) return res.send(500,'服务暂不可用:'+err);
      console.log('result1',result);
      console.log('result1',result.openid);
      var redirectUrl = '/index.html?openid='+result.openid;
      res.redirect(302,redirectUrl);
    })

  },


  getUserInfo : function (req,res){

    if(req.param('code') ){
      var opts = {
        code : req.param ('code',''),
      };
      UserLogIn.getUserInfoByCode(opts,function(err,result){
        if (err) return res.send(500,'{"msgNo":"9999","msgInfo":"服务出错，请您稍后再试","data":'+JSON.stringify(err) +'}');
        if (result=='') return res.send(404,'{"msgNo":"8888","msgInfo":"对不起，没有找到您要信息"}');
        var str = JSON.stringify(result) ;
        result = util.format('{"msgNo":"0000","msgInfo":"查询到了信息","data":[%s]}',str);
        res.send(result);
      });
    }else{
      var opts = {
        openid : req.param ('openid',''),
      };
      UserLogIn.getUserInfoFromDBByOpenid(opts,function(err,result){
        if (err) return res.send(500,'{"msgNo":"9999","msgInfo":"服务出错，请您稍后再试"}');
        if (result=='') return res.send(404,'{"msgNo":"8888","msgInfo":"对不起，没有找到您要信息"}');
        var str = JSON.stringify(result) ;
        result = util.format('{"msgNo":"0000","msgInfo":"查询到了信息","data":%s}',str);
        res.send(result);
      })
    }
  },


  //发送验证码至手机
  sendNumToPhone : function(req,res){
    var opts = {
        phone : req.param('phone',''),
      };
    UserLogIn.sendNumToPhone(opts,function(err,result){
      if(err) return res.send(500,'{"msgNo":"9999","msgInfo":"服务出错，请您稍后再试"}');
      var str = JSON.stringify(result) ;
      result = util.format('{"msgNo":"0000","msgInfo":"发送到手机，请查收(测试)","data":%s}',str);
      res.send(result);
    });
  },

  //测试方法
  logInTest: function(req,res){
    //获取参数
    var opts = {
      code : req.param('code',''),
      stat : req.param('state',''),
    };
    // 1,从微信获取openid 2，根据openid查是否注册，若没有注册则拉取用户资料然后再写入，3若成功，重定向url带openid
    res.send(opts);
  },
};

