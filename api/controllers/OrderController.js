/**
 * OrderController
 *
 * @description :: 下单接口相关
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var async = require('async');
var util = require('util');

module.exports = {
  order : function(req,res){
    //------------------------------
    var opts = {
      userID:req.session.userID,
      openid:req.session.openid,
      servantID:req.param('servantID',''),
      tags :req.param('tags'),
      // totalfee:req.getParams('totalFee',null),
      apptTime:req.param('apptTime',''), //预约时间
      apptPlace:req.param('apptPlace',''),
      userName: req.param('userName',''),
      phone   : req.param('phone',''),
      expectSalary : req.param('expectSalary'),
      title:req.param('title','家政服务'),
    };

    //todo 需要参数处理:apptTime
    if(opts.servantID==''||opts.apptPlace==''||opts.apptTime==''){
      res.send('{"msgNo":"9999","msgInfo":"参数错误"}');
    }

    if(opts.userID==opts.servantID){
      return res.send('{"msgNo":"9999","msgInfo":"对不起，不能预约您自己"}');
    }
    if(opts.tags!==''){opts.tags=JSON.parse(opts.tags)}

    //todo 后续需要后台判断身份证和姓名
    if(opts.userName==''&& opts.phone == '') {
      User.find({userID:opts.servantID}).exec(function(err,servant) {
        if (err) return res.send('{"msgNo":"9999","msgInfo":"请您稍后再试"}');
        //写入expectSalary，前端需要
        opts.expectSalary=servant[0].expectSalary;
        order.order(opts, function (err, result) {
          if (err) return res.send('{"msgNo":"9999","msgInfo":"请您稍后再试"}');
          var str = JSON.stringify(result);
          result = util.format('{"msgNo":"0000","msgInfo":"预约成功","data":%s}', str);
          res.send(result);
        })
      })
    }else{
      //完善用户姓名和身份证 后续需要修改
      User.update({userID:opts.userID},{userName:opts.userName,phone:opts.phone}).exec(function(err,user) {
        User.find({userID: opts.servantID}).exec(function (err, servant) {
          if (err) return res.send('{"msgNo":"9999","msgInfo":"请您稍后再试"}');
          //写入expectSalary，前端需要

          opts.expectSalary = servant[0].expectSalary;
          if (err) return res.send('{"msgNo":"9999","msgInfo":"请您稍后再试"}');
          order.order(opts, function (err, result) {
            if (err) return res.send('{"msgNo":"9999","msgInfo":"请您稍后再试"}');
            var str = JSON.stringify(result);
            result = util.format('{"msgNo":"0000","msgInfo":"预约成功","data":%s}', str);
            res.send(result);
          })
        })
      })
    }
  },

  getOrderList : function (req,res) {
    var limit =req.param('limit',5);
    var opts = {
      userID : req.session.userID,
      status : req.param('status',100),//完成交易：0 等待交易：1 取消交易：2  全部：100
      limit  : limit,
      start  : (req.param('start',1)-1)*limit,
    };
    //var opts = {
    //  userID : req.session.userID,
    //  status : req.param('status',100),//完成交易：0 等待交易：1 取消交易：2  全部：100
    //  start  : 0,
    //  limit  : 5,
    //};
    //if(!opts.status||!opts.start||!opts.limit){
    //  return  res.send('{"msgNo":"9999","msgInfo":"参数错误"}');
    //}
    order.getOrderList(opts,function(err,orderList){
      if(err) return res.send('{"msgNo":"9999","msgInfo":"请您稍后再试"}');
      var str = JSON.stringify(orderList) ;
      var  result = util.format('{"msgNo":"0000","msgInfo":"查询成功","data":%s}',str);
      res.send(result);
    })
  },

  getOrderDetail : function (req,res){
    var opts = {
      userID : req.session.userID,
      orderID : req.param('orderID')
    };
    //todo 参数处理
    if(!opts.orderID){
      res.send('{"msgNo":"9999","msgInfo":"参数错误"}');
    }
    order.getOrderDetail(opts,function(err,result){
      if (err) return res.send('{"msgNo":"9999","msgInfo":"请您稍后再试"}');
      var str = JSON.stringify(result);
      result = util.format('{"msgNo":"0000","msgInfo":"查询成功","data":%s}', str);
      res.send(result);
    });
  },

  buyIns:function(req,res){
    var opts = {
      userID : req.session.userID,
      IDCard : req.param('IDCard',''),
      userName  : req.param('userName',''),
      orderID : req.param('orderID',''),
    };

    if(opts.userID==''||opts.IDCard==''||opts.userName==''||opts.orderID==''){
      res.send('{"msgNo":"9999","msgInfo":"参数错误"}');
    }
    order.buyIns(opts,function(err,ins){
      if(err) return res.send('{"msgNo":"9999","msgInfo":"请您稍后再试"}');
      var str = JSON.stringify(ins);
      var result = util.format('{"msgNo":"0000","msgInfo":"成功","data":%s}', str);
      res.send(result);
    })
  }
};

