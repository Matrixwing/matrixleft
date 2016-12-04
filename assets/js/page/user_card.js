
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
		    var own=base.getQueryString('own');
		    if (own==1) {
		    	$('.yy_bar').show()
		    };
		    //var userID= '6';
		    $.get('getUserCard?userID='+userID,function(data,status){
		    	var data= JSON.parse(data);
				if (data.msgNo == '0000' ) {
					if (data.data.avatarUrl) {
						$('#avatarUrl').attr('src',data.data.avatarUrl)
					}
					$('#workstatus').html('目前'+data.data.workstatus)
					if (data.data.serviceCity) {
						$('#serveCity').html('服务于'+data.data.serviceCity)
					}else{
						$('#serveCity').html('服务于成都市')
					};
					$('#userName').html('我是'+data.data.userName)
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
					if (data.data.identityAuth) {
						cardHtml.push('<li class="mui-table-view-cell"><p class="mui-pull-left mui-col-xs-3">小元实名：</p><span>'+data.data.identityAuth+'</span></li>')
					};
					if (data.data.examination) {
						cardHtml.push('<li class="mui-table-view-cell"><p class="mui-pull-left mui-col-xs-3">小元体检：</p><span>'+data.data.examination+'</span></li>')
					};
					if (data.data.assessment) {
						cardHtml.push('<li class="mui-table-view-cell"><p class="mui-pull-left mui-col-xs-3">小元评价：</p><span>'+data.data.assessment+'</span></li>')
					};
					cardHtml = cardHtml.join('');
					$('#getUserCard').append(cardHtml)
					var cardHtml_t=[];
					if (data.data.IDCard) {
						cardHtml_t.push('<li class="mui-table-view-cell"><p class="mui-pull-left mui-col-xs-3">身份证号：</p><span>'+data.data.IDCard.replace(data.data.IDCard.substr(6,8), "******")+'</span></li>')
						$('#IDCard').val(data.data.IDCard);
					};
					if (data.data.phone) {
						cardHtml_t.push('<li class="mui-table-view-cell"><p class="mui-pull-left mui-col-xs-3">手机号码：</p><span>'+data.data.phone.replace(data.data.phone.substr(3,4), "******")+'</span></li>')
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
					//if (data.data.certificate) {};
				}else{
					mui.toast(JSON.parse(data).msgInfo);
				};
					
			});
		});
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
		
		$('#qcode').on('tap',function(){
			var mask = mui.createMask(closeqcode);
			mask.show();
			$('body').append('<div id="qcode_div"></div>')
			var src = $('#avatarUrl').attr('src');
			if (!src) {
				var src = 'images/timg.jpg';
			};
			var href = 'http://192.168.2.108/user_card.html?userID='+base.getQueryString('userID')
			$('#qcode_div').qrcode({
                text: href,
                height: 250,
                width: 250,
                correctLevel: QRErrorCorrectLevel.H,
                background: "#fff",
                src: src
                });
		})
		function closeqcode(){
			$('#qcode_div').remove()
		}
		$('#shi').on('tap',function(){
			mui.toast('已通过小元实名认证')
		})
		$('#jian').on('tap',function(){
			mui.toast('已通过小元体检认证')
		})