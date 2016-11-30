/**
 * MessageController
 *
 * @description :: Server-side logic for managing Messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var weixinConfig = require('../../config/wyhConfig.js').Weixin;
var https = require('https');
var request = require('request');
var querystring = require('querystring');

module.exports = {
  //发送信息
  //template_id:4etMv_lqdemL4CTnOBSgZkm_lc0SmKZX-ycYh4ykm9s 为服务员接收的面试邀请模板
  sendMessageToUser: function (req, res) {
    WxAccess.validateToken(function(err,token){
      var post_data = JSON.stringify( {
        touser:"ovSs8w80wR9UoqpP5oROHe84QcqM",
        template_id:"4etMv_lqdemL4CTnOBSgZkm_lc0SmKZX-ycYh4ykm9s",
        url:"http://1k5x895985.iask.in/index.html",
        //topcolor:"#FF0000",
        data:{
          first: {
            value:"您有一条新面试消息",
            color:"#173177"
          },
          keyword1:{
            value:"保姆",
            color:"#173177"
          },
          keyword2: {
            value:"2016-1-1-14:00",
            color:"#173177"
          },
          keyword3: {
            value:"东苑",
            color:"#173177"
          },
          remark:{
            value:"请做好准备，按时应邀面试",
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
  }

};

