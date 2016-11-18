mui.init({
	swipeBack:false, //启用右滑关闭功能
	pullRefresh: {
			container: '#pullrefresh',
			down: {
				callback: pulldownRefresh
			},
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
});
$(document).ready(function(){
  	var old_tag = new mui.PopPicker();
 	old_tag.setData([
 		{value:'200',text:'照顾老人'},
 		{value:'201',text:'老人自理'},
 		{value:'202',text:'老人半自理'},
 		{value:'203',text:'老人不自理'},
	]);
	old_tag.pickers[0].setSelectedIndex(1, 2000);
	$('.old_tag').on('tap', function(event) {
		var _this = $(this);
		old_tag.show(function(items) {
			_this.html(items[0].text);
			if (items[0].value=='200') {
				_this.removeClass('onselect')
			}else{
				_this.addClass('onselect')
			};
		});
	});
	//
	var child_tag = new mui.PopPicker();
 	child_tag.setData([
 		{value:'100',text:'照顾小孩'},
 		{value:'101',text:'小孩小于1岁'},
 		{value:'102',text:'小孩1到3岁'},
 		{value:'103',text:'小孩大于1岁'},
	]);
	child_tag.pickers[0].setSelectedIndex(1, 2000);
	$('.child_tag').on('tap', function(event) {
		var _this = $(this);
		child_tag.show(function(items) {
			_this.html(items[0].text);
			if (items[0].value=='100') {
				_this.removeClass('onselect')
			}else{
				_this.addClass('onselect')
			};
		});
	});
})
 //侧滑容器父节点
var offCanvasWrapper = mui('#offCanvasWrapper');
 //主界面容器
var offCanvasInner = offCanvasWrapper[0].querySelector('.mui-inner-wrap');
 //菜单容器
var offCanvasSide = document.getElementById("offCanvasSide");
document.getElementById('offCanvasShow').addEventListener('tap', function() {
	offCanvasWrapper.offCanvas('show');
	getTagList();
});
document.getElementById('tag_sure').addEventListener('tap', function() {
	offCanvasWrapper.offCanvas('close');
});
 //主界面和侧滑菜单界面均支持区域滚动；
mui('#offCanvasSideScroll').scroll();
mui('#offCanvasContentScroll').scroll();


$('.choose .mui-btn').on('tap',function(){
	$('.choose .mui-btn').removeClass('choosein_btn')
	$(this).addClass('choosein_btn')
})
/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
	setTimeout(function() {
		var table = document.body.querySelector('.mui-table-view');
		var cells = document.body.querySelectorAll('.mui-table-view-cell');
		for (var i = cells.length, len = i + 3; i < len; i++) {
			var li = document.createElement('li');
			li.className = 'mui-table-view-cell';
			li.innerHTML = '<a class="mui-navigate-right">Item ' + (i + 1) + '</a>';
			//下拉刷新，新纪录插到最前面；
			table.insertBefore(li, table.firstChild);
		}
		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
	}, 1500);
}
var count = 0;
/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
	setTimeout(function() {
		mui('#pullrefresh').pullRefresh().endPullupToRefresh((++count > 2)); //参数为true代表没有更多数据了。
		var table = document.body.querySelector('.mui-table-view');
		var cells = document.body.querySelectorAll('.mui-table-view-cell');
		for (var i = cells.length, len = i + 20; i < len; i++) {
			var li = document.createElement('li');
			li.className = 'mui-table-view-cell';
			li.innerHTML = '<a class="mui-navigate-right">Item ' + (i + 1) + '</a>';
			table.appendChild(li);
		}
	}, 1500);
}
if (mui.os.plus) {
	mui.plusReady(function() {
		setTimeout(function() {
			mui('#pullrefresh').pullRefresh().pullupLoading();
		}, 1000);

	});
} else {
	mui.ready(function() {
		mui('#pullrefresh').pullRefresh().pullupLoading();
	});
}
function getTagList(){
	$.get('/getTagList',function(data,status){
    	var data = JSON.parse(data);
    	var d = data.data;
		if (data.msgNo == '0000' ) {
			$('.load_tag').hide();
			if (d[2]) {
				var t = d[2];
				var thtml =[];
				for(var i=0;i<d.length;i++){
					thtml.push('<button type="button" class="mui-btn mui-pull-left" "tagID='+t[i].tagID+'">'+t[i].tagName+'</button>')
				}
				var html=thtml.join('');
				$('#tese').empty();
				$('#tese').append(html)
			};
			if (d[3]) {
				var c = d[3];
				var thtml =[];
				for(var i=0;i<c.length;i++){
					thtml.push('<button type="button" class="mui-btn mui-pull-left" "tagID='+c[i].tagID+'">'+c[i].tagName+'</button>')
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
$('.tag_row select').on('change',function(){
	if ($(this).find("option:selected").index()=='0') {
		$(this).removeClass('onselect')
	}else{
		$(this).addClass('onselect')
	};

})
$('#add_old').on('tap',function(){
	$('#old_tag2').show()
	$(this).hide()
})
$('#add_child').on('tap',function(){
	$('#child_tag2').show()
	$(this).hide()
})