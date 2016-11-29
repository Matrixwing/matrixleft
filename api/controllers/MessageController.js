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
      var post_data = JSON.stringify( {
        touser:"ovSs8w7mUy1j1SkeLBsmWpjVpkGM",
        template_id:"ocGJIHW7voLu_sC3Hxo98MYddqQoLUaMKvpZq8XnvQ8",
        url:"http://1k5x895985.iask.in/index.html",
        //topcolor:"#FF0000",
        data:{
          first: {
            value:"恭喜你购买成功！",
            color:"#173177"
          },
          name: {
            value:"巧克力",
            color:"#173177"
          },
          remark:{
            value:"欢迎再次购买",
            color:"#173177"
          }
        }
      });



      console.log('11111111');
      console.log(post_data);
      var options = {
        protocol:'https:',
        hostname: 'api.weixin.qq.com',
        port: 443,
        path:'/cgi-bin/message/template/send?access_token='+token.access_token,
        method:'POST',
        //json:true,
        //rejectUnauthorized: false,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': post_data.length
        }
      };
      var data;
      console.log(token);
      console.log(options);
      var req = https.request(options, function(res) {
        res.setEncoding('utf8');
        //var buffers = [];
        var responseString = '';
        res.on('data', function (chunk) {
          console.log('-----------');
          responseString += chunk;
        });
        res.on('end',function () {
          //var wholeData = Buffer.concat(buffers);
          //var dataStr = wholeData.toString('utf8');
          var resultObject = JSON.parse(responseString);
          console.log('-----resBody-----',resultObject);
         // console.log(dataStr);
        })
      });

      req.on('error', function(err) {
        console.log('error',err);
      })
      req.write(post_data);
      req.end();

    })
  }

};

