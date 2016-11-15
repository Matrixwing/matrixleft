/**
 * TagList.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'localMysqlServer',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoid: false,
  attributes: {

  },
  getAllTagList : function(cb){
    TagList.query('SELECT t.tagID,t.tagName,ifnull(tl.level,"") as level,ifnull(tl.sonID,"") as sonID FROM  taglevel tl RIGHT JOIN tag t ON t.tagID=tl.tagID; ',function(err,allList){
      console.log(err);
      if(err) return cb(err);
      return cb(null,allList)
    })
  }
};

