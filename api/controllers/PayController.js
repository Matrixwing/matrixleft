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
    console.log('1111111111111111111111111',req.body);
    var opts = {
      userID:req.session.userID,
      outTradeNo:req.param('orderId',null),
      servPriceID:parseInt(req.param('servicePriceID',0)),       //将字符串转换成数字，流程完善之后有服务端传入数字 参数验证
      //servPriceID:1,                    //将字符串转换成数字，流程完善之后有服务端传入数字
      //salary:1,                         //将字符串转换成数字，流程完善之后有服务端传入数字
      salary:parseInt(req.param('salary')),
      commission:parseInt(req.param('commission',0)),
      firstService:req.param('firstService'),
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
      sails.log.debug(result);
      var result = JSON.stringify(result) ;
      result = util.format('{"msgNo":"0000","msgInfo":"","data":%s}',result);
      return res.send(result);
    })
  },

  notice : function(req,res){

    console.log(req.param('return_code'));


    console.log(req.body);
    myutil.pipe(req.body, function(err,data){
      console.log('data',data);
      var xml = data.toString('utf8');
      myutil.parseXML(xml, function(err, msg){
        console.log('err',err);
        console.log('111111',msg);
        req.wxmessage = msg;
        console.log('111111',msg);
      });
    });
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

  wechat : function(req,res,next){
    console.log('sssssssssssssssssssssssssssssssssss');

    next(req,res)
  }


};

