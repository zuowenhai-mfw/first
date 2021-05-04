//用户信息维护
app.controller('businessUserListCtrl',  function($scope,NgTableParams, getDataService,$screenFactory,$confirm, ngTip,$uibModal,$http,$compile) {


    $scope.options = [];
    $scope.events = [];
    $("#businessUserList").bootstrapTable({
        url: "/plmcore/businessUserList",
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
            {field: 'name', title: '用户姓名'},
            {field: 'gendar', title: '性别'},
            {field: 'phone', title: '座机号'},
            {field: 'mobile', title: '手机号'},
            {field: 'type', title: '用户类型',formatter:function(value,row,index){
                    var value = "";
                    if(row.type=='1'){
                        return "发布人员";
                    }else if(row.type=='2'){
                        return "销售人员";
                    }else if(row.type=='3'){
                        return "下单人员";
                    }else if(row.type=='4'){
                        return "发货人员";
                    }else if(row.type=='5'){
                        return "需求人员";
                    }else{
                        return "实施人员";
                    }
                }
            },

            {field: 'operate', title: '操作', formatter: function(value,row,index){
                var rtn = "<div id='option_"+index+"'></div>"
                var event= '<span title="编辑" ng-click="editBusinessUser('+row.id+')"><a class="fa fa-edit"></a></span> &nbsp;'

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
    $scope.editBusinessUser = function(obj){
        $uibModal.open({
            templateUrl : 'systemManage/businessUserManage/businessUserEdit.html',
            controller :'addOrEditBusinessUserCtrl',
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
    $scope.addOrEditBusinessUser = function(obj){
        $uibModal.open({
            templateUrl : 'systemManage/businessUserManage/businessUserAdd.html',
            controller :'addOrEditBusinessUserCtrl',
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

});


/**
 *校验新增用户名唯一的指令。
 */
app.directive('nameEnsureUnique',
    function ($http,ngTip) {
        return {
            restrict: 'EA',
            require: '?ngModel',
            link: function ($scope, element, attrs, c) {
                $scope.$watch(attrs.ngModel, function () {
                    var name = $scope.addUser.name;
                    if ($scope.addUser.name !== undefined) {
                        $http({
                            method: 'POST',
                            timeout: 10000,
                            url: '/plmcore/validateBusinessName',
                            params: {
                                id: $scope.addUser.id,
                                name: name
                            }
                        }).success(function (data) {
                            // 该方法用于改变验证状态，以及在控制变化的验证标准时通知表格（validationErrorKey,isValid）
                            c.$setValidity('bussinesUnique', data);
                        }).error(function () {
                            c.$setValidity('unique', false);
                            ngTip.tip("网络不通请关闭窗口重试");
                        });
                    }else{
                        c.$setValidity('bussinesUnique', true);
                    }

                });
            }
        }
    });


/*点击编辑或者新增的模态框*/
app.controller('addOrEditBusinessUserCtrl',function($rootScope,$scope,$uibModalInstance,ngTip,param,$http){
    //关闭按钮
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }

    $scope.addUser = {};
    $scope.addUser.id = 0;
    $scope.title = '新增';
    if(param != undefined){
        $scope.title = '编辑';
        $scope.addUser.id = param;
        //console.log("$scope.addUser.id============"+$scope.addUser.id);
        $http({
            url:'/plmcore/getBusinessUserById',
            method :'POST',
            params: {
                id: $scope.addUser.id
            }
        }).success(function(res){
            $scope.addUser = res;
            //$scope.addUser.type = res.type+"";
            //console.log(res.type);
            if(res.type!=null){
                var typeArr = res.type.split(",");
                var lenType = typeArr.length;
                for(var i=0;i<lenType;i++){
                    console.log(typeArr[i]);
                    if(typeArr[i] == '1'){
                        $scope.firstSign = true;
                    }
                    if(typeArr[i] == '2'){
                        $scope.secondSign = true;
                    }
                    if(typeArr[i] == '3'){
                        $scope.thirdSign = true;
                    }
                    if(typeArr[i] == '4'){
                        $scope.fourthSign = true;
                    }
                    if(typeArr[i] == '5'){
                        $scope.fifthSign = true;
                    }
                    if(typeArr[i] == '6'){
                        $scope.sixthSign = true;
                    }
                }
            }

            //console.log("res.type============"+$scope.addUser.type);
            //console.log("title============"+$scope.title);
        }).error(function () {
            ngTip.tip("网络不通请关闭窗口重试");
        })
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
    })


    // 点击关闭按钮，关闭模态框.
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


    $scope.addUserInfoForm = function () {

        var userTypeArr = document.getElementsByName("userType");
        var lenUserType = userTypeArr.length;
        var userType = [];
        var typeSign = false;
        for(var i=0;i<lenUserType;i++){
            if(userTypeArr[i].checked){
                userType.push(userTypeArr[i].value);
                typeSign = true;
            }
        }

        if(!typeSign){
            ngTip.tip("请至少选择一个用户类型");
            return;
        }
        // 防止表单多次点击重复提交
        if (!$scope.addBusinessUserForm.$submitted) {
            $scope.addBusinessUserForm.$submitted = true;
            $uibModalInstance.close('cancel');// 关闭模态框
            $http({
                method: "POST",
                url: "/plmcore/saveBusinessUser",
                params: {
                    name: $scope.addUser.name,
                    gendar: $scope.addUser.gendar,
                    phone: $scope.addUser.phone,
                    mobile: $scope.addUser.mobile,
                    //type: $scope.addUser.type
                    type: userType.join(",")
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

    }

    $scope.editUserInfoForm = function () {
        var userTypeArr = document.getElementsByName("userType");
        var lenUserType = userTypeArr.length;
        var userType = [];
        var typeSign = false;
        for(var i=0;i<lenUserType;i++){
            if(userTypeArr[i].checked){
                userType.push(userTypeArr[i].value);
                typeSign = true;
            }
        }
        if(!typeSign){
            ngTip.tip("请至少选择一个用户类型");
            return;
        }
        if (!$scope.editBusinessUserForm.$submitted) {
            $scope.editBusinessUserForm.$submitted = true;
            // 同步调用getUserDataService。获得接口，调用承诺api获取数据.resolve
            $uibModalInstance.close('cancel');// 关闭模态框
            $http({
                method: "POST",
                url: "/plmcore/saveBusinessUser",
                params: {
                    id: $scope.addUser.id,
                    name: $scope.addUser.name,
                    gendar: $scope.addUser.gendar,
                    phone: $scope.addUser.phone,
                    mobile: $scope.addUser.mobile,
                    type: userType.join(",")
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

    }
})

