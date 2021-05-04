//产品交付发货
app.controller('productDeliveryListCtrl',  function($scope,NgTableParams, getDataService,$screenFactory, ngTip,$http,$confirm,$uibModal,$compile) {

    $scope.options = [];
    $scope.events = [];
    $("#productDeliveryList").bootstrapTable({
        //url: "js/lifeCycleManagement/lifeCycleManagement/productDelivery.json",
        url: "/plmcore/productDeliverList",
        /*method:'get',
        pagination: true,
        showRefresh: false,
        showToggle: false,
        showColumns: false,
        search:true,
        iconSize: "outline",*/
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
            {field: 'billNo', title: '单据号'},
            {field: 'hardwareSerialNumber', title: '硬件序列号'},
            {field: 'contractNo', title: '合同号'},
            {field: 'sendUser', title: '发货人'},
            {field: 'sendDate', title: '发货日期'},
            {field: 'demandUser', title: '需求人'},
            {field: 'company', title: '接收单位'},
            {field: 'contactPerson', title: '接收人员'},
            {field: 'contactInfo', title: '联系方式'},
            {field: 'remarks', title: '备注'},
            {field: 'operate', title: '操作', formatter: function(value,row,index){
                var rtn = "<div id='option_"+index+"'></div>"
                var event= '<span title="查看详情" ng-click="detailProductDelivery('+row.id+')"><a class="fa fa-search"></a></span> &nbsp;'+
                    '<span title="还原处理" ng-click="restore('+row.id+')"><a>还原处理</a></span>'

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
    $scope.addOreEditProductDelivery = function(obj){
        $uibModal.open({
            templateUrl : 'lifeCycleManagement/productDelivery/productDeliveryAddOrEdit.html',
            controller :'addOrEditProductDeliveryCtrl',
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
    $scope.detailProductDelivery = function(obj){
        $uibModal.open({
            templateUrl : 'lifeCycleManagement/productDelivery/productDeliveryDetailContent.html',
            controller :'detailProductDeliveryContentCtrl',
            backdrop :'static',
            size : 'lg',
            resolve : {
                param : function() {
                    return   angular.copy(obj);
                }
            }
        });
    }

    $scope.restore = function (value) {

        //还原操作是将product_deliver和deliver_serial_number这两张表中的数据删除
        $confirm({text: "还原操作无法恢复，您确认还原吗？", title: "还原", ok: "是", cancel: "否"})
            .then(function () {
                $http({
                    method: 'post',
                    url: '/plmcore/restoreProductDeliver',
                    params: {
                        id: value
                    }
                }).success(function (response) {
                    if(response.stateCode == '1'){
                        ngTip.tip(response.message, "success");
                    }else{
                        ngTip.tip(response.message, "warning");
                    }
                    $("#productDeliveryList").bootstrapTable('refresh');
                });
            });



    }

    $scope.deleteProductDelivery = function(){

        var checkId = [];
        var rows = $("#productDeliveryList").bootstrapTable('getSelections');
        for(var i=0;i<rows.length;i++){
            checkId.push(rows[i].id);
        }
        //console.log("checkId="+checkId);
        if(rows.length == 0){
            ngTip.tip("请选择要删除的数据！", "warning");
        }else{

            $confirm({text: "删除的数据无法恢复，您确认删除吗？", title: "删除数据", ok: "是", cancel: "否"})
                .then(function () {
                    $http({
                        method: 'post',
                        url: '/plmcore/deleteProductDeliver',
                        params: {
                            checkId: checkId.join(",")
                        }
                    }).success(function (response) {
                        if(response.stateCode == '1'){
                            ngTip.tip(response.message, "success");
                        }else{
                            ngTip.tip(response.message, "warning");
                        }
                        $("#productDeliveryList").bootstrapTable('refresh');
                    });
             });
        }


    }


});
app.controller('addOrEditProductDeliveryCtrl',function($scope,$uibModalInstance,ngTip,param,$http){
    //关闭按钮
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    };
    $scope.title = '新增';
    $scope.productDeliver = {};
    $scope.productDeliver.id = 0;
    $scope.customerUser = {};
    $scope.getSendDate;
   if(param != undefined){
       $scope.title = '编辑';
       $scope.productDeliver.id = param;
       $http({
           url: "/plmcore/productDeliverView",
           method:'post',
           params: {
               id: param,
               sign: 'true'
           }
       }).success(function(res){
           //console.log(res);
           $scope.productDeliver = res;
       }).error(function () {
           ngTip.tip("网络不通请关闭窗口重试");
       });
       //"/plmcore/selectedHardwareSerialNumberList?productDeliverId="+param+"&sign=true",
       //查看
       setTimeout(function(){
           $("#hardwareNumberList").bootstrapTable({
               url: "/plmcore/selectedHardwareSerialNumberList",
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
                       "keyword": keyword,
                       "productDeliverId":$scope.productDeliver.id,
                       "sign": true
                   }
                   return param;
               },
               columns: [
                   {checkbox: true},
                   {field: 'id', title: 'id',visible: false},
                   {field: 'hardwareSerialNumber', title: '硬件序列号'},
                   {field: 'authCodeId', title: '软件序列号'},
                   {field: 'productCode', title: '产品'},
                   {field: 'contractNo', title: '合同号'}
               ]
           });
       },100)


   }else{
       //新增
       setTimeout(function(){
           $("#hardwareNumberList").bootstrapTable({
               url: "/plmcore/hardwareSerialNumberList",
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
                       "keyword": keyword,
                       "sign": true
                   }
                   return param;
               },
               columns: [
                   {checkbox: true},
                   {field: 'id', title: 'id',visible: false},
                   {field: 'hardwareSerialNumber', title: '硬件序列号'},
                   {field: 'authCodeId', title: '软件序列号'},
                   {field: 'productType', title: '产品'},
                   {field: 'productCode',visible:false, title: '成品编码'},
                   {field: 'codeType',visible:false, title: '授权码类型'},
                   {field: 'contractNo', title: '合同号'}
               ]
           });
       },100)

   }

    // 发货人名称下拉框
    $http({
        method :'POST',
        url :'/plmcore/businessUserListByType',
        params: {
            type: '4'
        }
    }).success(function(res) {
        $scope.sendData = res;
    }).error(function () {
        ngTip.tip("网络不通请关闭窗口重试");
    });

    // 需求人名称下拉框
    $http({
        method :'POST',
        url :'/plmcore/businessUserListByType',
        params: {
            type: '5'
        }
    }).success(function(res) {
        $scope.demandData = res;
    }).error(function () {
        ngTip.tip("网络不通请关闭窗口重试");
    });

    // 接收人名称下拉框
    $http({
        method :'POST',
        url :'/plmcore/receiveUserList'
    }).success(function(res) {
        $scope.receiveData = res;
    }).error(function () {
        ngTip.tip("网络不通请关闭窗口重试");
    });

    $scope.changetype = function(customerId){

        //根据customerId查询对应的接收单位和联系方式
        $http({
            method :'POST',
            url :'/plmcore/getCustomerInfoMaintainById',
            params: {
                id: customerId
            }
        }).success(function(res) {
            $scope.customerUser = res;
            $scope.productDeliver.company = $scope.customerUser.companyName;
            $scope.productDeliver.contactInfo = $scope.customerUser.contactInfo;
        }).error(function () {
            ngTip.tip("网络不通请关闭窗口重试");
        });

    }



    $scope.save = function () {

        var operateType = "add";
        if(param != undefined){
            operateType = "edit";
            $scope.productDeliver.id = param;
        }
        $scope.getSendDate = $scope.productDeliver.sendDate;
        $scope.productDeliver.sendDate = null;

        var allTableData = $('#hardwareNumberList').bootstrapTable('getAllSelections');
        $scope.serialNumberListParam = [];
        $.each(allTableData,function (i,e) {
            //console.log(e.hardwareNumber+"   "+e.myhardwareNumber);
            $scope.serialNumberListParam.push({
                authorizationCodeId:e.id,
                hardwareSerialNumber:e.hardwareSerialNumber,
                authCodeId:e.authCodeId,
                productCode:e.productCode,
                contractNo:e.contractNo,
                codeType:e.codeType
            });
        })
        var len = $scope.serialNumberListParam.length;

        //这里对提交的表中所选择的硬件序列号做一下判断，如果所选择的硬件序列号中存在多条记录中同一个硬件序列号
        //对应多个不同的授权码ID或防护板ID时，要提示用户如果选择的记录中，存在同一个硬件序列号对应多个不同的
        //授权码ID或防护板ID或同一个硬件序列号对应多条记录时，只能选择一条
        $http({
            url:'/plmcore/sendHardwareSerialNumberIsDuplicate',
            method:'post',
            params: {
                serialNumberArray: JSON.stringify($scope.serialNumberListParam),
            }
        }).success(function(res){

            if(res.stateCode==0){
                ngTip.tip(res.message);
            }else{

                if(len>0){
                    $http({
                        method: "POST",
                        url: "/plmcore/saveProductDeliver",
                        params: {
                            id: $scope.productDeliver.id,
                            billNo: $scope.productDeliver.billNo,
                            sendUserId: $scope.productDeliver.sendUserId,
                            getSendDate: $scope.getSendDate,
                            demandUserId: $scope.productDeliver.demandUserId,
                            company: $scope.productDeliver.company,
                            customerId: $scope.productDeliver.customerId,
                            contactInfo: $scope.productDeliver.contactInfo,
                            remarks: $scope.productDeliver.remarks,
                            serialNumberArray: JSON.stringify($scope.serialNumberListParam),
                            operateType: operateType

                        }
                    }).success(function (res) {
                        ngTip.tip(res.message, res.result);
                        $("#productDeliveryList").bootstrapTable('refresh');
                        var time = setTimeout(function(){
                            $uibModalInstance.close(true);
                        },1000);
                    }).error(function () {
                        ngTip.tip("网络不通请关闭窗口重试");
                    })
                }else{
                    ngTip.tip("请选择要发货的硬件序列号");
                }

            }
        })

    }


})
app.controller('detailProductDeliveryContentCtrl',function($scope,$uibModalInstance,ngTip,param,$http){
    //关闭按钮
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    };


    $scope.title = '新增';
    $scope.productDeliver = {};
    $scope.productDeliver.id = 0;
    $scope.customerUser = {};
    $scope.getSendDate;
    if(param != undefined){
        $scope.title = '查看';
        $scope.productDeliver.id = param;
        $http({
            url: "/plmcore/productDeliverView",
            method:'post',
            params: {
                id: param,
                sign: 'true'
            }
        }).success(function(res){
            //console.log(res);
            $scope.productDeliver = res;
        }).error(function () {
            ngTip.tip("网络不通请关闭窗口重试");
        })
        //"/plmcore/selectedHardwareSerialNumberList?productDeliverId="+param+"&sign=true",
        //查看
        setTimeout(function(){
            $("#hardwareNumberList").bootstrapTable({
                url: "/plmcore/selectedHardwareSerialNumberList",
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
                        "keyword": keyword,
                        "productDeliverId":$scope.productDeliver.id,
                        "sign": true
                    }
                    return param;
                },
                columns: [
                    {checkbox: true},
                    {field: 'id', title: 'id',visible: false},
                    {field: 'hardwareSerialNumber', title: '硬件序列号'},
                    {field: 'authCodeId', title: '软件序列号'},
                    {field: 'productCode', title: '产品'},
                    {field: 'contractNo', title: '合同号'}
                ]
            });
        },100)


    }



    // 发货人名称下拉框
    $http({
        method :'POST',
        url :'/plmcore/businessUserListByType',
        params: {
            type: '4'
        }
    }).success(function(res) {
        $scope.sendData = res;
    }).error(function () {
        ngTip.tip("网络不通请关闭窗口重试");
    });

    // 需求人名称下拉框
    $http({
        method :'POST',
        url :'/plmcore/businessUserListByType',
        params: {
            type: '5'
        }
    }).success(function(res) {
        $scope.demandData = res;
    }).error(function () {
        ngTip.tip("网络不通请关闭窗口重试");
    });

    // 接收人名称下拉框
    $http({
        method :'POST',
        url :'/plmcore/receiveUserList'
    }).success(function(res) {
        $scope.receiveData = res;
    }).error(function () {
        ngTip.tip("网络不通请关闭窗口重试");
    });


})
/**
 * 发货单据号唯一性校验
 */
/*app.directive('billoNoUnique',
    function ($http,ngTip) {
        return {
            restrict: 'EA',
            require: '?ngModel',
            link: function ($scope, element, attrs, c) {
                $scope.$watch(attrs.ngModel, function () {
                    if ($scope.productDeliver.billNo) {
                        $http.post('/plmcore/validateBillNoUnique', {
                            id: $scope.productDeliver.id,
                            billNo: $scope.productDeliver.billNo
                        }).success(function (data) {
                            c.$setValidity('nameUnique', data);
                        }).error(function () {
                            c.$setValidity('unique', false);
                            ngTip.tip("网络不通请关闭窗口重试");
                        });
                    }
                });
            }
        }
    });*/

/**
 * 发货单据号唯一性校验
 */
app.directive('billoNoUnique',
    function ($http,ngTip) {
        return {
            restrict: 'EA',
            require: '?ngModel',
            link: function ($scope, element, attrs, c) {
                $scope.$watch(attrs.ngModel, function () {
                    var billNo = $scope.productDeliver.billNo;
                    if ($scope.productDeliver.billNo !== undefined) {
                        $http({
                            method: 'POST',
                            timeout: 10000,
                            url: '/plmcore/validateBillNoUnique',
                            params: {
                                id: $scope.productDeliver.id,
                                billNo: billNo
                            }
                        }).success(function (data) {
                            // 该方法用于改变验证状态，以及在控制变化的验证标准时通知表格（validationErrorKey,isValid）
                            c.$setValidity('nameUnique', data);
                        }).error(function () {
                            c.$setValidity('unique', false);
                            ngTip.tip("网络不通请关闭窗口重试");
                        });
                    }else{
                        c.$setValidity('nameUnique', true);
                    }

                });
            }
        }
    });
