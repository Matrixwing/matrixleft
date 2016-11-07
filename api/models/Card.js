/**
 * Card.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName:'usercard',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoid: false,

  attributes: {
    userID: {
      type:'int',
      primaryKey: true
    },
    userName : {
      type:'string'
    },
    workstatus : {
      type:'string'
    },
    gender : {
      type:'string'
    },
    serveCity : {
      type:'string'
    },

    avatarUrl : {
      type:'string'
    },
    address : {
      type:'string'
    },
    mouthRest : {
      type:'string'
    },
    workExp : {
      type:'string'
    },
    servantTypeName : {
      type:'string'
    },
    skillName : {
      type:'string'
    },
    examination : {
      type:'string'
    },
    identityAuth : {
      type:'string'
    },
    assessment : {
      type:'string',
      size:256
    },
    IDCard : {
      type:'string'
    },
    phone : {
      type:'string'
    },
    homeTown : {
      type:'string'
    },
    folk : {
      type:'string'
    },
    marriage : {
      type:'string',
      size:256
    },
    eduName : {
      type:'string'
    },
    selfEvaluation : {
      type:'string',
      size:256
    },
    certID : {
      type:'string',
    },
    certInfo : {
      type:'string',
    },
  },


};

