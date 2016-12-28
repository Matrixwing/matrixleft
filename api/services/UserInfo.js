

module.exports = {
  getUserInfo : function (opts,cb) {
    User.query('select * from userinfo where userID='+opts.userID,function(err,info){
      if (err) return cb(err);
      return cb(err,info);
    })
  },

  updateUserInfo : function (userInfo,userTag,req,cb){
    //var userBaseInfo = {
    //  userName : opts.userName,
    //  gender : opts.gender
    //}

    var userID = {
      userID : userInfo.userID
    };
    // 更新用户基本信息
    // 更新类型
    User.find({userName:userInfo.userName,IDCard:userInfo.IDCard,openid:null,status:1}).exec(function(err,tobuser){
      console.log('2buser',tobuser);
      if (err) return cb(err);
      if(tobuser=='') {
        async.parallel([
          function (next) {
            User.updateUserInfoByUserID(userInfo, function (err, results) {
              if (err) return next(err);
              return next(null, results)
            })
          },
          function (next) {
            if (userTag !== '') {
              console.log(userTag);
              var isAllDay=0;
              var isHalfDay=0;
              if(userInfo.role==2){
                for(var a in userTag){
                  if(userTag[a].tagID==0||userTag[a].tagID==1||userTag[a].tagID==3){
                    isAllDay=1;
                  }
                  if(userTag[a].tagID==2){
                    isHalfDay=1
                  }
                }
                if(isAllDay==1) userTag.push({tagID:23});
                if(isHalfDay==1) userTag.push({tagID:22});
                if(isAllDay==1||isHalfDay==1) userTag.push({tagID:21});
                userTag.push({tagID:28});
              }
              console.log(userTag);
              TagUserRe.updataTagUserRe(userInfo.userID, userTag, function (err, results) {
                if (err) return next(err);
                return next(null, results)
              })
            } else {
              return next(null, '')
            }
          }
        ], function (err, results) {
          if (err) return cb(err);
          return cb(null, '');
        });
      }else{
         User.update({userID:userInfo.userID},{openid:null}).exec(function(err,olduser){
           if(err) return cb(err)
           var data ={
             openid:userInfo.openid,
             phone:olduser[0].phone,
             status:2
           };
           User.update({userID:tobuser[0].userID},data).exec(function(err,newuser){
            if(err) return cb(err)
            req.session.userID=tobuser[0].userID;
            req.session.userID=tobuser[0].openid;
            cb(null,'');
          })
        })
      }
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
          //
          delete user.avatarUrl;
          delete user.userID;
          delete user.role;
          delete user.openid;
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
