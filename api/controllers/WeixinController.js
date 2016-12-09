/**
 * WeixinController
 *
 * @description :: 和微信api相关
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var util=require('util');
module.exports = {

	jsApiAccess : function(req,res){
    var opts = {
      curUrl : req.param('curUrl',req.headers['referer']),
    };
    console.log(opts);
    WxJsApi.getAccess(opts,function(err,result){
      if (err) return res.send('{"msgNo":"9999","msgInfo":"请您稍后再试"}');
      var str = JSON.stringify(result) ;
      result = util.format('{"msgNo":"0000","msgInfo":"成功","data":%s}',str);

      res.send(result);
    })
  }
};

