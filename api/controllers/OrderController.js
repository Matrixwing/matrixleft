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
    };
    //--------------------------------------

    ////--------------测试----------------
    //var opts = {
    //  userID:req.session.userID,
    //  openid:req.session.openid,
    //  servantID:6,
    //  tags : ['sdf','sdfasd','sdfa'],
    //  // totalfee:req.getParams('totalFee',null),
    //  apptTime:'2016-12-06 20:28', //预约时间
    //  apptPlace:'阳光春天',
    //};
    //--------------------------------------
    console.log(opts);
    //todo 需要参数处理:apptTime
    if(opts.servantID==''||opts.apptPlace==''||opts.apptTime==''){
      res.send('{"msgNo":"9999","msgInfo":"参数错误"}');
    }

    order.order(opts,function(err,result){
      console.log(err);
      console.log(result);
      if (err) return res.send('{"msgNo":"9999","msgInfo":"服务出错，请您稍后再试","data":'+JSON.stringify(err) +'}');
      var str = JSON.stringify(result) ;
      result = util.format('{"msgNo":"0000","msgInfo":"预约成功","data":%s}',str);
      res.send(result);
    })
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
      if(err) return res.send('{"msgNo":"9999","msgInfo":"服务出错，请您稍后再试"}');
      var str = JSON.stringify(orderList) ;
      result = util.format('{"msgNo":"0000","msgInfo":"查询成功","data":%s}',str);
      res.send(result);
    })
  },

  getOrderDetail : function (req,res){
    var opts = {
      userID : req.session.userID,
      orderID : req.param('orderID')
    };
    //todo 参数处理
    if(!opts.userID){
      res.send('{"msgNo":"9999","msgInfo":"参数错误"}');
    }
    order.getOrderDetail(opts,function(err,result){
      if (err) return res.send('{"msgNo":"9999","msgInfo":"服务出错，请您稍后再试","data":' + JSON.stringify(err) + '}');
      var str = JSON.stringify(result);
      result = util.format('{"msgNo":"0000","msgInfo":"查询成功","data":%s}', str);
      res.send(result);
    });

  }
};

