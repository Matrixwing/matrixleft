/**
 * Created by Administrator on 2016/12/23.
 */
var dateformat = require('dateformat');
var util = require('util');
var async = require('async');
//var Redpack = require('weixin-redpack').Redpack;
var fs=require('fs');
var weixinConfig = sails.config.weixin;

//var redpack = Redpack({
//  wxappid:weixinConfig.appid,
//  mch_id:weixinConfig.mch_id,
//  pfx: fs.readFileSync('./cert/apiclient_cert.p12'),
//  partner_key: weixinConfig.partner_key, //微信商户平台API密钥
//});
//var redpack = Redpack({
//  wxappid:'wx8306afd398ab31e5',
//  mch_id:'1402095402',
//  pfx: fs.readFileSync('./cert/apiclient_cert.p12'),
//  partner_key: 'qd20160725scfkilejlmatrix7u8x0kd', //微信商户平台API密钥
//});

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
          console.log('sdffadsf',results[0][x]);
          results[0][x].condition=JSON.parse(results[0][x].condition)
        }
      }
      var newResults = {
        redList : redList,
        totalPages : Math.ceil(results[1][0].totalRow/opts.limit)
      };
      cb(null,newResults);
    })
  },

  //给用户发红包
  sendRedsToUser : function(opts,cb){
    var now = new Date(); //现在时间
    for(var i=0;i<opts.reds.length;i++){
      Red.find({id:opts.reds[i]}).exec(function(err,red){
        console.log(err);
        console.log(red);
        if(err) return cb(err);
        if(red=='') return cb('没有这个红包');
        var expire=new Date(now.getTime()+red[0].validTime*24*60*60*1000); //过期时间
        var newRed ={
          userID:opts.userID,
          redID:red[0].id,
          expireAt:dateformat(expire,'yyyy-mm-dd'),
        }
        RedUserRe.create(newRed).exec(function(err,rur){
          if(err) return cb(err);
        })
      })
    }
  //  redpack.send({
  //    mch_billno: '123426900220150325'+Math.random().toString().substr(2,10),
  //    send_name: '红包来自',
  //    wishing: '新人大礼包',
  //    re_openid: 'ovSs8w7mUy1j1SkeLBsmWpjVpkGM',
  //    total_amount: 100,//单位分
  //    total_num: 1,
  //    client_ip: '14.23.102.146',
  //    nick_name: 'XXXX',
  //    act_name: '新人大礼包',
  //    remark: 'remark'
  //  }, function(err, result){
  //    console.log(err);
  //    console.log(result);
  //  })
  //  return cb(null,'');
  }
}
