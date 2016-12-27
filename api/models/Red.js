/**
 * Red.js
 *
 * @description :: 红包，优惠券
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'localMysqlServer',
  table: 'redenvelope',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoid: false,
  attributes: {
    id:{
      type: 'integer',
    },
    name:{
      type: 'string',
    },
    amount:{
      type: 'integer',
    },
    condition:{
      type:'datatime'
    },
    validTime:{
      type:'integer'
    }
  }
};

