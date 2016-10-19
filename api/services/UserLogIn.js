/**
 * Created by whl on 2016/10/18.
 */
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
    // todo:根据验证是否注册

    //处理完之后传openid
    var result ={
      openid:opts.openid
    };
    cb(null,result)
  },

  getUserInfoFromWeiXin :function (opts,cb){
      //todo:根据openid拉取用户基本信息
  },

  registerAndInsert : function (opts,cb) {
    //todo:注册到平台，并且写入用户基本数据
  },

  registerAndLogIn : function (opts,cb) {
    // todo:用户注册并且登陆
  }

}
