mui.init({
	swipeBack:true //启用右滑关闭功能
});
//初始化单页view
var viewApi = mui('#app').view({
	defaultPage: '#information_one'
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
	$('#type').attr('data','');
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
	$('#skill').attr('data','');
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
	$('#cer').attr('data','');
	var s='';
	var h='';
	var obj = $('#cer_div input');
	for(var i=0; i<obj.length; i++){
		if(obj[i].checked) {
			s+=obj[i].value+',';
			h+=obj[i].previousElementSibling.innerText+',';
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
	var type = $(this).attr('data')
    lrz(this.files[0],{width: 640,quality:0.3})
        .then(function (rst) {
        	p.next().show();
            $.ajax({
			    type: 'post',
			    url: '/uploadFiles',
			    data: {'files':rst.base64,'filesType':type},
			    dataType: 'json',
			    success: function(data) {
			    	p.next().hide();
			    	if (data.msgNo==0000) {
			        	p.prev().show();
			            p.prev().attr('src',rst.base64);
			            p.parent().removeClass('space')
			    	}else{
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
 		{value:'0',text:'已婚'},
 		{value:'1',text:'未婚'},
 		{value:'2',text:'保密'}
	]);
	$('#marriage').on('tap', function(event) {
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

$('#reg_add').on('tap',function(){
	if ($('#idcard_img1').attr('src')=='') {
		mui.toast('请上传您的身份证正面照片')
		return
	};
	if ($('#idcard_img2').attr('src')=='') {
		mui.toast('请上传您的身份证反面照片')
		return
	};
	var userName = $('#userName').val();
	var homeTown = $('#homeTown').val();
	var folk = $('#folk').val();
	var marriage = $('#marriage').attr('tagID');
	var expectSalary = $('#expectSalary').val();
	var workstatus = $('input:radio[name="workstatus"]:checked').val()
	var address = $('#address').val();
	var workExp = $('#workExp').val();
	//var serviceCity = $('#serviceCity').val();
	var gender = 1;
	if (userName=='') {
		mui.toast('请输入您的姓名')
		return;
	};
	if (homeTown=='') {
		mui.toast('请输入您的籍贯')
		return;
	};
	if (folk=='') {
		mui.toast('请输入您的民族')
		return;
	};
	if (marriage==undefined) {
		mui.toast('请选择您的婚姻状况')
		return;
	};
	if (expectSalary=='') {
		mui.toast('请选择您的期望月薪')
		return;
	};
	if (address=='') {
		mui.toast('请选择您的当前住址')
		return;
	};
	if (workExp=='') {
		mui.toast('请选择您的服务经验')
		return;
	};
	/*if (serviceCity=='') {
		mui.toast('请选择您的服务城市')
		return;
	};*/
	var userInfo={
		'userName':userName,
		'homeTown':homeTown,
		'folk':folk,
		'marriage':marriage,
		'expectSalary':expectSalary,
		'workstatus':workstatus,
		'address':address,
		'workExp':workExp,
		'gender':gender
	}
	var userTags=[];
	if ($('#type').attr('data')==undefined) {
		mui.toast('请选择您的工作类型')
		return
	}else{
		var type = $('#type').attr('data').split(',')
		for(var i=0;i<type.length-1;i++){
			userTags.push({'tagID':type[i]})
		}
	};
	if ($('#skill').attr('data')==undefined) {
		//mui.toast('请选择您的工作类型')
	}else{
		var skill = $('#skill').attr('data').split(',')
		for(var i=0;i<skill.length-1;i++){
			userTags.push({'tagID':skill[i]})
		}
	};
	$.ajax({
	    type: 'post',
	    url: '/updateUserInfo',
	    data: {
	    	'userInfo':JSON.stringify(userInfo),
	    	'userTags':JSON.stringify(userTags)
	    },
	    dataType: 'json',
	    success: function(data) {
	    	if (data.msgNo=='0000') {
	    		mui.toast('恭喜您，注册成功');
	    		setTimeout(function(){
	    			window.location.href='nurseHome.html'
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