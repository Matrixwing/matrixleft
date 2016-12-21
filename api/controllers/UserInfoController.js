/**
 * UserInfoController
 *
 * @description :: 完善服务员资料
 *
 */

var util = require('util');
module.exports = {
	updateUserInfo : function (req,res) {
    var userInfo  = '';
    var userTag  = '';
    console.log(req.param('userInfo'));
    userInfo  = JSON.parse(req.param('userInfo'));
    console.log('11111111111111',userInfo);
    if(req.param('userTags')){
      userTag  = JSON.parse(req.param('userTags'));
    }

    userInfo.workExp=parseInt(userInfo.workExp)||0;
    userInfo.role = parseInt(req.param('role',2));
    userInfo.userID = req.session.userID;                   //正式坏境用session的
    console.log(userInfo);
    console.log(userTag);
    UserInfo.updateUserInfo(userInfo,userTag,function(err,reslut){
      if (err) return res.send('{"msgNo":"9999","msgInfo":"修改失败"}');
      result = '{"msgNo":"0000","msgInfo":"修改成功"}';
      res.send(result);
    })
  },

 getSevantDetail : function(req,res){
   var userID  = req.param('userID');
   if(!userID){
     userID = req.session.userID;
   }
   var opts = {
     userID:userID
   };

   UserInfo.getSevantDetail(opts,function(err,info){
     if (err) return res.send('{"msgNo":"9999","msgInfo":"查询失败"}');
     var str = JSON.stringify(info) ;
     str = util.format('{"msgNo":"0000","msgInfo":"查询到了信息","data":[%s]}',str);
     res.send(str);
   })
 }

};

