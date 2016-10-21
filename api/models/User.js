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
    }
  },
  createUser: function(options,cb){
  },

  validateUser: function(options,cb){
    User.find(options).exec(function(err,result){
      if (err) return cb(err);
      cb(null,result)
    });
  },

  refreshAccessToken: function(options,cb){

  },
};

