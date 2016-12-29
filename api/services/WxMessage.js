/*
*用于使用微信公众号消息模版发送微信消息给用户
* 消息模版需要在公众页面进行配置
 */
var weixinConfig = sails.config.weixin;
var https = require('https');
var request = require('request');
var util = require('util');
module.exports = {

  /**
   * 下单完成之后
   * 向服务员，用户，管理员分别发送消息提示
   * 在下单完成之后即可调用
   *
   * @api public
   * @param  {Object} `opts`  需要发送的信息，{[订单信息]，[用户信息]，[服务员信息]}
   * @param {Function} cb
   * @return {*}
   */
  sendWxMsgAfterOrderDone : function(opts,cb){
    async.parallel([
      function(next){//发面试邀请
        var msg = {
          openid : opts[2].openid,
          apptTime:opts[0].apptTime,
          apptPlace:opts[0].apptPlace,
          remark :util.format('雇主%s%s,电话%s 邀请您面试。请及时回应邀请哦',opts[1].userName,opts[1].genderName,opts[1].phone),
        }
        WxMessage.sendInterviewToSeverant(msg,function(err,result){
          if(err) return next(err)
          return next(null,result);
        });
      },
      function(next){//向用户发支付信息或者成功预约通知
        var msg = {
          openid : opts[1].openid,
          orderID:opts[0].orderID,
          createTime:opts[0].createTime,
          validTime:opts[0].validTime,
          servantStatus:opts[2].status
        }
        if(msg.servantStatus==2){
          WxMessage.sendPayMsgToUser(msg,function(err,result){
            if(err) return next(err)
            return next(null,result);
          });
        }else{
          WxMessage.sendApptMsgToUser(msg,function(err,result){
            if(err) return next(err)
            return next(null,result);
          })
        }
      },
      function(next){//发管理员通知
        var invMsg = util.format('雇主%s%s，电话%s 邀请服务员%s%s，%s于%s在%s面试',opts[1].userName,opts[1].genderName,opts[1].phone,opts[2].userName,opts[2].genderName,opts[2].phone,opts[0].apptTime,opts[0].apptPlace);
        var msg = {
          apptTime:opts[0].apptTime,
          msg:invMsg,
          remark:'点击即可开始处理'
        }
        WxMessage.sendPayMsgToAdmin(msg,function(err,result){
          if(err) return next(err)
          return next(null,'result');
        })
      }
    ],function(err,result){
      console.log('----err-----------------',err);
      console.log('-------result-----------',result);
    })
  },

  //给雇主发支付通知
  //待支付订单提醒
  sendPayMsgToUser: function (opts,cb) {
    WxAccess.validateToken(function(err,token){
      var post_data = JSON.stringify({
        touser:opts.openid,
        template_id:weixinConfig.perPayTemp,
        url:weixinConfig.perPayUrl,
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
            value:"面试结束后即可点击完成支付哦~",
            color:"#173177"
          },
        }
      });
      console.log('sendPayMsgToUser',post_data);
      request({
        url: "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token="+token.access_token,
        method: 'POST',
        body: post_data,
      }, function(err, response, body){
        console.log(body);
      });

    })
  },

  /**
   * 下单完成之后
   * 如果预约的服务员是2b的服务员，那么像用户发送预约成功消息
   * @api private
   * @param  {Object} `opts`  需要发送的信息
   * @param {Function} cb
   * @return {*}
   */
  sendApptMsgToUser : function(opts,cb){
      WxAccess.validateToken(function(err,token){
        var postData = JSON.stringify({
          touser: opts.openid,
          template_id: weixinConfig.newApptTemp,
          data: {
            first: {
              value: "预约成功!稍后会有工作人员与您联系:D",
              color: "#173177"
            },
            keyword1: {
              value: opts.orderID,
              color: "#173177"
            },
            keyword2: {
              value: '等待面试',
              color: "#173177"
            },
            keyword3: {
              value: '面试时协商',
              color: "#173177"
            },
            //remark: {
            //  value: opts.remark,
            //  color: "#173177"
            //},
          }
        });

        request({
          url: "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=" + token.access_token,
          method: 'POST',
          body: postData,
        }, function (err, response, body) {
          console.log(body);
        });
      })
  },

  //发送消息给管理员，告知管理员订单情况
  //目前发给whl，ljh，tj，老李，田野，后续需要发给 user.role == 4 即运营人员
  sendPayMsgToAdmin : function (opts,cb){
    WxAccess.validateToken(function(err,token){
      for(var admin in weixinConfig.adminOpenid) { //目前发给whl，ljh，tj，老李四个人这固定的四人，后续需要发给 user.role == 4 即运营人员
        var post_data = JSON.stringify({
          touser: weixinConfig.adminOpenid[admin].openid,
          template_id: weixinConfig.newOrderTemp,
          url:weixinConfig.url+'manage/manageOrder.html',
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
              value: opts.remark,
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
        data:{
          first: {
            value:"您有一条面试邀请",
            color:"#173177"
          },
          keyword1: {
            value:"家政服务",
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
            //value:opts.tags,
            value:opts.remark,
            color:"#173177"
          },
        }
      });
      console.log('post_data',post_data);
      request({
        url: "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token="+token.access_token,
        method: 'POST',
        body: post_data,
      }, function(err, response, body){
        console.log(body);
      });
    })
  },

  sendCoApplyToAdmin : function(opts,cb){
    WxAccess.validateToken(function(err,token){
      for(var admin in weixinConfig.adminOpenid) { //发送给管理员
        var post_data = JSON.stringify({
          touser: weixinConfig.adminOpenid[admin].openid,
          template_id: weixinConfig.newCompTemp,
          data: {
            first: {
              value: "有新的小伙伴申请加入微元汇",
              color: "#173177"
            },
            keyword1: {
              value: opts.branchName,
              color: "#173177"
            },
            keyword2: {
              value: '成都',
              color: "#173177"
            },
            keyword3: {
              value: opts.applyTime,
              color: "#173177"
            },
            keyword4: {
              value: opts.userInfo,
              color: "#173177"
            },
            remark: {
              //value:opts.tags,
              value: '机会不容错过，大家奔走相告',
              color: "#173177"
            },
          }
        });
        console.log('post_data', post_data);
        request({
          url: "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=" + token.access_token,
          method: 'POST',
          body: post_data,
        }, function (err, response, body) {
          console.log(body);
          return cb(null,body);
        });
      }
    })

  }
}
