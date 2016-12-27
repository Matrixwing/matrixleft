/**
 * Branch.js
 *
 * @description ::机构/门店
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'localMysqlServer',
  table: 'branch',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoid: false,
  attributes: {
    id : {
      type: 'integer',
    },
    name:{
      type: 'string',
    },
    address:{
      type: 'string',
      size:512
    },
    userID: {
      type: 'integer',
    },
    remark : {
      type : 'string',
      size:512
    }
  },
};

