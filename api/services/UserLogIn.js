/**
 * Created by whl on 2016/10/18.
 */


var async = require('async');
var https = require('https');
var util = require('util');
///var weixinConfig= require('../../config/wyhConfig').Weixin; sails.config.weixin
var weixinConfig= sails.config.weixin;
module.exports = {
  /**
   * 通过code换取openid
   * @param opts js对象，code
   * @param cb 回调函数 cb(err,result)  err为错误信息  result为包含openid的对象
   */
  getUserByCode: function (opts,cb) {
    //发起hpttps 请求


    var hostname = util.format('https://api.weixin.qq.com/sns/oauth2/access_token?appid=%s&secret=%s&code=%s' +
      '&grant_type=authorization_code',weixinConfig.appid,weixinConfig.appsecret,opts.code);
    console.log(hostname);
    https.get(hostname, function(res) {
      var buffers = [];
      res.on('data', function(d) {
        buffers.push(d);
      });
      res.on('end', function(d){
        var wholeData = Buffer.concat(buffers);
        var dataStr = wholeData.toString('utf8');
        data=wholeData;
        data=JSON.parse(data);
        data.phone=opts.phone || null;
        //data.role=opts.role;
        if(data.errcode) return cb(data);
        cb(null,data);
      })
    }).on('error', function(e) {
      console.log(e);
      cb(e.errmsg);
    });
  },

  /**
   * 通过openid验证是否注册。有就返回用户信息，没有就加入数据库
   * @param opts js对象，需要包含该用户的openid
   * @param cb 回调函数 cb(err,result)  err为错误信息  result为拉取的用户信息
   */
  validateRegisterByOpenID : function (opts,cb){
    console.log('opts',opts);
    var queryObj ={
      openid:opts.openid
    };
    console.log(queryObj);
    User.find(queryObj).exec(function(err,result){

      if (err) return cb(err);
      if (result == ''){
        //如果沒有註冊，先拉取拉取用户信息再写入
        async.waterfall([
          function(cb){
            cb(null,opts);
          },UserLogIn.getUserInfoFromWeiXin,
          function(dataObj,cb){
            var updateUser = dataObj;
            updateUser.phone=opts.phone;
            updateUser.role=opts.role;

            cb(null,updateUser);
          },
          User.createUser
        ],function(err,result){
          if (err) return cb(err);
          return cb(null,result);
        });
      }else{
        cb(null,result[0]);}

    });
  },

  /**
   * 通过openid从微信拉取用户的基本信息
   * @param opts js对象，需要包含该用户的openid和access_token
   * @param cb 回调函数 cb(err,result)  err为错误信息  result为拉取的用户信息
   */
  getUserInfoFromWeiXin :function (opts,cb){
    var hostname = util.format('https://api.weixin.qq.com/sns/userinfo?access_token=%s&openid=%s&lang=zh_CN',opts.access_token,opts.openid);
    https.get(hostname, function(res) {
      var buffers = [];
      res.on('data', function(d) {
        buffers.push(d);
      });
      res.on('end', function(d){
        var wholeData = Buffer.concat(buffers);
        var dataStr = wholeData.toString('utf8');
        data=wholeData;
        data=JSON.parse(data);
        //更改js对象属性名为我们自己的
        var dataValided = data;
        dataValided.avatarUrl=dataValided.headimgurl;
        dataValided.gender=dataValided.sex;
        delete dataValided.headimgurl;
        delete dataValided.sexl;
        cb(null,dataValided);
      })
    }).on('error', function(e) {
      cb(e.errmsg);
    });

  },

  /**
   * 把用户的基本信息插入到数据库
   * @param opts js对象，需要包含该用户的基本信息
   * @param cb 回调函数 cb(err,result)  err为错误信息  result为用户的基本信息
   */
  registerAndInsert : function (opts,cb) {
    console.log(opts.headimgurl);
    //把用户信息插入数据库
    var sql = util.format('insert into user(openid,nickname,gender,avatarUrl) values ("%s","%s",%s,"%s")',opts.openid,opts.nickname,opts.gender,opts.avatarUrl);
    User.query(sql,function(err,result){
      if (err){ return cb(err);}
      cb(null,opts);
    });
  },

  registerAndLogIn : function (opts,cb) {
    // todo:用户注册并且登陆
  },


  /**
   * 通过openid从数据库取用户数据
   * @param opts js对象，需要包含该用户的openid和access_token
   * @param cb 回调函数 cb(err,result)  err为错误信息  result为拉取的用户信息
   */
  getUserInfoFromDBByOpenid : function (opts,cb) {
    //根据openid获取用户信息
    User.find(opts).exec(function(err,result){
      if(err) return cb(err);
      return cb(null,result);
    })
  },

  /**
   * 通过userID从数据库取用户数据
   * @param opts js对象，需要包含该用户的openid和access_token
   * @param cb 回调函数 cb(err,result)  err为错误信息  result为拉取的用户信息
   */
  getUserInfoFromDBByuserID : function (opts,cb) {
    //根据openid获取用户信息
    console.log(opts);
    User.find(opts).exec(function(err,result){
      console.log(result);
      if(err) return cb(err);
      return cb(null,result);
    })
  },



  /**
   * 通过code从读取取用户数据，如果没有注册则让用户注册
   * @param opts js对象，需要包含该用户的openid和access_token
   * @param cb 回调函数 cb(err,result)  err为错误信息  result为拉取的用户信息
   */
  getOrRegUserByCode : function (opts,cb) {
    async.waterfall([
        function(cb){
          cb(null,opts)
        }, UserLogIn.getUserByCode,
        UserLogIn.validateRegisterByOpenID,
      ],function(err,result){
        if(err) return cb(err);
        return cb(null,result);
      }
    )
  },

  /**
   * 用户注册时使用，生产一个4位随机数并且发送至用户注册时填写手机
   * @param opts js对象，需要包含该用户的手机
   * @param cb 回调函数 cb(err,result)  err为错误信息  result为拉取的用户信息
   */
  sendNumToPhone :  function(opts,cb) {
    async.waterfall([
      function(cb){
        cb(null,opts);
      },User.isPhoneRegistered,//验证这个手机是不是已经注册了
      function(opts,cb){//验证上一次短信是否在60秒内，并且该是否已经超出10条
        //console.log(opts);
        ValidatePhone.find({where:opts,sort:'createdAt DESC'}).exec(function(err,validateNum){
          //console.log('validateNum',validateNum);
          if(err) return cb(err);

          if(validateNum!=''){
            //console.log('validateNum[0]1111',validateNum[0]);
            var timeDiff = Date.now() - (new Date(validateNum[0].createdAt).getTime());
            if(timeDiff<=60*1000){
              //时间没有超过60秒
              return cb("您已经发送过一条短信了，请稍后再试");
            }else if(validateNum[9]){
              //发送超过10条
              return cb("您发送的短信的太多了");
            }else{
              return cb(null,opts);
            }
          }else{//这个手机好没有用过注册码
            return cb(null,opts);
          }
        });

      },function(opts,cb){
        //发送短信
        var rnd="";
        for(var i=0;i<4;i++)
          rnd+=Math.floor(Math.random()*10);
        var result = opts;
        result.num=rnd;
        SendMsg.sendValidaNumToPhone(result,function(err,infoFormaili){
          //console.log(infoFormaili);

          if(err) return cb(err);
         return cb(null,result);
        })
       // return cb(null,result);
      },
      function(opts,cb){
        //写入数据库
        ValidatePhone.create(opts).exec(function (err,newValidataPhone){
          if (err) return cb(err);
          return cb(null,newValidataPhone);
        });
      }
    ],function(err,result){
      if(err) {
        sails.log.error("发短信出错",opts.phone+err);
        return cb(err);}
      return cb(null,result);
    })
  },

  /**
   *注册
   * @param opts js对象，需要包含该用户的phone:手机和num:用户验证码微信授权成功后返回的code
   * @param cb 回调函数 cb(err,result)  err为错误信息  result为拉取的用户信息
   */
  register1 : function (opts,cb) {
    async.waterfall([
      function(cb){
        cb(null,opts);
      },User.isPhoneRegistered,//验证手机是否注册
      ValidatePhone.validateNum,//手机验证码是否正确？
      UserLogIn.getOrRegUserByCode//拉取用户资料，没有则写入
    ],function(err,newUser){
      if (err) return cb(err);
      cb(null,newUser);
    });
  },


  register : function (opts,cb) {
    ValidatePhone.validateNum(opts,function(err,optPassedOn){
      if(err) return cb(err);
      User.isPhoneExisted(optPassedOn,function(err,phoneReslut){
        console.log('isPhoneExisted+++++++',phoneReslut[0]);
        if(err) return cb(err);
        if(phoneReslut==''){
          //todo 手机号不存在，接来下拉取用户信息
        }else {
          /**
           *手机号存在，接下来判断是否有openid。有则表示手机号被占用。无则拉取用户信息
          */

          //又有手机号又有openid，这个号码已经被注册过了
          console.log('openid+++++++',phoneReslut[0].openid);
          if(phoneReslut[0].openid){return cb('这手机已经被注册了');}
          //有手机号但没有openid。表示这是个我们导入的用户。拉取这个人的微信信息，更新到我们的数据库
          console.log('有手机号但没有openid。表示这是个我们导入的用户。拉取这个人的微信信息，更新到我们的数据库');
          async.waterfall([
              function(cb1){
                console.log('1111111111111111');
                cb1(null,opts);
              },UserLogIn.getUserByCode,
              function(dataFromWeixin,cb1){
                cb1(null,{phone:opts.phone},dataFromWeixin);
              },User.updateUser
            ]
            ,function(err,newUser){
              if (err) return cb(err);
              cb(null,newUser);
            });
        }
      })
    })

  },


  //绑定手机号
  bindingPhone : function(opts,req,cb){
    //var req = this.req;
    //var res = this.res;
    ////var sails = req._sails;
    ValidatePhone.validateNum(opts,function(err,optPassedOn){
      if(err) return cb(err);
      User.isPhoneExisted(optPassedOn,function(err,phoneReslut){
        if(err) return cb(err);
        if(phoneReslut==''){
          User.update({userID:opts.userID},{phone:opts.phone}).exec(function(err,result){
            if (err) return cb(err);
            cb(null,result);
          });
        }else {
          /**
           *手机号存在
           */
            //又有手机号又有openid，这个号码已经被注册过了
          if(phoneReslut[0].openid){return cb('这手机已经被注册了');}
          else{//有手机号但没有openid。表示这是个我们导入的用户。更新到我们的数据库
            //更新信息
            User.find({userID:opts.userID}).exec(function(err,user){
              if(err) return cb(err);
              console.log(user[0]);
              var data ={
                avatarUrl:user[0].avatarUrl,
                nickname:user[0].nickname,
                gender:user[0].gender,
                openid:user[0].openid,
                role:2
                };
              console.log('data',data);
              User.update({userID:phoneReslut[0].userID},data).exec(function(err,newuser){
                console.log('err',err);
                if(err) return cb(err)
                User.update({userID:opts.userID},{openid:null}).exec(function(err,olduser){
                  console.log('err',err);
                  if(err) return cb(err)
                  console.log(newuser);
                  console.log(phoneReslut[0].userID);
                  req.session.userID=phoneReslut[0].userID;
                  console.log(req.session.userID);
                  cb(null,newuser,'0001');           //0001表示前端需要获取这个服务员的信息之后再让用户填写或者修改
                })

              })
            })
            //
          }


        }
      })
    })
  },

}
