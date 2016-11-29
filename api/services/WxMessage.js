var weixinConfig = require('../../config/wyhConfig.js').Weixin;
var https = require('https');
module.exports = {
  sendMessageToUser: function (req, res) {
    WxAccess.validateToken(function(err,token){
      console.log(token);
      var req = https.request(options,function(res){
        res,on('data',function(d){
          console.log(d);
        })
      })

      req.end();
      req.on('error',function(d){
        console.log(d);
      })

    })
  }
}
