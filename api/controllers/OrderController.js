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
      servantID:req.getParams('servantID'),
      tags : req.getParams('tags'),
      // totalfee:req.getParams('totalFee',null),
      apptTime:req.getParams('apptTime'), //预约时间
      apptPlace:req.getParams('apptPlace'),
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
      if (err) return res.send(500,'{"msgNo":"9999","msgInfo":"服务出错，请您稍后再试","data":'+JSON.stringify(err) +'}');
      if (result=='') return res.send(404,'{"msgNo":"8888","msgInfo":"对不起，没有找到您要信息"}');
      var str = JSON.stringify(result) ;
      result = util.format('{"msgNo":"0000","msgInfo":"查询到了信息","data":[%s]}',str);
      res.send(result);
    })
  },

  getOrderList : function (req,res) {
    var opts = {
      userID : req.session.userID,
      status : req.getParams('status','100'),//完成交易：0 等待交易：1 取消交易：2
    };

  },

  getOrderDetail : function (req,res){
    var opts = {
      userID : req.session.userID,
      orderID : req.getParams('orderID')
    };
  }
};

