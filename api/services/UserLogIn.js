/**
 * Created by whl on 2016/10/18.
 */


var async = require('async');
var https = require('https');
var util = require('util');


module.exports = {
  /**
   * 通过code换取openid
   * @param opts js对象，code
   * @param cb 回调函数 cb(err,result)  err为错误信息  result为包含openid的对象
   */
  getWebAccessTokenByCode: function (opts,cb) {
    //发起hpttps 请求
    var hostname = util.format('https://api.weixin.qq.com/sns/oauth2/access_token?appid=%s&secret=%s&code=%s' +
      '&grant_type=authorization_code','wx8306afd398ab31e5','8241fcf80a1271ab62715838c66fec41',opts.code);
    console.log('hostname',hostname);
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
        if(data.errcode) return cb(data);
        cb(null,data);
      })
    }).on('error', function(e) {
      console.log(e);
      cb(e.errmsg);
    });
  },

  /**
   * 通过openid验证是否注册。有就返回用户信息，没有就加入数据库
   * @param opts js对象，需要包含该用户的openid
   * @param cb 回调函数 cb(err,result)  err为错误信息  result为拉取的用户信息
   */
  validateRegisterByOpenID : function (opts,cb){
    var queryObj ={
      openID:opts.openid
    };
    User.find(queryObj).exec(function(err,result){
      if (err) return cb(err);
      if (result == ''){
        //如果沒有註冊，先拉取拉取用户信息再写入
        async.waterfall([
          function(cb){
            cb(null,opts);
          },UserLogIn.getUserInfoFromWeiXin,
          UserLogIn.registerAndInsert
        ],function(err,result){
          if (err) return cb(err);
          return cb(null,result);
        });
      }else{
        cb(null,result[0]);}

    });
  },

  /**
   * 通过openid从微信拉取用户的基本信息
   * @param opts js对象，需要包含该用户的openid和access_token
   * @param cb 回调函数 cb(err,result)  err为错误信息  result为拉取的用户信息
   */
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

  /**
   * 把用户的基本信息插入到数据库
   * @param opts js对象，需要包含该用户的基本信息
   * @param cb 回调函数 cb(err,result)  err为错误信息  result为用户的基本信息
   */
  registerAndInsert : function (opts,cb) {
    console.log(opts.headimgurl);
    //把用户信息插入数据库
    var sql = util.format('insert into user(openid,nickname,gender,avatarUrl) values ("%s","%s",%s,"%s")',opts.openid,opts.nickname,opts.sex,opts.headimgurl);
    User.query(sql,function(err,result){
      if (err){ return cb(err);}
      cb(null,opts);
    });
  },

  registerAndLogIn : function (opts,cb) {
    // todo:用户注册并且登陆
  },


  /**
   * 通过openid从数据库取用户数据
   * @param opts js对象，需要包含该用户的openid和access_token
   * @param cb 回调函数 cb(err,result)  err为错误信息  result为拉取的用户信息
   */
  getUserInfoFromDBByOpenid : function (opts,cb) {
    //根据openid获取用户信息
    User.find(opts).exec(function(err,result){
      if(err) return cb(err);
      return cb(null,result);
    })
  },


  /**
   * 通过code从读取取用户数据，如果没有注册则让用户注册
   * @param opts js对象，需要包含该用户的openid和access_token
   * @param cb 回调函数 cb(err,result)  err为错误信息  result为拉取的用户信息
   */
  getUserInfoByCode : function (opts,cb) {
    async.waterfall([
        function(cb){
          cb(null,opts)
        }, UserLogIn.getWebAccessTokenByCode,
        UserLogIn.validateRegisterByOpenID,
      ],function(err,result){
        if(err) return cb(err);
        return cb(null,result);
      }
    )
  }

}
