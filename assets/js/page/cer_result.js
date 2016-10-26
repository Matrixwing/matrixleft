
    	function getQueryString(name) {
	        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	        var r = window.location.search.substr(1).match(reg);
	        if (r != null) return unescape(r[2]);
	        return null;
	    }
	    function getDAesString(encrypted,key,iv){//解密
            var key  = CryptoJS.enc.Hex.parse(key);
            var iv   = CryptoJS.enc.Latin1.parse(iv);
            var decrypted = CryptoJS.AES.decrypt(encrypted,key,
                    {
                        iv:iv,
                        mode:CryptoJS.mode.CBC,
                        padding:CryptoJS.pad.Pkcs7
                    });
            return decrypted.toString(CryptoJS.enc.Utf8);
        }
	    $(document).ready(function(){
	    	//var queryInfo = getDAesString(getQueryString('queryInfo'),'1234567812345678','Pkcs7');
	    	var queryInfo = getQueryString('queryInfo');
			$.ajax({
			    type: 'post',
			    url: '/getCert',
			    data: {'queryInfo':queryInfo},
			    dataType: 'json',
			    success: function(data) {
			    	if (data.data) {
			        	var listHtml = [],
			        	certInfo = data.data[0].certInfo;
			        	$('.certInfo_bd').empty();
			        	if (data.data[0].avatarUrl==null) {
			        		$('.avatarUrl_div').hide()
			        	}else{
			        		$('.avatarUrl img').attr('src',data.data[0].avatarUrl)
			        	};
			        	
			        	$('.userName').html(data.data[0].userName)
			        	$('.gender').html(data.data[0].gender)
			        	$('.IDCard').html(data.data[0].IDCard)

			        	for(var i =0;i<certInfo.length;i++){
			        		listHtml.push('<div class="weui-panel weui-panel_access">')
				                listHtml.push('<div class="weui-panel__hd">'+certInfo[i].workTypeName+'证</div>')
			                    listHtml.push('<div class="weui-panel__bd">')
			                    	listHtml.push('<div class="eui-form-previeww">')
			                    		listHtml.push('<div class="weui-flex info_list">')
			                    			listHtml.push('<div class="weui-flex__item item_left"><p class="">证书编号：</p></div>')
			                    			listHtml.push('<div class="weui-flex__item item_right"><p class="">'+certInfo[i].certificateID+'</p></div>')
			                    		listHtml.push('</div>')

			                    		listHtml.push('<div class="weui-flex info_list">')
			                    			listHtml.push('<div class="weui-flex__item item_left"><p class="">职业（工种）：</p></div>')
			                    			listHtml.push('<div class="weui-flex__item item_right"><p class="">'+certInfo[i].workTypeName+'</p></div>')
			                    		listHtml.push('</div>')

			                    		listHtml.push('<div class="weui-flex info_list">')
			                    			listHtml.push('<div class="weui-flex__item item_left"><p class="">等级：</p></div>')
			                    			listHtml.push('<div class="weui-flex__item item_right"><p class="">'+certInfo[i].rank+'</p></div>')
			                    		listHtml.push('</div>')

			                    		listHtml.push('<div class="weui-flex info_list">')
			                    			listHtml.push('<div class="weui-flex__item item_left"><p class="">评定成绩：</p></div>')
			                    			listHtml.push('<div class="weui-flex__item item_right"><p class="">'+certInfo[i].assessment+'</p></div>')
			                    		listHtml.push('</div>')

			                    		listHtml.push('<div class="weui-flex info_list">')
			                    			listHtml.push('<div class="weui-flex__item item_left"><p class="">理论知识考试成绩：</p></div>')
			                    			listHtml.push('<div class="weui-flex__item item_right"><p class="">'+certInfo[i].score1+'</p></div>')
			                    		listHtml.push('</div>')

			                    		listHtml.push('<div class="weui-flex info_list">')
			                    			listHtml.push('<div class="weui-flex__item item_left"><p class="">操作技能考核成绩：</p></div>')
			                    			listHtml.push('<div class="weui-flex__item item_right"><p class="">'+certInfo[i].score2+'</p></div>')
			                    		listHtml.push('</div>')
			                    		if (certInfo[i].authorityUnit!=null) {
				                    		listHtml.push('<div class="weui-flex info_list">')
				                    			listHtml.push('<div class="weui-flex__item item_left"><p class="">发证单位：</p></div>')
				                    			listHtml.push('<div class="weui-flex__item item_right"><p class="">'+certInfo[i].authorityUnit+'</p></div>')
				                    		listHtml.push('</div>')
			                    		};
			                    		if (certInfo[i].authorityDate!=null) {
			                    		listHtml.push('<div class="weui-flex info_list">')
			                    			listHtml.push('<div class="weui-flex__item item_left"><p class="">发证日期：</p></div>')
			                    			listHtml.push('<div class="weui-flex__item item_right"><p class="">'+certInfo[i].authorityDate+'</p></div>')
			                    		listHtml.push('</div>')
			                    		};
			                    		if (certInfo[i].serialNumber!=null) {
			                    		listHtml.push('<div class="weui-flex info_list">')
			                    			listHtml.push('<div class="weui-flex__item item_left"><p class="">发证流水码及所属号段：</p></div>')
			                    			listHtml.push('<div class="weui-flex__item item_right"><p class="">'+certInfo[i].serialNumber+'</p></div>')
			                    		listHtml.push('</div>')
			                    		};
			                    	listHtml.push('</div>')
		                		listHtml.push('</div>')
				            listHtml.push('</div>')
			        	}
			        	listHtml = listHtml.join('');
			        	$('.certInfo_bd').append(listHtml);

			        	$('.page1').hide();
			        	$('.page2').show();
			        }else{
			        	
			        };
			    },
			    error: function(data) {
			    }
			});
		});