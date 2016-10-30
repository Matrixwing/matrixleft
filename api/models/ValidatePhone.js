/**
 * ValidatePhone.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tablename:"validatePhone",
  autoUpdatedAt: false,//忽略表中updated属性
  attributes: {
    num:{
      type:"string"
    },
    phone:{
      type:"string",
      minLength: 10,
    },
    expire:{
      type:"data",
    },
    stauts:{
      type:"int",
    }
  },

  /**
   * 在发送之前生产一个4位随机
   * @param opts js对象，需要包含该用户的手机
   * @param cb 回调函数 cb(err,opts)  err为错误信息  opts继续传递参数
   */
    //unused
  //beforeCreate : function (next) {
  //  var rnd = '';
  //  for(var i=0;i<4;i++)
  //    rnd+=Math.floor(Math.random()*10);
  //  var result = rnd;
  //  next(null,rnd);
  //}


  /**
   * 手机和验证码是否匹配？
   * @param opts js对象，需要包含该用户的手机和该手机的验证码
   * @param cb 回调函数 cb(err,result)  err为错误信息  opts继续传递参数
   */
  validateNum : function (opts,cb) {
    var query ={
      stauts: 1,
      phone: opts.phone,
      num : opts.num,
    };

    this.find({
      where: query,
      limit: 1,
      sort: 'createdAt DESC'
    }).exec(function (err, result) {
      console.log("result",result);
      if(err) return cb(err);
      if(result=='') return cb('验证码错误');
      //todo 把这条验证码的状态改为0

      //
      return cb(null,opts);
    });
  }
};

