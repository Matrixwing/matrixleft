/**
 * InsOrder.js
 *
 * @description :: 保险
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'localMysqlServer',
  table: 'insorder',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoid: false,
  attributes: {
    id : {
      type: 'string',
    },
    insureID:{
      type: 'string',
    },
    orderID:{
      type: 'string',
    },
    insSpecID:{
      type: 'integer',
    },
    beneficiaryID:{
      type: 'integer',
    },
    status:{
      type: 'integer',
    },
    desc:{
      type: 'string',
    },
    remark : {
      type : 'string',
    }
  },


};
