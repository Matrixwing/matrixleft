/**
 * ServantType.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName:'servanttype',
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    userID : {
      type:'int'
    },
    servantID : {
      type : 'string'
    },
  },

  updateServantTypeByUserID : function (userServantType,userID,cb) {
    //todo 删除有的
    //todo 插入新的
    cb(null,'');
  },
};

