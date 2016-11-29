/**
 * PayController
 *
 * @description :: Server-side logic for managing pays
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var util = require('util');
module.exports = {
	pay : function(req,res){
    //console.log(req);
    console.log(res.referrer);
    var opts = {
      userID:req.session.userID,
     // totalfee:req.getParams('totalFee',null),
      salary:parseInt(req.param('salary',1)),                         //将字符串转换成数字，流程完善之后有服务端传入数字
      servicePrice:parseInt(req.param('servicePrice',1)),       //将字符串转换成数字，流程完善之后有服务端传入数字
      body:'微元汇-测试支付',                                        //暂时写死
      outTradeNo:req.param('orderId',null),
      payUrl:req.param('payUrl',req.originalUrl)//当前支付网页的URL
    };

    //测试数据
    //var opts = {
    //  userID:req.session.userID,
    //  // totalfee:req.getParams('totalFee',null),
    //  salary:0,
    //  servicePrice:1,
    //  body:'微元汇-测试支付',
    //  outTradeNo:req.param('orderId','null'),
    //  outTradeNo:'8888887',
    //  payUrl:req.param('payUrl',req.originalUrl)//当前支付网页的URL
    //};
    console.log(opts);
    if(!(opts.outTradeNo&&opts.servicePrice)){
      return res.send('{"msgNo":"9999","msgInfo":"参数错误"}');
    }
    WxPay.wxPay(opts,function(err,result){
      if (err) return res.send('{"msgNo":"9999","msgInfo":"'+err+'"}');
      //sails.log.debug(result);
      var result = JSON.stringify(result) ;
      result = util.format('{"msgNo":"0000","msgInfo":"","data":%s}',result);
      return res.send(result);
    })
  },

};
