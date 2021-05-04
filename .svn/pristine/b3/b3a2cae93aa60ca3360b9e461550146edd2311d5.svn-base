$(function() {

//	获取过期时间(毫秒)
    var n = sessionStorage.getItem("timeout");

//	超时退出(0或负数永不超时)
    if(n > 0){
        var time = setTimeout(function(){
            $.ajax({
                url:'/plmcore/showIndexPage',
                type:'post',
                success:function(data) {
                    sessionStorage.clear();
                    location.href = data+".html";
                }
            });
        },n);
        $("body").click(function(){
            clearTimeout(time);
            time = setTimeout(function(){
                $.ajax({
                    url:'/plmcore/showIndexPage',
                    type:'post',
                    success:function(data) {
                        sessionStorage.clear();
                        location.href = data+".html";
                    }
                });
            },n);
        })
    }


});

/*startsWith函数并不是每个浏览器都有的，有些浏览器是undefined，做了一些处理*/
if (typeof String.prototype.startsWith !== 'function') {
    String.prototype.startsWith = function (prefix) {
        return this.slice(0, prefix.length) === prefix;
    }
}
