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
      page : req.param('state',1),
    };
    // 1,从微信获取openid 2，根据openid查是否注册，若没有注册则拉取用户资料然后再写入
    async.waterfall([
      function(cb){
        cb(null,opts);
      },
      UserLogIn.getUserByCode,
      UserLogIn.validateRegisterByOpenID,
    ],function (err,result){
      if (err != null ) {
        //if(err=='toUser') {
        // return res.view('toUser');
        //}
        sails.log.error(err);
        return res.send(500,'服务暂不可用:'+err);
      }

      req.session.userID=result.userID;
     // req.session.role=result.role;
      req.session.openid=result.openid;
      if(opts.page==1)
        var redirectUrl = '/nurseList.html';
      if (opts.page=='needlogin')
        var redirectUrl=req.session.page||'/nurseList.html';
      if(opts.page==2)
        var redirectUrl = '/nurseHome.html';
      //console.log(redirectUrl);
      res.redirect(302,redirectUrl);
    })

  },


  getUserInfo : function (req,res){
    if(req.param('code') ){//根据code查询
      var opts = {
        code : req.param ('code',''),
      };
      UserLogIn.getOrRegUserByCode(opts,function(err,result){
        if (err) return res.send(500,'{"msgNo":"9999","msgInfo":"服务出错，请您稍后再试","data":'+JSON.stringify(err) +'}');
        if (result=='') return res.send(404,'{"msgNo":"8888","msgInfo":"对不起，没有找到您要信息"}');
        var str = JSON.stringify(result) ;
        result = util.format('{"msgNo":"0000","msgInfo":"查询到了信息","data":[%s]}',str);
        res.send(result);
      });
    }else if(req.param('openid')){//根据openid查询
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
    }else{//userid查询

      var opts = {
        userID : req.session.userID ,
      };
      console.log('opts',opts.userID);
      if(opts.userID == '') return res.send(500,'{"msgNo":"9999","msgInfo":"参数错误"}');
      UserLogIn.getUserInfoFromDBByuserID(opts,function(err,result){
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
    //todo 验证参数
    UserLogIn.sendNumToPhone(opts,function(err,result){
      if(err) return res.send('{"msgNo":"9999","msgInfo":"'+err+'"}');
      var str = JSON.stringify(result) ;
      //result = util.format('{"msgNo":"0000","msgInfo":"发送到手机，请查收(测试)","data":%s}',str);
      result ='{"msgNo":"0000","msgInfo":"发送到手机，请查收"}';
      console.log(result);
      res.send(result);
    });
  },


  //注册
  register : function(req,res){

    var opts = {
      phone : req.param('phone',''),
      num: req.param('num',''),
      code: req.param('code','')
    };
    if(opts.phone==''||opts.num==''||opts.code=='') return res.send(500,'{"msgNo":"9999","msgInfo":"参数错误"}');//还需要一个code参数
    UserLogIn.register(opts,function(err,result){
      if(err){
        sails.log.error(err);
        return res.send(500,'{"msgNo":"9999","msgInfo":"'+err+'"}');
    }
      var str = JSON.stringify(result) ;
      result = util.format('{"msgNo":"0000","msgInfo":"注册成功","data":%s}',str);
      res.send(result);
    });
  },

//绑定手机
  bindingPhone : function(req,res){

  var opts = {
    phone : req.param('phone',''),
    num: req.param('num',''),
    userID: req.session.userID||req.param('userID','')
  };

  if(opts.phone==''||opts.num==''||opts.userID=='') return res.send('{"msgNo":"9999","msgInfo":"参数错误"}');//还需要一个code参数
  UserLogIn.bindingPhone(opts,req,function(err,result,stauts){
    if(err){
      sails.log.error(err);
      return res.send('{"msgNo":"9999","msgInfo":"'+err+'"}');
    }
    if(stauts=='0001'){
      var str = JSON.stringify(result) ;
      result = util.format('{"msgNo":"0001","msgInfo":"验证成功"}');
      return res.send(result);
    }
    var str = JSON.stringify(result) ;
    result = util.format('{"msgNo":"0000","msgInfo":"验证成功"}');
    return res.send(result);
  });
},
  //测试方法
  logInTest: function(req,res){
    //获取参数
    var opts = {
      code : req.param('code',''),
      stat : req.param('state',''),
    };

    console.log(opts);
    // 1,从微信获取openid 2，根据openid查是否注册，若没有注册则拉取用户资料然后再写入，3若成功，重定向url带openid
    res.send(opts);
  },
};

