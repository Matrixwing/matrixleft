/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'localMysqlServer',
  table: 'user',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoid: false,
  attributes: {
    userName: {
      type: 'string',
//    size: 50

    },
    gender: {
      type: 'string'
    },

    IDCard: {
      type: 'string',
//    size: 50
    },
    birthday: {
      type: 'string'
    },
    avatarUrl: {
      type: 'string'
    },
    userID: {
      type: 'int',
      primaryKey: true
    },
    nickname: {
      type: 'string'
    },
    openid: {
      type: 'string'
    },
    phone: {
      type: 'string'
    },
    userType: {
      type: 'int'
    },
    selfEvaluation : {
      type:'string',
      size : 512,
    },
    workstatus : {
      type : 'int'
    },
    address : {
      type : 'string',
      size :256
    },
    mouthRest : {
      type : 'int'
    },
    workExp : {
      type : 'int'
    },
    homeTown : {
      type : 'string',
      size : 32
    },
    marriage : {
      type : 'int'
    },
    folk : {
      type : 'string',
      size : 32
    }
  },
  createUser: function (options, cb) {

    var userWaitForCreate = {
      openid: options.openid || null,
      nickname: options.nickname || null,
      avatarUrl: options.avatarUrl || null,
      gender: options.gender || null,
      phone: options.phone || null,
      userType: options.phone || 0,
    };

    User.create(userWaitForCreate).exec(function (err, newUser) {
      if (err) {
        sails.log.error(err);
        return cb(err);
      }
      if (newUser.openid == '') {
        return cb(null, newUser);
      }
      User.findOne({openid: newUser.openid}).exec(function (err, alluserinfo) {
        if (err) return cb(err);
        return cb(null, alluserinfo);
      });

    });
  },

  validateUser: function (options, cb) {
    User.find(options).exec(function (err, result) {
      if (err) return cb(err);
      cb(null, result)
    });
  },

  refreshAccessToken: function (options, cb) {
  },

  //验证是否已经注册了该手机
  isPhoneRegistered: function (opts, cb) {
    User.find({phone: opts.phone}).exec(function (err, result) {
      if (err) return cb(err);
      if (result != '') {
        return cb('这个手机号已经注册过了')
      }
      else {
        cb(null, opts);
      }
    });
  },

  //验证手机号是否存在
  isPhoneExisted: function (opts, cb) {
    console.log(opts);
    User.find({phone: opts.phone}).exec(function (err, result) {
      if (err) return cb(err);
      return cb(null, result);

    });
  },

  //根性一个用户
  updateUser: function (condition, options, cb) {
    var updateRecords = {
      openid: options.openid || null,
      nickname: options.nickname || null,
      avatarUrl: options.avatarUrl || null,
      gender: options.gender || null,
      phone: options.phone || null,
      userType: options.userType || 0,
    };

    User.update(condition, updateRecords).exec(function (err, result) {
      if (err) return cb(err);

      return cb(null, result);
    });
  },


  updateUserBaseInfoByUserID: function (userID, userBaseInfo, cb) {
    console.log(userID);
    User.update(userID,userBaseInfo).exec(function (err, result) {
      if (err) return cb(err);

      return cb(null, result);
    });
}
};

