var base = {
    //手机
    phoneCheck: function(str) {
        var regPhone = /^0{0,1}(13[^4]|15[^4]|14[57]|17[0-9]|18[0-9])[0-9]{8}$|134[0-8][0-9]{7}$/;
        if (regPhone.test(str)) {
            return true;
        } else {
            return false;
        }
    },
    luhmCheck: function(bankno) {
        var lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhm进行比较）

        var first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
        var newArr = new Array();
        for (var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
            newArr.push(first15Num.substr(i, 1));
        }
        var arrJiShu = new Array(); //奇数位*2的积 <9
        var arrJiShu2 = new Array(); //奇数位*2的积 >9

        var arrOuShu = new Array(); //偶数位数组
        for (var j = 0; j < newArr.length; j++) {
            if ((j + 1) % 2 == 1) { //奇数位
                if (parseInt(newArr[j]) * 2 < 9)
                    arrJiShu.push(parseInt(newArr[j]) * 2);
                else
                    arrJiShu2.push(parseInt(newArr[j]) * 2);
            } else //偶数位
                arrOuShu.push(newArr[j]);
        }

        var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
        var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
        for (var h = 0; h < arrJiShu2.length; h++) {
            jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
            jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
        }

        var sumJiShu = 0; //奇数位*2 < 9 的数组之和
        var sumOuShu = 0; //偶数位数组之和
        var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
        var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
        var sumTotal = 0;
        for (var m = 0; m < arrJiShu.length; m++) {
            sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
        }

        for (var n = 0; n < arrOuShu.length; n++) {
            sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
        }

        for (var p = 0; p < jishu_child1.length; p++) {
            sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
            sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
        }
        //计算总和
        sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

        //计算Luhm值
        var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
        var luhm = 10 - k;

        if (lastNum == luhm && lastNum.length != 0) {
            return true;
        } else {
            return false;
        }
    },
    //身份证
    IdCheck: function(str) {

        //身份证需要严格验证
        var cid = str;
        var today = new Date();
        var sum = 0;
        var is_year = 0;
        var is_month = 0;
        var is_day = 0;
        var arrValid = new Array(1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2); //检验码
        var W = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1); //加权因子
        var a_carid = new Array();

        //检验长度
        if (cid.length == 15) {
            for (i = 0; i < 15; i++) {
                a_carid[i] = cid.charAt(i);
            }
            for (x = 6; x < 8; x++) {
                is_year = parseInt(is_year * 10) + parseInt(a_carid[x]);
            }
            for (y = 8; y < 10; y++) {
                is_month = parseInt(is_month * 10) + parseInt(a_carid[y]);
            }
            for (z = 10; z < 12; z++) {
                is_day = parseInt(is_day * 10) + parseInt(a_carid[z]);
            }
            is_year = is_year + 1900;
            if (is_year > today.getFullYear() || is_year < 1893 || is_month > 12 || is_day > 31) {
                return false; //身份证出生日期信息不正确
            } else if (isLeapYear(is_year) && is_month == 2 && is_day > 29) {
                return false; //闰年的时候2月大于29天
            } else if (!isLeapYear(is_year) && is_month == 2 && is_day > 28) {
                return false; //平年的时候2月大于28天
            } else if ((is_month == 4 || is_month == 6 || is_month == 9 || is_month == 11) && is_day > 30) {
                return false; //4,6,9,11的天数大于30
            }
            return true;
        } else if (18 == cid.length) {

            for (i = 0; i < 18; i++) {
                a_carid[i] = cid.charAt(i);
            }
            for (j = 0; j <= 16; j++) {
                sum += a_carid[j] * W[j];
            }
            for (x = 6; x < 10; x++) {
                is_year = parseInt(is_year * 10) + parseInt(a_carid[x]);
            }
            for (y = 10; y < 12; y++) {
                is_month = parseInt(is_month * 10) + parseInt(a_carid[y]);
            }
            for (z = 12; z < 14; z++) {
                is_day = parseInt(is_day * 10) + parseInt(a_carid[z]);
            }
            if (is_year > today.getFullYear() || is_year < 1893 || is_month > 12 || is_day > 31) {
                return false; //输入的时间有误
            } else if (isLeapYear(is_year) && is_month == 2 && is_day > 29) {
                return false; //闰年的时候2月大于29天
            } else if (!isLeapYear(is_year) && is_month == 2 && is_day > 28) {
                return false; //平年的时候2月大于28天
            } else if ((is_month == 4 || is_month == 6 || is_month == 9 || is_month == 11) && is_day > 30) {
                return false; //4,6,9,11的天数大于30
            }
            //校验码错误
            return arrValid[sum % 11] == a_carid[17].toUpperCase();
        } else {
            return false; //长度不符合
        }

        function isLeapYear(year) {
            return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
        }
    },
    numberCheck: function(str) {
        var regNumber = /^\d{5,12}$/;
        if (regNumber.test(str)) {
            return true;
        } else {
            return false;
        }
    },
    getQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
}