/**
 * MeasPrice.js
 *
 * @description :: 在”算一算”活动中,记录每个用户计算出的价格
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'localMysqlServer',
  table: 'measprice',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoid: false,
  attributes: {
    id :{
      type: 'integer',
    },
    userID  :{
      type: 'integer',
    },
    totalPrice  :{
      type: 'integer',
    },
    createTime :{
      type: 'datetime',
    },
  },
  updateOrCreate : function(opts,cb){
    MeasPrice.find({userID:opts.userID}).exec(function(err,result){
      if(err) return cb(err);
      if(result==''){
        MeasPrice.create({userID:opts.userID,totalPrice:opts.totalPrice}).exec(function(err,measPrice){
          if(err) return cb(err)
          return cb(null,measPrice);
        })
      }else{
        MeasPrice.update({userID:opts.userID},{totalPrice:opts.totalPrice}).exec(function(err,measPrice) {
          if (err) return cb(err)
          return cb(null, measPrice);
        })
      }
    })
  },
  getRanking : function (cb){
    var queryString = "SELECT nickname,avatarUrl,totalPrice FROM `measprice` m LEFT JOIN `user` u ON u.`userID`=m.`userID`  ORDER BY totalPrice DESC limit 0,20";
    MeasPrice.query(queryString,function(err,ranking){
      if (err) return cb(err)
      return cb(null, ranking);
    })

  }
};

