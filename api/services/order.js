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
      createTime:dateformat(now,'isoDateTime'),
      validTime:dateformat(expire,'isoDateTime'),
      remark : JSON.stringify({
        title:opts.title,
        apptTime:opts.apptTime,
        apptPlace:opts.apptPlace,
        expectSalary:opts.expectSalary,
        tags:opts.tags
      }),
    }
    Order.create(newOrder).exec(function(err,order){
      if(err) return cb(err)
      var result={
        orderID:order.orderID
      };
      //想雇主，服务员，管理员发微信消息
      async.parallel([
        function(next){
          User.find({userID:order.userID}).exec(function(err,userInfo){
            if(err) return next(err);
            if(userInfo == '') return next('用户为空');
            userInfo[0].genderName='';
            if(userInfo[0].gender==1) userInfo[0].genderName='先生';
            else if(userInfo[0].gender==1) userInfo[0].genderName='女士'
            return next(null,userInfo[0]);
          })
        },
        function(next) {
          User.find({userID: order.servantID, role: 2}).exec(function (err, servantInfo) {
            if (err) return next(err);
            if (servantInfo == '') return next('用户为空');
            return next(null, servantInfo[0]);
          })
        }
      ],function(err,results){
        newOrder.apptTime= opts.apptTime,'yyyy-mm-dd HH:MM:ss';
        newOrder.apptPlace=opts.apptPlace;
        newOrder.createTime=dateformat(newOrder.createTime,'yyyy-mm-dd HH:MM:ss');
        newOrder.validTime=dateformat(newOrder.validTime,'yyyy-mm-dd HH:MM:ss');
        msg=[newOrder,results[0],results[1]];
        WxMessage.sendWxMsgAfterOrderDone(msg);
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
      'FROM `Dict` `d` WHERE (( `d`.`columnName` = "order.stauts") AND (`d`.`value` = `od`.`status`) )),"") AS `status`,od.createTime,remark,od.`validTime` ' +
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
        orderList[x].createTime = dateformat(orderList[x].createTime,'yyyy-mm-dd HH:MM:ss'),
        orderList[x].validTime = dateformat(orderList[x].validTime,'yyyy-mm-dd HH:MM:ss'),
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
    //Order.find({orderID:opts.orderID}).exec(function(err,orderInfo){
    //  if (err) return res.send('{"msgNo":"9999","msgInfo":"请您稍后再试"}');
    //  var str = JSON.stringify(orderInfo[0]);
    //  var result = util.format('{"msgNo":"0000","msgInfo":"查询成功","data":%s}', str);
    //  res.send(result);
    //})
    Order.find(opts).exec(function(err,order){
      //todo 订单过期 提示过期
      if(err) return cb(err);
      order = order[0];
      User.find({userID:order.servantID}).exec(function(err,servant) {
        if(err) return cb(err);
        order.servantName=servant[0].userName||'';
        order.expectSalary=JSON.parse(order.remark).expectSalary||'';
        order.apptTime=JSON.parse(order.remark).apptTime||'';
        order.apptPlace=JSON.parse(order.remark).apptPlace||'';
        order.month=JSON.parse(order.remark).month||'';
        order.fristService=JSON.parse(order.remark).fristService||'';
        order.servPrice=JSON.parse(order.remark).servPrice||'';
        order.salary =JSON.parse(order.remark).salary ||'';
        order.cutPrice =JSON.parse(order.remark).cutPrice ||'';
        order.commission =JSON.parse(order.remark).commission ||'';
        order.createTime = dateformat(order.createTime,'yyyy-mm-dd HH:MM:ss'),
        order.validTime = dateformat(order.validTime,'yyyy-mm-dd HH:MM:ss'),
        cb(null,order);
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
