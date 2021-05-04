// JavaScript Document
$(function() {
	//全选
	$(document).on("click",".allChecked",function(){	
		if($(this).prop('checked')){
			$(".oneChecked").prop('checked',true);		
		}else{
			$(".oneChecked").prop('checked',false);		
		}	
	})
	//当tbody中的checkbox全部选中时，thead中的checkbox被选中，反之未被选中
	$(document).on("click",".oneChecked",function(){	
		var checkLength = $(".oneChecked").length;
		var i = 0;
		$(".oneChecked:checked").each(function() {
			i++;
        });
		if(i == checkLength){
			$(".allChecked").prop('checked',true);	
		}else{
			$(".allChecked").prop('checked',false);		
		}
	})
});
//二级菜单
$(function() {
	//全选
	$(document).on("click",".allChecked1",function(){
		if($(this).prop('checked')){
			$(".oneChecked1").prop('checked',true);
		}else{
			$(".oneChecked1").prop('checked',false);
		}
	})
	//当tbody中的checkbox全部选中时，thead中的checkbox被选中，反之未被选中
	$(document).on("click",".oneChecked1",function(){
		var checkLength = $(".oneChecked1").length;
		var i = 0;
		$(".oneChecked:checked").each(function() {
			i++;
		});
		if(i == checkLength){
			$(".allChecked1").prop('checked',true);
		}else{
			$(".allChecked1").prop('checked',false);
		}
	})
});