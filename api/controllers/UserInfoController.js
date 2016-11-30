/**
 * UserInfoController
 *
 * @description :: 完善服务员资料
 *
 */

module.exports = {
	updateUserInfo : function (req,res) {
    var userInfo  = req.param('userInfo');
    var userTag  = req.param('userTag');
    //var userInfo = {
    //  userName : '哇哇哇',
    //  //gender:1,
    //  homeTown:'成都',
    //  mouthRest:20
    //};
    //var userTag =[{tagID:1},{tagID:2},{tagID:3},{tagID:4}]

    userInfo.userID = 245;                                   //为了测试方便，暂时写成245
    //userInfo.userID = req.session.userID;                   //正式坏境用session的

    UserInfo.updateUserInfo(userInfo,userTag,function(err,reslut){
      if (err) return res.send('{"msgNo":"9999","msgInfo":"修改失败"}');
      result = '{"msgNo":"0000","msgInfo":"修改成功"}';
      res.send(result);
    })
  },

};

