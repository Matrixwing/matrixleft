/*
baseJS v1.0
2016年10月31日
*/
var base = {
    tabbar:function(){
        var currentSubWebview = mui('#tab-bar a.mui-active')[0].id;
        mui('#tab-bar').on('tap', 'a', function() {
            var id = this.getAttribute('id');
            var src = id + '.html';
            window.location.href = src;
            /*if (id != currentSubWebview){
                if (id != 'home' && id != 'me') {
                    if (!is_login) {
                        var frame = document.createElement('iframe');
                        frame.id = 'sub_login';
                        frame.className = 'sub';
                        frame.src = '../me/login.html';
                        mui('body')[0].appendChild(frame);

                        return false;
                    };
                };
                window.location.href = src;
            }*/
        })
    }
}
