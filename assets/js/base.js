/*
baseJS v1.0
2016年10月31日
*/
var base = {
    tabbar:function(){
        //var currentSubWebview = mui('#tab-bar a.mui-active')[0].id;
        mui('#tab-bar').on('tap', 'a', function() {
            var id = this.getAttribute('id');
            var data_click = this.getAttribute('data-click');
            var type = this.getAttribute('type')
            if (type) {
                var src = id + '.html?type='+type
            }else{
                var src = id + '.html'
            };
            _czc.push(["_trackEvent", "", data_click, "", "", ""]);
            window.location.href = src;
        })
    },
    tabbarHtml:function(type){
        var tabbarHtml = [];
        tabbarHtml.push('<nav class="mui-bar mui-bar-tab" id="tab-bar">')
            //type==1 普通用户  type==2 服务员
            if (type==2) {
                tabbarHtml.push('<a class="mui-tab-item mui-active" id="findJob"  data-click="找工作">')
                    tabbarHtml.push('<span class="mui-icon iconfont icon-yduizhuye"></span>')
                    tabbarHtml.push('<span class="mui-tab-label">找工作</span>')
                tabbarHtml.push('</a>')
                tabbarHtml.push('<a class="mui-tab-item" id="life"   data-click="生活圈" type="2">')
                    tabbarHtml.push('<span class="mui-icon iconfont icon-yduifaxian"></span>')
                    tabbarHtml.push('<span class="mui-tab-label">生活圈</span>')
                tabbarHtml.push('</a>')
                tabbarHtml.push('<a class="mui-tab-item" id="nurseHome"   data-click="我的">')
                    tabbarHtml.push('<span class="mui-icon iconfont icon-personalcenter"></span>')
                    tabbarHtml.push('<span class="mui-tab-label">我的</span>')
                tabbarHtml.push('</a> ')
            }else{
                tabbarHtml.push('<a class="mui-tab-item mui-active" id="nurseList"  data-click="找服务">')
                    tabbarHtml.push('<span class="mui-icon iconfont icon-yduizhuye"></span>')
                    tabbarHtml.push('<span class="mui-tab-label">找服务</span>')
                tabbarHtml.push('</a>')
                tabbarHtml.push('<a class="mui-tab-item" id="life"   data-click="生活圈">')
                    tabbarHtml.push('<span class="mui-icon iconfont icon-yduifaxian"></span>')
                    tabbarHtml.push('<span class="mui-tab-label">生活圈</span>')
                tabbarHtml.push('</a>')

                tabbarHtml.push('<a class="mui-tab-item" id="home"   data-click="我的">')
                    tabbarHtml.push('<span class="mui-icon iconfont icon-personalcenter"></span>')
                    tabbarHtml.push('<span class="mui-tab-label">我的</span>')
                tabbarHtml.push('</a> ')
            };
            
        tabbarHtml.push('</nav> ')
        tabbarHtml = tabbarHtml.join('');
        mui('body')[0].insertAdjacentHTML('beforeend', tabbarHtml);
        var path = window.location.pathname.slice(1,-5)
        console.log(path);
        if (!path) {
            path= 'index'
        };
        /*if (!tabid) {
            if (type==2) {
                tabid='nurseHome';
            }else{
                tabid='index';
            };
        };*/
        var lastActiveElem = document.querySelector('#tab-bar a.mui-active');
        lastActiveElem&&lastActiveElem.classList.remove('mui-active');
        document.getElementById(path).classList.add('mui-active');
        base.tabbar();
    },
        //手机
    phoneCheck: function(str) {
        var regPhone = /^0{0,1}(13[^4]|15[^4]|14[57]|17[0-9]|18[0-9])[0-9]{8}$|134[0-8][0-9]{7}$/;
        if (regPhone.test(str)) {
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
    },
    getAesString:function(data,key,iv){//加密
        var key  = CryptoJS.enc.Hex.parse(key);
        var iv   = CryptoJS.enc.Latin1.parse(iv);
        var encrypted = CryptoJS.AES.encrypt(data,key,
                {
                    iv:iv,
                    mode:CryptoJS.mode.CBC,
                    padding:CryptoJS.pad.Pkcs7
                });
        return encrypted;
    },
    isWeiXin:function(){
        var ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            return true;
        }else{
            return false;
        }
    },
    getCookie:function(c_name){
    if (document.cookie.length>0){
        c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1){ 
            c_start=c_start + c_name.length+1 
            c_end=document.cookie.indexOf(";",c_start)
            if (c_end==-1) c_end=document.cookie.length
            return unescape(document.cookie.substring(c_start,c_end))
            } 
        }
        return ""
    },
    setCookie:function(c_name,value,expiredays){
        var exdate=new Date()
        exdate.setDate(exdate.getDate()+expiredays)
        document.cookie=c_name+ "=" +escape(value)+
        ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
    },
    keepTwoDecimal:function(num){
        var result = parseFloat(num);
        result = Math.ceil(num * 100) / 100;
        return result;
    },
    getShareConfig:function(sharedata){
        $.ajax({
            type: 'Get',
            url: '/weixin/jsApiAccess',
            data:'',
            dataType: 'json',
            success: function(data) {
                if (data.msgNo == '0000' ) {
                    var config={
                        'appId':data.data.appID,
                        'timestamp':data.data.timeStamp,
                        'nonceStr':data.data.nonceStr,
                        'signature':data.data.signature
                    }
                    base.share(config,sharedata)
                }  
            }
        });
    },
    share:function(config,sharedata){
        wx.config({
            debug: false, 
            appId: config.appId, 
            timestamp:config.timestamp,
            nonceStr:config.nonceStr,
            signature:config.signature,
            jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
        });
        wx.onMenuShareTimeline({
            title: sharedata.title,
            link: sharedata.link,
            imgUrl: sharedata.imgUrl, 
            success: function () { 
                
            },
            cancel: function () { 
               
            }
        });
        wx.onMenuShareAppMessage({
            title: sharedata.title,
            link: sharedata.link,
            imgUrl: sharedata.imgUrl, 
            success: function () { 
                
            },
            cancel: function () { 
               
            }
        });
    }
}
