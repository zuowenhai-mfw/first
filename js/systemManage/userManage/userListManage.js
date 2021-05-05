//用户信息维护
app.controller('userListCtrl',  function($scope,NgTableParams, getDataService,$screenFactory,$confirm, ngTip,$uibModal,$http,$compile) {


    $scope.options = [];
    $scope.events = [];
    $("#userList").bootstrapTable({
        url: "/plmcore/userList",
        showRefresh: false,
        pageNumber: 1,
        pagination: true,
        sidePagination: 'server',
        pageSize: 10,
        pageList:[10,25,50,100],
        showToggle: false,
        showColumns: false,
        signleSelect: true,
        search:true,
        iconSize: "outline",
        toolbar: "#toolbar",
        queryParams:function queryParams(params){
            var keyword = params.search;
            if(keyword!== undefined){

            }else{
                keyword = "";
            }
            var param = {
                "pageNo":params.offset / params.limit + 1,
                "pageSize":params.limit,
                "keyword": keyword
            }
            return param;
        },
        columns: [
            {checkbox: true},
            {field: 'id', title: 'id',visible: false},
            {field: 'userName', title: '用户名'},
            {field: 'realName', title: '真实姓名'},
            {field: 'gendar', title: '性别'},
            {field: 'loginTime', title: '登录时间'},
            {field: 'phone', title: '座机号'},
            {field: 'mobile', title: '手机号'},
            {field: 'remark', title: '备注'},
            {field: 'operate', title: '操作', formatter: function(value,row,index){
                var rtn = "<div id='option_"+index+"'></div>"
                var event= '<span title="编辑" ng-click="editUser('+row.id+')"><a class="fa fa-edit"></a></span> &nbsp;'

                $scope.options.push("option_"+index)
                $scope.events.push(event)
                return rtn
            }}
        ],
        onLoadSuccess:function(){
            /*for(var i=0;i<$scope.options.length;i++){
                var _option = $scope.options[i]
                var _event = $scope.events[i];
                var $el = $(_event).appendTo('#'+_option)
                $compile($el)($scope)
            }*/


            for(var i=0;i<$scope.options.length;i++){
                var _option = $scope.options[i]
                var _event = $scope.events[i];
                $('#'+_option).empty();
                var $el = $(_event).appendTo('#'+_option);
                $compile($el)($scope);
            }



        }
    });

    //打开编辑页面
    $scope.editUser = function(obj){
        $uibModal.open({
            templateUrl : 'systemManage/userManage/userEdit.html',
            controller :'addOrEditUserCtrl',
            backdrop :'static',
            size : 'lg',
            resolve : {
                param : function() {
                    return   angular.copy(obj);
                }
            }
        });
    }

    //打开新增页面
    $scope.addOrEditUser = function(obj){
        $uibModal.open({
            templateUrl : 'systemManage/userManage/userAdd.html',
            controller :'addOrEditUserCtrl',
            backdrop :'static',
            size : 'lg',
            resolve : {
                param : function() {
                    return   angular.copy(obj);
                }
            }
        });
    }

    //删除用户
    $scope.delUserList = function(){
        var checkId = [];
        var dataType = [];
        var rows = $("#userList").bootstrapTable('getSelections');
        for(var i=0;i<rows.length;i++){
            checkId.push(rows[i].id);
        }
        //判断选择的用户是否有内置用户
        for(var i=0;i<rows.length;i++){
            //dataType.push(rows[i].dataType);
            if(rows[i].dataType == "1"){
                ngTip.tip("默认内置用户不能删除！", "warning");
                return;
            }
        }
        if(rows.length == 0){
            ngTip.tip("请选择要删除的数据！", "warning");
        }/*else if(rows.length>1){
            ngTip.tip("不能批量删除用户，只能单个删除！", "warning");
        }*/else{
            $confirm({text: "删除的数据无法恢复，您确认删除吗？", title: "删除数据", ok: "是", cancel: "否"})
                .then(function () {
                    $http({
                        method: 'post',
                        url: '/plmcore/delUser',
                        params: {
                            checkId: checkId.join(",")
                        }
                    }).success(function (response) {
                        if(response.stateCode == '1'){
                            ngTip.tip(response.message, "success");
                        }else{
                            ngTip.tip(response.message, "warning");
                        }
                        //$("#userList").bootstrapTable('refresh')
                        var time = setTimeout(function(){
                            var index = parent.layer.getFrameIndex(window.name);
                            parent.location.reload();
                            parent.layer.close(index);
                        },1000);
                    });
                });
        }
    }


    //删除列表
    $scope.delCustomersInfoList = function(){
        var checkId = [];
        var rows = $("#customersInformList").bootstrapTable('getSelections');
        for(var i=0;i<rows.length;i++){
            checkId.push(rows[i].id);
        }
        if(rows.length == 0){
            ngTip.tip("请选择要删除的数据！", "warning");
        }else{

            $confirm({text: "删除的数据无法恢复，您确认删除吗？", title: "删除数据", ok: "是", cancel: "否"})
                .then(function () {
                    $http({
                        method: 'post',
                        url: '/plmcore/deleteCustomersInformMaintenance',
                        params: {
                            checkId: checkId.join(",")
                        }
                    }).success(function (response) {
                        if(response.stateCode == '1'){
                            ngTip.tip(response.message, "success");
                        }else{
                            ngTip.tip(response.message, "warning");
                        }
                        $("#customersInformList").bootstrapTable('refresh');
                    });
                });
        }
    }

});


/**
 *校验新增用户名唯一的指令。
 */
app.directive('usernameEnsureUnique',
    function ($http,ngTip) {
        return {
            restrict: 'EA',
            require: '?ngModel',
            link: function ($scope, element, attrs, c) {
                $scope.$watch(attrs.ngModel, function () {
                    var username = $scope.addUser.username;
                    if ($scope.addUser.username !== undefined) {
                        $http({
                            method: 'POST',
                            timeout: 10000,
                            url: '/plmcore/validateUserName',
                            params: {
                                username: username
                            }
                        }).success(function (data) {
                            // 该方法用于改变验证状态，以及在控制变化的验证标准时通知表格（validationErrorKey,isValid）
                            c.$setValidity('userUnique', data);
                        }).error(function () {
                            c.$setValidity('unique', false);
                            ngTip.tip("网络不通请关闭窗口重试");
                        });
                    }else{
                        c.$setValidity('userUnique', true);
                    }

                });
            }
        }
    });


/*点击编辑或者新增的模态框*/
app.controller('addOrEditUserCtrl',function($rootScope,$scope,$uibModalInstance,ngTip,param,$http){
    //关闭按钮
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }

    $scope.addUser = {};
    $scope.customerInfoMaintain = {};
    $scope.customerInfoMaintain.id = 0;
    $scope.title = '新增';
    if(param != undefined){
        $scope.title = '编辑';
        $scope.addUser.id = param;
        $http({
            url:'/plmcore/getUserById',
            method :'POST',
            params: {
                id: $scope.addUser.id
            }
        }).success(function(res){
            $scope.addUser = res;
        }).error(function () {
            ngTip.tip("网络不通请关闭窗口重试");
        });
    }else{
        $scope.title = '新增';
    }


    $http({
        method: "POST",
        url: "/plmcore/roleList"
    }).success(function (res) {
        $scope.user_role_add = res;
    }).error(function () {
        ngTip.tip("网络不通请关闭窗口重试");
    });


    // 点击关闭按钮，关闭模态框.
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.addUser = {};
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
    }).error(function () {
        ngTip.tip("网络不通请关闭窗口重试");
    });

    $scope.addUserInfoForm = function () {
        // 防止表单多次点击重复提交
        $scope.addUser["password"] = Encrypt($scope.addUser.password);
        $scope.addUser["repeatPwd"] = Encrypt($scope.addUser.repeatPwd);

        // 如果角色名称没有选中的话，不让用户提交
        if (null != $scope.addUser.roleName) {
            if (!$scope.addUserForm.$submitted) {
                $scope.addUserForm.$submitted = true;
                // 同步调用getUserDataService。获得接口，调用承诺api获取数据.resolve
                $uibModalInstance.close('cancel');// 关闭模态框
                /*getDataListService.query("/soccore/saveUser", $scope.addUser).then(function (res) {
                    ngTip.tip(res, "success");
                    $rootScope.$broadcast('userTableRefresh');// 刷新页面
                });*/
                $http({
                    method: "POST",
                    url: "/plmcore/saveUser",
                    params: {
                        username: $scope.addUser.username,
                        password: $scope.addUser.password,
                        realName: $scope.addUser.realName,
                        userGendar: $scope.addUser.userGendar,
                        phone: $scope.addUser.phone,
                        mobile: $scope.addUser.mobile,
                        email: $scope.addUser.email,
                        remark: $scope.addUser.remark,
                        roleName: $scope.addUser.roleName
                    }
                }).success(function (res) {
                    ngTip.tip(res);
                    //$rootScope.$broadcast('userTableRefresh');// 刷新页面
                    var time = setTimeout(function(){
                        var index = parent.layer.getFrameIndex(window.name);
                        parent.location.reload();
                        parent.layer.close(index);
                    },1000);
                })

            }
        } else {
            ngTip.tip("请为用户选择对应角色", "warning");
            $scope.addUserForm.$submitted = false;
            $scope.addUserForm.$invalid = true;
        }

    }

    $scope.editUserInfoForm = function () {

        // 如果角色名称没有选中的话，不让用户提交
        if (null != $scope.addUser.roleName) {
            if (!$scope.addUserForm.$submitted) {
                $scope.addUserForm.$submitted = true;
                // 同步调用getUserDataService。获得接口，调用承诺api获取数据.resolve
                $uibModalInstance.close('cancel');// 关闭模态框
                $http({
                    method: "POST",
                    url: "/plmcore/updteUserInfo",
                    params: {
                        id: $scope.addUser.id,
                        username: $scope.addUser.userName,
                        realName: $scope.addUser.realName,
                        userGendar: $scope.addUser.gendar,
                        phone: $scope.addUser.phone,
                        mobile: $scope.addUser.mobile,
                        email: $scope.addUser.email,
                        remark: $scope.addUser.remark,
                        roleName: $scope.addUser.roleName
                    }
                }).success(function (res) {
                    ngTip.tip(res);
                    //$rootScope.$broadcast('userTableRefresh');// 刷新页面
                    var time = setTimeout(function(){
                        var index = parent.layer.getFrameIndex(window.name);
                        parent.location.reload();
                        parent.layer.close(index);
                    },1000);
                    //$("#userList").bootstrapTable('refresh')
                })

            }
        } else {
            ngTip.tip("请为用户选择对应角色", "warning");
            $scope.addUserForm.$submitted = false;
            $scope.addUserForm.$invalid = true;
        }

    }
})

