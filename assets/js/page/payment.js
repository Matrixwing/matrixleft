mui.init();

var st_time = new mui.DtPicker({
    type: "date",
    beginDate: new Date()
});
$('#st_time').on('tap', function(event) {
	var _this = $(this);
	st_time.show(function(items) {
		var t = items.y.text+'年'+items.m.text+'月'+items.d.text+'日';
		var d = items.y.text+'-'+items.m.text+'-'+items.d.text;
		$('#st_time').html(t)
		$('#st_time').attr('date',d)
	});
});

$('#m_num').on('tap', function(event) {
	var m_num = new mui.PopPicker();
 	m_num.setData([
 		{value:'1',text:'1月-无优惠',yh:'0'},
 		{value:'3',text:'3月-立减10元',yh:'10'},
 		{value:'6',text:'6月-立减15元',yh:'15'},
 		{value:'12',text:'12月-立减100元',yh:'100'},
	]);
	var _this = $(this);
	m_num.show(function(items) {
		_this.html(items[0].text);
		_this.attr('num',items[0].value);
		_this.attr('yh',items[0].yh);
		all_m();
	});
});

$(document).ready(function(){
	var name = decodeURI(base.getQueryString('name'));
	var orderID = base.getQueryString('orderID');
	$('#name').html('姓名：'+name)
	$('#orderID').html('订单：'+orderID)
	$('#salary').val(base.getQueryString('expectSalary'))
	var date = new Date();
	var t = date.getFullYear()+'年'+ (date.getMonth()+1)+'月'+date.getDate()+'日';
	var d = date.getFullYear()+'-'+ (date.getMonth()+1)+'-'+date.getDate();
	$('#st_time').html(t);
	$('#st_time').attr('date',d);
	all_m();
})
$('.scharge').on('tap',function(){
	$(this).siblings().removeClass('oncharge');
	$(this).toggleClass('oncharge');
	all_m();
})
$('#showDeatils').on('tap',function(){
	$('.deatilsInfo').toggle()
})
$('#salary').on('blur',all_m)
function all_m(){
	var salary = $('#salary').val();
	var servicePrice = $('.oncharge').attr('servicePrice');
	var commission=0;
	var yh = $('#m_num').attr('yh');
	var num = $('#m_num').attr('num');
	if (!servicePrice) {
		servicePrice=0;
		$('#commission_div').show();
		$('#servicePrice_div').hide();
		commission=base.keepTwoDecimal(((salary*num)*0.006));
		var a =salary*num+commission;
		if (a<yh) {
			$('#yh_div').hide();
			$('#all_m').html(salary*num+commission);
		}else{
			$('#all_m').html(salary*num+commission-yh);
			if (yh!=0) {
				$('#yh_div').show();
				$('#yh_show').html('-￥'+yh)
			}else{
				$('#yh_div').hide();
			};
		};
		$('#commission_show').html('￥'+commission)
	}else{
		$('#commission_div').hide();
		$('#servicePrice_div').show();
		var b =salary*num+servicePrice*num+commission;
		if (b<yh) {
			$('#yh_div').hide();
			$('#all_m').html(salary*num+servicePrice*num+commission)
		}else{
			$('#all_m').html(salary*num+servicePrice*num+commission-yh)
			if (yh!=0) {
				$('#yh_div').show();
				$('#yh_show').html('-￥'+yh)
			}else{
				$('#yh_div').hide();
			};
		};
		$('#servicePrice_show').html('￥'+servicePrice*num)
	};
	$('#salary_show').html('￥'+salary*num)
}

$('#pay_sure').on('tap',function(){
	/*if (!$('#st_time').attr('date')) {
		mui.toast('请选择首次服务日期');
		return;
	};*//*
	mui('#pay_sure').button('reset');
	return;*/
	all_m();
	var orderId = base.getQueryString('orderID');
	var salary = $('#salary').val();
	var cutPrice=0;
	var num = $('#m_num').attr('num');
	var servicePrice = $('.oncharge').attr('servicePrice');
	if (!servicePrice) {
		servicePrice=0;
		cutPrice=base.keepTwoDecimal(salary*num*0.006);
	};
	var firstService = $('#st_time').attr('date');
	var payUrl=window.location.href;
	var servicePriceID=$('.oncharge').attr('stype');
	if (!servicePriceID) {
		servicePriceID=0;
	};
	$.ajax({
	    type: 'post',
	    url: '/pay',
	    data:{
	    	'orderId':orderId,
	    	'servicePrice':servicePrice,
	    	'servicePriceID':servicePriceID,
	    	'salary':salary,
	    	'payUrl':payUrl,
	    	'firstService':firstService,
	    	'cutPrice':cutPrice
	    },
	    dataType: 'json',
	    success: function(data) {
	    	$('.tips').hide();
	    	//var data= JSON.parse(data);
			if (data.msgNo == '0000' ) {
				var paydata={
					'appId':data.data.appId,
					'timeStamp':data.data.timeStamp,
					'nonceStr':data.data.nonceStr,
					'package':data.data.package,
					'signature':data.data.signature,
					'signType':data.data.signType,
					'paySign':data.data.paySign,
				}
			pay(paydata)
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
	function pay(paydata){
	    wx.config({
	        debug: false, 
	        appId: paydata.appId, 
	        timestamp:paydata.timeStamp,
	        nonceStr:paydata.nonceStr,
	        signature:paydata.signature,
	        jsApiList: ['chooseWXPay']
	    });
	    wx.ready(function(){
	        wx.chooseWXPay({
	            timestamp: paydata.timeStamp, 
	            nonceStr: paydata.nonceStr,
	            package: paydata.package, 
	            signType: paydata.signType,
	            paySign: paydata.paySign,
	            success: function (res) {
	                mui.toast("支付成功！");
	                setTimeout(function(){
	                	window.location.href='record.html'
	                }, 2000);
	            },
	            cancel:function(res){  
		            mui.toast("您取消了支付");
		        },  
		        fail:function(res){ 
		        	 mui.toast("支付失败，请重试");
		        } 
	        });
	    });
	}
})
