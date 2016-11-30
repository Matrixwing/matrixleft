

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

  updateUserInfo : function (userInfo,userTag,cb){
    //todo 完善用户信息
    //var userBaseInfo = {
    //  userName : opts.userName,
    //  gender : opts.gender
    //}

    var userID = {
      userID : userInfo.userID
    };
    // 更新用户基本信息
    // 更新类型
    async.parallel([
      function(next){
        User.updateUserInfoByUserID(userInfo,function(err,results){
          if(err)  next(err);
          next(null,results)
        })
      },
      function(next){
        TagUserRe.updataTagUserRe(userInfo.userID,userTag,function(err,results){
          if(err) next(err);
          next(null,results)
        })
      }
    ],function(err,results){
      if(err) return cb(err);
      return cb(null,'');
    });
  },

  getSevantDetail:function(opts,cb){
    async.parallel([
      function(next){
        User.find({userID:opts.userID}).exec(function(err,results){
          console.log(results);
          if(err)  next(err);
          next(null,results);
        })
      },
      function(next){
        //查出非系统和证书的tags
        TagUserRe.query('select tur.tagID from taguserre tur left join tag t on tur.tagID=t.tagID where(t.`type`=0 OR t.`type`=1 OR t.`type`=2) and tur.userID='+opts.userID,function(err,results){
          console.log(results);
          if(err) next(err);
          next(null,results);
        })
      }
    ],function(err,results){
      console.log(results);
      if(err) return cb(err);
      return cb(null,err,results);
    });
  }
};
