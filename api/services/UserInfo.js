

module.exports = {
  getUserInfo : function (opts,cb) {
    User.query('select * from userinfo where userID='+opts.userID,function(err,info){
      if (err) return cb(err);
      return cb(err,info);
    })
  },

  updateUserInfo : function (userInfo,userTag,cb){
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
          console.log(err);
          if(err) return next(err);
          return next(null,results)
        })
      },
      function(next){
        TagUserRe.updataTagUserRe(userInfo.userID,userTag,function(err,results){
          console.log(err);
          if(err) return next(err);
          return next(null,results)
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
          var user =results[0];
          for(var x in user){
            if(!user[x]) user[x]='';
          }
          delete user.avatarUrl;
          delete user.userID;
          delete user.role;
          delete user.openid;
          delete user.IDCard;
          if(err) return next(err);
          return next(null,user);
        })
      },
      function(next){
        //查出非系统和证书的tags
        TagUserRe.query('select tur.tagID ,t.tagName from taguserre tur left join tag t on tur.tagID=t.tagID where t.`type`=0 and tur.userID='+opts.userID,function(err,results){
          if(err) return next(err);
          return  next(null,results);
        })
      },
      function(next){
        //查出非系统和证书的tags
        TagUserRe.query('select tur.tagID ,t.tagName from taguserre tur left join tag t on tur.tagID=t.tagID where t.`type`=2 and tur.userID='+opts.userID,function(err,results){
          if(err) return next(err);
          return  next(null,results);
        })
      }
    ],function(err,results){
      if(err) return cb(err);
      var servantDetail = {
        userInfo : results[0],
        severTags  : results[1],
        skillTags  : results[2]
      };
      return cb(null,servantDetail);
    });
  }
};
