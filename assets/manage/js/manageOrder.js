mui.init({
	pullRefresh: {
	container: '#pullrefresh',
	up: {
		height:80,
		contentrefresh: '正在加载...',
		contentnomore:'没有更多数据了',
		callback: getOrderList
	}
}
});

$('.choose').on('tap','button',function(){
	$('.choose .mui-btn').removeClass('choosein_btn')
	$(this).addClass('choosein_btn');
	if ($(this).attr('status')) {
		getOrderList($(this).attr('status'),'clear')
	}else{
		getOrderList('','clear')
	};
	
})
/*$(document).ready(function(){
	getOrderList()
})*/
var count = 1;
function getOrderList (status,clear) {
	$('.tips').show()
	if (status!= undefined) {
		var data ={
	    	'status':status,
	    	'start':count,
	    	'limit':8
	    }
	}else{
		var data ={
			'status':10,
	    	'start':count,
	    	'limit':8
	    }
	};
	
	$.ajax({
	    type: 'post',
	    url: '../admin/getOrderList',
	    data:data,
	    dataType: 'json',
	    success: function(data) {
	    	$('.tips').hide()
    		if (clear) {
    			$('#getOrderList').empty();
    		};
	    	if (data.msgNo==0000) {
	    		var list = data.data.orderList;
	    		if (list) {
	    			var html=[];
	    			for(var i=0;i<list.length;i++){
	    				html.push('<div class="mui-card lia">')
							html.push('<div class="mui-card-content">')
								html.push('<div class="mui-card-content-inner">')
									html.push('<span>雇主：汪仕彬</span>')
									html.push('<span>手机：18888888888</span>')
								html.push('</div>')
								html.push('<div class="mui-card-content-inner">')
									html.push('<span>雇主服务员：汪仕彬</span>')
								html.push('</div>')
								html.push('<div class="mui-card-content-inner">')
									html.push('<span>预约时间：2016年12月27日11:25:17</span>')
								html.push('</div>')
								html.push('<div class="mui-card-content-inner">')
									html.push('<span>订单编号：1010299282</span>')
								html.push('</div>')
							html.push('</div>')
						html.push('</div>')
	    			}
	    			html = html.join('')
	    			$('#getOrderList').append(html)
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
$('#getOrderList').on('tap','.lia',function(){
	mui('#sheet1').popover('toggle');
})