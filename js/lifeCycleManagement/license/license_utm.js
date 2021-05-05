//硬件平台采购
app.controller('licenseUTMListCtrl',  function($scope,NgTableParams,ngTip,getDataService,$screenFactory, $uibModal,$compile,$http) {

    $scope.options = [];
    $scope.events = [];
    $("#licenseUTMListList").bootstrapTable({
        url: "/plmcore/authorizationCodeUtmList",
        method:'get',
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
            {field: 'protectivePlateId', title: '防护板序列号'},
            {field: 'hardwareSerialNumber', title: '硬件序列号'},
            {field: 'guagCardNo', title: '刮刮卡编号'},
            {field: 'guagCardAuthCode', title: '刮刮卡授权码'},
            {field: 'authType', title: '授权类型'},
            {field: 'registerTime', title: '日期'},
            {field: 'dateTime', title: '时间'},
            {field: 'details', title: '详情'},
            {field: 'operate', title: '操作', formatter: function(value,row,index){
                var rtn = "<div id='option_"+index+"'></div>"
                var event= '<span title="编辑" ng-click="addOreEditlicenseUTM('+row.id+')"><a class="fa fa-edit"></a></span> &nbsp;'+
                    '<span title="查看详情" ng-click="openLicenseUtmDetails('+row.id+')"><a class="fa fa-search"></a></span>';
                $scope.options.push("option_"+index)
                $scope.events.push(event)
                return rtn
            }}
        ],
        onLoadSuccess:function(){
            for(var i=0;i<$scope.options.length;i++){
                var _option = $scope.options[i]
                var _event = $scope.events[i];
                $('#'+_option).empty();
                var $el = $(_event).appendTo('#'+_option);
                $compile($el)($scope);
            }
        }
    });

    //打开新增 、编辑页面
    $scope.addOreEditlicenseUTM = function(obj){
        $uibModal.open({
            templateUrl : 'lifeCycleManagement/license/license_utm_des/license_utm_desAddOrEdit.html',
            controller :'addOrEditlicenseUTMCtrl',
            backdrop :'static',
            size : 'lg',
            resolve : {
                param : function() {
                    return   angular.copy(obj);
                }
            }
        });
    }

    //打开查看详情页面
    $scope.openLicenseUtmDetails = function(obj){
        $uibModal.open({
            templateUrl : 'lifeCycleManagement/license/license_utm_des/license_utm_desDetails.html',
            controller :'licenseUtmDetailsCtrl',
            backdrop :'static',
            size : 'lg',
            resolve : {
                param : function() {
                    return   angular.copy(obj);
                }
            }
        });
    }

    $scope.deleteAuthorizationCodeUTM = function(obj){
        var checkId = [];
        var rows = $("#licenseUTMListList").bootstrapTable('getSelections');
        for(var i=0;i<rows.length;i++){
            checkId.push(rows[i].id);
        }
        if(rows.length == 0){
            ngTip.tip("请选择要授权的数据！", "warning");
            return;
        }

        $http({
            method: "POST",
            url: "/plmcore/deleteAuthorizationCodeUtm",
            params: {
                codeType: "2",
                checkId: checkId
            }
        }).success(function (res) {
            ngTip.tip(res.message, res.result);
            $("#licenseUTMListList").bootstrapTable('refresh');
        })
    }


});


/**
 *校验新增防护板序列号时，授权码id唯一的指令。
 */
app.directive('authcodeidEnsureUnique',
    function ($http,ngTip) {
        return {
            restrict: 'EA',
            require: '?ngModel',
            link: function ($scope, element, attrs, c) {
                $scope.$watch(attrs.ngModel, function () {
                    var protectivePlateId = $scope.authorizationCode.protectivePlateId;
                    if ($scope.authorizationCode.protectivePlateId !== undefined) {
                        $http({
                            method: 'POST',
                            timeout: 10000,
                            url: '/plmcore/validateProtectivePlateId',
                            params: {
                                id: $scope.authorizationCode.id,
                                protectivePlateId: protectivePlateId
                            }
                        }).success(function (data) {
                            // 该方法用于改变验证状态，以及在控制变化的验证标准时通知表格（validationErrorKey,isValid）
                            c.$setValidity('protectivePlateIdUnique', data);
                        }).error(function () {
                            c.$setValidity('unique', false);
                            ngTip.tip("网络不通请关闭窗口重试");
                        });
                    }else{
                        c.$setValidity('protectivePlateIdUnique', true);
                    }

                });
            }
        }
    });


app.controller('addOrEditlicenseUTMCtrl',function($scope,$uibModalInstance,param,ngTip,$http,$compile,$confirm){
    //关闭按钮
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }
    $scope.title = '新增';
    $scope.authorizationCode = {};
    $scope.authorizationCode.id = 0;
    $scope.authCodeIdSign=false;
    $scope.getRegisterTime;
    $scope.isDisplaySign = false;

    setTimeout(function(){
        $("#hardwareSerialNumber").bsSuggest({
            url: "/plmcore/hardwareSerialNoListView",
            showBtn:false,
            idField: "hardware_serial_number",
            keyField: "hardware_serial_number",
            effectiveFields:["hardware_serial_number"],
            effectiveFieldsAlias:{"hardware_serial_number":"硬件SN号"}
        }).on("onDataRequestSuccess", function (e, result) {
            //console.log("onDataRequestSuccess: ", result);
        }).on("onSetSelectValue", function (e, keyword) {
            //console.log("onSetSelectValue: ", keyword);
            $scope.authorizationCode.hardwareSerialNumber = keyword.key;
        }).on("onUnsetSelectValue", function (e) {
            //console.log("onUnsetSelectValue");
        })
    },100)



    if(param != undefined){
        $scope.title = '编辑';
        $scope.authorizationCode.id = param;
        $scope.authCodeIdSign=true;
        $http({
            url:'/plmcore/updateAuthorizationCodeUtmView',
            method:'post',
            params: {
                id: $scope.authorizationCode.id
            }
        }).success(function(res){
            $scope.authorizationCode = res;
            if(res.authType=='1'){
                $scope.isDisplaySign = true;
            }else{
                $scope.isDisplaySign = false;
            }
        }).error(function () {
            ngTip.tip("网络不通请关闭窗口重试");
        });
    };
    $scope.options = [];
    $scope.events = [];
    setTimeout(function(){
        $("#serialNumberList").bootstrapTable({
            url: "js/lifeCycleManagement/lifeCycleManagement/hardwareProchase.json",
            method:'get',
            pagination: !0,
            showRefresh: false,
            showToggle: false,
            showColumns: false,
            search:false,
            iconSize: "outline",
            columns: [
                { title: '序号',formatter:function(val,row,index){
                    //获取每页显示的数据
                    var pageSize = $("#serialNumberList").bootstrapTable('getOptions').pageSize;
                    //获取当前第几页
                    var pageNumber = $("#serialNumberList").bootstrapTable('getOptions').pageNumber;
                    return pageSize * (pageNumber - 1) + index +1
                }},
                {field: 'hardwareNumber', title: '硬件序列号'},
                {field: 'salesperson', title: '状态'},

                {field: 'operate', title: '操作', formatter: function(value,row,index){

                    var rtn = "<div id='remove_"+index+"'></div>"
                    var event= '<span title="编辑"  id="delserialNumberList"><a class="fa fa-remove"></a></span> &nbsp;'

                    return event;
                },events:delserialNumber}
            ]

        });
    },100)
    window.delserialNumber = {
        "click #delserialNumberList":function(value,row,index){
            $("#serialNumberList").bootstrapTable('remove',{field:"hardwareNumber",values:[index.hardwareNumber]})
        }
    }
    $scope.addHardwareSerialNumber = {}
    $scope.addserialNumber = function(){

        var singleSerialNumber = $scope.addHardwareSerialNumber.singleSerialNumber
        if(singleSerialNumber != undefined){
            $("#serialNumberList").bootstrapTable('insertRow',{index:0,row:{hardwareNumber:singleSerialNumber,salesperson:"未生产"}})

        }
        $scope.addHardwareSerialNumber = {}


    }

    $scope.isDisplay = function(value){
        if(value=='1'){
            $scope.isDisplaySign = true;
        }else{
            $scope.isDisplaySign = false;
            $scope.authorizationCode.guagCardNo = '';
            $scope.authorizationCode.guagCardAuthCode = '';
        }
    }

    $scope.save = function () {

        //这里对前端提交过来的硬件序列号做判断处理，如果该硬件序列号已关联防护板序列号(表示该硬件已使用)
        //则提示用户该硬件已使用，是否再次使用
        var operateType = 'add';
        $scope.getRegisterTime = $scope.authorizationCode.registerTime;
        $scope.authorizationCode.registerTime = null;
        if(param != undefined){
            $scope.authorizationCode.id = param;
            operateType = 'edit';
        }

        $http({
            method: "POST",
            url: "/plmcore/hardwareSerialNumberUsedByPlateId",
            params: {
                hardwareSerialNumber: $scope.authorizationCode.hardwareSerialNumber,
                id: $scope.authorizationCode.id,
                operateType: operateType
            }
        }).success(function (res) {
            if(res){
                //表示该硬件序列号未使用(也就是该硬件序列号未绑定防护板序列号且对应的state=1)
                $http({
                    method: "POST",
                    url: "/plmcore/saveUtm",
                    params: {
                        id: $scope.authorizationCode.id,
                        protectivePlateId: $scope.authorizationCode.protectivePlateId,
                        hardwareSerialNumber: $scope.authorizationCode.hardwareSerialNumber,
                        guagCardNo: $scope.authorizationCode.guagCardNo,
                        guagCardAuthCode: $scope.authorizationCode.guagCardAuthCode,
                        getRegisterTime: $scope.getRegisterTime,
                        authType: $scope.authorizationCode.authType,
                        details: $scope.authorizationCode.details
                    }
                }).success(function (res) {
                    ngTip.tip(res.message, res.result);
                    $("#licenseUTMListList").bootstrapTable('refresh');
                    var time = setTimeout(function(){
                        $uibModalInstance.close(true);
                    },1000);
                })
            }else{
                //表示该硬件已使用
                $confirm({text: "该硬件已使用，是否再次使用？", title: "是否再次使用", ok: "是", cancel: "否"})
                    .then(function () {
                        $http({
                            method: "POST",
                            url: "/plmcore/saveUtm",
                            params: {
                                id: $scope.authorizationCode.id,
                                protectivePlateId: $scope.authorizationCode.protectivePlateId,
                                hardwareSerialNumber: $scope.authorizationCode.hardwareSerialNumber,
                                guagCardNo: $scope.authorizationCode.guagCardNo,
                                guagCardAuthCode: $scope.authorizationCode.guagCardAuthCode,
                                getRegisterTime: $scope.getRegisterTime,
                                authType: $scope.authorizationCode.authType,
                                details: $scope.authorizationCode.details
                            }
                        }).success(function (res) {
                            ngTip.tip(res.message, res.result);
                            $("#licenseUTMListList").bootstrapTable('refresh');
                            var time = setTimeout(function(){
                                $uibModalInstance.close(true);
                            },1000);
                        })
                    });
            }
        })



    }

})

app.controller('licenseUtmDetailsCtrl',function($scope,$uibModalInstance,param,ngTip,$http,$compile){
    //关闭按钮
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }
    $scope.title = '新增';
    $scope.authorizationCode = {};
    $scope.authorizationCode.id = 0;
    $scope.authCodeIdSign=false;
    $scope.getRegisterTime;

    setTimeout(function(){
        $("#hardwareSerialNumber").bsSuggest({
            url: "/plmcore/hardwareSerialNoListView",
            showBtn:false,
            idField: "hardware_serial_number",
            keyField: "hardware_serial_number",
            effectiveFields:["hardware_serial_number"],
            effectiveFieldsAlias:{"hardware_serial_number":"硬件SN号"}
        }).on("onDataRequestSuccess", function (e, result) {
            //console.log("onDataRequestSuccess: ", result);
        }).on("onSetSelectValue", function (e, keyword) {
            //console.log("onSetSelectValue: ", keyword);
            $scope.authorizationCode.hardwareSerialNumber = keyword.key;
        }).on("onUnsetSelectValue", function (e) {
            //console.log("onUnsetSelectValue");
        })
    },100)

    if(param != undefined){
        $scope.title = '编辑';
        $scope.authorizationCode.id = param;
        $scope.authCodeIdSign=true;
        $http({
            url:'/plmcore/updateAuthorizationCodeUtmView',
            method:'post',
            params: {
                id: $scope.authorizationCode.id
            }
        }).success(function(res){
            $scope.authorizationCode = res;
            if(res.authType=='1'){
                $scope.isDisplaySign = true;
            }else{
                $scope.isDisplaySign = false;
            }
        }).error(function () {
            ngTip.tip("网络不通请关闭窗口重试");
        });
    };
    $scope.options = [];
    $scope.events = [];
    setTimeout(function(){
        $("#serialNumberList").bootstrapTable({
            url: "js/lifeCycleManagement/lifeCycleManagement/hardwareProchase.json",
            method:'get',
            pagination: !0,
            showRefresh: false,
            showToggle: false,
            showColumns: false,
            search:false,
            iconSize: "outline",
            columns: [
                { title: '序号',formatter:function(val,row,index){
                        //获取每页显示的数据
                        var pageSize = $("#serialNumberList").bootstrapTable('getOptions').pageSize;
                        //获取当前第几页
                        var pageNumber = $("#serialNumberList").bootstrapTable('getOptions').pageNumber;
                        return pageSize * (pageNumber - 1) + index +1
                    }},
                {field: 'hardwareNumber', title: '硬件序列号'},
                {field: 'salesperson', title: '状态'},

                {field: 'operate', title: '操作', formatter: function(value,row,index){

                        var rtn = "<div id='remove_"+index+"'></div>"
                        var event= '<span title="编辑"  id="delserialNumberList"><a class="fa fa-remove"></a></span> &nbsp;'

                        return event;
                    },events:delserialNumber}
            ]

        });
    },100)
    window.delserialNumber = {
        "click #delserialNumberList":function(value,row,index){
            $("#serialNumberList").bootstrapTable('remove',{field:"hardwareNumber",values:[index.hardwareNumber]})
        }
    }
    $scope.addHardwareSerialNumber = {}
    $scope.addserialNumber = function(){

        var singleSerialNumber = $scope.addHardwareSerialNumber.singleSerialNumber
        if(singleSerialNumber != undefined){
            $("#serialNumberList").bootstrapTable('insertRow',{index:0,row:{hardwareNumber:singleSerialNumber,salesperson:"未生产"}})

        }
        $scope.addHardwareSerialNumber = {}


    }

})
