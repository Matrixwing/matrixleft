mui.init({
	swipeBack:true //启用右滑关闭功能
});


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
	/*if ($(this).attr('close')=='c') {*/
		$('#type_div').show()
	/*};*/
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
	/*if ($(this).attr('close')=='c') {*/
		$('#skill_div').show()
	/*};*/
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

$(document).ready(function(){
	//$('input').attr('readonly','readonly');
	var userID = base.getQueryString('userID')
	$.ajax({
	    type: 'post',
	    url: '/getSevantDetail',
	    data: {
	    	'userID':userID
	    },
	    dataType: 'json',
	    success: function(data) {
	    	if (data.msgNo=='0000') {
	    		var d = data.data[0];
	    		$('#userName').val(d.userInfo.userName)
	    		$('#idCard').val(d.userInfo.IDCard)
	    		$('#homeTown').val(d.userInfo.homeTown)
	    		$('#folk').val(d.userInfo.folk)
	    		if (d.userInfo.marriage==1) {
	    			$('#marriage').html("未婚")
	    			$('#marriage').attr('tagID',1)
	    		}else if(d.userInfo.marriage==2){
	    			$('#marriage').html("保密")
	    			$('#marriage').attr('tagID',2)
	    		}else if (d.userInfo.marriage==0) {
	    			$('#marriage').html("已婚")
	    			$('#marriage').attr('tagID',0)
	    		};
	    		$('#expectSalary').val(d.userInfo.expectSalary)
	    		if (d.userInfo.workstatus==2) {
	    			$('#workstatus2').attr('checked','checked')
	    		}else{
	    			$('#workstatus1').attr('checked','checked')
	    		};
	    		$('#address').val(d.userInfo.address)
	    		$('#workExp').val(d.userInfo.workExp)
	    		//$('#serviceCity').val(d.userInfo.serviceCity)
	    		if (d.severTags.length!=0) {
	    			var tagName='',tagID='';
	    			for(var i = 0;i<d.severTags.length;i++){
		    			tagName += d.severTags[i].tagName+',';
		    			tagID += d.severTags[i].tagID+',';
		    		}
		    		$('#type').html(tagName)
		    		$('#type').attr('data',tagID)
	    		};
	    		if (d.skillTags.length!=0) {
	    			var tagName='',tagID='';
	    			for(var i = 0;i<d.skillTags.length;i++){
		    			tagName += d.skillTags[i].tagName+',';
		    			tagID += d.skillTags[i].tagID+',';
		    		}
		    		$('#skill').html(tagName)
		    		$('#skill').attr('data',tagID)
	    		};
	    	}else{
	    		mui.toast(data.msgInfo);
	    	}
	    },
	    error: function(xhr, textStatus, errorThrown) {
	    	if (xhr.status == 401) {
	    		var href =eval('(' + xhr.responseText + ')');
	    		window.location.href=href.loginPage;
	    	}
	    }
	});
})
$('#marriage').on('tap', function(event) {
	var hy = new mui.PopPicker();
 	hy.setData([
 		{value:'0',text:'已婚'},
 		{value:'1',text:'未婚'},
 		{value:'2',text:'保密'}
	]);
	var _this = $(this);
	hy.show(function(items) {
		_this.html(items[0].text);
		_this.attr('tagID',items[0].value);
	});
});
/*$('#edit').on('tap',function(){
	$('input').removeAttr('readonly')
	$('#sure_btn').show();
	$('#type').attr('close','c');
	$('#skill').attr('close','c');
})
*/
$('#reg_add').on('tap',function(){
	var userName = $('#userName').val();
	var IDCard = $('#idCard').val();
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
	if (!base.IdCheck(IDCard)) {
		mui.toast('请输入正确的身份证号码')
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
		'IDCard':IDCard,
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
	    		mui.toast('恭喜您，资料修改成功');
	    		setTimeout(function(){
	    			var userID = base.getQueryString('userID')
	    			window.location.href='userCard.html?userID='+userID;
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
