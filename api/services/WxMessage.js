
var weixinConfig = sails.config.weixin;
var https = require('https');
var request = require('request');
module.exports = {

  //给雇主发支付通知
  //待支付订单提醒
  sendPayMsgToUser: function (opts,cb) {
    WxAccess.validateToken(function(err,token){
      var post_data = JSON.stringify({
        touser:opts.openid,
        template_id:weixinConfig.perPayTemp,
        //template_id:"aP5_YUw_lC4sJ8aqGpsQWGpA5DWdvIKQEkzyRTA2nKM",//pr
        //url:"http://1k5x895985.iask.in/index.html",
        //topcolor:"#FF0000",
        data:{
          first: {
            value:"您提交了订单，等待支付中",
            color:"#173177"
          },
          keyword1: {
            value:"家政服务",
            color:"#173177"
          },
          keyword2:{
            value:'面试时协商',
            color:"#173177"
          },
          keyword3:{
            value:opts.orderID,
            color:"#173177"
          },
          keyword4:{
            value:opts.createTime,
            color:"#173177"
          },
          keyword5:{
            value:opts.validTime,
            color:"#173177"
          },
          remark:{
            value:"您有条新的订单，点击完成支付",
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
  },


  //发送消息给管理员，告知管理员订单情况
  //目前发给whl，ljh，tj，老李四个人这固定的四人，后续需要发给 user.role == 4 即运营人员
  sendPayMsgToAdmin : function (opts,cb){
    WxAccess.validateToken(function(err,token){
      for(var admin in weixinConfig.adminOpenid) { //目前发给whl，ljh，tj，老李四个人这固定的四人，后续需要发给 user.role == 4 即运营人员
        var post_data = JSON.stringify({
          touser: weixinConfig.adminOpenid[admin].openid,
          template_id: weixinConfig.newOrderTemp,
          //template_id: "OCMXadGpWX4FJRQypnDqO4_GNuo-PVcM365QuB0CHzQ",//pr
          //url:"http://1k5x895985.iask.in/index.html",
          //topcolor:"#FF0000",
          data: {
            first: {
              value: "新的订单",
              color: "#173177"
            },
            keyword1: {
              value: opts.apptTime,
              color: "#173177"
            },
            keyword2: {
              value: opts.msg,
              color: "#173177"
            },
            remark: {
              value: opts.tags,
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
        template_id:weixinConfig.interTemp,
        //template_id:"4etMv_lqdemL4CTnOBSgZkm_lc0SmKZX-ycYh4ykm9s",//pr
        //url:"http://1k5x895985.iask.in/index.html",
        //topcolor:"#FF0000",
        data:{
          first: {
            value:"您有一条面试邀请",
            color:"#173177"
          },
          keyword1: {
            value:"家庭服务",
            color:"#173177"
          },
          keyword2:{
            value:opts.apptTime,
            color:"#173177"
          },
          keyword3:{
            value:opts.apptPlace,
            color:"#173177"
          },
          remark:{
            value:opts.tags,
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
