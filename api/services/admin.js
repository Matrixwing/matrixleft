/**
 * Created by Administrator on 2016/12/28.
 */
var dateformat = require('dateformat');
module.exports = {
    //商户合作申请
    cooperate : function(req,res){
      var opts = {
        branchName : req.param('branchName'),
        applyTime  : dateformat(new Date(),'isoDateTime'),
        userInfo   :req.param('name','')+''+req.param('phone',''),
      }
      WXMessage.sendCoApplyToAdmin(opts,function(err,result){

      })
    }
}
