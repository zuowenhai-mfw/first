
/**
 * 校验用户输入的密码是否正确
 * user-pwd-validate
 */
app.directive('userPwdValidate', 
function($http) {
	return {		
		restrict:'A',		
        require: '?ngModel',
		link : function($scope, element, attrs, c) {
			$scope.$watch(attrs.ngModel, function(newValue, oldValue) {
				if (newValue !== oldValue && newValue !== undefined) {
					var password = newValue;
					var username = sessionStorage.getItem("username");
					$http({
						method : 'POST',
						timeout: 10000,
						url : '/plmcore/validateUserPwd',
                        params : {
							password : password,
							username : username
						}
					}).success(function(data) {
						// 该方法用于改变验证状态，以及在控制变化的验证标准时通知表格（validationErrorKey,isValid）
						c.$setValidity('userPwdUnique', data);
					});
				}
			});
		}
	}
});

/**
 * user-pwd-equal
 */
app.directive('userPwdEqual', 
function() {
	return {		
		restrict:'A',		
        require: '?ngModel',
		link : function($scope, element, attrs, c) {
			$scope.$watch(attrs.ngModel, function(newValue, oldValue) {
				if (newValue !== oldValue && newValue !== undefined) {
					var initialPwd = attrs.userPwdEqual;
					
					if (newValue === initialPwd) {
						c.$setValidity('pwdEqual', false);
					} else {
						c.$setValidity('pwdEqual', true);
					}
				}
			});
		}
	}
});

/**
 * 新密码和确认密码不能相同
 * user-pwd-unequal
 */
app.directive('userPwdUnequal', 
function() {
	return {		
		restrict:'A',		
		require: '?ngModel',
		link : function($scope, element, attrs, c) {
			//firstPassword是获取新密码的id
			var firstPassword = '#' + attrs.userPwdUnequal;  
			$(element).add(firstPassword).on('keyup', function () {  
				$scope.$apply(function () {  
					var data = element.val() === $(firstPassword).val();  
					c.$setValidity('pwdUnEqual',data);  
				});  
			});  
		}
	}
});

/**
 * 修改个人密码
 * userPwdController
 */
app.controller('userPwdController', ['$scope', 'username', 'ngTip', '$http', '$uibModalInstance','getDataListService',
function($scope, username, ngTip, $http, $uibModalInstance,getDataListService) {
	// 点击关闭按钮，关闭模态框.
	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	}
	
	var param = {
			"username" :username
	};
	// 同步调用getDataListService。获得接口，调用承诺api获取数据.resolve
	getDataListService.query("/plmcore/detailUser", param).then(function(res) {
		$scope.detailUser = res;
	});

	/**
	 *	加密
	 */
	var key = CryptoJS.enc.Utf8.parse('o7H8uIM2O5qv65l2');//秘钥

	$scope.encryptKey = key;
	function Encrypt(word){

		var srcs = CryptoJS.enc.Utf8.parse(word);

		var encrypted = CryptoJS.AES.encrypt(srcs, $scope.encryptKey, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});

		return encrypted.toString();

	}

	$http({
		method  : 'POST',
		url     : '/plmcore/getEncryptKey',
	}).success(function(res) {
		if (res.stateCode === 1) {
			$scope.encryptKey = CryptoJS.enc.Utf8.parse(res.data);//秘钥
		}
	});
	$scope.userPwd = {};
	// 修改密码后，点击确定按钮提交
	$scope.alterUserPwdForm = function() {
		$scope.userPwd["username"] = sessionStorage.getItem("username");
		$scope.userPwd["initialPwd"] = Encrypt($scope.userPwd.password);
		$scope.userPwd["newPwd"] = Encrypt($scope.userPwd.newPwd);
		$scope.userPwd["affirmPwd"] = Encrypt($scope.userPwd.affirmPwd);
		if ($scope.editPwdForm.$valid) {
			// 同步调用getDataListService。获得接口，调用承诺api获取数据.resolve
			$http({
				method  : 'POST',
				url     : '/plmcore/editUserPwd',
                params    : $scope.userPwd
			}).success(function(res) {

				console.log(res);

                if (res.stateCode == 1) {
                    ngTip.tip(res.message, "success");
                } else if (res.stateCode == 0) {
                    ngTip.tip(res.message, "warning");
                }
				$uibModalInstance.close('cancel');// 关闭模态框
			})
		}
		else {
			$scope.editPwdForm.submitted = true;
		}
	}
	
	}
]);
