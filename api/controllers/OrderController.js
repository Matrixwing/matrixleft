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
      servantID:req.param('servantID'),
      tags :req.param('tags'),
      // totalfee:req.getParams('totalFee',null),
      apptTime:req.param('apptTime'), //预约时间
      apptPlace:req.param('apptPlace'),
    };
    //--------------------------------------

    //--------------测试----------------
    //var opts = {
    //  userID:req.session.userID,
    //  servantID:6,
    //  tags : ['sdf','sdfasd','sdfa'],
    //  // totalfee:req.getParams('totalFee',null),
    //  apptTime:Date.now(), //预约时间
    //  apptPlace:'sdff',
    //};
    //--------------------------------------
    console.log(opts);
    //todo 需要参数处理
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
    var opts = {
      userID : req.session.userID,
      status : req.param('status','100'),//完成交易：0 等待交易：1 取消交易：2
    };
  },

  getOrderDetail : function (req,res){
    var opts = {
      userID : req.session.userID,
      orderID : req.param('orderID')
    };
    //todo 参数处理

    order.getOrderDetail(opts,function(err,result){
      if (err) return res.send('{"msgNo":"9999","msgInfo":"服务出错，请您稍后再试","data":' + JSON.stringify(err) + '}');
      var str = JSON.stringify(result);
      result = util.format('{"msgNo":"0000","msgInfo":"查询成功","data":%s}', str);
      res.send(result);
    });

  }
};

