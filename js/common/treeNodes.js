//部门树图节点
function getDeptData(){
	var zNodes = [
		{id:1, pId:0, name:"NSMS_2.11", open:true},
			{id:10, pId:1, name:"本级", open:true, checked:true},
				{id:101, pId:10, name:"KJ研发一部", open:true},
				{id:102, pId:10, name:"KJ研发二部", open:true},
				{id:103, pId:10, name:"KJ研发三部", open:true}
	];
	return zNodes;
}
//
function getAsstMove(){
	var zNodes = [
		{id:1, pId:0, name:"本级", open:true},
			{id:10, pId:1, name:"主机设备", open:true, checked:true},
			{id:11, pId:1, name:"安全设备", open:true},
			{id:12, pId:1, name:"网络设备", open:true},
			{id:13, pId:1, name:"待查设备", open:true},
			{id:14, pId:1, name:"其他设备", open:true}
	];
	return zNodes;
}

//部门树图节点单选框的情况
function getDeptSetting(){
	var setting = {
		view: {showIcon: true},
		data: {	simpleData: {enable: true}},
		check: {enable: true,chkStyle: "radio",radioType: "all"},
		callback: {onCheck: zTreeOnCheck}	
	};	
	return setting;
}

//系统树图节点
function getSystemTree(){
	var zNodes = [
		{id:1,pId:0,name:"NSMS",open:true},
			{id:10,pId:1,name:"NSMS_1.1",open:false},
			{id:11,pId:1,name:"NSMS_1.2",open:false},
			{id:12,pId:1,name:"NSMS_1.3",open:false}
	];
	return zNodes;
}





//运维管理中工单管理列表
function getmochaTree(){
	var zNodes = [
		{id:1,pId:0,name:"全部流程",open:true},
			{id:10,pId:1,name:"系统级联",open:false,title:"Cascade"},
			{id:12,pId:1,name:"系统入网",open:true,title:"System"},
			{id:13,pId:1,name:"设备入网",open:false,title:"Device"},
			{id:14,pId:1,name:"策略变更",open:false,title:"Asste"},
			{id:15,pId:1,name:"故障申告处置",open:false,title:"Fault"},
			{id:16,pId:1,name:"需求单",open:false,title:"Need"},
			/*{id:17,pId:1,name:"特征库升级",open:false,title:"Kuupgrade"},
			{id:18,pId:1,name:"安全防护软件升级",open:false,title:"upgrade"}*/
	];
	return zNodes;
}

