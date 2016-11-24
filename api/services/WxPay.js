var WXPay = require('weixin-pay');

var weixinConfig = require('../../config/wyhConfig.js').Weixin;

var async = require('async');

var wxpay = WXPay({
  appid:weixinConfig.appid,
  mch_id:weixinConfig.mch_id,
  partner_key: weixinConfig.partner_key, //微信商户平台API密钥

});

module.exports = {

  /**
   * 微信支付
   * @param opts js对象，openid,total_fee,out_trade_no
   * @param next 回调函数 next(err,result) 下一步需要执行的方法  err为错误信息  result为结果
   */
  getBrandWCPay : function (opts,cb) {

    //todo 商品信息写入detail，body属性
    wxpay.getBrandWCPayRequestParams({
      openid:opts.openid,
      body:opts.body,
      //detail: '{"goods_detail": [{"goods_id": "iphone6s_16G","wxpay_goods_id": "1001","goods_name": "iPhone6s 16G","quantity": 1,"price": 528800,"goods_category": "123456","body": "苹果手机"}]}',
      out_trade_no: opts.outTradeNo, //微元汇系统订单号
      total_fee: opts.salary+opts.servicePrice,
      spbill_create_ip: '112.193.91.16',
      notify_url: 'http://1k5x895985.iask.in/ok'
    }, function(err, result){
      if (err) return cb(err);
      return cb(null,result);
    });
  },

  wxPay : function (opts,cb) {
    console.log(weixinConfig);
    async.waterfall([
      function(next){
        sails.log.debug(opts);
        User.findOne({userID:opts.userID}).exec(function(err,user){
          if(err)  next(err);
          sails.log.debug(user);
          opts.openid=user.openid;
          sails.log.debug(opts);
          next(null,opts)
        })
      },
      WxPay.getBrandWCPay
      ],
    function(err,result){
      if (err) return cb(err);
      return cb(null,result);
    });
  }

}
