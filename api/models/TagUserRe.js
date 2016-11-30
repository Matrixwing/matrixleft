/**
 * TagUserRe.js
 *
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
    //先删除有的tag
    TagUserRe.destroy({userID:userID}).exec(function(err,result){
      //删除重复的tag
      var uniqueTags = [];
      for(var i = 0, l = tags.length; i < l; i++) {
        for(var j = i + 1; j < l; j++)
          if (tags[i] === tags[j]) j = ++i;
        uniqueTags.push(tags[i]);
      }
      console.log(uniqueTags);
      //添加tag
      var x;
      for(x in uniqueTags){
        console.log(x);
        TagUserRe.create({userID:userID,tagID:uniqueTags[x].tagID}).exec(function(err,result) {
          console.log(err);
          if(err) return cb(err);
          //if (x == uniqueTags.length - 1) {
          //  console.log("111111111111111");
          //  console.log(uniqueTags.length - 1);
          //  console.log(result);
          //}
        })
      }
      cb(null,result);
    })
  }
};

