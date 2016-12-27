
module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMongodbServer'
  // }
  weixin:{
    appid : 'wx63ace09080406d46',
    appsecret:'ef65f9b655db88606885742d5e2c41d7',
    mch_id:'1402095402',
    partner_key:'qd20160725scfkilejlmatrix7u8x0kd',//微信商户平台API密钥
    access_token:'',
    url:'http://1k5x895985.iask.in/',
    notify_url : 'http://1k5x895985.iask.in/notice',
    loginPage:'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx63ace09080406d46&redirect_uri=http%3a%2f%2f1k5x895985.iask.in%2fweixinLogIn&response_type=code&scope=snsapi_userinfo&state=needlogin#wechat_redirect',
    adminOpenid : [{openid:'oD7UUwN27b2-ROCqYyfWgVtIwcOs'}],
    perPayTemp:'_xuKsTWtEL8w_eg-n2tZtLY-i_VvKJksSlO-RrB98HI',//待支付订单提醒
    interTemp: 'vZCuH9JB73JzWrxXK322Lf5dfGsQrEm8-olG-jM7Hvs',//面试通知
    newOrderTemp:'FQa1YyjBO8WaECPc3DlzZpjjBkNC2_ROPiGq7WV84dU',//新订单通知
    newApptTemp:'yvlciVi1v5RTzjC2aCztCSJKKp3iAF-LoP3N-EyQkc8',//新预约通知
  },

  qiniu:{
    avatarBucket : 'test',
    domain:'http://ogp0rwqj4.bkt.clouddn.com/',
    ACCESS_KEY:'AJKfZNP67TG_MEvBPvTFMpRVMnx2mMwx673ezHzn',
    SECRET_KEY :'_cEQvBddK7nrtaCcUCcsrc4Owj37zkzVJTjFMQ4p',
  }

};
