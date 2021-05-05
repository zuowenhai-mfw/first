var app = angular.module('plmLogin', ['ui.bootstrap']);
/*app.directive("autofill", function(){
	return{
		require:'ngModel',
		link:function(scope, element, attrs, ngModel) {
			scope.$watch(function() {
				return element.val();
			},function(nv, ov) {
				if (nv !== ov) {
					ngModel.$setViewValue(nv);
				}
			});
		}
	}
});*/



/**
 * 登录确认
 */
app.controller('loginConfirmController', ['$scope', '$uibModalInstance', 'param',
    function ($scope, $uibModalInstance, param) {
        $scope.param = param;

        $scope.cancel = function () {
            $uibModalInstance.close(false);
        };

        $scope.login = function () {
            $uibModalInstance.close(true);
        }
    }
]);


app.controller('loginCtrl', function($scope, $http, $httpParamSerializer, $uibModal) {
	$scope.user = {};
    $scope.msg = "";

    $scope.userName;

	var key = CryptoJS.enc.Utf8.parse('o7H8uIM2O5qv65l2');//秘钥
	$scope.encryptKey = key;
    /**
     *	加密
     */
	function Encrypt(word){

		var srcs = CryptoJS.enc.Utf8.parse(word);

		var encrypted = CryptoJS.AES.encrypt(srcs, $scope.encryptKey, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});

		return encrypted.toString();

	}

	$http({
		method  : 'POST',
		url     : '/plmcore/getEncryptKey'
	}).success(function(res) {

		if (res.stateCode === 1) {
			$scope.encryptKey = CryptoJS.enc.Utf8.parse(res.data);//秘钥
		}
	});

    //超时时间
    $.ajax({
        url: '/plmcore/getSystemParam',
        type: 'post',
        data: {"name": "session_timeout"},
        dataType: "json",
        success: function (data) {
            sessionStorage.setItem("timeout", data.paramValue * 1000 * 60);
        }
    });


	$scope.login = function(forceLogin){
		var user = {
			username: $scope.user.username,
			password: Encrypt($scope.user.password),
			//rolename: $scope.user.rolename,
			forceLogin:forceLogin // 第一次是空的，强制登录的时候为true
		};
		$http({
			method  : 'POST',
			url     : '/plmcore/doUserLogin',
			data    : $httpParamSerializer(user),
			headers : {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(data) {
			//console.log(data)
			/*if(data.stateCode == 1){
                sessionStorage.setItem("username", data.data.userName);
                sessionStorage.setItem("roleType", data.data.roleType);
                localStorage.setItem("roleType", data.data.roleType);
                sessionStorage.setItem("sessionId", data.data.sessionId);
                location.href = data.uri + ".html";
			}else{
                $scope.msg = data.message
            }*/

            if (data.stateCode === 999) {
                $uibModal.open({
                    templateUrl: '/index/forceLoginConfirm.html',
                    controller: 'loginConfirmController',
                    size: 'md',
                    backdrop: 'static',
                    resolve: {
                        param: function () {
                            return {
                                username: user.username,
                                ip: data.message
                            };
                        }
                    }
                }).result.then(function (result) {
                    result && $scope.login("true");
                });
            } else if(data.stateCode === 1){
                sessionStorage.setItem("username", data.data.userName);
                sessionStorage.setItem("roleType", data.data.roleType);
                localStorage.setItem("roleType", data.data.roleType);
                sessionStorage.setItem("sessionId", data.data.sessionId);
                $scope.userName = data.data.userName;
                location.href = data.uri + ".html";
            } else if(data.stateCode === 0){
                //用户名密码错误
                $scope.msg = data.message
            }


		})
		/*location.href = "index.html";*/
	}
});
