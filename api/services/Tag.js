/**
 * Created by Administrator on 2016/11/13.
 */


module.exports = {
  getSumPrice : function(opts,cb){
    var queryString = 'select sum(price) from tag where tagID=';
    console.log(opts.length);
    for(tag in opts){
      console.log(tag);
      if(opts[tag].tagID!=''){
        queryString+=opts[tag].tagID;
        if(tag<opts.length-1)
        queryString+=' or tagID=';
      }
    }
    console.log(queryString);
    TagList.query(queryString,function(err,result){
      if(err) return cb(err);
      return cb(null,result);
    })
  },

  getServantByTag : function (opts,cb){
    var queryString = 'SELECT a.userID,ur.userName,ur.`avatarUrl`,SUM(weight) sumweight  FROM (SELECT t.userID,t.tagID FROM `taguserre` t LEFT JOIN `tag` ta ON t.tagID=ta.tagID  WHERE t.tagID=';
    console.log(opts.length);
    for(tag in opts){
      console.log(tag);
      if(opts[tag].tagID!=''){
        queryString+=opts[tag].tagID;
        if(tag<opts.length-1)
          queryString+=' or t.tagID=';
      }
    }
    queryString+=' OR ta.type=2) AS a LEFT JOIN `tag` ta ON a.tagID=ta.`tagID` LEFT JOIN USER ur  ON ur.`userID`=a.userID GROUP BY a.userID ORDER BY sumweight  DESC;';
    console.log(queryString);
    TagList.query(queryString,function(err,result){
      if(err) return cb(err);
      return cb(null,result);
    })
  }
}
