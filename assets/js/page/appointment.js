
		mui.init();
		var viewApi = mui('#app').view({
			defaultPage: '#card'
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

		$('#card_up').on('tap',function(){
			/*$('#card_more').show()*/
			$('#card_down').show()
			$('#card_up').hide();
			$('#card_more').slideDown();
		})
		$('#card_down').on('tap',function(){
			$('#card_more').slideUp();
			$('#card_down').hide()
			$('#card_up').show();
			/*mui('#card_up').scroll().scrollTo(0,0);*/
			mui('#returnup').scroll().scrollTo(0,0,1000);

		})
		$(document).ready(function(){
		    var userID=base.getQueryString('userID');
		    $.get('getUserCard?userID='+userID,function(data,status){
		    	var data= JSON.parse(data);
		    	$('.tips').hide();
				if (data.msgNo == '0000' ) {
					if (data.data.avatarUrl) {
						$('#avatarUrl').attr('src',data.data.avatarUrl)
					}
					if (data.data.workstatus) {
						$('#userName').html('我是'+data.data.userName+'，'+data.data.workstatus)
					}else{
						$('#userName').html('我是'+data.data.userName)
					}
					$('#name').val(data.data.userName)
					if (data.data.expectSalary) {
						$('#expectSalary').html('期望薪资：'+data.data.expectSalary+'元')
						$('#expectSalary_in').val(data.data.expectSalary)
					}
					if (data.data.serviceCity) {
						$('#serveCity').html('服务于'+data.data.serviceCity)
					}else{
						$('#serveCity').html('服务于成都市')
					};
					//$('#userName').html('我是'+data.data.userName+'目前'+data.data.workstatus)
					//$('#name_card').html(data.data.userName+'的名片')
					var cardHtml=[];
					if (data.data.address) {
						cardHtml.push('<li class="mui-table-view-cell"><p class="mui-pull-left mui-col-xs-3">当前住址：</p><span>'+data.data.address+'</span></li>')
					};
					if (data.data.servantTypeName) {
						cardHtml.push('<li class="mui-table-view-cell"><p class="mui-pull-left mui-col-xs-3">类&#12288;&#12288;型：</p><span>'+data.data.servantTypeName+'</span></li>')
					};
					if (data.data.skillName) {
						cardHtml.push('<li class="mui-table-view-cell"><p class="mui-pull-left mui-col-xs-3">专&#12288;&#12288;长：</p><span>'+data.data.skillName+'</span></li>')
					};
					if (data.data.workExp) {
						cardHtml.push('<li class="mui-table-view-cell"><p class="mui-pull-left mui-col-xs-3">服务经验：</p><span>'+data.data.workExp+'月</span></li>')
					};
					if (data.data.mouthRest) {
						cardHtml.push('<li class="mui-table-view-cell"><p class="mui-pull-left mui-col-xs-3">每月休息：</p><span>'+data.data.mouthRest+'天</span></li>')
					};
					if (data.data.identityAuth==1) {
						//cardHtml.push('<li class="mui-table-view-cell"><p class="mui-pull-left mui-col-xs-3">小元实名：</p><span>'+data.data.identityAuth+'</span></li>')
						$('#shi').show();
					};
					if (data.data.examination==1) {
						//cardHtml.push('<li class="mui-table-view-cell"><p class="mui-pull-left mui-col-xs-3">小元体检：</p><span>'+data.data.examination+'</span></li>')
						//$('#jian').show();
						//暂时屏蔽掉体检
					};
					if (data.data.assessment==1) {
						cardHtml.push('<li class="mui-table-view-cell"><p class="mui-pull-left mui-col-xs-3">小元评价：</p><span>'+data.data.assessment+'</span></li>')
						$('#ping').show();
					};
					cardHtml = cardHtml.join('');
					$('#getUserCard').append(cardHtml)
					var cardHtml_t=[];
					if (data.data.IDCard) {
						cardHtml_t.push('<li class="mui-table-view-cell"><p class="mui-pull-left mui-col-xs-3">身份证号：</p><span>'+data.data.IDCard.replace(data.data.IDCard.substr(6,8), "********")+'</span></li>')
						$('#IDCard').val(data.data.IDCard);
					};
					if (data.data.phone) {
						cardHtml_t.push('<li class="mui-table-view-cell"><p class="mui-pull-left mui-col-xs-3">手机号码：</p><span>'+data.data.phone.replace(data.data.phone.substr(3,4), "****")+'</span></li>')
					};
					if (data.data.homeTown) {
						cardHtml_t.push('<li class="mui-table-view-cell"><p class="mui-pull-left mui-col-xs-3">籍&#12288;&#12288;贯：</p><span>'+data.data.homeTown+'</span></li>')
					};
					if (data.data.folk) {
						cardHtml_t.push('<li class="mui-table-view-cell"><p class="mui-pull-left mui-col-xs-3">民&#12288;&#12288;族：</p><span>'+data.data.folk+'</span></li>')
					};
					if (data.data.marriage) {
						cardHtml_t.push('<li class="mui-table-view-cell"><p class="mui-pull-left mui-col-xs-3">婚&#12288;&#12288;姻：</p><span>'+data.data.marriage+'</span></li>')
					};
					if (data.data.eduName) {
						cardHtml_t.push('<li class="mui-table-view-cell"><p class="mui-pull-left mui-col-xs-3">学&#12288;&#12288;历：</p><span>'+data.data.eduName+'</span></li>')
					};
					if (data.data.niandai) {
						cardHtml_t.push('<li class="mui-table-view-cell"><p class="mui-pull-left mui-col-xs-3">年&#12288;&#12288;龄：</p><span>'+data.data.niandai+'</span></li>')
					};
					if (data.data.shengxiao) {
						cardHtml_t.push('<li class="mui-table-view-cell"><p class="mui-pull-left mui-col-xs-3">生&#12288;&#12288;肖：</p><span>'+data.data.shengxiao+'</span></li>')
					};
					if (data.data.xingzuo) {
						cardHtml_t.push('<li class="mui-table-view-cell"><p class="mui-pull-left mui-col-xs-3">星&#12288;&#12288;座：</p><span>'+data.data.xingzuo+'</span></li>')
					};
					if (data.data.selfEvaluation) {
						cardHtml_t.push('<li class="mui-table-view-cell"><p class="mui-pull-left mui-col-xs-3">自我介绍：</p><span>'+data.data.selfEvaluation+'</span></li>')
					};
					cardHtml_t = cardHtml_t.join('');
					$('#card_more').append(cardHtml_t)
					if (data.data.certificate) {
						$('#cer').show();
					};
				}else{
					mui.toast(JSON.parse(data).msgInfo);
				};
					
			});
			setTimeout(getuser, 2000);
		});
		function getuser(){
			$.ajax({
			    type: 'get',
			    url: '/getUser',
			    dataType: 'json',
			    success: function(data) {
			    	//var data = JSON.parse(data);
					if (data.msgNo=='0000') {
					    if (data.data[0].userName) {
					   		$('#gz_userName').val(data.data[0].userName);
					    }
					    if (data.data[0].phone) {
					    	$('#gz_phone').val(data.data[0].phone);
					    }
					}
			    },
			    error: function(xhr, textStatus, errorThrown) {
			    	/*if (xhr.status == 401) {
			    		var href =eval('(' + xhr.responseText + ')');
			    		window.location.href=href.loginPage;
			    	}*/
			    }
			});
		}
		$('.icon-zhengshu').on('tap',function(){
			/*var certID = $('#certID').val();
			var certID =$('#certID').val(base.getAesString(certID,'1234567812345678','Pkcs7'));*/
			var certID = $('#IDCard').val();
			var mask = mui.createMask();
			mask.show()
			$.ajax({
			    type: 'post',
			    url: '/getCert',
			    data: {'queryInfo':certID},
			    dataType: 'json',
			    success: function(data) {
			    	mask.close()
			    	if (data.data) {
			        	var listHtml = [];
			        	var certInfo = data.data[0].certInfo;
			        	$('#cer_title').html(data.data[0].userName+'的证书');
			        	for(var i =0;i<certInfo.length;i++){
			        		listHtml.push('<div class="mui-card">')
								listHtml.push('<ul class="mui-table-view">')
									listHtml.push('<li class="mui-table-view-cell mui-collapse mui-active">')
										listHtml.push('<a class="mui-navigate-right" href="#">'+certInfo[i].workTypeName+'证</a>')
										listHtml.push('<div class="mui-collapse-content cer_info">')
											listHtml.push('<ul class="mui-table-view">')
												listHtml.push('<li class="mui-table-view-cell">')
												 	listHtml.push('<p class="mui-pull-left mui-col-xs-4">证书编号：</p>')
												 	listHtml.push('<span>'+certInfo[i].certificateID+'</span>')
												listHtml.push('</li>')
												listHtml.push(' <li class="mui-table-view-cell">')
												 	listHtml.push('<p class="mui-pull-left mui-col-xs-4">职业（工种）：</p>')
												 	listHtml.push('<span>'+certInfo[i].workTypeName+'</span>')
												listHtml.push('</li>')
												listHtml.push('<li class="mui-table-view-cell">')
												 	listHtml.push('<p class="mui-pull-left mui-col-xs-4">等&#12288;&#12288;级：</p>')
												 	listHtml.push('<span>'+certInfo[i].rank+'</span>')
												listHtml.push('</li>')
												listHtml.push('<li class="mui-table-view-cell">')
												 	listHtml.push('<p class="mui-pull-left mui-col-xs-4">评定成绩：</p>')
												 	listHtml.push('<span>'+certInfo[i].assessment+'</span>')
												listHtml.push('</li>')
												listHtml.push('<li class="mui-table-view-cell">')
												 	listHtml.push('<p class="mui-pull-left mui-col-xs-4">理论成绩：</p>')
												 	listHtml.push('<span>'+certInfo[i].score1+'分</span>')
												listHtml.push('</li>')
												listHtml.push('<li class="mui-table-view-cell">')
												 	listHtml.push('<p class="mui-pull-left mui-col-xs-4">操作成绩：</p>')
												 	listHtml.push('<span>'+certInfo[i].score2+'分</span>')
												listHtml.push('</li>')
												if (certInfo[i].authorityUnit) {
													listHtml.push('<li class="mui-table-view-cell">')
													 	listHtml.push('<p class="mui-pull-left mui-col-xs-4">发证单位：</p>')
													 	listHtml.push('<span>'+certInfo[i].authorityUnit+'</span>')
													listHtml.push('</li>')
												};
												if (certInfo[i].authorityDate) {
													listHtml.push('<li class="mui-table-view-cell">')
													 	listHtml.push('<p class="mui-pull-left mui-col-xs-4">发证日期：</p>')
													 	listHtml.push('<span>'+certInfo[i].authorityDate+'</span>')
													listHtml.push('</li>')
												};
												
											listHtml.push('</ul>')
										listHtml.push('</div>')
									listHtml.push('</li>')
								listHtml.push('</ul>')
							listHtml.push('</div>')
				        }
				        
			        	listHtml = listHtml.join('');
			        	$('#card_main').empty();
			        	$('#card_main').append(listHtml);
				    }
			    },
			    error: function(data) {
			    }
			});
		})
		$('#shi').on('tap',function(){
			mui.toast('已通过小元实名认证');
			_czc.push(["_trackEvent", "预约页面", "实", "", "", ""]);
		})
		$('#jian').on('tap',function(){
			//mui.toast('已通过小元体检认证')
			_czc.push(["_trackEvent", "预约页面", "检", "", "", ""]);
		})

/*order*/
	
	/*$('#local').on('tap', function(event) {
		var local = new mui.PopPicker();
	 	local.setData([
	 		{value:'1',text:'翔宇苑'},
	 		{value:'2',text:'东苑'}
		]);
		var _this = $(this);
		local.show(function(items) {
			_this.html(items[0].text);
			_this.attr('tagID',items[0].value);
			
		});
	});*/
	/*var t=new Date();
	if (t.getHours()>18) {
		var str = t.getFullYear()+','+ (t.getMonth()+1)+','+(t.getDate()+1)
	};
	if (t.getHours()>19) {
		var str = t.valueOf() + 1*24*60*60*1000
	};*/
	/*var time = new mui.DtPicker({
	    type: "datetime",//设置日历初始视图模式 
	    beginDate: new Date(),//设置开始日期
	    "customData": {
        "h": [ 
            { value: "09", text: "09" },
            { value: "10", text: "10" },
            { value: "11", text: "11" },
            { value: "12", text: "12" },
            { value: "13", text: "13" },
            { value: "14", text: "14" },
            { value: "15", text: "15" },
            { value: "16", text: "16" },
            { value: "17", text: "17" },
            { value: "18", text: "18" },
        ]
    } 
	});*/
	var time = new mui.DtPicker({
	    type: "datetime",
	    beginDate: new Date()
	});
	$('#time').on('tap', function(event) {
		var _this = $(this);
		time.show(function(items) {
			var t = items.y.text+'-'+items.m.text+'-'+items.d.text+'&nbsp;'+items.h.text+'时'+items.i.text+'分';
			var d = items.y.text+'-'+items.m.text+'-'+items.d.text+' '+items.h.text+':'+items.i.text;
			$('#time').html(t)
			$('#time').attr('d',d)
		});
	});
	var h=base.getCookie('needs');
	console.log(h);
	if (h) {
		$('.needs').show();
		h = eval('(' + h + ')');
		var needs_html=[];
		needs_html.push(h[1].tagName+h[1].value+'人、'+h[2].tagName+h[2].value+'平米、')
		for(var i = 3;i<h.length;i++){
			if (i==(h.length-1)) {
				if (h[i].value==1) {
					needs_html.push(h[i].tagName)
				}else{
					needs_html.push('两位'+h[i].tagName)
				};
			}else{
				if (h[i].value==1) {
					needs_html.push(h[i].tagName+'、')
				}else{
					needs_html.push('两位'+h[i].tagName+'、')
				};
			};
		}
		needs_html = needs_html.join('')
		$('.needs p').html(needs_html)
	};
	
	$('#order').on('tap',function(){
		var servantID = base.getQueryString('userID');
		var tags = base.getCookie('needs');
		var apptTime = $('#time').attr('d');
		//var apptPlace = $('#local').html();
		var userName = $('#gz_userName').val();
		var phone = $('#gz_phone').val();
		var expectSalary = $('#expectSalary_in').val();
		/*if (apptPlace == '选择地点') {
			mui.toast('请选择面试地点');
			return;
		};*/
		if (!apptTime) {
			mui.toast('请选择面试时间');
			return;
		};
		if (!userName) {
			mui.toast('请输入您的称呼');
			return;
		};
		if (!base.phoneCheck(phone)) {
			mui.toast('请输入正确的手机号');
			return;
		}
		mui('#order').button('loading');
		$.ajax({
		    type: 'post',
		    url: '/order',
		    data: {
		    	'servantID':servantID,
		    	'tags':tags,
		    	'apptTime':apptTime,
		    	'apptPlace':'1',
		    	'phone':phone,
		    	'userName':userName,
		    	'expectSalary':expectSalary
		    },
		    dataType: 'json',
		    success: function(data) {
		    	if (data.msgNo==0000) {
		        	mui('#order').button('reset');
		        	var name = encodeURI(encodeURI($('#name').val()));
		        	var orderID = data.data.orderID;
		        	var expectSalary = $('#expectSalary_in').val();
		        	//window.location.href='payment.html?name='+name+'&orderID='+orderID+'&expectSalary='+expectSalary;
		        	window.location.href='apSuccess.html'
		    	}else{
		    		mui.toast(data.msgInfo);
		    	};
		    },
		    error: function(xhr, textStatus, errorThrown) {
		    	if (xhr.status == 401) {
		    		var href =eval('(' + xhr.responseText + ')');
		    		window.location.href=href.loginPage;
		    	}
		    }
		});
		_czc.push(["_trackEvent", "预约页面", "下一步", "", "", ""]);
	})

