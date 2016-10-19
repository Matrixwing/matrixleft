/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'localMysqlServer',
  table:'user',
  attributes: {
    userName: {
      type:'string',
//      size: 50
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
    openID: {
      type:'string'
    },


  },

  createUser: function(options,cb){

  },

  validateUser: function(options,cb){

  },

  refreshAccessToken: function(options,cb){

  },
};

