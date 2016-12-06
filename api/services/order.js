/*
* 下单相关的服务
*
*
*/
//https://github.com/felixge/node-dateformat
var dateformat = require('dateformat');
var util = require('util');
module.exports = {

  //下单
  order : function(opts,cb){
    var now = new Date(); //现在时间
    var expire=new Date(now.getTime()+10*24*60*60*1000); //过期时间
    var newOrder = {
      userID:opts.userID,
      orderID:dateformat(now,'yyyymmddHHMMss')+Math.random().toString().substr(2, 4),
      servantID:opts.servantID,
      createTime:dateformat(now,'isoUtcDateTime'),
      validTime:dateformat(expire,'isoUtcDateTime'),
      remark : JSON.stringify({
        apptTime:opts.apptTime,
        apptPlace:opts.apptPlace,
        tags:opts.tags
      }),
    }

    Order.create(newOrder).exec(function(err,order){
      if(err) return cb(err)
      console.log('order',order);
      var result={
        orderID:order.orderID
      };

      async.parallel([
        function(next){//发面试邀请
          User.find({userID:order.servantID,role:2}).exec(function(err,servant){
            if (err) return next(err);
            if (servant!=''){
              var msg = {
                openid:servant[0].openid,
                apptTime:opts.apptTime,
                apptPlace:opts.apptPlace,
                tags:opts.tags
              }
              console.log('发面试邀请',msg);
              WxMessage.sendInterviewToSeverant(msg,function(err,result){
                if(err) return next(err)
                return next(null,result);
              });
            }
          })
        },
        function(next){//发支付信息
          var msg = {
            openid:opts.openid,
            orderID:order.orderID,
            createTime:order.createTime,
            validTime:order.validTime
          }
          console.log('发支付信息',msg);
          WxMessage.sendPayMsgToUser(msg,function(err,result){
            if(err) return next(err)
            return next(null,result);
          });
        },

        function(next){//发管理员通知
          User.find({userID:order.userID}).exec(function(err,user){
            console.log(user);
            if(err) if(err) return next(err);
            User.find({userID:order.servantID,role:2}).exec(function(err,servant){
              servant=servant[0];
              if (err) return next(err);
              if (servant!=''){
                var invMsg = util.format('雇主%s,%s 邀请服务员%s,%s于%s在%s面试',user.userName,user.phone,servant.userName,servant.phone,opts.apptTime,opts.apptPlace);
                var msg = {
                  apptTime:opts.apptTime,
                  msg:invMsg,
                  tags:opts.tags
                }
                console.log('发管理员通知',msg);
                WxMessage.sendPayMsgToAdmin(msg,function(err,result){
                  if(err) return next(err)
                  return next(null,'result');
                });
              }

            })
          })
        }
      ],function(err,result){
        console.log(err);
        console.log(result);
      })



      return cb(null,result)
    })

  },

  //取得订单列表
  getOrderList : function(opts,cb){

  },

  //订单详情
  getOrderDetail :  function(opts,cb){
    Order.find(opts).exec(function(err,order){
      //todo 订单过期 提示过期
      if(err) return cb(err);
      //console.log(err);
      //console.log(order);
      User.find({userID:order[0].servantID}).exec(function(err,servant) {
        //console.log(err);
        //console.log(servant);
        if(err) return cb(err);
        var orderInfo = {
          servantName:servant[0].userName,
          expectSalary:servant[0].expectSalary,
          orderID:order[0].orderID,
        };
        cb(null,orderInfo);
      })
    })
  },


  //服务员响应邀请
  answerInvitation : function(opt,cb){

  }

}
