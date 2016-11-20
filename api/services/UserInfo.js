

module.exports = {
  getUserInfo : function (opts,cb) {
    User.query('select * from userinfo where userID='+opts.userID,function(err,info){
      if (err) return cb(err);
      return cb(err,info);
    })
  },

  uploadIDCard : function (opts,cb){
  //todo 上传身份证

  },

  updateUserInfo : function (userBaseInfo,userSkill,userServantType,cb){
    //todo 完善用户信息
    //var userBaseInfo = {
    //  userName : opts.userName,
    //  gender : opts.gender
    //}

    var userID = {
      userID : userBaseInfo.userID
    };

    // 更新用户基本信息
    // 更新特长
    // 更新类型

    async.parallel([
      function(next){
        User.updateUserBaseInfoByUserID(userID, userBaseInfo,function(err,results){
          if(err) return cb(err);
          next(null,results)
        })
      },
      function(next){
        Skill.updateUserSkillByUserID(userSkill,userID,function(err,results){
          if(err) return cb(err);
          next(null,results)
        })
      },
      function(next){
        ServantType.updateServantTypeByUserID(userServantType,userID,function(err,results){
          if(err) return cb(err);
          next(null,results)
        })
      }

    ],function(err,results){
      if(err) return cb(err);
      return cb(null,'');
    });

  }
};
