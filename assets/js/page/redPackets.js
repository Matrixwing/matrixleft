mui.init({
	pullRefresh: {
	container: '#pullrefresh',
	up: {
		height:80,
		contentrefresh: '正在加载...',
		contentnomore:'没有更多数据了',
		callback: getRedList
	}
}
});

$('.choose').on('tap','button',function(){
	$('.choose .mui-btn').removeClass('choosein_btn')
	$(this).addClass('choosein_btn');
	if ($(this).attr('status')) {
		getRedList($(this).attr('status'),'clear')
	}else{
		getRedList('','clear')
	};
	
})
/*$(document).ready(function(){
	getRedList()
})*/
var count = 1;
function getRedList (status,clear) {
	$('.tips').show()
	if (clear) {
		count=1;
		mui('#pullrefresh').pullRefresh().refresh(true);
	};
	if (status!= undefined) {
		var data ={
	    	'status':status,
	    	'start':count,
	    	'limit':8
	    }
	}else{
		var data ={
			'status':1,
	    	'start':count,
	    	'limit':8
	    }
	};
	
	$.ajax({
	    type: 'post',
	    url: '/red/getRedList',
	    data:data,
	    dataType: 'json',
	    success: function(data) {
	    	$('.tips').hide()
    		if (clear) {
    			$('#getRedList').empty();
    		};
	    	if (data.msgNo==0000) {
	    		var list = data.data.redList;
	    		if (list) {
	    			var html=[];
	    			for(var i=0;i<list.length;i++){
	    					html.push('<li class="mui-row packets">')
								html.push('<div class="packets_left mui-pull-left" redID='+list[i].redID+'>')
									html.push('<div class="name">'+list[i].name+'</div>')
									if (list[i].condition.leastMonth) {
										html.push('<div class="packets_li">')
											html.push('<span class="mui-icon mui-icon-forward"></span><p>托管'+list[i].condition.leastMonth+'月及以上工资</p>')
										html.push('</div>')
									};
									if (list[i].condition.leastMoeny) {
										html.push('<div class="packets_li">')
											html.push('<span class="mui-icon mui-icon-forward"></span><p>金额满'+list[i].condition.leastMoeny+'元</p>')
										html.push('</div>')
									};
								/*	if (list[i].condition.serv.length>=2) {
										html.push('<div class="packets_li">')
											html.push('<span class="mui-icon mui-icon-forward"></span><p>购买任意一项保障服务</p>')
										html.push('</div>')
									};*/
									html.push('<div class="packets_li">')
										html.push('<span class="mui-icon mui-icon-forward"></span><p>有效期至：'+list[i].expireAt+'</p>')
									html.push('</div>')
								html.push('</div>')
								html.push('<div class="packets_right mui-pull-right">')
									html.push('<img src="../images/redPackets_bg.png">')
									html.push('<span>￥<font>'+list[i].amount+'</font></span>')
									html.push('<div class="go">去使用</div>')
								html.push('</div>')
							html.push('</li>')
	    			}
	    			html = html.join('')
	    			$('#getRedList').append(html)
	    			mui('#pullrefresh').pullRefresh().endPullupToRefresh((++count > data.data.totalPages));
	    		}else{
	    			mui.toast(data.msgInfo);
	    		};
	    	}else{

	    	};
	    },
	    error: function(xhr, textStatus, errorThrown) {
	    	if (xhr.status == 401) {
	    		var href =eval('(' + xhr.responseText + ')');
	    		window.location.href=href.loginPage;
	    	}
	    }
	});
}
mui.ready(function() {
	mui('#pullrefresh').pullRefresh().pullupLoading();
});
base.tabbarHtml();