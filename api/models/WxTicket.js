/**
 * WxTicket.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var qs = require('querystring');
var https = require('https');
var util = require('util');
module.exports = {
  tablename:"wxTicket",
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    ticket:{
      type: "string",
      size:512
    },
    expires_in:{
      type:"int"
    },
    updatedAt:{
      type:"data"
    }
  },
  updataTicket:function(cb){

    //更新tikect的文档在
    //http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html#.E9.99.84.E5.BD.951-JS-SDK.E4.BD.BF.E7.94.A8.E6.9D.83.E9.99.90.E7.AD.BE.E5.90.8D.E7.AE.97.E6.B3.95

    //获取tikect前需要先获取token
    WxAccess.validateToken(function(err,token){
      if(err) return cb(err);
      var hostname = util.format('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=%s' +
        '&type=jsapi',token.access_token);
      console.log('hostname',hostname);
      https.get(hostname, function(res) {
        var buffers = [];
        res.on('data', function(d) {
          buffers.push(d);
        });
        res.on('end', function(d){
          var wholeData = Buffer.concat(buffers);
          var dataStr = wholeData.toString('utf8');
          data=wholeData;
          data=JSON.parse(data);
          if(data.errcode){
            return cb(data);
          }else{
            var updateString =util.format( 'update wxticket set ticket="%s",expires_in=%s,updatedAt=NOW();',data.ticket,data.expires_in);
            console.log('updateString',updateString);
            console.log('data',data);
            WxTicket.query(updateString,function(err,result){
              if(err) return cb(err);
              return cb(null,result);
            });
          }
        })
      }).on('error', function(e) {
        cb(e.errmsg);
      });

    })


  },

  //检查ticket是否过期，会返回一个可用ticket
  validateTicket:function(cb){
    WxTicket.find().limit(1).exec(function(err,ticket){
      if(err) return cb(err);
      ticket=ticket[0];
      var isExpired;
      var updatedTime=(new Date(ticket.updatedAt).getTime());
      console.log('validateTicket',ticket);
      var timeDiff = Date.now() - updatedTime;
      console.log(timeDiff);
      if(timeDiff>=ticket.expires_in*1000||ticket==''){
        //ticket，更新ticket
        WxTicket.updataTicket(function(err,result){
          if(err) return cb(err);
          return cb(null,result);
        })
      }else{
        //ticket没过期不需要更新ticket
        return cb(null,ticket);
      }
    });
  },
};


