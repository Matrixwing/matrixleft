mui.init({
	swipeBack:true //启用右滑关闭功能
});
//初始化单页view
var viewApi = mui('#app').view({
	defaultPage: '#information_sec'
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
/*
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
});*/
/*getcode*/
$('#getcode').on('tap',function(){
	var phone = $('#phone').val();
	if (!base.phoneCheck(phone)) {
		mui.toast('请输入正确的手机号');
		return;
	}else{
		var _this = this;
		$.get("/sendNumToPhone?phone="+phone,function(data,status){
			if (JSON.parse(data).msgNo == '0000' ) {
				mui.toast(JSON.parse(data).msgInfo);
				settime(_this);
			}else{
				mui.toast(JSON.parse(data).msgInfo);
			};
			
		});
		
	};
	_czc.push(["_trackEvent", "个人主页", "获取验证码", "", "", ""]);
})
/*倒计时*/
var countdown=60; 
function settime(obj) { 
    if (countdown == 0) { 
        obj.removeAttribute("disabled");    
        obj.innerHTML ="获取验证码"; 
        countdown = 60; 
        return;
    } else { 
        obj.setAttribute("disabled", true); 
        obj.innerHTML ="重新发送(" + countdown + "s)"; 
        countdown--; 
    } 
setTimeout(function() { 
    settime(obj) }
    ,1000) 
}

$('#type').on('tap',function(){
	$('#type_div').show()
})

$('#type_sure').on('tap',function(){
	var s='';
	var h='';
	var obj = $('#type_div input');
	for(var i=0; i<obj.length; i++){
		if(obj[i].checked) {
			s+=obj[i].value+',' ;
			h+=obj[i].previousElementSibling.innerText+',' ;
		}
	}
	if (h) {
		$('#type').html(h);
		$('#type').attr('data',s);
	}
	$('#type_div').hide();
})

$('#skill').on('tap',function(){
	$('#skill_div').show()
})

$('#skill_sure').on('tap',function(){
	var s='';
	var h='';
	var obj = $('#skill_div input');
	for(var i=0; i<obj.length; i++){
		if(obj[i].checked) {
			s+=obj[i].value+',' ;
			h+=obj[i].previousElementSibling.innerText+',' ;
		}
	}
	if (h) {
		$('#skill').html(h);
		$('#skill').attr('data',s);
	}
	$('#skill_div').hide();
})
$('#cer').on('tap',function(){
	$('#cer_div').show()
})

$('#cer_sure').on('tap',function(){
	var s='';
	var h='';
	var obj = $('#cer_div input');
	for(var i=0; i<obj.length; i++){
		if(obj[i].checked) {
			s+=obj[i].value+',' ;
			h+=obj[i].previousElementSibling.innerText+',' ;
		}
	}
	if (h) {
		$('#cer').html(h);
		$('#cer').attr('data',s);
	}
	$('#cer_div').hide();
})
/*uploadimg*/
$('.file').on('change', function () {
	var p =$(this);
    lrz(this.files[0],{width: 640,quality:0.8})
        .then(function (rst) {
        	p.prev().show();
            p.prev().attr('src',rst.base64);
            p.parent().removeClass('space')
            return rst;
        })
        .catch(function (err) {
        	alert(err);
        })
        .always(function () {
        });
});
$('.image-close').on('tap',function(){
	$(this).next().hide();
	$(this).nextAll('input').val('');
	$(this).parent().addClass('space')
})


$('#reg').on('tap',function(){
	mui(this).button('loading');
	$(this).attr('href','#information_sec')
})

$(document).ready(function(){
	var hy = new mui.PopPicker();
 	hy.setData([
 		{value:'200',text:'已婚'},
 		{value:'201',text:'未婚'},
 		{value:'202',text:'保密'}
	]);
	$('#hy').on('tap', function(event) {
		var _this = $(this);
		hy.show(function(items) {
			_this.html(items[0].text);
			_this.attr('tagID',items[0].value);
		});
	});
})
/*link*/
$('#user_card').on('tap',function(){
	_czc.push(["_trackEvent", "个人主页", "名片", "", "", ""]);
	window.location.href='user_card.html?userID='+userID;
})