/**
 * Skill.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName:'specialskill',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  //autoid: false,
  attributes: {
    skillID : {
      type: 'int'
    },
    userID : {
      type : 'int'
    },
  },

  //getAllSkills : function (opts,cb) {
  //  Skill.find().exec(function(err,allSkill){
  //    if (err) return cb(err);
  //    return cb(err,allSkill);
  //  });
  //},
  updateUserSkillByUserID : function (userSkill,userID,cb){
    Skill.destroy(userID).exec(function(err){
      if (err) return cb(err);
      //Skill
    });
    
    //todo 添加新的
    //console.log('111111111111111111111');
    cb(null,'');
  }
};

