/**
 * Created by Administrator on 2016/12/28.
 */
var dateformat = require('dateformat');
module.exports = {
  //商户合作申请
  cooperateApply : function(req,res){
    var opts = {
      branchName : req.param('branchName'),
      applyTime  : dateformat(new Date(),'yyyy-mm-dd hh:mm:ss'),
      userInfo   :req.param('name','')+''+req.param('phone',''),
    }
    WxMessage.sendCoApplyToAdmin(opts,function(err,result){
      if (err) return res.send(500,'{"msgNo":"9999","msgInfo":"请您稍后再试"}');
       return res.send('{"msgNo":"0000","msgInfo":"管理员哥哥收到了您的申请，稍后便会与您取得联系"}');
    })
  }
}
