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
	    //var userID=base.getQueryString('userID');
		/*$.get("/getUser?",function(data,status){
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
		    alert(status)
		});*/
		/*$(document).reday(function(){
			$.ajax({
			    type: 'get',
			    url: '/getUser',
			    dataType: 'json',
			    success: function(data) {
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
			    },
			    error: function(data) {
			    	alert()
			    }
			});
		})*/
		$(function(){
			$.ajax({
			    type: 'get',
			    url: '/getUser',
			    dataType: 'json',
			    success: function(data) {
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
			    },
			    error: function(xhr, textStatus, errorThrown) {
			    	if (xhr.status == 401) {
			    		//window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8306afd398ab31e5&redirect_uri=http%3a%2f%2fwyh.matrixwing.com%2fweixinLogIn&response_type=code&scope=snsapi_userinfo&state=needlogin#wechat_redirect'
			    	};
			    }
			});
		}) 
		/*$('.mui-media').on('tap', function() {
				mui.toast('敬请期待...');
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
		/*绑定*/
		$('#reg').on('tap',function(){
			var phone = $('#phone').val();
			var code = $('#code').val();
			if (!base.phoneCheck(phone)) {
				mui.toast('请输入正确的手机号');
				return;
			}else if(code.length<4){
				mui.toast('请输入正确的验证码');
				return;
			}else{
				$.get('bindingPhone?phone='+phone+'&num='+code+'&userID='+userID,function(data,status){
					if (JSON.parse(data).msgNo == '0000' ) {
						mui.toast(JSON.parse(data).msgInfo);
						setTimeout(function(){window.location.href=document.referrer;},1000);
					}else{
						mui.toast(JSON.parse(data).msgInfo);
					};
					
				});
			};
			_czc.push(["_trackEvent", "个人主页", "绑定手机号", "", "", ""]);
		})
		$('#user_card').on('tap',function(){
			_czc.push(["_trackEvent", "个人主页", "名片", "", "", ""]);
			window.location.href='userCard.html?userID='+userID;
		})
		$('#share').on('tap',function(){
			_czc.push(["_trackEvent", "个人主页", "分享", "", "", ""]);
			var avatarUrl=$('.avatarUrl').attr('src');
			window.location.href='share.html?userID='+userID+'&avatarUrl='+avatarUrl;
		})
		base.tabbarHtml();