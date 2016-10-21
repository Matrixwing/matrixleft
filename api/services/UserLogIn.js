/**
 * Created by whl on 2016/10/18.
 */
//var User= require("../models/User")
var async = require('async');
var https = require('https');
var util = require('util');
  //.format('{"msgNo":"0000","msgInfo":"查询到了信息","data":%s}',str)
module.exports = {
  //获取网页accesstoken
  getWebAccessTokenByCode: function (opts,cb) {
    //发起hpttps 请求
    var hostname = util.format('https://api.weixin.qq.com/sns/oauth2/access_token?appid=%s&secret=%s&code=%s' +
      '&grant_type=authorization_code','wx8306afd398ab31e5','8241fcf80a1271ab62715838c66fec41',opts.code);
    https.get(hostname, function(res) {
      var buffers = [];
      res.on('data', function(d) {
        buffers.push(d);
      });
      res.on('end', function(d){
        var wholeData = Buffer.concat(buffers);
        var dataStr = wholeData.toString('utf8');
        data=wholeData;
        data=JSON.parse(data);
        cb(null,data);
      })
    }).on('error', function(e) {
      cb(e.errmsg);
    });
  },

  validateRegisterByOpenID : function (opts,cb){
    // 根据openid验证是否注册
    var queryObj ={
      openID:opts.openid
    };
    User.find(queryObj).exec(function(err,result){
      console.log('result',result);
      if (err) return cb(err);
      if (result == ''){
        //如果沒有註冊，先拉取拉取用户信息再写入
        async.waterfall([
          function(cb){
            cb(null,opts);
          },UserLogIn.getUserInfoFromWeiXin,
          UserLogIn.registerAndInsert
        ],function(err,result){
          console.log('result',result);
          if (err) return cb(err)
          return cb(null,result[0]);
        });
      }
     cb(null,result[0])
    });
    //var result ={
    //  openid:opts.openid
    //};
    //cb(null,result)
  },

  getUserInfoFromWeiXin :function (opts,cb){
    var hostname = util.format('https://api.weixin.qq.com/sns/userinfo?access_token=%s&openid=%s&lang=zh_CN',opts.access_token,opts.openid);
    console.log(hostname);
    https.get(hostname, function(res) {
      var buffers = [];
      res.on('data', function(d) {
        buffers.push(d);
      });
      res.on('end', function(d){
        var wholeData = Buffer.concat(buffers);
        var dataStr = wholeData.toString('utf8');
        data=wholeData;
        data=JSON.parse(data);
        cb(null,data);
      })
    }).on('error', function(e) {
      cb(e.errmsg);
    });

  },

  registerAndInsert : function (opts,cb) {
    console.log(opts.headimgurl);
    //把用户信息插入数据库
    var sql = util.format('insert into user(openid,nickname,gender,avatarUrl) values ("%s","%s",%s,"%s")',opts.openid,opts.nickname,opts.sex,opts.headimgurl);
    console.log(sql);
    User.query(sql,function(err,result){
      if (err) return cb(err)
      cb(null,opts);
    });
  },

  registerAndLogIn : function (opts,cb) {
    // todo:用户注册并且登陆
  },

  getUserInfoFromDBByOpenid : function (opts,cb) {
    //根据openid获取用户信息
    User.find(opts).exec(function(err,result){
      if(err) return cb(err);
      return cb(null,result);
    })
  }

}
