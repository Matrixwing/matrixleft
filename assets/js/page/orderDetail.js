$(document).ready(function(){
	var orderID = base.getQueryString('orderID')
	$.ajax({
	    type: 'get',
	    url: '/getOrderDetail',
	    data:{
	    	'orderID':orderID
	    },
	    dataType: 'json',
	    success: function(data) {
	    	$('.tips').hide();
			if (data.msgNo == '0000' ) {
				var html=[];
				var status=['完成交易','等待交易','取消交易']

				html.push('<form class="mui-input-group">')
					html.push('<div class="mui-input-row"><label>订单号：</label><div class="mui-row">'+data.data.orderID+'</div></div>')
					html.push('<div class="mui-input-row"><label>下单时间：</label><div class="mui-row">'+data.data.createTime+'</div></div>')
					html.push('<div class="mui-input-row"><label>过期时间：</label><div class="mui-row">'+data.data.validTime+'</div></div>')
					html.push('<div class="mui-input-row"><label>订单状态：</label><div class="mui-row">'+status[data.data.status]+'</div></div>')
					if (data.data.paidTime) {
						html.push('<div class="mui-input-row"><label>支付时间：</label><div class="mui-row">'+data.data.paidTime+'</div></div>')
					}
					if (data.data.totalFee) {
						html.push('<div class="mui-input-row"><label>订单金额：</label><div class="mui-row">'+data.data.totalFee/100+'元</div></div>')
					};
					if (data.data.salary) {
						html.push('<div class="mui-input-row"><label>工资金额：</label><div class="mui-row">'+(data.data.salary)/100+'元</div></div>')
					};
					if (data.data.servicePrice) {
						html.push('<div class="mui-input-row"><label>服务费：</label><div class="mui-row">'+(data.data.servicePrice)/100+'元</div></div>')
					};
					if (data.data.cutPrice) {
						html.push('<div class="mui-input-row"><label>优惠金额：</label><div class="mui-row">'+(data.data.cutPrice)/100+'元</div></div>')
					};
					if (data.data.commission) {
						html.push('<div class="mui-input-row"><label>手续费：</label><div class="mui-row">'+(data.data.commission)/100+'元</div></div>')
					};
				html.push('</form>')
				var remark =  eval('(' + data.data.remark + ')'); 
				html.push('<form class="mui-input-group">')
					html.push('<div class="mui-input-row"><label>预约时间：</label><div class="mui-row">'+remark.apptTime+'</div></div>')
					/*html.push('<div class="mui-input-row"><label>面试地点：</label><div class="mui-row">'+remark.apptPlace+'</div></div>')*/
					if (data.data.servantID) {
						html.push('<div class="mui-input-row"><label>服务员：</label><div class="mui-row">'+data.data.servantName+'</div></div>')
					};
					if (remark.tags) {
						var needs_html=[];
						needs_html.push(remark.tags[1].tagName+remark.tags[1].value+'人、'+remark.tags[2].tagName+remark.tags[2].value+'平米、')
						for(var i = 3;i<remark.tags.length;i++){
							if (i==(remark.tags.length-1)) {
								if (remark.tags[i].value==1) {
									needs_html.push(remark.tags[i].tagName)
								}else{
									needs_html.push('两位'+remark.tags[i].tagName)
								};
							}else{
								if (remark.tags[i].value==1) {
									needs_html.push(remark.tags[i].tagName+'、')
								}else{
									needs_html.push('两位'+remark.tags[i].tagName+'、')
								};
							};
						}
						needs_html = needs_html.join('')
						html.push('<div class="mui-input-row needs"><label>需求：</label><div class="mui-row">'+needs_html+'</div></div>')
					};
				html.push('</form>')
				if (data.data.status==1) {
					if (data.data.servantStatus==2) {
						html.push('<div class="mui-content-padded"><a  class="mui-btn mui-btn-block mui-btn-primary pay" servantName='+data.data.servantName+' orderID='+data.data.orderID+' expectSalary='+data.data.expectSalary+'>去支付</a></div>')
					};
				};
				html= html.join('');
				$('#detail').append(html)
			}else{
				mui.toast(data.msgInfo);
			}	
	    },
	    error: function(xhr, textStatus, errorThrown) {
	    	if (xhr.status == 401) {
	    		var href =eval('(' + xhr.responseText + ')');
	    		window.location.href=href.loginPage;
	    	}
	    }
	});
})
$('#detail').on('tap','.pay',function(){
	var servantName =  encodeURI(encodeURI($(this).attr('servantName')));
	var orderID = $(this).attr('orderID');
	var expectSalary = $(this).attr('expectSalary');
	window.location.href='payment.html?orderID='+orderID+'&name='+servantName+'&expectSalary='+expectSalary;
})
/*var sharedata={
	'title':'微元汇',
	'link':'http://wyh.matrixwing.com/nurseList.html',
	'imgUrl':'http://wyh.matrixwing.com/images/logo.jpg',
	'desc':'小元找保姆就是好'
}
base.getShareConfig(sharedata)*/