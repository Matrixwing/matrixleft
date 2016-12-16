/*
*微信各种api
 */
var myutil = require('../util/util.js');
var util=require('util');
var crypto=require('crypto');
module.exports = {
  //生产调用权限需要公众号的ticket，时间戳，起调控件的url
  getAccess : function(opts,cb){
    var apiInfo = {
      nonceStr:myutil.generateNonceString(),
      timeStamp:Math.floor(Date.now()/1000),
      curUrl:opts.curUrl,
      appID : sails.config.weixin.appid
    }
    WxTicket.validateTicket(function(err,tickect){
      if(err) return cb(err);
      var  signString=util.format('jsapi_ticket=%s&noncestr=%s&timestamp=%s&url=%s',tickect.ticket,apiInfo.nonceStr,apiInfo.timeStamp,apiInfo.curUrl);
      console.log(signString);
      var sha1=crypto.createHash("sha1");
      var signature=sha1.update(signString);
      signature = sha1.digest('hex');
      apiInfo.signature=signature;
      delete apiInfo.curUrl;
      return cb(null,apiInfo);
    })
  }

}
