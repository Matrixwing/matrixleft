mui.init({
    swipeBack: true //启用右滑关闭功能
});
//初始化单页view
var viewApi = mui('#app').view({
    defaultPage: '#myhome'
});
//初始化单页的区域滚动
mui('.mui-scroll-wrapper').scroll();
var view = viewApi.view; (function($) {
    //处理view的后退与webview后退
    var oldBack = $.back;
    $.back = function() {
        if (viewApi.canBack()) { //如果view可以后退，则执行view的后退
            viewApi.back();
        } else { //执行webview后退
            oldBack();
        }
    };

})(mui);
$(function() {
    $.ajax({
        type: 'get',
        url: '/getUser',
        dataType: 'json',
        success: function(data) {
            //var data = JSON.parse(data);
            if (data.msgNo == '0000') {
                $('.avatarUrl').attr('src', data.data[0].avatarUrl);
                $('.nickname').html(data.data[0].nickname);
                $('#nickname').val(data.data[0].nickname);
                if (data.data[0].userName) {
                    $('.nickname').html(data.data[0].userName);
                    $('#userName').val(data.data[0].userName);
                }
                if (data.data[0].IDCard) {
                    $('#IDCard').val(data.data[0].IDCard);
                }
                if (data.data[0].userID) {
                    $('.nickname').attr('userID', data.data[0].userID);
                };
                if (data.data[0].gender == 1) {
                    $('.gender').val('女');
                } else {
                    $('.gender').val('男');
                };

                if (data.data[0].phone) {
                    $('.phone').html(data.data[0].phone);
                    $('#phone').val(data.data[0].phone);
                } else {
                    $('.reg_phone').show();
                };
                //$('.reg_phone').show();
            } else {
                mui.toast(data.msgInfo)
            };
        },
        error: function(xhr, textStatus, errorThrown) {
            if (xhr.status == 401) {
                var href = eval('(' + xhr.responseText + ')');
                window.location.href = href.loginPage;
            }
        }
    });
})
/*getcode*/
$('#getcode').on('tap',
function() {
    var phone = $('#phone').val();
    if (!base.phoneCheck(phone)) {
        mui.toast('请输入正确的手机号');
        return;
    } else {
        var _this = this;
        $.get("/sendNumToPhone?phone=" + phone,
        function(data, status) {
            if (JSON.parse(data).msgNo == '0000') {
                mui.toast(JSON.parse(data).msgInfo);
                settime(_this);
            } else {
                mui.toast(JSON.parse(data).msgInfo);
            };

        });

    };
    _czc.push(["_trackEvent", "个人主页", "获取验证码", "", "", ""]);
})
/*倒计时*/
var countdown = 60;
function settime(obj) {
    if (countdown == 0) {
        obj.removeAttribute("disabled");
        obj.innerHTML = "获取验证码";
        countdown = 60;
        return;
    } else {
        obj.setAttribute("disabled", true);
        obj.innerHTML = "重新发送(" + countdown + "s)";
        countdown--;
    }
    setTimeout(function() {
        settime(obj)
    },
    1000)
}
/*绑定*/
$('#reg').on('tap',
function() {
    var phone = $('#phone').val();
    var code = $('#code').val();
    var userID = $('.nickname').attr('userID');
    if (!base.phoneCheck(phone)) {
        mui.toast('请输入正确的手机号');
        return;
    } else if (code.length < 4) {
        mui.toast('请输入正确的验证码');
        return;
    } else {
        $.get('bindingPhone?phone=' + phone + '&num=' + code + '&userID=' + userID,
        function(data, status) {
            if (JSON.parse(data).msgNo == '0000') {
                mui.toast(JSON.parse(data).msgInfo);
                setTimeout(function() {
                    window.location.reload();
                },
                1000);
            } else {
                mui.toast(JSON.parse(data).msgInfo);
            };

        });
    };
    _czc.push(["_trackEvent", "个人主页", "绑定手机号", "", "", ""]);
}) 
$('#share').on('tap',function() {
    _czc.push(["_trackEvent", "个人主页", "分享", "", "", ""]);
    var avatarUrl = $('.avatarUrl').attr('src');
    var userID = $('.nickname').attr('userID');
    window.location.href = 'share.html?userID=' + userID + '&avatarUrl=' + avatarUrl;
}) 

base.tabbarHtml();

$('.wait').on('tap',function() {
    mui.toast('正在开发中，敬请期待');
    return;
}) 

$('.file').on('change',function() {
    var p = $(this);
    lrz(this.files[0], {
        width: 640,
        quality: 0.3
    }).then(function(rst) {
        $('.tips').show();
        $.ajax({
            type: 'post',
            url: '/uploadFiles',
            data: {
                'files': rst.base64,
                'filesType': 4
            },
            dataType: 'json',
            success: function(data) {
            	$('.tips').hide();
                if (data.msgNo == 0000) {
                    $('#head-img1').attr('src', rst.base64);
                } else {
                    mui.toast(data.msgInfo);
                };
            },
            error: function(xhr, textStatus, errorThrown) {
                /*if (xhr.status == 401) {
			    		window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8306afd398ab31e5&redirect_uri=http%3a%2f%2fwyh.matrixwing.com%2fweixinLogIn&response_type=code&scope=snsapi_userinfo&state=needlogin#wechat_redirect'
			    	};*/
            }
        });
        //return rst;
    }).
    catch(function(err) {
        alert(err);
    }).always(function() {});
});

$('#edit').on('tap',function(){
    $(this).hide();
    $('.save_btn').show();
    $('.file').show();
    $('.editinfos input').removeAttr("readOnly");
})
$('#save').on('tap',function(){
    var userName = $('#userName').val();
    var IDCard = $('#IDCard').val();
    var nickname = $('#nickname').val();
    var phone = $('#phone').val();
    var userInfo={
        'userName':userName,
        'IDCard':IDCard,
        'nikename':nickname,
        'phone':phone,
        'role':1
    }
    $.ajax({
        type: 'post',
        url: '/updateUserInfo',
        data: {
            'userInfo':JSON.stringify(userInfo),
            'userTags':''
        },
        dataType: 'json',
        success: function(data) {
            if (data.msgNo=='0000') {
                mui.toast('恭喜您，资料修改成功');
                setTimeout(function(){
                    window.location.href='home.html';
                },1500)
            }else{
                mui.toast(data.msgInfo);
            }
        },
        error: function(data) {
            mui.toast('请重试');
        }
    });
})