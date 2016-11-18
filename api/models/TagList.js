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


  //查询出所有的标签，并且把type不同的标签区分开。返回一个二维的对象数组：
  //返回的结果：tagList = [[type=1的对象组成的对象数组],[type=2的对象组成的对象数组],[type=3的对象组成的对象数组],........]
  getAllListGoupByType : function(cb){
    TagList.query('SELECT t.tagID,t.tagName,t.type FROM tag t where t.type != 5 ORDER BY t.tagID ASC; ',function(err,allTag){

      if(err){
        sails.console.error('查询出所有的标签出错(TagList.getAllListGoupByType)：',err);
        return cb(err);
      }
      //把type相同的tag放在同一个数组中
      //
      var childTag,oldTag;
      var tagList = [] ;
      for (tag in allTag){
        console.log(allTag[tag]);
        console.log(allTag[tag].tagID);
        if(!tagList[allTag[tag].type]) {
          tagList[allTag[tag].type] = [];
        }

        if(allTag[tag].tagID == 100){
          childTag=tag
          allTag[tag].sonTag=[];
          console.log(allTag[tag]);
        }
        if(allTag[tag].tagID == 101 || allTag[tag].tagID == 102 || allTag[tag].tagID == 103) {
          console.log(allTag[childTag]);
          allTag[childTag].sonTag.push(allTag[tag]);
          console.log(allTag[childTag]);
          allTag[tag]=null;
          console.log(allTag[tag]);
        }

        if(allTag[tag]&&allTag[tag].tagID == 200){
          oldTag=tag
          allTag[tag].sonTag=[];

        }
        if(allTag[tag]&&(allTag[tag].tagID == 201 || allTag[tag].tagID == 202 || allTag[tag].tagID == 203)) {
          allTag[oldTag].sonTag.push(allTag[tag]);
          allTag[tag]=null;
        }

        if(allTag[tag]){
          tagList[allTag[tag].type].push(allTag[tag]);
        }


      }
      return cb(null,tagList)
    })
  }
};

