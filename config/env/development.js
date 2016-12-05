/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMongodbServer'
  // }
  weixin:{
    appid : 'wx8306afd398ab31e5',
    appsecret:'8241fcf80a1271ab62715838c66fec41',
    access_token:'',
    mch_id:'1402095402',
    partner_key:'qd20160725scfkilejlmatrix7u8x0kd',//微信商户平台API密钥
    url:'http://wyh.matrixwing.com',//公众号的域名
    notify_url : 'http://wyh.matrixwing.com/notice',
    loginPage : 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8306afd398ab31e5&redirect_uri=' +
    'http%3a%2f%2fwyh.matrixwing.com%2fweixinLogIn&response_type=code&scope=snsapi_userinfo&state=needlogin#wechat_redirect',//通过微信的授权登录的页面
    //运营人员的openid，发送订单提醒时使用
    //目前发给whl，ljh，tj，老李四个人这固定的四人，后续需要发给 user.role == 4 即运营人员
    adminOpenid : [{openid:'ovSs8w7mUy1j1SkeLBsmWpjVpkGM'},{openid:'ovSs8w80wR9UoqpP5oROHe84QcqM'},{openid:'ovSs8w4905MKwk0k57Kztf1YYxfw'},{openid:'ovSs8w_eUu_OrGgSXvpwPF6sY1c0'}]
    //appid : 'wx63ace09080406d46',
    //appsecret:'ef65f9b655db88606885742d5e2c41d7',
    //access_token:'',
    //notify_url : 'http://1k5x895985.iask.in/ok',
  }

};
