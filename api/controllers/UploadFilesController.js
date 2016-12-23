/**
 * UploadFilesController
 *
 * @description :: 上传文件到服务器
 *
 */
var util = require('util');
module.exports = {
  uploadFiles : function (req,res){
    var opts = {
      userID:req.session.userID,
      files:req.param('files'),
      filesType:req.param('filesType')
    };

    if((!opts.files)||(!opts.files)){
      return res.send('{"msgNo":"9999","msgInfo":"参数错误"}');
    }
    if(opts.filesType != 4 ) {
      UploadFiles.uploadImage(opts, function (err, result) {
        if (err) return res.send('{"msgNo":"9999","msgInfo":"' + err + '"}');
        var str = JSON.stringify(result);
        result = util.format('{"msgNo":"0000","msgInfo":"上传成功"}');
        res.send(result);
      })
    }
    if(opts.filesType == 4) {
      UploadFiles.uploadAvatar(opts, function (err, result) {
        if (err) return res.send('{"msgNo":"9999","msgInfo":"' + err + '"}');
        var str = JSON.stringify(result);
        result = util.format('{"msgNo":"0000","msgInfo":"上传成功"}');
        res.send(result);
      })
    }
  }
};

