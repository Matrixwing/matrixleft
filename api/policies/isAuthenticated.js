/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: 判断是否登陆
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
var wyhCon=sails.config.weixin;

module.exports = function(req, res, next) {
  // If `req.session.userID` 则表示已经登录过了
  console.log('isAuthenticated',req.session.userID);
  req.session.page=req.headers['referer'];
  if (req.session.userID){
    return next();
  };

  //  异步处理请求比如ajax
  if (req.wantsJSON) {
    return res.send(401,"{'loginPage':'"+wyhCon.loginPage+"'}");

  }

  return res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8306afd398ab31e5&redirect_uri=http%3a%2f%2fwyh.matrixwing.com%2fweixinLogIn&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect');
};
