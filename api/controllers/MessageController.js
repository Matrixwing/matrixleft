/**
 * MessageController
 *
 * @description :: Server-side logic for managing Messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var weixinConfig = require('../../config/wyhConfig.js').Weixin;
var https = require('https');
var querystring = require('querystring');

module.exports = {
  //发送信息
  sendMessageToUser: function (req, res) {

    WxAccess.validateToken(function(err,token){
      //var options = {
      //  hostname: 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token='+token,
      //  method: 'POST'
      //};

      var post_data = JSON.stringify( {
        touser:"ovSs8w7mUy1j1SkeLBsmWpjVpkGM",
        template_id:"9BZprd3ZFlT2FH511zm4zh3KU-_JO_GGQCyX7rUiSbI",
        url:"http://weixin.qq.com/download",
        topcolor:"#FF0000",
        data:{
          first: {
            value:"恭喜你购买成功！",
            color:"#173177"
          },
          productType:{
            value:"巧克力",
            color:"#173177"
          },
          name: {
            value:"巧克力",
            color:"#173177"
          },
          time: {
            value:"2014年9月22日",
            color:"#173177"
          },
          remark:{
            value:"欢迎再次购买",
            color:"#173177"
          }
        }
      });

      //var post_data =querystring.stringify( {
      //  "touser":"ovSs8w7mUy1j1SkeLBsmWpjVpkGM",
      //  "template_id":"ngqIpbwh8bUfcSsECmogfXcV14J0tQlEpBO27izEYtY",
      //  "url":"http://weixin.qq.com/download",
      //  "topcolor":"#FF0000",
      //  "data":{
      //  "User": {
      //    "value":"黄先生",
      //      "color":"#173177"
      //  },
      //  "Date":{
      //    "value":"06月07日 19时24分",
      //      "color":"#173177"
      //  },
      //  "CardNumber":{
      //    "value":"0426",
      //      "color":"#173177"
      //  },
      //  "Type":{
      //    "value":"消费",
      //      "color":"#173177"
      //  },
      //  "Money":{
      //    "value":"人民币260.00元",
      //      "color":"#173177"
      //  },
      //  "DeadTime":{
      //    "value":"06月07日19时24分",
      //      "color":"#173177"
      //  },
      //  "Left":{
      //    "value":"6504.09",
      //      "color":"#173177"
      //  }
      //}
      //});

      //var post_data = querystring.stringify( {
      //  "touser":"ovSs8w7mUy1j1SkeLBsmWpjVpkGM",
      //  "template_id":"OCMXadGpWX4FJRQypnDqO4_GNuo-PVcM365QuB0CHzQ",
      //  //url:"http://weixin.qq.com/download",
      //  "data":{
      //
      //    "tradeDateTime":{
      //      "value":"巧克力",
      //      "color":"#173177"
      //    },
      //    "orderType": {
      //      "value":"39.8元",
      //      "color":"#173177"
      //    },
      //    "customerInfo": {
      //      "value":"2014年9月22日",
      //      "color":"#173177"
      //    },
      //    "orderItemName":{
      //      "value":"欢迎再次购买！",
      //      "color":"#173177"
      //    },
      //    "orderItemData":{
      //      "value":"欢迎再次购买！",
      //      "color":"#173177"
      //    },
      //    "remark":{
      //      "value":"欢迎再次购买！",
      //      "color":"#173177"
      //    }
      //  }
      //});


      console.log('11111111');
      console.log(post_data);
      var options = {
        protocol:'https:',
        hostname: 'api.weixin.qq.com',
        //port: 443,
        path:'/cgi-bin/message/template/send?access_token='+token.access_token,
        method:'POST',
        //rejectUnauthorized: false,  //很多时候不加会访问出错
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': post_data.length
        }
      };
      var data;
      console.log(token);
      console.log(options);
      var req = https.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        //res.setEncoding('utf8');
        var buffers = [];
        res.on('data', function (chunk) {
          console.log('-----------');
          buffers.push(chunk);
        });
        res.on('end',function () {

          var wholeData = Buffer.concat(buffers);
          var dataStr = wholeData.toString('utf8');
          console.log('-----------');
          console.log(dataStr);
        })
      });

      req.on('error', function(err) {
        console.log('error',err);
      })
      req.write(post_data );
      req.end();

    })
  }

};

