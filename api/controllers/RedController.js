/**
 * RedController
 *
 * @description :: 红包相关
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var util = require('util');
module.exports = {
  getRedList: function (req, res) {
    var limit =req.param('limit',5);
    var opts ={
      status:req.param('status')||null,
      userID:req.session.userID,
      limit  : limit,
      start  : (req.param('start',1)-1)*limit,
    }
    Reds.getRedList(opts,function(err,resluts){
      console.log(err);
      if (err) return res.send('{"msgNo":"9999","msgInfo":"查询失败"}');
      var str = JSON.stringify(resluts) ;
      str = util.format('{"msgNo":"0000","msgInfo":"查询成功","data":%s}',str);
      console.log(str);
      res.send(str);
    })
  }
};

