/**
 * WxAccess.js
 *
 * @description :: 和微信接口相关的api。刷新acessstoken
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */


var qs = require('querystring');
var wxConfig = sails.config.weixin;
var https = require('https');
var util = require('util');
module.exports = {
  tablename:"wxAccess",
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    access_token:{
      type: "string",
      size:512
    },
    expires_in:{
      type:"int"
    },
    updatedAt:{
      type:"data"
    }
  },
  updataToken:function(cb){
    //更新accesstoken的文档在
    // http://mp.weixin.qq.com/wiki/15/54ce45d8d30b6bf6758f68d2e95bc627.html
    var hostname = util.format('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s' +
      '&secret=%s',wxConfig.appid,wxConfig.appsecret);
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
        if(data.errcode){
          return cb(data);
        }else{
          var updateString =util.format( 'update wxaccess set access_token="%s",expires_in=%s,updatedAt=NOW();',data.access_token,data.expires_in);
          //console.log('updateString',updateString);
          //console.log('data',data);
          WxAccess.query(updateString,function(err,result){
            console.log('result',result);
            if(err) return cb(err);
            return cb(null,data);
          });
        }
      })
    }).on('error', function(e) {
      cb(e.errmsg);
    });
 },
  validateToken:function(cb){
    WxAccess.find().limit(1).exec(function(err,token){
      if(err) return cb(err);
      token=token[0];
      var isExpired
      //console.log('token',token);

      var timeDiff = Date.now() - (new Date(token.updatedAt).getTime());
      //console.log('timeDiff',timeDiff>=token.expires_in*1000||token=='');
      if(timeDiff>=token.expires_in*1000||token==''){
        //token过期了，更新token
        WxAccess.updataToken(function(err,result){
          if(err) return cb(err);
          return cb(null,result);
        })
      }else{
        //token没过期不需要更新token
        return cb(null,token);
      }
    });
 },
};

