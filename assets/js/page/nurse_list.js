mui.init({
	swipeBack:false, //启用右滑关闭功能
	pullRefresh: {
			container: '#pullrefresh',
			up: {
				height:80,
				contentrefresh: '正在加载...',
				contentnomore:'没有更多数据了',
				callback: getServantList
			}
		}
});
$(document).ready(function(){
	getTagList();
  	var old_tag = new mui.PopPicker();
 	old_tag.setData([
 		{value:'200',text:'不选择'},
 		{value:'201',text:'老人自理'},
 		{value:'202',text:'老人半自理'},
 		{value:'203',text:'老人不自理'},
	]);
	old_tag.pickers[0].setSelectedIndex(1, 2000);
	$('.old_tag').on('tap', function(event) {
		var _this = $(this);
		old_tag.show(function(items) {
			_this.html(items[0].text);
			_this.attr('tagID',items[0].value);
			if (items[0].value=='200') {
				_this.removeClass('onselect_l')
				_this.html('照顾老人')
			}else{
				_this.addClass('onselect_l')
			};
		});
	});
	//
	var child_tag = new mui.PopPicker();
 	child_tag.setData([
 		{value:'100',text:'不选择'},
 		{value:'101',text:'小孩小于1岁'},
 		{value:'102',text:'小孩1到3岁'},
 		{value:'103',text:'小孩大于1岁'},
	]);
	child_tag.pickers[0].setSelectedIndex(1, 2000);
	$('.child_tag').on('tap', function(event) {
		var _this = $(this);
		child_tag.show(function(items) {
			_this.html(items[0].text);
			_this.attr('tagID',items[0].value);
			if (items[0].value=='100') {
				_this.removeClass('onselect_c')
				_this.html('照顾小孩')
			}else{
				_this.addClass('onselect_c')
			};
		});
	});
	//延迟获取tag
	//setTimeout("getTagList()",1500)
})




if (mui.os.plus) {
	mui.plusReady(function() {
		setTimeout(function() {
			mui('#pullrefresh').pullRefresh().pullupLoading();
		}, 1000);

	});
} else {
	mui.ready(function() {
		setTimeout(function() {
			mui('#pullrefresh').pullRefresh().pullupLoading();
		}, 100);
	});
}

 //侧滑容器父节点
var offCanvasWrapper = mui('#offCanvasWrapper');
 //菜单容器
var offCanvasSide = document.getElementById("offCanvasSide");
$('#offCanvasShow').on('tap','.ready',function() {
	$('.choose .mui-btn').removeClass('choosein_btn')
	$(this).addClass('choosein_btn')
	$('.title').html($(this).html())
	offCanvasWrapper.offCanvas('show');
	//getTagList();
});

 //主界面和侧滑菜单界面均支持区域滚动；
mui('#offCanvasSideScroll').scroll();
//mui('#offCanvasContentScroll').scroll();



function getTagList(){
	$.get('/getTagList',function(data,status){
    	var data = JSON.parse(data);
    	var d = data.data;
		if (data.msgNo == '0000' ) {
			$('.load_tag').hide();
			//工种填充
			if (d[0]) {
				var g = d[0];
				var thtml =[];
				for(var i=0;i<g.length;i++){
					if (g[i].tagID=='300' || g[i].tagID=='301') {
						thtml.push('<button type="button" class="mui-btn mui-pull-left" tagID='+g[i].tagID+'>'+g[i].tagName+'</button>')
					}else{
						thtml.push('<button type="button" class="mui-btn mui-pull-left ready" tagID='+g[i].tagID+'>'+g[i].tagName+'</button>')
					}
				}
				var html=thtml.join('');
				$('#offCanvasShow').empty();
				$('#offCanvasShow').append(html)
			};
			if (d[2]) {
				var t = d[2];
				var thtml =[];
				for(var i=0;i<t.length;i++){
					thtml.push('<button type="button" class="mui-btn mui-pull-left" tagID='+t[i].tagID+'>'+t[i].tagName+'</button>')
				}
				var html=thtml.join('');
				$('#tese').empty();
				$('#tese').append(html)
			};
			if (d[3]) {
				var c = d[3];
				var thtml =[];
				for(var i=0;i<c.length;i++){
					thtml.push('<button type="button" class="mui-btn mui-pull-left" tagID='+c[i].tagID+'>'+c[i].tagName+'</button>')
				}
				var html=thtml.join('')
				$('#cer').empty();
				$('#cer').append(html)
			};
		}else{
			mui.toast(data.msgInfo);
		};

	});
}

$('#add_old').on('tap',function(){
	$('#old_tag2').show()
	$(this).hide()
})
$('#add_child').on('tap',function(){
	$('#child_tag2').show()
	$(this).hide()
})
$('#full_tag').on('tap','button',function(){
	$(this).toggleClass('onselect')
})
$('#getServantList').on('tap','li',function(){
	window.location.href='userCard.html?userID='+$(this).attr('userID')
})
/*getServantList*/
$('#tag_sure').on('tap',function(){
	offCanvasWrapper.offCanvas('close');
	var dataList=[];

	//工种
	dataList.push({
	   tagID:$('.choosein_btn').attr('tagID'),
	   value:'1'
	})
	if ($('.choosein_btn').attr('tagID')=='0' || $('.choosein_btn').attr('tagID')=='2') {
		dataList.push({
		   tagID:'22',
		   value:$('#people').val()
		})
	}else{
		dataList.push({
		   tagID:'23',
		   value:$('#people').val()
		})
	};
	
	dataList.push({
	   tagID:$('#forests').attr('tagID'),
	   value:$('#forests').val()
	})
	//old
	if ($('.onselect_l').length!=0) {
		if ($('.onselect_l').length==1) {
			dataList.push({
			   tagID:$('.onselect_l').attr('tagID'),
			   value:1
			})
		}else{
			if ($('.onselect_l').eq(0).attr('tagID')==$('.onselect_l').eq(1).attr('tagID')) {
				dataList.push({
				   tagID:$('.onselect_l').eq(0).attr('tagID'),
				   value:2
				})
			}else{
				dataList.push({
				   tagID:$('.onselect_l').eq(0).attr('tagID'),
				   value:1
				})
				dataList.push({
				   tagID:$('.onselect_l').eq(1).attr('tagID'),
				   value:1
				})
			};
		}
		
	};
	//child
	if ($('.onselect_c').length!=0) {
		if ($('.onselect_c').length==1) {
			dataList.push({
			   tagID:$('.onselect_c').attr('tagID'),
			   value:1
			})
		}else{
			if ($('.onselect_c').eq(0).attr('tagID')==$('.onselect_c').eq(1).attr('tagID')) {
				dataList.push({
				   tagID:$('.onselect_c').eq(0).attr('tagID'),
				   value:2
				})
			}else{
				dataList.push({
				   tagID:$('.onselect_c').eq(0).attr('tagID'),
				   value:1
				})
				dataList.push({
				   tagID:$('.onselect_c').eq(1).attr('tagID'),
				   value:1
				})
			};
		}
		
	};
	for(var i =0;i<$('.onselect').length;i++){
		if ($('.onselect').eq(i).attr('tagID')) {
			dataList.push({
			   tagID:$('.onselect').eq(i).attr('tagID'),
			   value:'1'
			})
		};
	}
	d_e = dataList;
	getServantList(dataList,'clear')
})
var count = 1;
var d_e='';
function getServantList(dataList,clear){
	if (!dataList) {
		dataList = d_e;
	};
	if (clear) {
		count=1;
    	mui('#pullrefresh').pullRefresh().refresh(true);
	}
	var dataList = JSON.stringify(dataList)
	$.ajax({
	    type: 'post',
	    url: '/getServantList',
	    data: {
	    	'tag':dataList,
	    	'start':count,
	    	'limit':5
	    },
	    dataType: 'json',
	    success: function(data) {
	    	if (data.msgNo=='0000') {
	    		var serventList = [];
		    	for(var i =0;i<data.data.servantList.length;i++){
		    		serventList.push('<li class="mui-table-view-cell mui-media" userID="'+data.data.servantList[i].userID+'">')
		    			serventList.push('<a class="mui-navigate-right">')
		    				serventList.push('<img class="mui-media-object mui-pull-left" src="'+data.data.servantList[i].avatarUrl+'">')
		    				serventList.push('<div class="mui-media-body">')
		    					serventList.push('<div class="mui-row">')
									serventList.push('<span class="mui-pull-left">'+data.data.servantList[i].userName+'</span>')
									serventList.push('<div class="qwxz  mui-pull-right">期望薪资：<font>'+data.data.servantList[i].expectSalary+'</font>/月</div>')
								serventList.push('</div>')
								serventList.push('<div class="mui-row">')
									serventList.push('<div class="mui-row">')
										
											serventList.push('<div class="kbd_div mui-pull-left">')
											if (data.data.servantList[i].sysTag) {
												serventList.push('<div class="kbd">小元实名</div>')
											};
											serventList.push('</div>')
											
										/*serventList.push('<div class="kbd_div mui-pull-left">')
											serventList.push('<div class="kbd">小元体检</div>')
										serventList.push('</div>')*/
									serventList.push('</div>')
									serventList.push('<div class="ckxz">小元参考薪资：<font>'+data.data.servantList[i].price+'</font>/月</div>')
								serventList.push('</div>')
		    				serventList.push('</div>')
		    				/*serventList.push('<p class="mui-ellipsis">小元评价：改服务员态度好，服务号，做饭好，什么都好</p>')*/
		    			serventList.push('</a>')
	    			serventList.push('</li>')
		    	}
		    	var serventList = serventList.join('')
		    	if (clear) {
		    		$('#getServantList').empty();
		    		var scroll = mui('#pullrefresh').scroll(); 
		    		if (scroll.y!='0') {
		    			mui('#pullrefresh').pullRefresh().scrollTo(0,0,0)
		    			console.log(scroll.y);
		    			//mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
		    			//mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		    		};
		    	};
		    	$('#getServantList').append(serventList)
				mui('#pullrefresh').pullRefresh().endPullupToRefresh((++count > data.data.totalPages));
	    	};
	    },
	    error: function(data) {
	    	mui.toast('请重试');
	    }
	});
}
var scroll = mui('#pullrefresh').scroll(); 

    		document.getElementById('pullrefresh' ).addEventListener('scroll', function () { 
      console.log(scroll.y); 
    }) 
function reset(){
	$('#people').val('1');
	$('#forests').val('100');
	$('#old_tag2').hide();
	$('#child_tag2').hide();
	$('#add_old').show();
	$('#add_child').show();
	$('#full_tag button').removeClass('onselect')
	old_tag.pickers.setSelectedIndex(1, 2000);
}
$('#reset').on('tap',function(){
	reset()
})
