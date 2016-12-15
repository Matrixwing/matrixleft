/**
 * UploadFiles
 *
 * @description :: 上传文件
 *
 */
var qiniu = require("qiniu");
var fs=require("fs");
qiniu.conf.ACCESS_KEY = 'AJKfZNP67TG_MEvBPvTFMpRVMnx2mMwx673ezHzn';
qiniu.conf.SECRET_KEY = '_cEQvBddK7nrtaCcUCcsrc4Owj37zkzVJTjFMQ4p';
var bucket = 'test';
var qiniuDom = 'http://ogp0rwqj4.bkt.clouddn.com/' ;
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
    },


  /**
   * 用户完善资料时候上传自己的头像图片
   *
   * @api public
   * @param  {Object} `opts`  头像信息，userID:上传用户的userID。files：图片的base64编码
   * @param {Function} cb
   * @return {*}
   */
  uploadAvatarToQiniu : function(uptoken, key, localFile,cb) {
    var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
      if(!err) {
        console.log(ret.hash, ret.key, ret.persistentId);
        cb(null,ret)

      } else {
        // 上传失败， 处理返回代码
        console.log(err);
        return cb(err);
      }
    });
  },

  /**
   * 把base64的图片保存在本地磁盘上
   *
   * @api private
   * @param  {Object} `opts`  userID:上传用户的userID。files：图片的base64编码，type：上传图片的类型
   * @param {Function} cb
   * @return {*}
   */
  uploadAvatar : function(opts,cb){
    var userID = opts.userID;
    var base64Data = opts.files;
    console.log(base64Data);
    //过滤data:URL
    var base64Data = base64Data.replace(/^data:image\/\w+;base64,/, "");
    var base64Data = base64Data.replace(/\s/g,"+");
    var dataBuffer = new Buffer(base64Data, 'base64');
    console.log(base64Data);
    var key =userID+".jpg"; //文件名
    var localFilePath = "./.tmp/"+key; //本地的的位置
    fs.writeFile(localFilePath, dataBuffer, function(err) {
      if(err){
        return cb(err);
      }else{
        var token = UploadFiles.uptoken(bucket, key);
        UploadFiles.uploadAvatarToQiniu(token,key,localFilePath,function(err,result){
          if(err) return cb(err);
          User.update({userID:userID},{avatarUrl:qiniuDom+key}).exec(function(err,result){
            if(err) return cb(err);
            return cb(null,'result');
          })

        })

      }
    });
  },
  /**
   * 構建七牛的上傳策略函數
   *
   * @api private
   * @param  {String} bucket
   * @param {String} key
   * @return {String} token
   */
  uptoken : function(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
  return putPolicy.token();
  }
}
