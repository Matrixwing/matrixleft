/**
 * UploadFiles
 *
 * @description :: 上传文件
 *
 */
var dateformat = require('dateformat');
var qiniu = require("qiniu");
var fs=require("fs");
qiniu.conf.ACCESS_KEY = sails.config.qiniu.ACCESS_KEY;
qiniu.conf.SECRET_KEY = sails.config.qiniu.SECRET_KEY;
var bucket = sails.config.qiniu.avatarBucket;
var qiniuDom = sails.config.qiniu.domain ;
module.exports = {
    uploadImage : function (opts,cb){
      var image = {
        userID:opts.userID,
        type:opts.filesType,
        image:opts.files
      };
      UploadImage.find({userID:image.userID,type:image.type}).limit(1).exec(function(err,result) {
        if(result==''){
          UploadImage.create(image).exec(function(err,card){
            if(err) return cb(err)
            return cb(null,card);
          })
        }else{
          if(result[0].status!=3){
            UploadImage.update({userID:image.userID,type:image.type},image).exec(function(err,card){
              if(err) return cb(err);
              return cb(null,card);
            })
          }else{
            return cb('管理员哥哥已经审核过了，不用重复上传啦！');
          }
        }
      })
    },


  /**
   * 用户完善资料时候上传自己的头像图片
   *
   * @api private
   * @param  {Object} `opts`  头像信息，userID:上传用户的userID。files：图片的base64编码
   * @param {Function} cb
   * @return {*}
   */
  //uploadAvatarToQiniu : function(uptoken, key, localFile,cb) {
  uploadAvatarToQiniu : function(opts,cb) {
    var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(opts.uptoken, opts.key, opts.localFilePath, extra, function(err, ret) {
      console.log("err",err);
      console.log('111111111111111111111',ret);
      if(!err) {
        console.log(ret);
        cb(null,opts)
      } else {
        // 上传失败， 处理返回代码
        return cb(err);
      }
    });
  },

  deleteFromQiniu : function(opts,cb) {
    console.log(opts);
    var client = new qiniu.rs.Client();
    client.remove(bucket, opts.oldKey, function(err, ret) {
      console.log("err",err);
      console.log('111111111111111111111',ret);
      if (!err) {
        return cb(null,opts);
      } else {
        console.log(err);
        if(err.code == 612){ //七牛上没有数据，说明用户使用的是微信头像
          return cb(null,opts);
        }
        return cb(false);
      }
    });
  },
  /**
   * 用户上传头像
   *
   * @api public
   * @param  {Object} `opts`  userID:上传用户的userID。files：图片的base64编码，type：上传图片的类型
   * @param {Function} cb
   * @return {*}
   */
  uploadAvatar : function(opts,cb){
    var userID = opts.userID;
    var base64Data = opts.files;
    //过滤data:URL
    var base64Data = base64Data.replace(/^data:image\/\w+;base64,/, "");
    var base64Data = base64Data.replace(/\s/g,"+");
    var dataBuffer = new Buffer(base64Data, 'base64');
    //console.log(base64Data);
    var now = new Date(); //现在时间
    var key =userID+"u"+dateformat(now,'yyyymmddHHMMss')+".jpg"; //文件名
    var localFilePath = "./.tmp/"+key; //本地的的位置
    fs.writeFile(localFilePath, dataBuffer, function(err) {
      if(err){
        return cb(err);
      }else{
        var fileInfo = {
          userID:opts.userID,
          key:key,
          localFilePath:localFilePath,
          uptoken : UploadFiles.uptoken(bucket, key)
        }
       // var token = UploadFiles.uptoken(bucket, key);
        //先删除原有的头像
        async.waterfall([
          function(next){
            next(null,fileInfo);
          },function(fileInfo,next){
            User.find({userID:fileInfo.userID}).exec(function(err,user){
              console.log(user);
              console.log(err);
              if(err) return next(err);
              fileInfo.oldKey=user[0].avatarUrl.replace(qiniuDom,"");
              console.log(fileInfo);
              next(null,fileInfo);
            })
          },UploadFiles.deleteFromQiniu,
          UploadFiles.uploadAvatarToQiniu,
          function(fileInfo,next){
            User.update({userID:fileInfo.userID},{avatarUrl:qiniuDom+key}).exec(function(err,result){
              if(err) next(err);
              next (null,'result');
            })
          }
        ],function(err,reslut){
          console.log('err',err);
          console.log('reslut',reslut);
          if(err) return cb(err);
          return cb(null,'result');
        })

        //UploadFiles.uploadAvatarToQiniu(token,key,localFilePath,function(err,result){
        //  if(err) return cb(err);
        //  User.update({userID:userID},{avatarUrl:qiniuDom+key}).exec(function(err,result){
        //    if(err) return cb(err);
        //    return cb(null,'result');
        //  })
        //
        //})

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
