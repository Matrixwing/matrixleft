/**
 * Red.js
 *
 * @description :: 红包，优惠券
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'localMysqlServer',
  table: 'order',
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
    stauts:{
      type:'integer'
    }
  }
};

