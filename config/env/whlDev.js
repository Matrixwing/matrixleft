
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
    access_token:'',
    notify_url : 'http://1k5x895985.iask.in/notice',
    loginPage:'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx63ace09080406d46&redirect_uri=http%3a%2f%2f1k5x895985.iask.in%2fweixinLogIn&response_type=code&scope=snsapi_userinfo&state=needlogin#wechat_redirect'
  }
};
