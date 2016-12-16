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
	    url: '/getOrderList',
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
	    				html.push('<div class="mui-card">')
							html.push('<div class="mui-card-header">')
								html.push('<p id="orderID">订单编号：'+list[i].orderID+'</p>')
								html.push('<span id="status">'+list[i].status+'</span>')
							html.push('</div>')
							html.push('<div class="mui-card-content">')
								html.push('<div class="mui-card-content-inner">')
									html.push('<p>服务员姓名：'+list[i].servantName+'</p>')
									html.push('<p>预约时间：'+list[i].apptTime+'</p>')
									/*html.push('<p>订单金额：111元</p>')*/
								html.push('</div>')
							html.push('</div>')
							if (list[i].status=='等待交易') {
								html.push('<div class="mui-card-footer">')

									html.push('<a class="mui-card-link getOrderDetail" orderID='+list[i].orderID+' >查看详情</a>')
									html.push('<a class="mui-card-link pay" servantName='+list[i].servantName+' orderID='+list[i].orderID+' expectSalary='+list[i].expectSalary+'>去支付</a>')
								html.push('</div>')
							}else{
								html.push('<div class="mui-card-footer">')
									html.push('<a class="mui-card-link getOrderDetail" orderID='+list[i].orderID+' >查看详情</a>')
								html.push('</div>')
							}
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
$('#getOrderList').on('tap','.pay',function(){
	var servantName =  encodeURI(encodeURI($(this).attr('servantName')));
	var orderID = $(this).attr('orderID');
	var expectSalary = $(this).attr('expectSalary');
	window.location.href='payment.html?orderID='+orderID+'&name='+servantName+'&expectSalary='+expectSalary;
})
$('#getOrderList').on('tap','.getOrderDetail',function(){
	var orderID = $(this).attr('orderID');
	window.location.href='orderDetail.html?orderID='+orderID;
})
base.tabbarHtml();