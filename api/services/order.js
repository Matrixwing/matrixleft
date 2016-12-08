/*
* 下单相关的服务
*
*
*/
//https://github.com/felixge/node-dateformat
var dateformat = require('dateformat');
var util = require('util');
var async = require('async');
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
        expectSalary:opts.expectSalary,
        tags:opts.tags
      }),
    }
    console.log(newOrder);
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

          WxMessage.sendPayMsgToUser(msg,function(err,result){
            if(err) return next(err)
            return next(null,result);
          });
        },
        function(next){//发管理员通知
          User.find({userID:order.userID}).exec(function(err,user){
            user=user[0];
            if(err) if(err) return next(err);
            User.find({userID:order.servantID}).exec(function(err,servant){
              servant=servant[0];
              if (err) return next(err);
              if (servant){
                var invMsg = util.format('雇主%s,%s 邀请服务员%s,%s于%s在%s面试',user.userName,user.phone,servant.userName,servant.phone,opts.apptTime,opts.apptPlace);
                var msg = {
                  apptTime:opts.apptTime,
                  msg:invMsg,
                  tags:opts.tags
                }

                WxMessage.sendPayMsgToAdmin(msg,function(err,result){
                  if(err) return next(err)
                  return next(null,'result');
                });
              }
            })
          })
        }
      ],function(err,result){
        console.log('----err-----------------',err);
        console.log('-------result-----------',result);
      })
      return cb(null,result)
    })
  },

  //取得订单列表
  getOrderList : function(opts,cb){
    //todo 过期的等待支付？
    var exprieString = '';
    var statusString = '';

    if(opts.status==0){statusString=' and od.status ='+opts.status };
    if(opts.status==1){exprieString = 'AND NOW() < od.`validTime` ';statusString=' and od.status ='+opts.status };
    if(opts.status==2){statusString=' and od.status ='+opts.status };


    var queryString = util.format('SELECT od.`orderID`,(SELECT  userName FROM `user` u WHERE u.userID = od.servantID) AS servantName,IFNULL((SELECT  `d`.`define`  ' +
      'FROM `Dict` `d` WHERE (( `d`.`columnName` = "order.stauts") AND (`d`.`value` = `od`.`status`) )),"") AS `status`,remark,od.`validTime` ' +
      ' FROM`order` od  WHERE od.`userID` = %s  %s   %s ORDER BY validTime DESC limit %s,%s;',opts.userID,statusString,exprieString,opts.start,opts.limit);

    var countString = util.format('SELECT count(orderID) as totalRow '+
      ' FROM`order` od  WHERE od.`userID` = %s  %s %s  ORDER BY validTime DESC',opts.userID,statusString,exprieString);

    async.parallel([
      function(next){
        Order.query(queryString,(function(err,orderList){
          if(err) return next(err);
          return next(null,orderList)
        }))
      },
      function(next){
        Order.query(countString,(function(err,orderList){
          if(err) return next(err);
          return next(null,orderList)
        }))
      },

    ],function(err,results){

      if(err) return cb(err);

      var orderList = results[0];
      for ( var x in orderList ){
        orderList[x].apptTime = JSON.parse(orderList[x].remark).apptTime;
        orderList[x].expectSalary =JSON.parse(orderList[x].remark).expectSalary;
        delete orderList[x].remark;
      }

      var newResults = {
        orderList : orderList,
        totalPages : Math.ceil(results[1][0].totalRow/opts.limit)
      };

      cb(null,newResults);
    })

  },

  //订单详情
  getOrderDetail :  function(opts,cb){
    Order.find(opts).exec(function(err,order){
      //todo 订单过期 提示过期
      if(err) return cb(err);
      User.find({userID:order[0].servantID}).exec(function(err,servant) {
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

  },

  buyIns : function (opts,cb){
    var insInfo = {
      orderID:opts.orderID,
      beneficiaryID:opts.userID,
      status : 1,
      remark:JSON.stringify({
        userName:opts.userName,
        IDCard:opts.IDCard
      })
    };
    InsOrder.create(insInfo).exec(function(err,Ins){
      if(err) return cb(err);
      return cb(null,Ins);
    })
  },


}
