/**
 * Tag
 *
 * @description :: 根据标签筛选服务员和获取标签有关，价格算法和筛选请参照设计文档
 * @help
 */
async = require('async');
var weixinConfig= sails.config.weixin;
module.exports = {
  /**
   * 在前端调用/getServantList接口，而且不传参数时。即随机推挤
   *
   * @api public
   * @param  {Object} `opts`  随机的tagID
   * @param {Function} cb
   * @return {*}
   */
  getRandomServantList : function(){
  },

  //查询出所有的标签，并且把type不同的标签区分开。返回一个二维的对象数组：
  //返回的结果：tagList = [[type=0的对象组成的对象数组],[type=1的对象组成的对象数组],[type=2的对象组成的对象数组],........]
  getAllListGoupByType : function(cb){
    //TagList.query('SELECT t.tagID,t.tagName,t.type FROM tag t where t.type != 5 ORDER BY t.tagID ASC; ',function(err,allTag){
    TagList.query('SELECT t.tagID,t.tagName,t.type FROM tag t  ORDER BY t.tagID ASC; ',function(err,allTag){
      if(err){
        sails.console.error('查询出所有的标签出错(TagList.getAllListGoupByType)：',err);
        return cb(err);
      }
      //1.把type相同的tag放在同一个数组中
      //2.把‘照顾老人’和‘照顾小孩’的子选项分别放在这两个tag的sonTag属性中
      var childTag,oldTag;
      var tagList = [] ;
      for (tag in allTag){
        if(!tagList[allTag[tag].type]) {
          tagList[allTag[tag].type] = [];
        }
        //约定‘照顾小孩’的tagID为100，其子选项tagID为101，102，103
        if(allTag[tag].tagID == 100){
          childTag=tag
          allTag[tag].sonTag=[];
        }
        if(allTag[tag].tagID == 101 || allTag[tag].tagID == 102 || allTag[tag].tagID == 103) {
          allTag[childTag].sonTag.push(allTag[tag]);
          allTag[tag]=null;
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
    var tag = opts.tag;
    console.log(tag);
    var tagNum;
    var tagStr='';
    var queryNeedString='';
    var queryInfoString ='';
    var countString = '';
    var count=0;
    if(tag!=''){
      for(tagNum in tag){
        count ++;
        tagStr+=tag[tagNum].tagID;
        if(tagNum<tag.length-1)
          tagStr+=',';
      }
    }
    var havingString = " ";
    var whereString  = " ";
    var tagString = " ";
    if(tag!=''){
      havingString = " HAVING COUNT(*)="+ count;
      whereString  = " AND tur.tagID IN ("+tagStr+") ";
    }
    async.parallel([
      function(next) {
        var queryString = "SELECT "+
          "tur.`userID`, "+
          "IFNULL(ur.userName,'') AS userName, "+
          "IFNULL(ur.`avatarUrl`,'"+weixinConfig.url+"images/avatar404.jpg') AS avatarUrl,(SELECT '') AS sysComment, "+
          "IFNULL(ur.expectSalary,'') AS expectSalary, "+
          "IFNULL((SELECT GROUP_CONCAT(tagName SEPARATOR '|') FROM tag t LEFT JOIN taguserre tur ON tur.tagID=t.tagID WHERE t.type=4 AND tur.`userID` = ur.`userID` ),'') AS sysTag ,"+
          "(SELECT SUM(b.weight) FROM taguserre a LEFT JOIN tag b ON b.`tagID` =a.`tagID` WHERE a.userID = tur.`userID` GROUP BY tur.`userID`) AS sumweight "+
          "FROM taguserre tur LEFT JOIN tag ta ON ta.`tagID`=tur.`tagID` "+
          "LEFT JOIN `user` ur ON tur.`userID` = ur.`userID` "+
          "WHERE  ur.workstatus!=0  AND ur.role=2  "+
          whereString+
          "GROUP BY tur.userID "+ havingString+" ORDER BY sumweight DESC limit "+opts.start +", "+opts.limit+" ;";
        console.log(queryString);
        TagList.query(queryString,function(err,result){
          if(err) { return next(err); }
          next(null,result);
        })
      },
      function(next){
        var queryString = "SELECT COUNT(*) totalRow "+
        "FROM "+
        "(SELECT "+
        "COUNT(tur.`userID`) "+
        "FROM taguserre tur LEFT JOIN tag ta ON ta.`tagID`=tur.`tagID` "+
        "LEFT JOIN `user` ur ON tur.`userID` = ur.`userID` "+
        "WHERE  ur.workstatus!=2  AND ur.role=2  "+
         whereString+
        "GROUP BY tur.userID "+ havingString+" ) AS a ; ";
        TagList.query(queryString,function(err,result){
          if(err) { return next(err); }
          next(null,result);
        })
      },
      function(next){  //计算出推荐工资的下限
        if(tag==''){
          return  next(null,[{lowPrice:0}]);
        }
        var queryString = "select sum(price) as lowPrice from tag tur where tur.type!=1 "+whereString
        TagList.query(queryString,function(err,result){
          if(err) { return next(err); }
          next(null,result);
        })
      },
      //function(next){  //计算出推荐工资的上限
      //  var queryString = "SELECT SUM(price) AS highPrice ,tur.`userID` FROM "+
      //  "taguserre tur LEFT JOIN tag t ON tur.`tagID`=t.`tagID` WHERE t.`type`!=1 AND tur.userID IN "+
      //  "(SELECT tur.userID "+
      //  " FROM taguserre tur LEFT JOIN tag ta ON ta.`tagID`=tur.`tagID` "+
      //  "LEFT JOIN `user` ur ON tur.`userID` = ur.`userID` "+
      //  "WHERE "+
      //  " ur.workstatus!=2  AND ur.role=2 "+whereString +
      //  " GROUP BY tur.userID "+havingString+" ) GROUP BY tur.userID ;";
      //  console.log(queryString);
      //  TagList.query(queryString,function(err,result){
      //    if(err) { return next(err); }
      //    next(null,result);
      //  })
      //},
      function(next){
        var workPrice = 0;//工作内容需要的价格
        var queryString = 'select * from tag tur where tur.type=1 '+whereString ;
        //计算出工作内容的价格
        TagList.query(queryString,function(err,tagInfo){
          for(x in tagInfo){
            for(y in tag){
              if(tag[y].tagID== tagInfo[x].tagID)
                workPrice +=  tagInfo[x].price*(1+(tag[y].value-tagInfo[x].minValue)/tagInfo[x].precision*tagInfo[x].coefficient);//计算公示请参照设计文档3.1.3便签价格算法
            }
          }
          var result ={
            workPrice:workPrice
          };
          if(err) {
            sails.log.error(err);
            return next(err);
          }
          return next(null,result);
        })
      }
    ],function(err,results){
      if(err) return cb(err);
      var x;
      var users = '';
      var count=0;
      var tagList = results[0];
      var lowPrice= results[2][0];
      var highPrice=results[3];
      for(a in tagList) {
        count++;
        users += tagList[a].userID;
        if (a < tagList.length - 1)
          users += ',';
      }
      //console.log(users);
      if(users!=''&&tag!=''){
        var queryString = "SELECT SUM(price) AS highPrice ,tur.`userID` FROM taguserre tur LEFT JOIN tag t ON tur.`tagID`=t.`tagID` WHERE t.`type`!=1 AND tur.userID IN ("+users+") GROUP BY tur.`userID`";
      }
      else if(users!=''&&tag==''){
        var queryString = "SELECT SUM(price) AS highPrice ,tur.`userID` FROM taguserre tur LEFT JOIN tag t ON tur.`tagID`=t.`tagID` WHERE  tur.userID IN ("+users+") GROUP BY tur.`userID`";
      }else var queryString = "SELECT null";
      console.log(queryString);
      TagList.query(queryString,function(err,high){
        console.log(high);
        console.log(results[3]);
        console.log(lowPrice);
        if(err) return cb(err);
        for( x in tagList){
          tagList[x].lowPrice = lowPrice.lowPrice||0;
          tagList[x].lowPrice+=results[3].workPrice;
          tagList[x].highPrice = high[x].highPrice||0;
          tagList[x].highPrice += results[3].workPrice;
          delete tagList[x].upPrice;
          delete tagList[x].downPrice;
          delete tagList[x].sumweight;
          if(tag==''){
            tagList[x].price=tagList[x].highPrice;
          }else{
            tagList[x].price=tagList[x].lowPrice+'-'+tagList[x].highPrice;
          }
        }
        var servants = {
          servantList:tagList,
          totalPages:Math.ceil(results[1][0].totalRow/opts.limit)
        };
        return cb(null,servants);
      })


    });
  },
  //通过用户选择的标签筛选出服务员。并且通过标签的权重之和进行重高到低的排序
  //查询出来的信息有：用户姓名，用户id，用户头像，用户期待薪水，除去工作内容价格的价格下限和价格上限。
  //工作内容价格需要用公示进行计算
  getServantSortByWight : function (opts,cb){
    var tag = opts.tag;
    var tagNum;
    var tagStr='';
    var queryNeedString='';
    var queryInfoString ='';
    var countString = '';
    for(tagNum in tag){
      tagStr+=tag[tagNum].tagID;
      if(tagNum<tag.length-1)
        tagStr+=',';
    }
    console.log(tagStr);
    var queryString = "SELECT "+
      "tur.`userID`, "+
      "GROUP_CONCAT(ta.tagID), "+
      "IFNULL(ur.userName,'') AS userName, "+
      "IFNULL(ur.`avatarUrl`,'') AS avatarUrl,(SELECT '') AS sysComment, "+
      "IFNULL(ur.expectSalary,'') AS expectSalary, "+
      " IFNULL((SELECT GROUP_CONCAT(tagName SEPARATOR '|') FROM tag t LEFT JOIN taguserre tur ON tur.tagID=t.tagID WHERE t.type=4  ),'') AS sysTag , "+
      "SUM(ta.weight) AS sumweight "+
      "FROM taguserre tur LEFT JOIN tag ta ON ta.`tagID`=tur.`tagID` "+
      "LEFT JOIN `user` ur ON tur.`userID` = ur.`userID` "+
      "WHERE  tur.tagID IN ("+tagStr+") "+
      "AND ur.workstatus!=2  AND ur.role=2 "+
      "GROUP BY tur.userID HAVING COUNT(*)>1 ORDER BY sumweight DESC limit "+opts.start +", "+opts.limit+" ;";
    console.log(queryString);
    TagList.query(queryString,function(err,result){
      if(err) {
        sails.log.error(err);
        return cb(err);
      }
      return cb(null,result);
    })
  },

  getTotalRowNum : function (opts,cb){
    var tag = opts.tag;
    var tagNum;
    var tagStr='';
    for(tagNum in tag){
      //if(opts[tag].tagID){
      tagStr+=tag[tagNum].tagID;
      if(tagNum<tag.length-1)
        tagStr+=' or t.tagID=';
      //}
    }
    var queryString = "select count(*) totalRow FROM ( SELECT COUNT(a.userID) FROM (SELECT  t.userID, t.tagID FROM `taguserre` t  LEFT JOIN `tag` ta ON t.tagID = ta.tagID WHERE ( ";
    queryString += tagStr ;
    queryString += " )  OR ta.type = 4 OR ta.type = 3) AS a GROUP BY a.userID ) AS b" ;
    TagList.query(queryString,function(err,result){
      if(err) {
        sails.log.error(err);
        return cb(err);
      }
      var  totalPages ={
        totalPages:Math.ceil(result[0].totalRow/opts.limit)
      };
      return cb(null,totalPages);
    })
  },


  //工作内容的价格需要公示进行计算
  getWorkTagPrice : function (opts,cb){
    var workPrice = 0;//工作内容需要的价格
    var queryString = 'select * from tag t where (t.tagID=' ;
    for(tag in opts){

      if(opts[tag].tagID){
        queryString+=opts[tag].tagID;
        if(tag<opts.length-1)
          queryString +=' or t.tagID=';
      }
    }
    queryString += ' ) and t.type=1;';
    //计算出工作内容的价格
    console.log(queryString);
    TagList.query(queryString,function(err,tagInfo){
      for(x in tagInfo){
        for(y in opts){
         if(opts[y].tagID== tagInfo[x].tagID)
           workPrice +=  tagInfo[x].price*(1+(opts[y].value-tagInfo[x].minValue)/tagInfo[x].precision*tagInfo[x].coefficient);//计算公示请参照设计文档3.1.3便签价格算法
        }
      }
      var result ={
        workPrice:workPrice
      };
      if(err) {
        sails.log.error(err);
        return cb(err);
      }
      return cb(null,result);
    })
  },

  countPrice : function (opts,cb){ //活动，算算你值多少钱
    var tag = opts.tag;
    var tagStr = '';
    for(var tagNum in tag){
      tagStr+=tag[tagNum].tagID;
      if(tagNum<tag.length-1)
        tagStr+=',';
    }
    var queryString = " select sum(price) totalPrice from tag where tagID in("+tagStr+")";
    TagList.query(queryString,function(err,result){
      console.log(err);
      console.log(result);
      if(err) return cb(err);
      var info = {
        userID: opts.userID,
        totalPrice:result[0].totalPrice
      }
      MeasPrice.updateOrCreate(info,function(err,result1){
        console.log(err);
        console.log(result1);
        if(err) return cb(err);
        return cb(null,result[0]);
      })
    })
  },

  getResult : function(opts,cb){
    async.parallel([
      function(next){
        MeasPrice.find({userID:opts.userID}).exec(function(err,priceInfo){
          if(err) return next(err);
          var num = Math.ceil(priceInfo[0].totalPrice/1000);
          console.log(num);
          var percentage = '5%';
          switch(num)
          {
            case 1:
              percentage = '10%';
              break;
            case 2:
              percentage = '15%';
              break;
            case 3:
              percentage = '31%';
              break;
            case 4:
              percentage = '59%';
              break;
            case 5:
              percentage = '79%';
              break;
            case 6:
              percentage = '85%';
              break;
            case 7:
              percentage = '91%';
              break;
            case 7:
              percentage = '95%';
              break;
            default:
              percentage = '96%';
          }
          delete  priceInfo[0].id;
          delete  priceInfo[0].userID;
          delete  priceInfo[0].createTime;
          priceInfo[0].percentage = percentage;
          return next(null,priceInfo[0]);
        })
      },
      function(next){
        MeasPrice.getRanking(function(err,ranking){
          if(err) return next(err);
          return next(null,ranking);
        })
      }
    ],function(err,reslut){
      if(err) return cb(err);
      var info = {
        userInfo : reslut[0],
        ranking   : reslut[1],
      };
      return cb(null,info)
    })

  }
}
