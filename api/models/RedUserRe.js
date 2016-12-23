/**
 * RedUserRe.js
 *
 * @description :: 红包用户关系
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'localMysqlServer',
  table: 'reduserre',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoid: false,
  attributes: {
    id:{
      type: 'integer',
    },
    redID:{
      type: 'integer',
    },
    userID:{
      type: 'integer',
    },
    createAt:{
      type:'datatime'
    },
    expireAt:{
      type:'datatime'
    },
    usedAt:{
      type:'datatime'
    },
    status:{
      type:'integer'
    }
  }
};

