/**
 * PayController
 *
 * @description :: Server-side logic for managing pays
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var util = require('util');
module.exports = {
	pay : function(req,res){
    //var opts = {
    //  userID:req.session.userID,
    // // totalfee:req.getParams('totalFee',null),
    //  salary:req.param('salary',0),
    //  servicePrice:req.param('servicePrice',null),
    //  body:'微元汇-测试支付',                           //暂时写死
    //  outTradeNo:req.param('orderId',null),
    //};
    //测试数据
    var opts = {
      userID:242,
      // totalfee:req.getParams('totalFee',null),
      salary:0,
      servicePrice:1,
      body:'微元汇-测试支付',
      outTradeNo:'99999999',
      payUrl:req.param('payUrl',req.originalUrl)//当前支付网页的URL
    };

    if(!(opts.outTradeNo&&opts.servicePrice)){
      return res.send('{"msgNo":"9999","msgInfo":"参数错误"}');
    }
    WxPay.wxPay(opts,function(err,result){
      if (err) return res.send('{"msgNo":"9999","msgInfo":"服务出错，请您稍后再试","data":'+JSON.stringify(err) +'}');
      //sails.log.debug(result);
      var result = JSON.stringify(result) ;
      result = util.format('{"msgNo":"0000","msgInfo":"","data":%s}',result);
      return res.send(result);
    })
  },

};

