/**
 * UserTagRe.js
 *
 * @description ::
 *
 */

module.exports = {
  connection: 'localMysqlServer',
  table:'usertagre',
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

  updataUserTagRe : function(userID,tags,cb) {
    //先删除有的tag
    UserTagRe.destroy({userID:userID}).exec(function(err,result){
      //删除重复的tag
      for(a in tags){
        for(b in tags){
          if(tags[a].tagID==tags[b].tagID){

          }
        }
      }
      //添加tag
      var x;
      for(x in tags){
        UserTagRe.create({userID:userID,tagID:tags[x].tagID}).exec(function(err,result) {
          if (x == tags.length - 1) {
            return cb(null,result);
          }
          if (err) return cb(err);
        })
      }
    })
  }
};

