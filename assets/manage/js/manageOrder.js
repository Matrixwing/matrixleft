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
var od_s=1;
function getOrderList (status,clear) {
	$('.noorder').hide()
	if (clear) {
		count=1;
		$('.tips').show()
		mui('#pullrefresh').pullRefresh().refresh(true);
	};
	
	if (status!= undefined) {
		var data ={
	    	'status':status,
	    	'start':count,
	    	'limit':8
	    }
	    od_s=status;
	}else{
		var data ={
			'status':od_s,
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
	    				if (list[i].status==1 ||list[i].status==10 ) {
	    					html.push('<div class="mui-card lia" orderID="'+list[i].orderID+'">')
	    				}else{
	    					html.push('<div class="mui-card" orderID="'+list[i].orderID+'">')
	    				};
							html.push('<div class="mui-card-content">')
								html.push('<div class="mui-card-content-inner">')
									html.push('<span>雇主：'+list[i].userName+'</span>')
									html.push('<span>手机：'+list[i].userPhone+'</span>')
								html.push('</div>')
								html.push('<div class="mui-card-content-inner">')
									html.push('<span>服务员：'+list[i].servantName+'</span>')
								html.push('</div>')
								html.push('<div class="mui-card-content-inner">')
									html.push('<span>预约时间：'+list[i].apptTime+'</span>')
								html.push('</div>')
								html.push('<div class="mui-card-content-inner">')
									html.push('<span>订单编号：'+list[i].orderID+'</span>')
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
	    	}else if (data.msgNo==4000){
	    		$('.noorder').show();
	    		mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
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
	var orderID= $(this).attr('orderid');
	$('.ylx').attr('orderid',orderID)
	if ($('.choosein_btn').index()==0) {
		mui('#sheet1').popover('toggle');
	}else{
		mui('#sheet2').popover('toggle');
	};
})
$('.ylx').on('tap',function(){
	var orderID= $(this).attr('orderid');
	var status= $(this).attr('status');
	var  type= $(this).attr('type');
	confirmOrder(orderID,status,type)
})
function confirmOrder(orderID,status,type){
	$.ajax({
	    type: 'get',
	    url: '../admin/confirmOrder',
	    data:{"orderID":orderID,"status":status},
	    dataType: 'json',
	    success: function(data) {
    		
	    	if (data.msgNo==0000) {
	    		var status = $('.choosein_btn').attr('status');
				getOrderList(status,1)
	    	}	
	    	mui('#sheet'+type).popover('toggle');
	    },
	    error: function(xhr, textStatus, errorThrown) {
	    	if (xhr.status == 401) {
	    		var href =eval('(' + xhr.responseText + ')');
	    		window.location.href=href.loginPage;
	    	}
	    }
	});
}