/**
 * PayController
 *
 * @description :: Server-side logic for managing pays
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var util = require('util');
module.exports = {
	pay : function(req,res){
    var opts = {
      userID:req.session.userID,
      outTradeNo:req.param('orderId',null),
      servPriceID:parseInt(req.param('servicePriceID',0)),       //将字符串转换成数字，流程完善之后有服务端传入数字
      //servPriceID:1,       //将字符串转换成数字，流程完善之后有服务端传入数字
      salary:1,                         //将字符串转换成数字，流程完善之后有服务端传入数字
      commission:parseInt(req.param('commission',0)),
      firstService:parseInt(req.param('firstService')),
      month:parseInt(req.param('month',1)),
      cutPrice:parseInt(req.param('cutPrice',0)),
      body:'微元汇-家政服务',                                        //暂时写死
      payUrl:req.param('payUrl',req.headers['referer'])//当前支付网页的URL
    };

    ////-------------测试数据-----------------
    //var opts = {
    //  userID:req.session.userID,
    //  // totalfee:req.getParams('totalFee',null),
    //  salary:0,
    //  servicePrice:1,
    //  body:'微元汇-测试支付',
    //  outTradeNo:req.param('orderId','null'),
    //  outTradeNo:'8888447',
    //  payUrl:req.param('payUrl',req.originalUrl)//当前支付网页的URL
    //};
    //opts.userID=249;   //todo 测试时使用 正式坏境删除
    ////--------------------------------------
    //console.log(opts);
    if(!(opts.outTradeNo)){
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

  notice : function(req,res){
    console.log(req);
    console.log(req.body);
    console.log(req.param('return_code'));
    console.log(req.param('return_msg'));
    //WxMessage.sendPayMsgToUser()
  }
};

