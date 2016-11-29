/**
 * UploadFilesController
 *
 * @description :: 上传文件到服务器
 *
 */
var util = require('util');
module.exports = {
  uploadFiles : function (req,res){
    //todo 这里是测试数据后面要修改
    req.session.userID=245;

    var opts = {
      userID:req.session.userID,
      files:req.param('files'),
      filesType:req.param('filesType')
    };


    //var opts = {
    //  userID:req.session.userID,
    //  files:"1111",
    //  filesType:1
    //};
    if((!opts.files)||(!opts.files)){
      return res.send('{"msgNo":"9999","msgInfo":"参数错误"}');
    }
    UploadFiles.uploadIDCard(opts,function(err,result){
      if (err) return res.send('{"msgNo":"9999","msgInfo":"'+err+'"}');
      var str = JSON.stringify(result) ;
      result = util.format('{"msgNo":"0000","msgInfo":"上传成功"}');
      res.send(result);
    })
  }
};

