/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var async = require('async');

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

    //todo : 1,从微信获取openid 2，根据openid查是否注册，若没有注册则拉取用户资料然后再写入，3若成功，重定向url带openid

    async.waterfall([
      function(cb){
        cb(null,opts);
      },
      UserLogIn.getWebAccessTokenByCode,
      UserLogIn.validateRegisterByOpenID,
    ],function (err,result){
      if (err != null ) return res.send(500,'服务暂不可用:'+err);
      console.log(result);
      var redirectUrl = '/index.html?openid='+result.openid;
      res.redirect(302,redirectUrl);
    })

  },
};

