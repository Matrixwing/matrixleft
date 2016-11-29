/**
 * UserInfoController
 *
 * @description :: Server-side logic for managing userinfoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	updateUserInfo : function (req,res) {
    var userInfo  = req.param('userInfo');
    //var userSkill = req.allParams();
    //var userServantType = req.allParams();
    //var userID={
    //  userID:req.param('userID'),
    //};
    userInfo.userID = req.session.userID;

    UserInfo.updateUserInfo(userBaseInfo,userSkill,userServantType,function(err,reslut){
      res.send(reslut);
    })
  },

};

