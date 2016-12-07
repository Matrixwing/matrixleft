/**
 * ServPrice.js
 *
 * @description :: 服务费用和服务价格
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'localMysqlServer',
  table: 'servprice',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoid: false,
  attributes: {
    id : {
      type : 'integer'
    },
    servName : {
      type : 'string'
    },
    servPrice : {
      type : 'integer'
    }
  }
};

