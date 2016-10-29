/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'localMysqlServer',
  table:'user',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoid: false,
  attributes: {
    userName: {
      type:'string',
//      size: 50
      primaryKey: true
    },

    IDCard: {
      type:'string',
//      size: 50
    },

    gender: {
      type:'string'
    },

    birthday: {
      type:'string'
    },
    avatarUrl: {
      type:'string'
    },
    userID: {
      type:'int'
    },
    nickname: {
      type:'string'
    },
    openid: {
      type:'string'
    },
    phone:{
      type:'string'
    },
  },
  createUser: function(options,cb){
    console.log(options);
    var userWaitForCreate = {
      openid :    options.openid || null,
      nickname:   options.nickname ||null,
      avatarUrl : options.avatarUrl ||null,
      gender:     options.gender || null,
      phone:      options.phone|| null,
      };
    User.create(userWaitForCreate).exec(function(err,newUser){
      if(err){sails.log.error(err); return cb(err);}
      return cb(null,newUser);
    });
  },

  validateUser: function(options,cb){
    User.find(options).exec(function(err,result){
      if (err) return cb(err);
      cb(null,result)
    });
  },

  refreshAccessToken: function(options,cb){

  },

  //验证是否已经注册了该手机
  isPhoneExisted : function(opts,cb){
    User.find({phone:opts.phone}).exec(function (err,result) {
      if(err) return cb(err);
      if(result!='') {return cb('这个手机号已经注册过了')}
      else{
        cb(null,opts);
      }
    });
  },
};

