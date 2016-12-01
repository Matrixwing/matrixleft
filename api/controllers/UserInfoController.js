/**
 * UserInfoController
 *
 * @description :: 完善服务员资料
 *
 */

var util = require('util');
module.exports = {
	updateUserInfo : function (req,res) {
    var userInfo  = JSON.parse(req.param('userInfo'));
    var userTag  = JSON.parse(req.param('userTags'));
    //var userInfo  = req.param('userInfo');
    //var userTag  =req.param('userTags');
    //var userInfo = {
    //  userName : '哇哇哇',
    //  //gender:1,
    //  homeTown:'成都',
    //  mouthRest:20
    //};
   // var userTag =[{tagID:1},{tagID:2},{tagID:3}]
    userInfo.workExp=parseInt(userInfo.workExp);
    userInfo.userID = req.session.userID;                   //正式坏境用session的
    console.log(userInfo.userID);
    UserInfo.updateUserInfo(userInfo,userTag,function(err,reslut){
      if (err) return res.send('{"msgNo":"9999","msgInfo":"修改失败"}');
      result = '{"msgNo":"0000","msgInfo":"修改成功"}';
      res.send(result);
    })
  },

 getSevantDetail : function(req,res){
   var userID  = req.param('userID');
   console.log(userID);
   if(!userID){
     userID = req.session.userID;
   }
   var opts = {
     userID:userID
   }
   UserInfo.getSevantDetail(opts,function(err,info){
     if (err) return res.send('{"msgNo":"9999","msgInfo":"查询失败"}');
     var str = JSON.stringify(info) ;
     str = util.format('{"msgNo":"0000","msgInfo":"查询到了信息","data":[%s]}',str);
     res.send(str);
   })
 }
};

