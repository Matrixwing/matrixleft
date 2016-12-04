mui.init({
	swipeBack:true //启用右滑关闭功能
});
//初始化单页view
var viewApi = mui('#app').view({
	defaultPage: '#myhome'
});
//初始化单页的区域滚动
mui('.mui-scroll-wrapper').scroll();
var view = viewApi.view;
(function($) {
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

$(function(){
	$.ajax({
	    type: 'get',
	    url: '/getUser',
	    dataType: 'json',
	    success: function(data) {
	    	//var data = JSON.parse(data);
			if (data.msgNo=='0000') {
				$('.avatarUrl').attr('src', data.data[0].avatarUrl);
			    if (data.data[0].userName) {
			   		$('.nickname').html(data.data[0].userName);
			    }else{
			    	$('.nickname').html(data.data[0].nickname);
			    };
			    if (data.data[0].userID) {
			   		$('.nickname').attr('userID',data.data[0].userID);
			    };
			    if (data.data[0].gender==1) {
			    	$('.gender').html('女');
			    }else{
			    	$('.gender').html('男');
			    };
			    
			    if (data.data[0].phone) {
			    	$('.phone').html(data.data[0].phone);
			    }else{
			    	$('.reg_phone').show();
			    };
			    //$('.reg_phone').show();
			}else{
				mui.toast(data.msgInfo)
			};
	    },
	    error: function(xhr, textStatus, errorThrown) {
	    	if (xhr.status == 401) {
	    		window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8306afd398ab31e5&redirect_uri=http%3a%2f%2fwyh.matrixwing.com%2fweixinLogIn&response_type=code&scope=snsapi_userinfo&state=needlogin#wechat_redirect'
	    	}else{
				mui.toast(textStatus)
			};
	    }
	});
}) 

$(document).ready(function(){
	base.tabbarHtml(2);
})
/*link*/
$('#user_card').on('tap',function(){
	var userID=$('.nickname').attr('userID');
	_czc.push(["_trackEvent", "服务员主页", "名片", "", "", ""]);
	window.location.href='userCard.html?userID='+userID;
})
$('#editInfo').on('tap',function(){
	var userID=$('.nickname').attr('userID');
	_czc.push(["_trackEvent", "服务员主页", "资料", "", "", ""]);
	window.location.href='editInfo.html?userID='+userID;
})
$('#share').on('tap',function(){
	var userID=$('.nickname').attr('userID');
	var avatarUrl = $('#avatarUrl').attr('src');
	_czc.push(["_trackEvent", "服务员主页", "分享", "", "", ""]);
	window.location.href='share.html?userID='+userID+'&avatarUrl='+avatarUrl;
})