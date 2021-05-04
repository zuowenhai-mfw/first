     	var reportApp = angular.module('center', ['ngTable','ui.bootstrap']).config(
			function($locationProvider){
				$locationProvider.html5Mode({
					enable:true,
					requireBase:false
				})
			}
		);

     	reportApp.directive('panelToggle', function() {
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
     	reportApp.directive('iboxToggle', function() {
     	    return {
     	        restrict: 'A',
     	        link: function($scope, element) {
     	            element.bind("click", function(){
     	                var o = $(this).closest("div.ibox"), e = $(this).find("i"), i = o.find("div.ibox-content");
     	                i.slideToggle(200),
     	                    e.toggleClass("fa-chevron-up").toggleClass("fa-chevron-down")
     	            })
     	        }
     	    }
     	});
     	
     	reportApp.directive('openTd', function() {
     	    return {
     	        restrict: 'A',
     	        link: function($scope, element) {
     	            element.bind("click", function(){
     	                $(this).next("tr").toggle();
     	                $(this).find("span").toggleClass("fa-plus-square-o").toggleClass("fa-minus-square-o")
     	            })
     	        }
     	    }
     	});
         // 获取列表service方法（统一使用）
     	reportApp.service('getDataListService', ["$q", "$http", "$log", function($q, $http, $log) {
     	    this.query = function(url, param) {
     	    	var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
     	        var promise = deferred.promise;       
     	    	var resPonsePromis = $http({method: 'POST', url: url, params:param});
     		    resPonsePromis.then(function(response) {
     		    	deferred.resolve(response.data);// 声明执行成功，即http请求数据成功，可以返回数据了
     		    });

     		    return promise;// 返回承诺，这里并不是最终数据，而是访问最终数据的API
     	    }
     	}]);
     	
     	//绿盟漏扫显示扫描结果详情
     	reportApp.controller('datalistCtrl', ['$scope','$location','getDataListService', 'NgTableParams',
     	    function($scope, $location, getDataListService, NgTableParams){
     		$scope.leakResultReport = [];
     		var urlParams = $location.url().replace("/","");
     		var resultCode = urlParams.split("#")[0];
     		var hostIp = urlParams.split("#")[1];
     		var params = {
     			resultCode : resultCode,
     			hostIp : hostIp
     		};
     		getDataListService.query("/socstrategy/showLeakTakResultReport",params).then(function(response){
     			$scope.leakResultReport["hostIp"] = response.hostIp;
     			$scope.leakResultReport["version"] = response.version;
     			$scope.leakResultReport["plug_version"] = response.plug_version;
     			$scope.leakResultReport["startTime"] = response.startTime;
     			$scope.leakResultReport["endTime"] = response.endTime;
     			$scope.leakResultReport["pluginTemplate"] = response.pluginTemplate;
     			$scope.leakResultReport["sysType"] = response.sysType;
     			$scope.leakResultReport["riskValue"] = response.riskValue;
     			$scope.leakResultReport["openServiceList"] = response.openServiceList;
     			$scope.leakResultReport["portInfoList"] = response.portInfoList;
     			$scope.leakResultReport["portBannerList"] = response.portBannerList;
     			$scope.leakResultReport["decAndRpcInfoList"] = response.decAndRpcInfoList;
     			$scope.leakResultReport["leakBasicInfoList"] = response.leakBasicInfoList;
     			$scope.leakResultReport["leakDetailInfoList"] = response.leakDetailInfoList;
     		});
     		
     	}]);
     	
     	//榕基漏扫显示扫描结果详情
     	reportApp.controller('dataRjlistCtrl', ['$scope','$location','getDataListService', 'NgTableParams',
     	                              	    function($scope, $location, getDataListService, NgTableParams){
          		$scope.leakResultReport = [];
          		var urlParams = $location.url().replace("/","");
          		var resultCode = urlParams.split("#")[0];
          		var hostIp = urlParams.split("#")[1];
          		var params = {
          			resultCode : resultCode,
          			hostIp : hostIp
          		};
          		getDataListService.query("/socstrategy/showLeakTakResultReport",params).then(function(response){
          			$scope.leakResultReport["hostIp"] = response.hostIp;
          			$scope.leakResultReport["hostName"] = response.hostName; //主机名
          			$scope.leakResultReport["workgroup"] = response.workgroup; //工作组
          			$scope.leakResultReport["startTime"] = response.startTime;
          			$scope.leakResultReport["endTime"] = response.endTime;
          			$scope.leakResultReport["osVersion"] = response.osVersion; //补丁集成包
          			$scope.leakResultReport["osName"] = response.osName; //操作系统名称

          			$scope.leakResultReport["leakBasicInfoList"] = response.leakBasicInfoList; // 端口信息
          			$scope.leakResultReport["leakDetailInfoList"] = response.leakDetailInfoList;

          			$scope.leakResultReport["hostUserInfoList"] = response.hostUserInfoList; //用户系统消息
          			$scope.leakResultReport["serverInfoList"] = response.serverInfoList;     //服务消息
          			$scope.leakResultReport["shareInfoList"] = response.shareInfoList;       //共享信息
          		});

          	}]);
     	
     	//兴安新漏扫显示扫描结果详情
     	reportApp.controller('dataXaNewlistCtrl', ['$scope','$location','getDataListService', 'NgTableParams',
     	                              	    function($scope, $location, getDataListService, NgTableParams){
          		$scope.leakResultReport = [];
          		var urlParams = $location.url().replace("/","");
          		var resultCode = urlParams.split("#")[0];
          		var hostIp = urlParams.split("#")[1];
          		var params = {
          			resultCode : resultCode,
          			hostIp : hostIp
          		};
          		getDataListService.query("/socstrategy/showLeakTakResultReport",params).then(function(response){
          			$scope.leakResultReport["hostIp"] = response.hostIp;
          			$scope.leakResultReport["hostName"] = response.hostName; //主机名
          			$scope.leakResultReport["startTime"] = response.startTime;
          			$scope.leakResultReport["endTime"] = response.endTime;
          			$scope.leakResultReport["vulnscount"] = response.vulnscount; 
          			$scope.leakResultReport["osName"] = response.osName; //操作系统名称
          			$scope.leakResultReport["leakBasicInfoList"] = response.leakBasicInfoList;
          			console.log("leakDetailInfoList=="+JSON.stringify(response.leakDetailInfoList))
          			$scope.leakResultReport["leakDetailInfoList"] = response.leakDetailInfoList; 
          		});

          	}]);

		//天境漏扫显示扫描结果详情
		reportApp.controller('dataTianjinglistCtrl', ['$scope','$location','getDataListService', 'NgTableParams','$uibModal',
			function($scope, $location, getDataListService, NgTableParams,$uibModal){
				$scope.leakResultReport = [];
				var urlParams = $location.url().replace("/","");
				var resultCode = urlParams.split("#")[0];
				var hostIp = urlParams.split("#")[1];
				var params = {
					resultCode : resultCode,
					hostIp : hostIp
				};
				getDataListService.query("/socstrategy/showLeakTakResultReport",params).then(function(response){
					console.log(response)
					$scope.leakResultReport["hostIp"] = response.hostIp;
					$scope.leakResultReport["hostName"] = response.hostName; //主机名
					$scope.leakResultReport["startTime"] = response.startTime;
					$scope.leakResultReport["endTime"] = response.endTime;
					$scope.leakResultReport["vulnscount"] = response.vulnscount;
					$scope.leakResultReport["osName"] = response.osName; //操作系统名称
					/*端口列表*/
					$scope.leakResultReport["serverInfoList"] = response.serverInfoList;

					/*漏洞列表*/
					$scope.leakResultReport["leakDetailInfoList"] = response.leakDetailInfoList;

					/*用户列表*/
					$scope.leakResultReport["hostUserInfoList"] =response.hostUserInfoList;
				});

				/*点击查看漏洞详情*/
				$scope.openleakDetail = function(obj){

					$uibModal.open({
						templateUrl : '/strategy/strategy/leak/safedev_leak_venus_tianjing/strategyLeakTianjingResult_leakDetail.html',
						controller :'TianjingleakDetailResultCtrl',
						backdrop :'static',
						size:'lg',
						resolve : {
							param : function() {
								return   angular.copy(obj);
							}
						}
					});
				}

			}]);
		//天境漏扫任务结果-->查看漏洞列表中漏洞的详情
		reportApp.controller('TianjingleakDetailResultCtrl', ['$scope', '$uibModalInstance','param',
			function($scope,$uibModalInstance, param) {
				console.log(param)
				$scope.leakDetail = param;

				// 点击关闭按钮，关闭模态框.
				$scope.cancel = function() {
					$uibModalInstance.dismiss('cancel');
				}

			}]);