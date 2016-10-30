/**
 * Created by Administrator on 2016/10/30.
 */

//todo 需要配置文件
TopClient = require('./aliSendMsg/topClient').TopClient;
//alidayu    = require('../config');
module.exports = {

  /**
   * 向手机发送验证码
   * @param opts js对象，需要有phone手机号和num验证码
   * @param next 回调函数 next(err,result) 下一步需要执行的方法  err为错误信息  result为结果
   */
  sendValidaNumToPhone : function (opts,next) {
    var toPhone = {
      phone : opts.phone  || null,
      num :    opts.num    || null,
    }
    if(!(toPhone.phone||toPhone.num)) return next('没有成功的发送短信');
    var client = new TopClient({
      'appkey':'23496956',
      'appsecret':'c85a8410b502dac9029aa5fb96e51548',
      'REST_URL':'http://gw.api.taobao.com/router/rest'});

    client.execute('alibaba.aliqin.fc.sms.num.send', {
        'extend':'123456',
        'sms_type':'normal',
        'sms_free_sign_name':'矩阵科技-微元汇',
        'sms_param':'{\"code\":'+toPhone.num+',\"product\":\"微元汇\"}',
        'rec_num':toPhone.phone,
        'sms_template_code':'SMS_24540103'
      },
      function (error,response) {
        if(!error)
          next(error);
        else
          next(null,response);
      })
  },

}
