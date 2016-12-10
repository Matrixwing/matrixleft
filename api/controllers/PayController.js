/**
 * PayController
 *
 * @description :: Server-side logic for managing pays
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var util = require('util');
var myutil =require('../util/util.js');
//var WXPay = require('weixin-pay');
module.exports = {
  pay : function(req,res){
    var opts = {
      userID:req.session.userID,
      outTradeNo:req.param('orderId',null),
      servPriceID:parseInt(req.param('servicePriceID',0)),       //将字符串转换成数字，流程完善之后有服务端传入数字 参数验证
      //servPriceID:1,                    //将字符串转换成数字，流程完善之后有服务端传入数字
      //salary:1,                         //将字符串转换成数字，流程完善之后有服务端传入数字
      salary:parseInt(req.param('salary'))*100,
      commission:parseInt(req.param('commission',0)),
      totalFee:parseInt(req.param('totalFee',0)),
      firstService:req.param('firstService'),
      month:parseInt(req.param('month',1)),
      cutPrice:parseInt(req.param('cutPrice',0)),
      body:'',
      ip:req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress,
      payUrl:req.param('payUrl',req.headers['referer'])//当前支付网页的URL
    };
    console.log('req.body111111111111',req.body);
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
      sails.log.debug(result);
      var result = JSON.stringify(result) ;
      result = util.format('{"msgNo":"0000","msgInfo":"","data":%s}',result);
      return res.send(result);
    })
  },
  notice : function(req,res){
    /*
     { xml:
     { appid: [ 'wx8306afd398ab31e5' ],
     bank_type: [ 'BOC_DEBIT' ],
     cash_fee: [ '1' ],
     fee_type: [ 'CNY' ],
     is_subscribe: [ 'Y' ],
     mch_id: [ '1402095402' ],
     nonce_str: [ 'tQIf9LEQFbzT8CJoJpfVBhbxUXJJSmpc' ],
     openid: [ 'ovSs8w7mUy1j1SkeLBsmWpjVpkGM' ],
     out_trade_no: [ '201612081146549039' ],
     result_code: [ 'SUCCESS' ],
     return_code: [ 'SUCCESS' ],
     sign: [ 'E176BA8F4676EFEC56C45DE7B20A08BA' ],
     time_end: [ '20161208115437' ],
     total_fee: [ '1' ],
     trade_type: [ 'JSAPI' ],
     transaction_id: [ '4003152001201612082142160784' ] } }
     */
    //todo 成功失败
    console.log(req.body);
    var msg=req.body.xml
    var opts = {
      appid:msg.appid[0],
      nonce_str:msg.nonce_str[0],
      sign:msg.sign[0],
      result_code:msg.result_code[0],
      openid:msg.openid[0],
      totalFee:msg.total_fee[0],
      transactionID:msg.transaction_id[0],//微信的订单号
      orderID:msg.out_trade_no[0],          //系统的订到号
      resultCode:msg.return_code[0],
      returnCode:JSON.stringify(msg),
      paidTime:myutil.formateDate(msg.time_end[0]),
    }
    console.log(opts);
    WxPay.completePay(opts,function(err,result){
      console.log(err);
      console.log(result);
      if(err) return res.end(myutil.buildXML({ xml:{ return_code:'FAIL' } }));
      return  res.end(myutil.buildXML({ xml:{ return_code:'SUCCESS' } }));
    })
    //res.end(myutil.buildXML({ xml:{ return_code:'SUCCESS' } }));
    //res.end(myutil.buildXML({ xml:{ return_code:'SUCCESS' } }));
    ////WxMessage.sendPayMsgToUser()
    ////res.success();
    //WxPay.test(req.body,res,function(err,rest){
    //  // 处理商户业务逻辑
    //  console.log(rest);
    //  // res.success() 向微信返回处理成功信息，res.fail()返回失败信息。
    //  //res.success();
    //})
  },

  getTotaoFee : function(req,res) {
    var opts = {
      month:req.param(),
    }

  }

};

