//var weixinConfig = require('../../config/wyhConfig.js').Weixin;
var weixinConfig = sails.config.weixin;
var https = require('https');
var request = require('request');
module.exports = {
  sendPayMsgToUser: function (opts,cb) {
    WxAccess.validateToken(function(err,token){
      var post_data = JSON.stringify({
        touser:"ovSs8w7mUy1j1SkeLBsmWpjVpkGM",
        template_id:"ocGJIHW7voLu_sC3Hxo98MYddqQoLUaMKvpZq8XnvQ8",
        //url:"http://1k5x895985.iask.in/index.html",
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
  //目前发给whl，ljh，tj，老李四个人这固定的四人，后续需要发给 user.role == 4 即运营人员
  sendPayMsgToAdmin : function (opts,cb){
    WxAccess.validateToken(function(err,token){
      for(var admin in weixinConfig.adminOpenid) { //目前发给whl，ljh，tj，老李四个人这固定的四人，后续需要发给 user.role == 4 即运营人员
        var post_data = JSON.stringify({
          touser: admin.openid,
          template_id: "OCMXadGpWX4FJRQypnDqO4_GNuo-PVcM365QuB0CHzQ",
          //url:"http://1k5x895985.iask.in/index.html",
          //topcolor:"#FF0000",
          data: {
            first: {
              value: "新的订单来啦，快处理！",
              color: "#173177"
            },
            tradeDateTime: {
              value: "测试",
              color: "#173177"
            },
            customerInfo: {
              value: "测试",
              color: "#173177"
            },
            orderItemName: {
              value: "测试",
              color: "#173177"
            },
            orderItemData: {
              value: "测试",
              color: "#173177"
            },
            remark: {
              value: "测试",
              color: "#173177"
            },
          }
        });
        request({
          url: "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=" + token.access_token,
          method: 'POST',
          body: post_data,
        }, function (err, response, body) {
          console.log(body);
        });
      }
    })
  },

  //发送信息给保险业务员，告知保险情况
  sendMsgToInsure : function (opts,cb){
  },

  //发送面试邀请给服务服务员
  sendInterviewToSeverant : function(opts,cb){
    WxAccess.validateToken(function(err,token){
      var post_data = JSON.stringify({
        touser:opts.openid,
        template_id:"4etMv_lqdemL4CTnOBSgZkm_lc0SmKZX-ycYh4ykm9s",
        //url:"http://1k5x895985.iask.in/index.html",
        //topcolor:"#FF0000",
        data:{
          first: {
            value:"您有一条面试邀请",
            color:"#173177"
          },
          keyword1: {
            value:"职位",
            color:"#173177"
          },
          keyword2:{
            value:"时间",
            color:"#173177"
          },
          keyword3:{
            value:"地点",
            color:"#173177"
          },
          remark:{
            value:"备注信息",
            color:"#173177"
          },
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
}
