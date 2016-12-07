var WXPay = require('weixin-pay');

var weixinConfig = sails.config.weixin;
var crypto=require('crypto');
var async = require('async');
var util = require('util');

var wxpay = WXPay({
  appid:weixinConfig.appid,
  mch_id:weixinConfig.mch_id,
  partner_key: weixinConfig.partner_key, //微信商户平台API密钥
});

module.exports = {

  /**
   * 微信支付，请求预支付码
   * @param opts js对象，openid,total_fee,out_trade_no
   * @param next 回调函数 next(err,result) 下一步需要执行的方法  err为错误信息  result为结果
   */
  getBrandWCPay : function (opts,cb) {
    //todo spbill_create_ip，detail
    console.log('opts',opts);
    wxpay.getBrandWCPayRequestParams({
      openid:opts.openid,
      body:opts.body,
      //detail: '{"goods_detail": [{"goods_id": "iphone6s_16G","wxpay_goods_id": "1001","goods_name": "iPhone6s 16G","quantity": 1,"price": 528800,"goods_category": "123456","body": "苹果手机"}]}',
      out_trade_no: opts.outTradeNo, //微元汇系统订单号
      //total_fee: opts.total_fee,
      total_fee: 1,
      //spbill_create_ip: '112.193.91.16',
      notify_url: weixinConfig.notify_url
    }, function(err, result){
      if (err){
        return cb(err);
      }else{
        //前端调用微信jsapi需要signature
        WxTicket.validateTicket(function(err,tickect){
          if(err) return cb(err);
          var  signString=util.format('jsapi_ticket=%s&noncestr=%s&timestamp=%s&url=%s',tickect.ticket,result.nonceStr,result.timeStamp,weixinConfig.url+opts.payUrl);
          var sha1=crypto.createHash("sha1");
          var signature=sha1.update(signString);
          signature = sha1.digest('hex');
          result.signature=signature;
          return cb(null,result);
        })

        //return cb(null,result);
      }

    });
  },

  wxPay : function (opts,cb) {
    async.waterfall([
        function(next){//获取openid
          sails.log.debug(opts);
          User.findOne({userID:opts.userID}).exec(function(err,user){
            if(err)  next(err);
            //sails.log.debug(user);
            opts.openid=user.openid;
            sails.log.debug(opts);
            next(null,opts)
          })
        },
        function(opts,next){//计算价格，组织支付信息
          ServPrice.find({id:opts.servPriceID}).exec(function(err,price){
            console.log(err);
            console.log(price);
            if(err) return next(err);
            if(price=='') {
              opts.servPrice=0;
              opts.servName=''
            }else{
              opts.servPrice=price[0].servPrice;
              opts.servName=price[0].servName;
            }
            //计算折扣价格
            opts.cutPrice=0;
            if(opts.month==3){opts.cutPrice=1000;}
            else if(opts.month==6){opts.cutPrice=1500;}
            else if(opts.month==12){opts.cutPrice=10000;}

            console.log('-----------------------',opts);

            opts.total_fee=(opts.salary+opts.servPrice)*opts.month-opts.cutPrice;//没有手续费的价格
            console.log('2222222',opts.total_fee);
            opts.total_fee*=1.006;
            opts.total_fee=Math.ceil(opts.total_fee);
            console.log('3333333',opts.total_fee);
            opts.body = util.format('微元汇-%s型%s月家政服务',opts.servName,opts.month);
            next(null,opts)
          })
        },
        WxPay.getBrandWCPay
      ],
      function(err,result){
        if (err) return cb(err);
        return cb(null,result);
      });
  },

 completePay:function(opts,cb){
   //console.log(req.body);
   //todo 校验签名
   //todo 数据库锁



}
}
