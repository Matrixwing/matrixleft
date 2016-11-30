/**
 * UserInfoController
 *
 * @description :: Server-side logic for managing userinfoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	updateUserInfo : function (req,res) {
    //var userInfo  = req.param('userInfo');

    //var userSkill = req.allParams();
    //var userServantType = req.allParams();
    //var userID={
    //  userID:req.param('userID'),
    //};

    var userInfo = {
      userName : '哇哇哇',
      //gender:1,
      homeTown:'成都',
      mouthRest:20
    };
    var userTag =[{tagID:1},{tagID:2},{tagID:3}]
    userInfo.userID = 245;
    //userInfo.userID = req.session.userID;

    UserInfo.updateUserInfo(userInfo,userTag,function(err,reslut){
      res.send(reslut);
    })
  },

};

