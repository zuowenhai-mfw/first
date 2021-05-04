$(function(){
	
	function f(l){
		var k=0;
		$(l).each(function(){
			k+=$(this).outerWidth(true)
		});
		return k
	}
	
	function g(n){
		var o=f($(n).prevAll()),q=f($(n).nextAll());
		var l=f($(".content-tabs").children().not(".J_menuTabs"));
		var k=$(".content-tabs").outerWidth(true)-l;
		var p=0;
		if($(".page-tabs-content").outerWidth()<k){
			p=0
		}else{
			if(q<=(k-$(n).outerWidth(true)-$(n).next().outerWidth(true))){
				if((k-$(n).next().outerWidth(true))>q){
					p=o;
					var m=n;
					while((p-$(m).outerWidth())>($(".page-tabs-content").outerWidth()-k)){
						p-=$(m).prev().outerWidth();
						m=$(m).prev()
					}
				}
			}else{
				if(o>(k-$(n).outerWidth(true)-$(n).prev().outerWidth(true))){
					p=o-$(n).prev().outerWidth(true)
				}
			}
		}
		$(".page-tabs-content").animate({marginLeft:0-p+"px"},"fast")
	}
				
	$(".J_menuItem").each(function(k){
		if(!$(this).attr("data-index")){
			$(this).attr("data-index",k)
		}
	});
	
	//点击左侧菜单添加tabs标签
	function c(){
		var o=$(this).attr("href"),m=$(this).data("index"),l=$.trim($(this).text()),k=true;
		if(o==undefined||$.trim(o).length==0){return false}
		$(".J_menuTab").each(function(){
			if($(this).data("id")==o){
				if(!$(this).hasClass("active")){
					$(this).addClass("active").siblings(".J_menuTab").removeClass("active");
					g(this);
					window.location.href=o;
				}
				k=false;
				return false
			}
		});
		if(k){
			var p='<a href="'+o+'" class="active J_menuTab" data-id="'+o+'">'+l+' <i class="fa fa-times-circle"></i></a>';
			$(".J_menuTab").removeClass("active");
			window.location.href=o;
			$(".J_menuTabs .page-tabs-content").append(p);
			g($(".J_menuTab.active"))
		}
		return false
	}
	$(".J_menuItem").on("click",c);
	
	//标签后面的关闭按钮操作
	function h(){
		var m=$(this).parents(".J_menuTab").data("id");
		var l=$(this).parents(".J_menuTab").width();
		if($(this).parents(".J_menuTab").hasClass("active")){
			if($(this).parents(".J_menuTab").next(".J_menuTab").size()){
				var k=$(this).parents(".J_menuTab").next(".J_menuTab:eq(0)").data("id");
				var next_tab = $(this).parents(".J_menuTab").next(".J_menuTab:eq(0)");
				next_tab.addClass("active");
				var next_href = next_tab.attr('href');
				window.location.href = next_href;
				var n=parseInt($(".page-tabs-content").css("margin-left"));
				if(n<0){
					$(".page-tabs-content").animate({marginLeft:(n+l)+"px"},"fast")
				}
				$(this).parents(".J_menuTab").remove();
			}
			if($(this).parents(".J_menuTab").prev(".J_menuTab").size()){
				var k=$(this).parents(".J_menuTab").prev(".J_menuTab:last").data("id");
				var prev_tab = $(this).parents(".J_menuTab").prev(".J_menuTab:last");
				prev_tab.addClass("active");
				var prev_href = prev_tab.attr('href');
				window.location.href = prev_href;
				$(this).parents(".J_menuTab").remove();
			}
		}else{
			$(this).parents(".J_menuTab").remove();
			g($(".J_menuTab.active"))
		}
		return false
	}
	$(".J_menuTabs").on("click",".J_menuTab i",h);
	
	//关闭其他选项卡
	function i(){
		$(".page-tabs-content").children("[data-id]").not(":first").not(".active").each(function(){
			$(this).remove();
		});
		$(".page-tabs-content").css("margin-left","0")
	}
	$(".J_tabCloseOther").on("click",i);
	
	//定位当前选项卡
	function j(){
		g($(".J_menuTab.active"))
	}	
	$(".J_tabShowActive").on("click",j);
	
	//点击tabs标签
	function e(){
		if(!$(this).hasClass("active")){
			var k=$(this).data("id");
			$(this).addClass("active").siblings(".J_menuTab").removeClass("active");
			g(this)
		}
	}	
	$(".J_menuTabs").on("click",".J_menuTab",e);
	
	//双击tabs标签
	function d(){
		var k=l.attr("src")
	}
	$(".J_menuTabs").on("dblclick",".J_menuTab",d);
	
	//点击菜单左侧滑动按钮
	function a(){
		var o=Math.abs(parseInt($(".page-tabs-content").css("margin-left")));
		var l=f($(".content-tabs").children().not(".J_menuTabs"));
		var k=$(".content-tabs").outerWidth(true)-l;
		var p=0;
		if($(".page-tabs-content").width()<k){
			return false
		}else{
			var m=$(".J_menuTab:first");
			var n=0;
			while((n+$(m).outerWidth(true))<=o){
				n+=$(m).outerWidth(true);
				m=$(m).next()
			}
			n=0;
			if(f($(m).prevAll())>k){
				while((n+$(m).outerWidth(true))<(k)&&m.length>0){
					n+=$(m).outerWidth(true);
					m=$(m).prev()
				}
				p=f($(m).prevAll())
			}
		}
		$(".page-tabs-content").animate({marginLeft:0-p+"px"},"fast")
	}
	$(".J_tabLeft").on("click",a);
	
	//点击菜单右侧滑动按钮
	function b(){
		var o=Math.abs(parseInt($(".page-tabs-content").css("margin-left")));
		var l=f($(".content-tabs").children().not(".J_menuTabs"));
		var k=$(".content-tabs").outerWidth(true)-l;
		var p=0;
		if($(".page-tabs-content").width()<k){
			return false
		}else{
			var m=$(".J_menuTab:first");
			var n=0;
			while((n+$(m).outerWidth(true))<=o){
				n+=$(m).outerWidth(true);
				m=$(m).next()
			}
			n=0;
			while((n+$(m).outerWidth(true))<(k)&&m.length>0){
				n+=$(m).outerWidth(true);
				m=$(m).next()
			}
			p=f($(m).prevAll());
			if(p>0){
				$(".page-tabs-content").animate({marginLeft:0-p+"px"},"fast")
			}
		}
	}
	$(".J_tabRight").on("click",b);
	
	//关闭全部选项卡
	$(".J_tabCloseAll").on("click",function(){
		$(".page-tabs-content").children("[data-id]").not(":first").each(function(){
			$(this).remove();
		});
		$(".page-tabs-content").children("[data-id]:first").each(function(){
			$(this).addClass("active");
			var url = $(this).data("id");
			window.location.href='#/'+url;
		});
		$(".page-tabs-content").css("margin-left","0")
	})
});
