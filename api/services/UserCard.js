/**
 * Created by Administrator on 2016/11/7.
 */

module.exports = {

  getCard : function(opts,cb){
    Card.find(opts).exec(function(err,card) {
      if (err) return cb(err);
      if(card == '') return cb(null,card[0]);
      var shengxiao=null, xingzuo=null, niandai=null;
      var idcard = card[0].IDCard;
      if(card[0].status==2){
        delete card[0].branchID;
        delete card[0].branchName;
        delete card[0].branchAddress;
      }
      if (idcard) {

      year = idcard.substring(6, 10);
      month = idcard.substring(10, 12);
      day = idcard.substring(12, 14);

      shengxiao = UserCard.getShengxiao(year);
      xingzuo = UserCard.getXingzuo(month, day);
      niandai = UserCard.getNiandai(year);
      }
      card[0].xingzuo=xingzuo;
      card[0].shengxiao=shengxiao;
      card[0].niandai=niandai;

      return cb(null,card[0]);
    })
  },

  getShengxiao : function(year){
    var toyear = 1997;
    var birthyear = year;
    var birthpet="Ox"
    x = (toyear - birthyear) % 12
    if ((x == 1) || (x == -11)) {
      birthpet="鼠" }
    else {
      if (x == 0) {
        birthpet = "牛"
      }
      else {
        if ((x == 11) || (x == -1)) {
          birthpet = "虎"
        }
        else {
          if ((x == 10) || (x == -2)) {
            birthpet = "兔"
          }
          else {
            if ((x == 9) || (x == -3)) {
              birthpet = "龙"
            }
            else {
              if ((x == 8) || (x == -4)) {
                birthpet = "蛇"
              }
              else {
                if ((x == 7) || (x == -5)) {
                  birthpet = "马"
                }
                else {
                  if ((x == 6) || (x == -6)) {
                    birthpet = "羊"
                  }
                  else {
                    if ((x == 5) || (x == -7)) {
                      birthpet = "猴"
                    }
                    else {
                      if ((x == 4) || (x == -8)) {
                        birthpet = "鸡"
                      }
                      else {
                        if ((x == 3) || (x == -9)) {
                          birthpet = "狗"
                        }
                        else {
                          if ((x == 2) || (x == -10)) {
                            birthpet = "猪"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return birthpet;
  },

  getXingzuo : function(month,day){



    var value='';
    if (month == 1 && day >=20 || month == 2 && day <=18) {value = "水瓶座";}
    if (month == 1 && day > 31) {value = "未知";}
    if (month == 2 && day >=19 || month == 3 && day <=20) {value = "双鱼座";}
    if (month == 2 && day > 29) {value = "未知";}
    if (month == 3 && day >=21 || month == 4 && day <=19) {value = "白羊座";}
    if (month == 3 && day > 31) {value = "未知";}
    if (month == 4 && day >=20 || month == 5 && day <=20) {value = "金牛座";}
    if (month == 4 && day > 30) {value = "未知";}
    if (month == 5 && day >=21 || month == 6 && day <=21) {value = "双子座";}
    if (month == 5 && day > 31) {value = "未知";}
    if (month == 6 && day >=22 || month == 7 && day <=22) {value = "巨蟹座";}
    if (month == 6 && day > 30) {value = "未知";}
    if (month == 7 && day >=23 || month == 8 && day <=22) {value = "狮子座";}
    if (month == 7 && day > 31) {value = "未知";}
    if (month == 8 && day >=23 || month == 9 && day <=22) {value = "处女座";}
    if (month == 8 && day > 31) {value = "未知";}
    if (month == 9 && day >=23 || month == 10 && day <=22) {value = "天秤座";}
    if (month == 9 && day > 30) {value = "未知";}
    if (month == 10 && day >=23 || month == 11 && day <=21) {value = "天蝎座";}
    if (month == 10 && day > 31) {value = "未知";}
    if (month == 11 && day >=22 || month == 12 && day <=21) {value = "射手座";}
    if (month == 11 && day > 30) {value = "未知";}
    if (month == 12 && day >=22 || month == 1 && day <=19) {value = "摩羯座";}
    if (month == 12 && day > 31) {value = "未知";}
    return value;
  },

  getNiandai : function(year){
    var niandai = year.substring(2,3);
    if(niandai) return (niandai+'0后')
    return(null);
  },
}
