/**
 * TagUserRe.js
 * @description ::
 *
 */

module.exports = {
  connection: 'localMysqlServer',
  tableName:'taguserre',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoid: false,
  attributes: {
    userID:{
      type:'int'
    },
    tagID:{
      type:'int'
    }
  },

  updataTagUserRe : function(userID,tags,cb) {
    //TagUserRe.destroy({userID:userID}).exec(function(err,result){
    //删除不是系统标签和证书的tag
    TagUserRe.query('DELETE tur.* FROM `taguserre` tur LEFT JOIN tag  t ON tur.tagID=t.tagID WHERE tur.userID= '+userID+' AND (t.`type`=0 OR t.`type`=1 OR t.`type`=2 OR t.`type`=6);',function(err,result){
      //删除重复的tag
      var uniqueTags = [];
      for(var i = 0, l = tags.length; i < l; i++) {
        for(var j = i + 1; j < l; j++)
          if (tags[i] === tags[j]) j = ++i;
        uniqueTags.push(tags[i]);
      }
      //console.log('uniqueTags',uniqueTags);
      //添加tag
      var x;
      for(x in uniqueTags){
        TagUserRe.create({userID:userID,tagID:uniqueTags[x].tagID}).exec(function(err,result) {
          if(err) return cb(err);
        })
      }
      cb(null,result);
    })
    //})
  }
};

