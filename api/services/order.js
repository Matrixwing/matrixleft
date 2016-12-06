/*
* 下单相关的服务
*
*
*/


module.exports = {

  //下单
  order : function(opts,cb){
    var str=""
    //str+=Date.getFullYear()//年
    //str+=Date.getMonth()+1//月 月比实际月份要少1
    //str+=Date.getDate()//日
    //str+=Date.getHours()//HH
    //str+=Date.getMinutes()//MM
    //str+=Date.getSeconds //SS
    var newOrder = {
      userID:opts.userID,
      orderID:str+Math.random().toString().substr(2, 10),   //todo 生产订单号
      servantID:opts.servantID,
      remark : JSON.stringify({
        apptTime:opts.apptTime,
        apptPlace:opts.apptPlace,
        tags:opts.tags
      }),
    }
console.log(newOrder);
    Order.create(newOrder).exec(function(err,order){
      if(err) return cb(err)
      console.log('order',order);
      var result={
        orderID:order.orderID
      };

      //todo 发消息

      return cb(null,result)
    })

  },

  //取得订单列表
  getOrderList : function(opts,cb){

  },

  //订单详情
  getOrderDetail :  function(opts,cb){
    Order.find(opts).exec(function(err,order){
      if(err) return cb(err);
      console.log(err);
      console.log(order);
      User.find({userID:opts.servantID}).exec(function(err,servant) {
        if(err) return cb(err);
        var orderInfo = {
          servantName:servant[0].userName,
          expectSalary:servant[0].expectSalary,
          orderID:order[0].orderID,
        };
        cb(null,orderInfo);
      })
    })
  },
}
