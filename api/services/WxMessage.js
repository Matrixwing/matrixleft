var weixinConfig = require('../../config/wyhConfig.js').Weixin;
var https = require('https');
var request = require('request');
module.exports = {
  sendPayMsgToUser: function (opts,cb) {
    WxAccess.validateToken(function(err,token){
      var post_data = JSON.stringify({
        touser:"ovSs8w7mUy1j1SkeLBsmWpjVpkGM",
        template_id:"ocGJIHW7voLu_sC3Hxo98MYddqQoLUaMKvpZq8XnvQ8",
        url:"http://1k5x895985.iask.in/index.html",
        //topcolor:"#FF0000",
        data:{
          first: {
            value:"测试",
            color:"#173177"
          },
          name: {
            value:"测试",
            color:"#173177"
          },
          remark:{
            value:"测试",
            color:"#173177"
          }
        }
      });
      request({
        url: "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token="+token.access_token,
        method: 'POST',
        body: post_data,
      }, function(err, response, body){
        console.log(body);
      });

    })
  },


  //发送消息给管理员，告知管理员订单情况
  sendPayMsgToAdmin : function (opts,cb){

  },

  //发送信息给保险业务员，告知保险情况
  sendMsgToInsure : function (opts,cb){

  },

  //发送面试邀请给服务服务员
  sendInterviewToSeverant : function(opts,cb){

  }
}
