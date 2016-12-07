/**
 * Order.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var util = require('util');
module.exports = {
  connection: 'localMysqlServer',
  table: 'order',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoid: false,
  attributes: {
    orderID : {
      type: 'string',
    },
    redenvId:{
      type: 'integer',
    },
    redenvId:{
      type: 'integer',
    },
    userID:{
      type: 'integer',
    },
    servantID:{
      type: 'integer',
    },
    createTime:{
      type: 'datetime',
    },
    validTime:{
      type: 'datetime',
    },
    paidTime :{
      type: 'datetime',
    },
    servicePrice :{
      type: 'float',
    },
    salary :{
      type: 'float',
    },
    status :{
      type: 'integer',   //完成交易：0  等待交易：1    取消交易：2
    },
    transactionID  :{
      type: 'string',
    },
    platform  :{
      type: 'string',
    },
    ResultCode    :{
      type: 'string',
    },
    ErrCodeAndDes   :{
      type: 'string',
      size:256
    },
    remark   :{
      type: 'string',
      size:2048
    },

  },


};

