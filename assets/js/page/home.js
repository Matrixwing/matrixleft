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
			    		var href =eval('(' + xhr.responseText + ')');
			    		window.location.href=href.loginPage;
			    	}
			    }
			});
		}) 
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
		$('#share').on('tap',function(){
			_czc.push(["_trackEvent", "个人主页", "分享", "", "", ""]);
			var avatarUrl=$('.avatarUrl').attr('src');
			var userID=$('.nickname').attr('userID');
			window.location.href='share.html?userID='+userID+'&avatarUrl='+avatarUrl;
		})
		base.tabbarHtml();