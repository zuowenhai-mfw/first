// JavaScript Document
var app = angular.module('main', ['ngRoute','ngTable','ui.bootstrap', 'ngTip','angularFileUpload', 'angular-confirm']);
app.run([
    '$rootScope', '$http','$location', function ($rootScope, $http,$location) {
        $rootScope.systemType = sessionStorage.getItem("systemType");
        $rootScope.roleType = localStorage.getItem("roleType");
        var session_roleType = sessionStorage.getItem("roleType");
        /*var url;*/
        if($location.absUrl()){
            if(session_roleType != $rootScope.roleType){
                location.href = '/';
            }

        }
    }]);
app.config(['$routeProvider',function($routeProvider) {
	$routeProvider.when('/baseInform/hardwareplatform', {       //硬件平台发布
		templateUrl: 'baseInform/hardwareList/hardwareplatList.html'
	}).when('/baseInform/softwareplatform',{                    //软件平台发布
		templateUrl: 'baseInform/softwareList/softwareplatList.html'
	}).when('/baseInform/customersInformMaintenance',{          //客户信息维护
		templateUrl: 'baseInform/customersInformList/customersInformList.html'
	}).when('/lifeCycleManagement/contractOrder',{              //合同订单签订
		templateUrl: 'lifeCycleManagement/contractOrder/contractOrderList.html'
	}).when('/lifeCycleManagement/hardwareProchase',{           //硬件平台采购
		templateUrl: 'lifeCycleManagement/hardwareProchase/hardwareProchaseList.html'
	}).when('/lifeCycleManagement/LicenseMake',{           //自研产品组装 --> License制作
		templateUrl: 'lifeCycleManagement/license/licenseMake/licenseMake.html'
	}).when('/lifeCycleManagement/UTMMake',{           //自研产品组装 --> utm制作
		templateUrl: 'lifeCycleManagement/license/license_utm_des/license_utm_des.html'
	}).when('/lifeCycleManagement/productDelivery',{            //产品交付发货
		templateUrl: 'lifeCycleManagement/productDelivery/productDeliveryList.html'
	}).when('/lifeCycleManagement/productService',{            //产品安装售后
		templateUrl: 'lifeCycleManagement/productService/productServiceList.html'
	}).when('/dataQuery/dataQueryList',{            //数据查询
        templateUrl: 'dataQuery/dataQueryList.html'
    }).when('/systemMessage/systemMessageList',{    //系统消息
		templateUrl: 'systemMessage/systemMessageList.html'
	}).when('/systemManage/userManage',{            //用户管理
        templateUrl: 'systemManage/userManage/userList.html'
    }).when('/systemManage/businessUserManage',{            //业务用户管理
		templateUrl: 'systemManage/businessUserManage/businessUserList.html'
	}).otherwise({
		//redirectTo: '/dataQuery/dataQueryList'
	});
}]);


/*$("#userLogout").click(function () {
    $.post('/plmcore/logout', function () {
        sessionStorage.clear();
        location.href = '/loginPwd.html';
    });
});*/




//获取当前时间
app.directive('myCurrentTime', function($timeout, dateFilter){
	return function(scope, element, attrs){
		var format, timeoutld;
		function updateTime(){
			element.text(dateFilter(new Date(), format));
		}
		scope.$watch(attrs.myCurrentTime, function(value){
			format = value;
			updateTime();
		})
		function updateLater(){
			timeoutld = $timeout(function(){
				updateTime();
				updateLater();
			}, 1000);
		}
		element.bind('$destroy', function(){
			$timeout.cancel(timeoutld);
		});
		updateLater();
	}
})

var dayNames = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
var day = dayNames[new Date().getDay()]

app.controller('timeController', function($scope){
	$scope.format = 'yyyy-MM-dd HH:mm:ss' + ' ' + day
})


//数据列表服务
app.service('getDataService', ["$q", "$http", function($q, $http){
    this.query = function(url, params) {
    	var deferred = $q.defer();
        var promise = deferred.promise;
    	var resPonsePromis = $http.get(url);
	    resPonsePromis.then(function(response) {
	    	deferred.resolve(response.data);			
	    });
	    return promise;
    };
}]);
//根据屏幕的高度自适应显示列表的列数
app.factory('$screenFactory', function(){
	return{
		screenSize:function(){
			var size, tableTopH;
			
			var otherHeight = $(".otherHeight").height();
			if(otherHeight == null){ otherHeight = 0;}
			var tableTop = $(".tableTop").height();
			if(tableTop == null){ tableTop = 0;}
			var mainH = $("#content-main").height();//主体部分高度
			var tableH = mainH - otherHeight - tableTopH - 145;//table高度
			var tbodyH = tableH - 38;//table tbody高度
			if (tbodyH/38 <= 10) {
				size = 10;
			} else {
				size = 25;
			}
			return size;
		}
	}
})

//tab标签页有新的标签页打开之间的切换
app.directive('tabClick', function(){
	return {
		restrict: 'A',
		link: function($scope){
			$scope.day_li = $("#patchTabs li:eq(1)");
			$scope.day_li.hide();
			$scope.Tabopen = function(){
				$scope.day_li.show().addClass('active');
				$scope.day_li.siblings().removeClass('active');
				$("#towmassage").addClass('active');
				$("#massage").removeClass('active');
			}

			$("#patchTabs .fa-times-circle").click(function(){
				$(this).parents('li').hide();
				$scope.li_state = $(this).parents('li').attr('class');
				if($scope.li_state == ""){
					return false;
				}else{
					$scope.day_li.siblings().addClass('active');
					$("#massage").addClass('active');
					$("#towmassage").removeClass('active');
				}
			})
		}
	}
})

//点击input框下拉列表的显示与隐藏
app.directive('inputClick', function(){
	return {
		restrict: 'A',
		link: function($scope, element){
			$(".input_tree").hide();
			element.bind("click",function(e){
				e.stopPropagation();
				var id = $(this).next().attr('id');
				$(".input_tree").hide();
				$("#"+id).show();
				$(document).click(function(e){
					if(e.target.tagName!='BUTTON' && e.target.tagName!='SPAN'){
						$(".input_tree").hide();
					}
				});
			})
		}
	}
})


//根据屏幕尺寸大小展示不同列表数服务
app.factory('ngTableCountFactory', function() {
    // 每页显示数目
    var count, tableTopH;
    // 根据屏幕尺寸大小来判断当前需要展示多少条数据
    function getNgTableCount() {
        var otherHeight = $(".otherHeight").height();
        if(otherHeight == null){ otherHeight = 0;}
        var tableTop = $(".tableTop").height();
        if(tableTop == null){ tableTop = 0;}
        var mainH = $("#content-main").height();//主体部分高度
        var tableH = mainH - otherHeight - tableTopH - 145;//table高度
        var tbodyH = tableH - 38;//table tbody高度
        if (tbodyH/38 <= 10) {
            count = 10;
        } else {
            count = 25;
        }
        return count;
    }

    return {
        getNgTableCount : getNgTableCount
    }
});

// 获取列表service方法（统一使用）
app.service('getDataListService', ["$q", "$http", "$log", function($q, $http, $log) {
    this.query = function(url, param) {
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        var resPonsePromis = $http({method: 'post', url: url, params:param});
        resPonsePromis.then(function(response) {
            deferred.resolve(response.data);// 声明执行成功，即http请求数据成功，可以返回数据了
        });

        return promise;// 返回承诺，这里并不是最终数据，而是访问最终数据的API
    }
}]);

app.controller('centerCtrl',['$rootScope', '$scope', '$uibModal', '$http', 'getDataListService',
	function($rootScope, $scope, $uibModal, $http, getDataListService) {
	//树图的点击事件
	$scope.$on('nodeClick', function(params, treeNode) { 
        $scope.$broadcast('dataReload', treeNode);
    });

	$scope.userName = sessionStorage.getItem("username");

    $scope.loginOut = function(){
        $.post('/plmcore/logout', function () {
            location.href = '/';
            sessionStorage.clear();
        });
	}



    // 修改用户名密码
    $scope.editUserPwd = function() {
        var username = sessionStorage.getItem("username");
        // 打开模态框，跳转到修改个人资料页面。
        $uibModal.open({
            templateUrl : '/index/userPasswordEdit.html',
            controller  : 'userPwdController',
            backdrop    : 'static',
            resolve     : {
                username: function() {
                    return username;
                }
            }
        });
    };

	
	//打开模态框
	$scope.open = function(url,size){		
		var uibModalInstance = $uibModal.open({
			templateUrl : url, 
			controller : 'ModalInstanceCtrl',
			size : size,
			backdrop : 'static'
		});
	}

	//打开系统消息提示
	$scope.systemMessageInfo = '2';
	$scope.opensystemInformation = function(){
		$uibModal.open({
			templateUrl : 'index/index_systemInformation.html',
			controller : 'indexSystemCtrl',
			backdrop : 'static'
		});
		$scope.systemMessageInfo = '';
		var o = $("#systemMessageTab").closest("div.panel-success");
		o.removeClass("active")
	}


	//打开系统消息提示
	$scope.systemMessageInfo = {}

	// 页面初始化查询系统消息查看系统消息
	function sysMessage() {
		$http({
			method: 'POST',
			url: '/plmcore/getNotifMessage'
		}).success(function (res) {
			$scope.systemMessageInfo.count = res;
		});
	}

	sysMessage()
	setInterval(function () {
		sysMessage()
	}, 10000000);

	
	$scope.selectNum = 0;//已选数量
	//单选
	/*$scope.changeCurrent = function (current, $event, data) {
		$scope.selectNum += current.checked ? 1 : -1;
		$scope.selectAll = $scope.selectNum === data.length;
		$event.stopPropagation();
	}*/
	//全选
	$scope.selectAll = {value:""};
	$scope.changeAll = function (data) {
		angular.forEach(data, function (item) {
			item.checked = $scope.selectAll.value;
		});
		$scope.selectNum = $scope.selectAll.value ? data.length : 0;
	}
	//单击行选中
	$scope.changeCurrents = function (current, $event, data) {
		var type = $event.target.type;
		if(type != 'checkbox') {
			if(current.checked == undefined) {
				current.checked = true;	
			} else {
				current.checked = !current.checked;	
			}			
			//$scope.changeCurrent(current, $event, data);		
		}
		$scope.selectNum += current.checked ? 1 : -1;
		$scope.selectAll.value = $scope.selectNum === data.length;
	}
}]);

//跳转页面
app.directive('skipCtrl', function(){
	return{
		restrict: 'A',
		link: function($scope, element){
			element.bind("click",function(){
				var hf = $(this).attr("href"), name = $(this).attr("name") , k = true;
				$(".J_menuTab").each(function(){
					if($(this).data("id")==hf){
						if(!$(this).hasClass("active")){
							$(this).addClass("active").siblings(".J_menuTab").removeClass("active");
						}
						$(this)[0].innerHTML = name +'<i class="fa fa-times-circle"></i>'
						k = false;
						return false;
					}
				})
				if(k){
					var pp="<a href="+hf+" class='active J_menuTab' data-id="+hf+">"+ name + "<i class='fa fa-times-circle'></i></a>";
					$(".J_menuTab").removeClass("active");
					$(".J_menuTabs .page-tabs-content").append(pp);
				}
			})
		}
	}
})


//表单验证--失去焦点时进行验证
app.directive('validateForm', function(){
	return {
		restrict: 'A',
		link: function($scope, element, ctrl){
			element.bind('blur', function () {
				//console.log("失去焦点");
			}).bind('focus', function () {
				$(this).next("span").remove();
			});
		}
	}
});



//列表左侧树状图
app.directive('zTree', ['$timeout',	function($timeout) {
	return {
		restrict: 'A',
		link: function($scope, element, attrs) {
			$timeout(function(){
				var setting = {
					data: {
						//key: {title: "t"},
						simpleData: {
							enable: true
						}
					},
					view: {
						showLine: false,
						showIcon : true,
						dblClickExpand: false,
						addDiyDom: function(treeId, treeNode) {
							var spaceWidth = 5;
							var switchObj = $("#" + treeNode.tId + "_switch"),
							icoObj = $("#" + treeNode.tId + "_ico");
							switchObj.remove();
							icoObj.before(switchObj);
							
							var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+ "px'></span>";
							switchObj.before(spaceStr);	
						}
					},
					callback : {							
						onClick : function(event, treeId, treeNode){
							$scope.$apply(function () {
								$scope.$emit('nodeClick', treeNode);
							});
						},
						//单击展开/折叠节点
						beforeClick: function(treeId, treeNode) {
							var zTree = $.fn.zTree.getZTreeObj(treeId);
							zTree.expandNode(treeNode);
						}
					}
				};
				$.fn.zTree.init(element, setting, $scope[attrs.zNodes]);
				/*element.addClass("showIcon");	*/
				$(".btn-toolbar .fa-plus").parent('a').addClass('disabled');
				$(".btn-toolbar .fa-remove").parent('a').addClass('disabled');
				$(".btn-toolbar .fa-edit").parent('a').addClass('disabled');


			});

			var ztree_height = $(window).height();
			$('.mailbox-content').css('max-height',ztree_height).css('overflow','auto')
		}
	}
}]);
//单选框树状图
app.directive('radioZtree', ['$timeout', function($timeout) {
	return {
		restrict: 'A',
		link: function($scope, element, attrs) {
			$timeout(function(){
				var setting = {
						data: {simpleData: {enable: true}},
						check: {enable: true,chkStyle: "radio",radioType: "all"},
						callback : {onCheck : function(event, treeId, treeNode){
							var treeObj = $.fn.zTree.getZTreeObj(treeId);
							var node = treeObj.getNodeByParam("id", 1, null);
							var nodes = treeObj.getCheckedNodes(true);
							node.chkDisabled = true;
							var str=''
							if(nodes.length=='0'){
								str=''
							}else{
								str += treeNode.name
							}
							$("input[name='choice_" + treeId + "']").val(str);
						}
					}
				};
				$.fn.zTree.init(element, setting, $scope[attrs.zNodes]);
			});
		}
	}
}]);
//input checkbox多选，父节点和子节点都显示
app.directive('checkedShowTotal', ['$timeout', function($timeout) {
	return {
		restrict: 'A',
		link: function($scope, element, attrs) {
			$timeout(function(){
				var setting = {
					data: {simpleData: {enable: true}},
					check: {enable: true,chkStyle: "checkbox"},
					callback : {
						onCheck : function(event, treeId, treeNode){
							var treeObj = $.fn.zTree.getZTreeObj(treeId);
							var nodes = treeObj.getCheckedNodes(true);
							var html = "";
							if(nodes.length == 0){
								html = "";
							}else{
								for(var i=0; i<nodes.length; i++){
									html += "<p>" + nodes[i].name + "</p>";
								}
							}
							$("#" + treeId + "text").html(html);
						}
					}
				};
				$.fn.zTree.init(element, setting, $scope[attrs.zNodes]);
			});
		}
	}
}]);
//input checkbox多选，只显示子节点
app.directive('checkedShowChild', ['$timeout', function($timeout) {
	return {
		restrict: 'A',
		link: function($scope, element, attrs) {
			$scope.checkedNumber = 0;
			$timeout(function(){
				var setting = {
					data: {simpleData: {enable: true}},
					check: {enable: true,chkStyle: "checkbox"},
					callback : {
						onCheck : function(event, treeId, treeNode){
							var treeObjType = $.fn.zTree.getZTreeObj(treeId);
							var nodes = treeObjType.getCheckedNodes(true);

							var str = "";
							if(nodes.length == "0"){
								str = "";
							}else{
								for(var i=0; i<nodes.length; i++){
									if(!nodes[i].isParent) {
										$scope.checkedNumber ++;	
										str += "<p>" + nodes[i].name + "<i class='fa fa-trash' style='float:right;cursor:pointer;'></i></p>";
									}
								}
							}
							//str = str.substring(0, str.length - 1);
							$("#" + treeId + "text").html(str);
						}
					}
				};
				$.fn.zTree.init(element, setting, $scope[attrs.zNodes]);
			});
		}
	}
}]);
//input框里面的树状图
app.directive('inchkZtree', ['$timeout',
	function($timeout) {
		return {
			restrict: 'A',
			link: function($scope, element, attrs) {
				$scope.checkedNumber = 0;
				$timeout(function(){
					var setting = {
						data: {simpleData: {enable: true}},
						check: {enable: true,chkStyle: "checkbox",chkboxType: {"Y":"s","N":"s"}},
						callback : {
							onCheck : function(event, treeId, treeNode){
								var treeObjType = $.fn.zTree.getZTreeObj(treeId);
								var nodes = treeObjType.getCheckedNodes(true);

								var str = "";
								if(nodes.length == "0"){
									str = "";
								}else{
									for(var i=0; i<nodes.length; i++){
										if(!nodes[i].isParent) {
											$scope.checkedNumber ++;
											str += nodes[i].name + ",";
										}
									}
								}
								str = str.substring(0, str.length - 1);
								$("input[name='choice_" + treeId + "']").val(str);
							}
						}
					};
					$.fn.zTree.init(element, setting, $scope[attrs.zNodes]);
				});
			}
		}
	}
]);
//input框里面的父级与子级分开
app.directive('inchkSplitZtree', ['$timeout',
	function($timeout) {
		return {
			restrict: 'A',
			link: function($scope, element, attrs) {
				$scope.checkedNumber = 0;
				$timeout(function(){
					var setting = {
						data: {simpleData: {enable: true}},
						check: {enable: true,chkStyle: "checkbox",chkboxType: {"Y":"ps","N":"ps"}},
						callback : {
							onCheck : function(event, treeId, treeNode){
								var treeObjType = $.fn.zTree.getZTreeObj(treeId);
								var nodes = treeObjType.getCheckedNodes(true);

								var str = "";
								if(nodes.length == "0"){
									str = "";
								}else{
									for(var i=0; i<nodes.length; i++){
										if(!nodes[i].isParent) {
											$scope.checkedNumber ++;
											str += nodes[i].name + ",";
										}
									}
								}
								str = str.substring(0, str.length - 1);
								$("input[name='choice_" + treeId + "']").val(str);
							}
						}
					};
					$.fn.zTree.init(element, setting, $scope[attrs.zNodes]);
				});
			}
		}
	}
]);
//面板展开收缩操作
app.directive('panelToggle', function() {
	return {
		restrict: 'A',
		link: function($scope, element) {
			element.bind("click", function(){
				var o = $(this).closest("div.panel-default"), e = $(this).find("i"), i = o.find("div.panel-collapse");
				i.slideToggle(200),
				e.toggleClass("fa-chevron-up").toggleClass("fa-chevron-down")
			})
		}
	}
});


//下拉框搜索
app.directive('selectQuery', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            // 初始化
            var tagName = element[0].tagName,
                config = {
                    allowClear: true,
                    multiple: !!attrs.multiple,
                    placeholder: attrs.placeholder || ' '
                };

            // 生成select
            if(tagName === 'SELECT') {
                // 初始化
                var $element = $(element);
                delete config.multiple;
                $element.prepend('<option value=""></option>').val('').select2(config);
            }
        }
    }
});


//列表中的操作下拉按钮
app.directive('myOperation', function() {
	return {
		restrict: 'A',
		link: function($scope, element, attrs) {
			element.on("click", function(e){
				//$(".operation_content").hide();
				$(this).next().toggle();
				$(this).parents("tr").siblings().find(".operation_content").hide();
			})
		}
	}
});

//有关左移右移的数据过滤
app.filter("myfilter", function(){
	return function(collection, direction){
		var out = [];
		angular.forEach(collection, function(item){
			if(item.direction == direction){
				out.push(item);
			}
		});
		return out;
	}
});


//加载添加界面时间控件指令
app.directive('defLaydate', function () {
	return {
		restrict: 'A',
		require: '?ngModel',
		scope:{
			ngModel:'='
		},
		link: function ($scope, $element, $attrs,ngModel) {
			var timeout;
			if (timeout) {
				clearTimeout(timeout);
			}
			timeout = setTimeout(function () {
				$scope.$apply(initEventDate);
			}, 1000)

			function testDate(number){
				if(isNaN(number) && !isNaN(Date.parse(number))){
					return number
				}else{
					return Number(number)
				}
			}
			function initEventDate() {
				var _date = null, _config = {};
				if(!$attrs.id){
					$element.attr('id', '_laydate' + (Date.now()));
				}

				/*初始化参数*/
				_config = {
					elem: "#" + $attrs.id,  //id
					type:$attrs.datetype,   //时间类型：year 、month 、date 、time 、datetime
					range:$attrs.range,     //开启左右面板范围选择，默认‘-’或者‘～’
					min:$attrs.mindate = $attrs.mindate == undefined ? '1900-01-01 00:00:00' : testDate($attrs.mindate),      //最小范围
					max:$attrs.maxdate = $attrs.maxdate == undefined ? '2200-01-01 00:00:00' : testDate($attrs.maxdate),      //最大范围
					theme:$attrs.theme,
					done:function(value,date,endDate){   //选择完毕后的回调函数
						ngModel.$setViewValue(value);
					}
				};
				/*初始化*/
				_date = laydate.render(_config);
				/*模型值同步到视图上*/
				ngModel.$render = function(){
					$element.val(ngModel.$viewValue || '')
				}
			}
			/*销毁控件*/
			function destroy(id){
				var elem = $('#'+id);
				var key = elem.attr('lay-key')
				if(key){
					//如果打开着就给关闭掉
					$('#layui-laydate'+key).remove();
				}
				//复制当前节点
				/*var nodeClone = elem.clone(true);*/
				//替换节点，去掉lay-key的值，方便后面重新render
				/*elem.replaceWith(nodeClone.attr('lay-key',null))*/
			}
			$scope.$on('$destroy', function () {
				console.log('销毁加载...');
				destroy($attrs.id)
			});
		}
	}
});