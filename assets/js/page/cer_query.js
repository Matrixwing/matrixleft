
    	$('#search_input').focus(function(){
            //searchBar
            var $weuiSearchBar = $('#search_bar');
            $weuiSearchBar.addClass('weui-search-bar_focusing');
        })
    	$('#search_input').blur(function(){
            var $weuiSearchBar = $('#search_bar');
                $weuiSearchBar.removeClass('weui-search-bar_focusing');
                if($(this).val()){
                    $('#search_text').hide();
                }else{
                    $('#search_text').show();
                }
        })
        $('#search_clear').on('click',function(){
        	$("#search_show").hide();
            $('#search_input').val('');
        })
        $('#search_input').on('search', function(e){
		  	var queryInfo = $('#search_input').val();
		  	queryAjax(queryInfo)
		});
		$('.sure_query').on('click', function(e){
		  	var queryInfo = $('#search_input').val();
		  	queryAjax(queryInfo)
		});
        function queryAjax(queryInfo){
        	$('.result_empty').hide();
        	if (queryInfo=='') {
        		return;
        	};
        	var new_queryInfo = queryInfo;
        	$('#loadingToast').show();

        	if ($('#data_input').val()!='') {
        		if ($('#idcard_input').val()=='') {
        			$('#loadingToast').hide();
        			return;
        		};
        		var idcard_input = $('#idcard_input').val();
        		var IDCard = $('#data_input').val().split(",")
        		for(var i = 0;i<IDCard.length;i++){
        			if (idcard_input == IDCard[i].substr(-4)) {
        				queryInfo=IDCard[i];
        			}
        		}
        		//alert($.inArray("idcard_input", IDCard) )
        		if (new_queryInfo==queryInfo) {
        			$('#loadingToast').hide();
        			$('.result_empty').show();
        			return;
        		};
        	}
            $('#data_input').attr('enc',getAesString(queryInfo,'1234567812345678','Pkcs7'));
            var encrypted = $('#data_input').attr('enc')
        	$.ajax({
			    type: 'post',
			    url: '/getCert',
			    data: {'queryInfo':encrypted},
			    dataType: 'json',
			    success: function(data) {
			    	$('#loadingToast').hide();
			    	if (data.data.length>1) {
			        	var listidcard=[];
			        	for(var i =0;i<data.data.length;i++){
			        		listidcard.push(data.data[i].IDCard)     
			        	}
			        	$('#data_input').val(listidcard)
			        	$('#search_input').attr("disabled",true);
			        	$('#ag_input').show();
			        }else if (data.data.length==1) {
			        	$('#data_input').val('');
			        	$('#idcard_input').val('');
			        	var encrypted = getAesString(data.data[0].IDCard,'1234567812345678','Pkcs7')
			        	window.location.href='/cer_result.html?queryInfo='+encrypted;
			        }else{
			        	$('.result_empty').show();
			        };
			    },
			    error: function(data) {
			    }
			});
        }
        function getAesString(data,key,iv){//加密
            var key  = CryptoJS.enc.Hex.parse(key);
            var iv   = CryptoJS.enc.Latin1.parse(iv);
            var encrypted = CryptoJS.AES.encrypt(data,key,
                    {
                        iv:iv,
                        mode:CryptoJS.mode.CBC,
                        padding:CryptoJS.pad.Pkcs7
                    });
            return encrypted;
        }
       function isWeiXin(){
            var ua = window.navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                return true;
            }else{
                return false;
            }
        }
		$(document).ready(function(){
			if(!isWeiXin()){
				$('#weui-footer').removeClass('weui-footer_ab')
		        $('.qr_div').show();
		    }
		})
