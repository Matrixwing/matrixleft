/**
 * UploadFiles
 *
 * @description :: 上传文件之服务器
 *
 */

module.exports = {
    uploadIDCard : function (opts,cb){

      if(opts.filesType==1){
        var idcard = {
          userID:opts.userID,
          front:opts.files
        };
      }else{
        var idcard = {
          userID:opts.userID,
          reverse:opts.files
        };
      }
      IDImage.find({userID:opts.userID}).limit(1).exec(function(err,result) {

        if(result==''){
          IDImage.create(idcard).exec(function(err,card){
            if(err) return cb(err)
            return cb(null,card);
          })
        }else{
          IDImage.update({userID:opts.userID},idcard).exec(function(err,card){

            if(err) return cb(err)
            return cb(null,card);
          })
        }

      })

    }
}