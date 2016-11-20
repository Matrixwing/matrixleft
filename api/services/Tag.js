/**
 * Created by Administrator on 2016/11/13.
 */


//价格算法和筛选请参照设计文档
async = require('async');

module.exports = {

  //查询出所有的标签，并且把type不同的标签区分开。返回一个二维的对象数组：
  //返回的结果：tagList = [[type=0的对象组成的对象数组],[type=1的对象组成的对象数组],[type=2的对象组成的对象数组],........]
  getAllListGoupByType : function(cb){
    TagList.query('SELECT t.tagID,t.tagName,t.type FROM tag t where t.type != 5 ORDER BY t.tagID ASC; ',function(err,allTag){

      if(err){
        sails.console.error('查询出所有的标签出错(TagList.getAllListGoupByType)：',err);
        return cb(err);
      }
      //1.把type相同的tag放在同一个数组中
      //2.把‘照顾老人’和‘照顾小孩’的子选项分别放在这两个tag的sonTag属性中
      var childTag,oldTag;
      var tagList = [] ;
      for (tag in allTag){
        console.log(allTag[tag]);
        console.log(allTag[tag].tagID);
        if(!tagList[allTag[tag].type]) {
          tagList[allTag[tag].type] = [];
        }

        //约定‘照顾小孩’的tagID为100，其子选项tagID为101，102，103
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
        //约定‘照顾老人’的tagID为200，其子选项tagID为201，202，203
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
  },


  //把通过getServantSortByWight和getWorkTagPrice拼接成：
  //含有userID，用户姓名，avaterUrl，小元推荐薪资，服务员期望薪资，系统标签属性，小元评价属性的对象
  getServantList : function(opts,cb) {
    async.parallel([
      function(next) {
        Tag.getServantSortByWight(opts,function(err,results){
          if(err) return cb(err);
          next(null,results)
        })
      },
      function(next){
        Tag.getWorkTagPrice(opts,function(err,results){
          if(err) return cb(err);
          next(null,results)
        })
      }
    ],function(err,results){
      if(err) return cb(err);
      console.log(results);
      var tag;
      var tagList = results[0];
      for(tag in tagList){
        tagList[tag].downPrice+=results[1].workPrice;
        tagList[tag].upPrice+=results[1].workPrice;
        tagList[tag].price=tagList[tag].downPrice+'到'+tagList[tag].upPrice;
        delete tagList[tag].upPrice;
        delete tagList[tag].downPrice;
        delete tagList[tag].sumweight;
      }
      return cb(null,tagList);
    });
  },


  //通过用户选择的标签筛选出服务员。并且通过标签的权重之和进行重高到低的排序
  //查询出来的信息有：用户姓名，用户id，用户头像，用户期待薪水，除去工作内容价格的价格下限和价格上限。
  //工作内容价格需要用共事进行计算
  getServantSortByWight : function (opts,cb){

    //拼接出查询语句
    var tag;
    var tagStr='';
    for(tag in opts){

      //if(opts[tag].tagID){
        tagStr+=opts[tag].tagID;

        if(tag<opts.length-1)
          tagStr+=' or t.tagID=';
      //}
    }
    sails.log.debug(tagStr);

    var queryString = "SELECT a.userID,IFNULL(ur.userName,'') AS userName,IFNULL(ur.`avatarUrl`,'') AS avatarUrl,IFNULL(ur.expectSalary,'') AS expectSalary,SUM(weight) sumweight  ," +
      "ifnull((SELECT SUM(ta.`price`) FROM tag ta LEFT JOIN taguserre t ON t.tagID=ta.tagID WHERE ta.type!=1 AND (t.tagID=" ;
    queryString += tagStr ;
    queryString +=') AND t.`userID`=a.userID ),0)AS downPrice,ifnull((SELECT SUM(ta.`price`) FROM tag ta LEFT JOIN taguserre t ON t.tagID=ta.tagID WHERE ta.type!=1  AND t.`userID`=a.userID ),0)AS upPrice,' +
      'IFNULL((SELECT GROUP_CONCAT(tagName) FROM tag t   LEFT JOIN taguserre tur ON tur.tagID=t.tagID WHERE t.type=4 AND tur.`userID`=a.userID ),"") AS sysTag FROM  (SELECT ta.tagName,t.userID,t.tagID ' +
    'FROM `taguserre` t LEFT JOIN `tag` ta ON t.tagID=ta.tagID  WHERE (t.tagID=';
    queryString += tagStr ;
    queryString +=') OR ta.type=4 OR ta.type=3) AS a LEFT JOIN `tag` ta ON a.tagID=ta.`tagID` LEFT JOIN `user` ur  ON ur.`userID`=a.userID GROUP BY a.userID ORDER BY sumweight  DESC; ';

    console.log(queryString);
    //Tag.getWorkTagPrice(opts,function(){});
    TagList.query(queryString,function(err,result){
      if(err) return cb(err);
      return cb(null,result);
    })
  },


  //工作内容的价格需要公示进行计算
  getWorkTagPrice : function (opts,cb){
    var workPrice = 0;//工作内容需要的价格
    var queryString = 'select * from tag t where (t.tagID=' ;
    for(tag in opts){
      console.log(tag);
      if(opts[tag].tagID){
        queryString+=opts[tag].tagID;
        if(tag<opts.length-1)
          queryString +=' or t.tagID=';
      }
    }
    queryString += ' ) and t.type=1;';
    //计算出工作内容的价格
    TagList.query(queryString,function(err,tagInfo){
      for(x in tagInfo){
        for(y in opts){
         if(opts[y].tagID== tagInfo[x].tagID)
           workPrice +=  tagInfo[x].price*(1+(opts[y].value-tagInfo[x].minValue)/tagInfo[x].precision*tagInfo[x].coefficient);//计算公示请参照设计文档3.1.3便签价格算法
        }
      }
      console.log(workPrice);
      var result ={
        workPrice:workPrice
      };
      if(err) {
        sails.log.error(err);
        return cb(err);
      }
      return cb(null,result);
    })
  }
}
