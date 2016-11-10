/**
 * ServantController
 *
 * @description :: Server-side logic for managing Servants
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var CryptoJS = require("crypto-js");


module.exports = {

  /**
   * 查询服务员详细信息
   * @param   {req}   request
   * @param   {res}  response
   */
  getCertInfo: function (req, res) {
    sails.log.info('getCertInfo');
    var queryInfo =  req.param('queryInfo','');

    ////*加密部分  以后需封装
    //var queryInfoD =  req.param('queryInfo','');
    //var key = CryptoJS.enc.Hex.parse('1234567812345678');
    //var iv   = CryptoJS.enc.Latin1.parse('Pkcs7');
    ////var bytes  = CryptoJS.AES.decrypt(queryInfoD,key);
    //var bytes = CryptoJS.AES.decrypt(queryInfoD,key,
    //  {
    //    iv:iv,
    //    mode:CryptoJS.mode.CBC,
    //    padding:CryptoJS.pad.Pkcs7
    //  });
    //var queryInfo = bytes.toString(CryptoJS.enc.Utf8);
    ////加密部分结束

    var options = new Object();

    var Regx = /^[A-Za-z0-9]*$/;
    if (Regx.test(queryInfo)) {
      if(queryInfo.length==18 || queryInfo.length==15){
        //用户输入的是身份证，根据身份证查询
        sails.log.info('用户输入的是身份证');
        options.IDCard = queryInfo;

      }else{
        //用户输入的是证件编号
        sails.log.info('用户输入的是证件编号');
        options.certificateID = queryInfo;
      }
    }
    else {
      //用户输入的是名字
      options.userName = queryInfo;
    }

    //查询证书
    ServantCert.getCert(options,function(err,result){
      if (err) return res.send(404,'对不起没有找到您要的信息');
      var str = JSON.stringify(result) ;
      result = require('util').format('{"msgNo":"0000","msgInfo":"查询到了信息","data":%s}',str);
      res.send(result);
    });
  }
};

