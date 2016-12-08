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
var count = 1;
$('.choose').on('tap','button',function(){
	$('.choose .mui-btn').removeClass('choosein_btn')
	$(this).addClass('choosein_btn')
})
/*$(document).ready(function(){
	getOrderList()
})*/
function getOrderList (status) {
	$.ajax({
	    type: 'post',
	    url: '/getOrderList',
	    data:{
	    	'status':status,
	    	'start':1,
	    	'limit':10
	    },
	    dataType: 'json',
	    success: function(data) {
	    	if (data.msgNo==0000) {
	    		var list = data.data.orderList;
	    		if (list) {
	    			var html=[];
	    			for(var i=0;i<list.length;i++){
	    				
	    			}
	    			mui('#pullrefresh').pullRefresh().endPullupToRefresh((++count > data.data.totalPages));
	    		}else{
	    			
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