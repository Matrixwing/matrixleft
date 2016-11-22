/**
 * 404 (Not Found) Handler
 * 已经根据产品做了修改
 */
var rf=require("fs");

module.exports = function notFound (data, options) {

  // Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  rf.readFile("./assets/404.html",'utf-8',function(err,html){
    if(err){
      console.log(err);
      return res.send('找不到该页面');
    }else{
      return res.send(html);
    }
  });
   // return res.send(html);
};

