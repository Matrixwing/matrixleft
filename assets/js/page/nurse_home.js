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

var userID=base.getQueryString('userID');
$.get("/getUser?userID="+userID,function(data,status){
	var data = JSON.parse(data).data[0];
    $('.avatarUrl').attr('src', data.avatarUrl);
    if (data.userName) {
   		$('.nickname').html(data.userName);
    }else{
    	$('.nickname').html(data.nickname);
    };
    $('.gender').html(data.gender);
    if (data.phone) {
    	$('.phone').html(data.phone);
    }else{
    	$('.reg_phone').show();
    };
    $('.reg_phone').show();
});

$(document).ready(function(){
	base.tabbarHtml();
})
/*link*/
$('#user_card').on('tap',function(){
	_czc.push(["_trackEvent", "个人主页", "名片", "", "", ""]);
	window.location.href='user_card.html?userID='+userID;
})