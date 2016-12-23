/**
 * UploadImage.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tablename:"UploadImage",
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoid: false,
  attributes: {
    userID:{
      type:"integer",
    },
    type:{
      type:'string'
    },
    image : {
      type:"string",
      size:65535
    },
    status:{
      type:'integer'
    },
    remark : {
      type:"string",
      size:1024
    }
  }
};

