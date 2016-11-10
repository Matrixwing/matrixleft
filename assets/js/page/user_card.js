
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
		    //var userID= '6';
		    var mask = mui.createMask();
			mask.show()
		    $.get('getUserCard?userID='+userID,function(data,status){
		    	var data= JSON.parse(data);
				if (data.msgNo == '0000' ) {
					mask.close()
					$('#avatarUrl').attr('src',data.data.avatarUrl)
					$('#userName').html(data.data.userName)
					$('#name_card').html(data.data.userName+'的名片')
					$('#IDCard').html(data.data.IDCard)
					$('#workstatus').html(data.data.workstatus)
					$('#serveCity').html(data.data.serveCity)
					$('#address').html(data.data.address)
					$('#servantTypeName').html(data.data.servantTypeName)
					$('#skillName').html(data.data.skillName)
					$('#workExp').html(data.data.workExp+'年')
					$('#mouthRest').html(data.data.mouthRest+'天')
					$('#identityAuth').html(data.data.identityAuth)
					$('#examination').html(data.data.examination)
					$('#assessment').html(data.data.assessment)
					$('#phone').html(data.data.phone)
					$('#homeTown').html(data.data.homeTown)
					$('#folk').html(data.data.folk)
					$('#marriage').html(data.data.marriage)
					$('#eduName').html(data.data.eduName)
					$('#niandai').html(data.data.niandai)
					$('#shengxiao').html(data.data.shengxiao)
					$('#xingzuo').html(data.data.xingzuo)
					$('#selfEvaluation').html(data.data.selfEvaluation)
					$('#zhengshuid').val(data.data.certID)
				}else{
					mui.toast(JSON.parse(data).msgInfo);
				};
					
			});
		});
		$('.icon-zhengshu').on('tap',function(){
			/*var certID = $('#certID').val();
			var certID =$('#certID').val(base.getAesString(certID,'1234567812345678','Pkcs7'));*/
			var certID = $('#IDCard').html();
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
									listHtml.push('<li class="mui-table-view-cell mui-collapse mui-active" id="card_main">')
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
			        	listHtml = listHtml.join('');
			        	$('#card_main').empty();
			        	$('#card_main').append(listHtml);
			        }
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