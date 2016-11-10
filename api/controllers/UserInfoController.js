/**
 * UserInfoController
 *
 * @description :: Server-side logic for managing userinfoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	updateUserInfo : function (req,res) {
    var userBaseInfo  = req.allParams();
    var userSkill = req.allParams();
    var userServantType = req.allParams();
    var userID={
      userID:req.param('userID'),
    };
    console.log('userBaseInfo',userBaseInfo);
    console.log('userBaseInfo',req.param.all);
    UserInfo.updateUserInfo(userBaseInfo,userSkill,userServantType,function(err,reslut){
      res.send(reslut);
    })
  },

};

