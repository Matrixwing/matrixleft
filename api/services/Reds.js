/**
 * Created by Administrator on 2016/12/23.
 */
var util = require('util');
module.exports = {

  getRedList : function (opts,cb){
    //console.log(opts);
    var statusString = '';
    if(opts.status) statusString=' AND status='+opts.status
    var queryString = 'SELECT ifnull(rur.RedID,"") as redID,ifnull(rur.createAt,"") as createAt,ifnull(rur.ExpireAt,"") as expireAt,ifnull(rur.usedAt,"") as usedAt,`status`,ifnull(rd.name,"") as `name`,ifnull(rd.amount,"") as amount,ifnull(rd.condition,"")as `condition` ' +
      'FROM `reduserre` rur LEFT JOIN redenvelope rd ON rur.redID=rd.id  WHERE userID=%s %s';
    var countString =  'SELECT count(0) totalRow ' +
      'FROM `reduserre` rur LEFT JOIN redenvelope rd ON rur.redID=rd.id  WHERE userID=%s %s';
    queryString = util.format(queryString,opts.userID,statusString);
    countString = util.format(countString,opts.userID,statusString);
    async.parallel([
      function(next){
        RedUserRe.query(queryString,(function(err,orderList){
          if(err) return next(err);
          return next(null,orderList)
        }))
      },
      function(next){
        RedUserRe.query(countString,(function(err,orderList){
          if(err) return next(err);
          return next(null,orderList)
        }))
      },

    ],function(err,results){
      if(err) return cb(err);
      var redList = results[0];
      console.log(JSON.parse(results[0][0].condition))
      for (var x in results[0]){
        if(results[0][x]!=''){
          results[0][x].condition=JSON.parse(results[0][0].condition)
        }
      }
      var newResults = {
        redList : redList,
        totalPages : Math.ceil(results[1][0].totalRow/opts.limit)
      };
      cb(null,newResults);
    })

  }
}
