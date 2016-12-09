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
 		{value:'1',text:'1月-无优惠-手续费0.6%',yh:'0'},
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
	var index= $('.oncharge').attr('stype');
	$('.c_text').hide();
	if (!index) {
		$('.c_text').eq(2).show();
	}else{
		$('.c_text').eq(index-1).show();
	};

	all_m();
})
$('#showDeatils').on('tap',function(){
	$('.deatilsInfo').toggle()
})
$('#salary').on('blur',all_m)
$('#scfw').on('tap',function(){
	mui.toast('请慎重选择首次服务日期，该日期将决定何时给服务员发放薪资。');
	_czc.push(["_trackEvent", "支付页面", "首次服务说明", "", "", ""]);
})
function all_m(){
	var salary = $('#salary').val();
	var servicePrice = $('.oncharge').attr('servicePrice');
	var commission=0;
	var yh = $('#m_num').attr('yh');
	var num = $('#m_num').attr('num');
	var salary_m=salary*num;
	var all=0;
	if (num==1) {
		$('#commission_div').show();
		if (!servicePrice) {
			$('#servicePrice_div').hide();
			commission=base.keepTwoDecimal(salary_m*0.012);
			all =salary*num+commission;
		}else{
			$('#servicePrice_div').show();
			commission=base.keepTwoDecimal(salary_m*0.006);
			all =salary*num+servicePrice*num+commission;
			$('#servicePrice_show').html('￥'+servicePrice*num)
		};
		$('#commission_show').html('￥'+commission)
		
	}else{
		if (!servicePrice) {
			$('#commission_div').show();
			$('#servicePrice_div').hide();
			commission=base.keepTwoDecimal((salary_m*0.006));
			$('#commission_show').html('￥'+commission)
			all =salary*num+commission;
		}else{
			$('#servicePrice_div').show();
			$('#commission_div').hide();
			all =salary*num+servicePrice*num;
			$('#servicePrice_show').html('￥'+servicePrice*num)
		};
	};

	if (all<yh) {
		$('#yh_div').hide();
		$('#all_m').html(all)
	}else{
		$('#all_m').html(all-yh)
		if (yh!=0) {
			$('#yh_div').show();
			$('#yh_show').html('-￥'+yh)
		}else{
			$('#yh_div').hide();
		};
	};
	$('#salary_show').html('￥'+salary*num)
}

$('#pay_sure').on('tap',function(){
	all_m();
	var orderId = base.getQueryString('orderID');
	var salary = $('#salary').val();
	if (!salary) {
		mui.toast("请输入服务员月薪");
		return;
	};
	var commission=0;
	var num = $('#m_num').attr('num');
	var servicePrice = $('.oncharge').attr('servicePrice');
	if (!servicePrice) {
		servicePrice=0;
		commission=base.keepTwoDecimal(salary*num*0.006);
	};
	var firstService = $('#st_time').attr('date');
	var payUrl=window.location.href;
	var servicePriceID=$('.oncharge').attr('stype');
	if (!servicePriceID) {
		servicePriceID=0;
	};
	var totalFee=($('#all_m').html())*100;
	var data={
    	orderId:orderId,
    	servicePriceID:servicePriceID,
    	salary:salary*100,
    	payUrl:payUrl,
    	firstService:firstService,
    	month:num,
    	commission:commission*100,
    	platform:'wx',
    	totalFee:totalFee
    };
    //sign方法：按照ASCII码从小到大排序（字典序）为URL键值对的格式（即key1=value1&key2=value2…）后用md5加密
	function sign(param){
		var querystring = Object.keys(param).filter(function(key){
		return param[key] !== undefined && param[key] !== ''  <0;
		}).sort().map(function(key){
			return key + '=' + param[key];
		}).join("&")
		return $.md5(querystring).toUpperCase();
	} 
	
	var sign= sign(data);
	data['sign'] = sign;
	$.ajax({
	    type: 'post',
	    url: '/pay',
	    data:data,
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
					'orderId':orderId
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
	_czc.push(["_trackEvent", "支付页面", "支付", "", "", ""]);
})

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
	                	window.location.href='paySuccess.html?orderId='+paydata.orderId
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
$('#fwf').on('tap',function(){
	_czc.push(["_trackEvent", "支付页面", "首次服务说明", "", "", ""]);
})
$('#reset').on('tap',function(){
	_czc.push(["_trackEvent", "支付页面", "稍后支付", "", "", ""]);
})