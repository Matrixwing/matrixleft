module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMongodbServer'
  // }
  weixin:{
    appid : 'wx8ec4c9973e23c290',
    appsecret:'c137431a59f56f560f5861c7a5f7c182',
    access_token:'',
    mch_id:'1402095402',
    partner_key:'qd20160725scfkilejlmatrix7u8x0kd',//微信商户平台API密钥
    notify_url : 'http://15898oq619.iok.la/ok',
    loginPage:'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8ec4c9973e23c290&redirect_uri=' +
    'http%3a%2f%2f15898oq619.iok.la%2fweixinLogIn&response_type=code&scope=snsapi_userinfo&state=needlogin#wechat_redirect',//微信授权页面
  },
  qiniu:{
    avatarBucket : 'test',
    domain:'http://ogp0rwqj4.bkt.clouddn.com/',
    ACCESS_KEY:'AJKfZNP67TG_MEvBPvTFMpRVMnx2mMwx673ezHzn',
    SECRET_KEY :'_cEQvBddK7nrtaCcUCcsrc4Owj37zkzVJTjFMQ4p',
  }
};
