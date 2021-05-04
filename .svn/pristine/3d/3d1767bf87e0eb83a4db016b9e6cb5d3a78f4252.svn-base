// JavaScript Document
//该组件依赖ztree控件
//下拉列表显示框
//结果显示框
function TreeList(contentId,listWidth,listHeight,resWidth,resHeight){
	this.contentId = contentId;
	this.listWidth=typeof(listWidth)=='undefined'?200:listWidth;
	this.listHeight=typeof(listHeight)=='undefined'?300:listHeight;
	this.resWidth = typeof(resWidth)=='undefined'?300:resWidth;
	this.resHeight=typeof(resHeight)=='undefined'?150:resHeight;
	this.listHeight = this.resHeight - 10;
	this.initModel();
	this.data = [];
}

//返回树图下拉表ID
TreeList.prototype.getTreeId = function(){
	return this.contentId + "-tree";
}

//初始化组件模型元素，选择按钮、下拉列表框、结果显示框
TreeList.prototype.initModel = function(){
	var select_btn_html = "<div style='float:left; position:relative;'><button onclick= showTreeOptions('" + this.contentId + "',this,event) class='btn_select'><i class='fa fa-caret-down'></i>&nbsp;选择</button></div>";
	$("#" + this.contentId).append($(select_btn_html));
	var result_html = "<div style='width:" + this.resWidth+"px; height:" + this.resHeight+"px; border:1px solid #ccc; border-radius: 4px; box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.075) inset; float:left; background-color:#fff; overflow:auto; margin-left:2px;' id='" + this.contentId+"-result'><table id='" + this.contentId+"-result-table'></table></div>";
	$("#" + this.contentId).append($(result_html));
	var tree_html = "<div style='width:" + this.listWidth+ "px; height:" + this.listHeight+"px; border:1px solid #ccc; border-radius: 4px; box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.075) inset; background-color:#fff; position:absolute; display:none; overflow:auto;' id='" + this.contentId+"-tree' class='ztree'></div>";
	$("#" + this.contentId).append($(tree_html));
}

function showTreeOptions(contentId,This,evt){
	evt.stopPropagation();
	$("#" + contentId + "-tree").css({top:0}).show();
	var paddingleft = $(This).css('padding-left').replace('px','');
	var mw = $("#" + contentId + "-tree").width() - paddingleft - 25;
	$("#" + contentId + "-result").animate({marginLeft:mw + 'px'},100);
	$(This).parent().append($("#" + contentId + "-tree"));
	
	$(document).click(function(e){
		$("#" + contentId + "-tree").hide();
		$("#" + contentId + "-result").animate({marginLeft:'2px'},100);
	});
	$("#" + contentId + "-tree,#" + contentId + "-result").click(function(e){e.stopPropagation();});

}

//设置显示结果的数据
TreeList.prototype.setData = function(nodes){
	this.data = nodes;
}

//在结果窗口里显示选中结果
TreeList.prototype.showResult = function(){
	$("#" + this.contentId + "-result-table").empty();
	for(var i=0;i<this.data.length;i++){
		var node = this.data[i];
		var path = recursionParentNode(node.pId,this.contentId + "-tree") + '/' + node.name;
		var path_temp = '';
		var len = path.length;
		//if(len>50)path_temp = path.substring(0,50);
		//var html = "<tr title='" + path+"'><td nowrap='nowrap'>" + path+"</td><td align='right'><img src='../images/icon/btn/delete.png' style='cursor:pointer' onclick=removeData('" + node.id +  "','" + this.contentId+ "-tree"+ "',this)></td></tr>";
		var html = "<tr title='" + path+"'><td nowrap='nowrap'>" + path+"</td><td align='right'><a style='cursor:pointer' onclick=removeData('" + node.id +  "','" + this.contentId+ "-tree"+ "',this)><span style='margin:5px;' class='fa fa-remove'></span></a></td></tr>";
		$("#" + this.contentId + "-result-table").append($(html));
	}
}


function recursionParentNode(pId,treeId){
	var path='';
	var treeObj = $.fn.zTree.getZTreeObj(treeId);
	var sNodes = treeObj.transformToArray(treeObj.getNodes());
	for(var i=0;i<sNodes.length;i++){
		var sn = sNodes[i];
		if(sn.id==pId){
			path += recursionParentNode(sn.pId,treeId) + "/" + sn.name  ;
			
		}
	}	
	return path;
}

function removeData(nodeId,treeId,This){
	$(This).parent('td').parent('tr').remove();
	var treeObj = $.fn.zTree.getZTreeObj(treeId);
	var nodes = treeObj.getCheckedNodes(true);
	for(var i=0;i<nodes.length;i++){
		var node = nodes[i];
		if(node.id==nodeId){
			treeObj.checkNode(node, false,true, true);
		}
	}
}






