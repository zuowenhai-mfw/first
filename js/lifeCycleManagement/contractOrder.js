//合同订单签订
app.controller('contractOrderListCtrl', function ($scope, NgTableParams, getDataService, $screenFactory, $uibModal, $compile,$confirm,ngTip,$http) {

    $scope.options = [];
    $scope.events = [];
    $("#contractOrderList").bootstrapTable({
        url: "/plmcore/contractOrderList",
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
            {field: 'id', title: 'id',visible: false},
            {field: 'contractNo', title: '合同号'},
            {field: 'saleUser', title: '销售人员'},
            {field: 'contractDetails', title: '合同详情'},
           /* {field: 'finishProductCode', title: '成品编码'},
            {field: 'productName', title: '产品名称'},
            {field: 'number', title: '数量'},*/
            {field: 'signDate', title: '签订日期'},
            {field: 'putOnRecordDate', title: '建档日期'},
            {field: 'remarks', title: '备注'},
            {
                field: 'operate', title: '操作', formatter: function (value, row, index) {
                var rtn = "<div id='option_" + index + "'></div>"
                var event = '<span title="编辑" ng-click="addOrEditContractOrder(' + row.id + ')"><a class="fa fa-edit"></a></span> &nbsp;' +
                    '<span title="详情" ng-click="openContractOrderDetail(' + row.id + ')"><a class="fa fa-search"></a></span>'

                $scope.options.push("option_" + index)
                $scope.events.push(event)
                return rtn
            }
            }
        ],
        onLoadSuccess: function () {
            for (var i = 0; i < $scope.options.length; i++) {
                var _option = $scope.options[i]
                var _event = $scope.events[i];
                $('#'+_option).empty();
                var $el = $(_event).appendTo('#'+_option);
                $compile($el)($scope);
            }
        }
    });

    //打开新增 、编辑页面
    $scope.addOrEditContractOrder = function (obj) {
        //console.log("sdsdsd="+obj);
        $uibModal.open({
            templateUrl: 'lifeCycleManagement/contractOrder/contractOrderAddOrEdit.html',
            controller: 'addOrEditContractOrderCtrl',
            backdrop: 'static',
            size: 'lg',
            resolve: {
                param: function () {
                    return angular.copy(obj);
                }
            }
        });
    }

   //打开详情页面
    $scope.openContractOrderDetail = function (obj) {
        $uibModal.open({
            templateUrl: 'lifeCycleManagement/contractOrder/contractOrderDetail.html',
            controller: 'contractOrderDetailCtrl',
            backdrop: 'static',
            size: 'lg',
            resolve: {
                param: function () {
                    return angular.copy(obj);
                }
            }
        });
    }


    //删除列表
    $scope.deleContractOrder = function(){
        var checkId = [];
        var rows = $("#contractOrderList").bootstrapTable('getSelections');
        for(var i=0;i<rows.length;i++){
            checkId.push(rows[i].id);
        }
        if(rows.length == 0){
            ngTip.tip("请选择要删除的数据！", "warning");
        }else if(rows.length>1){
            ngTip.tip("不能批量删除合同，只能单个删除！", "warning");
        }else{

            $confirm({text: "删除的数据无法恢复，您确认删除吗？", title: "删除数据", ok: "是", cancel: "否"})
                .then(function () {
                    $http({
                        method: 'post',
                        url: '/plmcore/deleteContractOrder',
                        params: {
                            checkId: checkId.join(",")
                        }
                    }).success(function (response) {
                        if(response.stateCode == '1'){
                            ngTip.tip(response.message, "success");
                        }else{
                            ngTip.tip(response.message, "warning");
                        }
                        $("#contractOrderList").bootstrapTable('refresh')
                        //$scope.parentTableParams.reload();
                    });
                });
        }
    }

});


/**
 *校验合同号唯一的指令。
 */
app.directive('contractnoEnsureUnique',
    function ($http,ngTip) {
        return {
            restrict: 'EA',
            require: '?ngModel',
            link: function ($scope, element, attrs, c) {
                $scope.$watch(attrs.ngModel, function () {
                    var contractNo = $scope.contractOrder.contractNo;
                    if ($scope.contractOrder.contractNo !== undefined) {
                        $http({
                            method: 'POST',
                            timeout: 10000,
                            url: '/plmcore/validateContractNo',
                            params: {
                                id: $scope.contractOrder.id,
                                contractNo: contractNo
                            }
                        }).success(function (data) {
                            // 该方法用于改变验证状态，以及在控制变化的验证标准时通知表格（validationErrorKey,isValid）
                            c.$setValidity('contractNoUnique', data);
                        }).error(function () {
                            c.$setValidity('unique', false);
                            ngTip.tip("网络不通请关闭窗口重试");
                        });
                    }else{
                        c.$setValidity('contractNoUnique', true);
                    }

                });
            }
        }
    });


/*新增，编辑*/
app.controller('addOrEditContractOrderCtrl', function ($scope, $uibModalInstance, ngTip,param,$filter, $http) {
    //关闭按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }
    $scope.title = '新增';
    $scope.operateType = '';
    $scope.contractOrder = {};
    $scope.contractOrder.id = 0;
    $scope.productList = [];
    $scope.productCodeData = [];
    $scope.sum = 1;
    $scope.pl = [];
    $scope.contractNoSign = false;
    $scope.jdDate=new Date().toLocaleDateString();
    $scope.contractOrder.putOnRecordDate=$scope.jdDate.replace(new RegExp("/","gm"),"-");
    //销售人员名称下拉框
    $http({
        method :'POST',
        url :'/plmcore/businessUserListByType',
        params: {
            type: '2'
        }
    }).success(function(res) {
        $scope.sale = res;
    }).error(function () {
        ngTip.tip("网络不通请关闭窗口重试");
    });

    if (param != undefined) {
        $scope.title = '编辑';
        $scope.contractOrder.id = param;
        $scope.contractNoSign = true;
        $http({
            url: '/plmcore/updateContractOrderView',
            method: 'post',
            params: {
                id: $scope.contractOrder.id,
                sign: 'true'
            }
        }).success(function (res) {
            $scope.contractOrder = res.contractOrderVo;
            $scope.saleUserId = res.contractOrderVo.saleUserId;
            $scope.productList = res.contractFinishedProductList;
        }).error(function () {
            ngTip.tip("网络不通请关闭窗口重试");
        })
    }else{
        $scope.title = '新增';

    }

    $scope.addproductList = function(){
        var productCode = $scope.productCode;
        var productName = $scope.productName;
        var sum = $scope.sum;

        var sumReg = new RegExp(/^[0-9]*$/g);

        var sumSign = sumReg.test(sum);

        if(!sumSign){
            ngTip.tip("必须为数字");
            return;
        }

        if(parseInt(sum)<=0 || parseInt(sum)>=1000000){
            ngTip.tip("数字范围在1到1000000之间");
            return;
        }

        if($scope.productCodeData.indexOf(productCode)==-1){
            ngTip.tip("请从成品编码下拉框列表中选择对应的成品编码");
            return;
        }

        /*if($scope.productList.indexOf(productCode)==-1){
            ngTip.tip("请从成品编码下拉框列表中选择对应的成品编码");
            return;
        }*/

        if(productCode != ''){

            //var getProductCode = $scope.filterData = $filter('filter')($scope.productList,{productCode: productCode});
            var getProductCode = $filter('filter')($scope.productList,{productCode: productCode});
            if(getProductCode.length==0){
                $scope.productList.push({
                    finishedProductNo:productCode,
                    productName:productName,
                    sum:sum})
            }else{
                ngTip.tip("成品编码已存在");
            }

        }else{
            ngTip.tip("请选择成品编码");
        }
        $scope.productCode = '';
        $scope.sum = 1;
        $scope.productName = '';
    }

    $scope.delProductList = function (index) {
        /*if ($scope.productList.length == 1) {
            return;
        }*/
        var dataLength = $scope.pl.length;
        for (var i = index; i < dataLength - 1; i++) {
            // 把剩余成品编码记录项冒泡
            $scope.pl[i] = $scope.pl[i + 1];
        }
        $scope.pl.pop();

        $scope.productList.splice($scope.productList.length - 1, 1);

    }

    setTimeout(function(){
        $("#product").bsSuggest({
            url: "/plmcore/queryProductCodeList",
            showBtn:false,
            idField: "productName",
            keyField: "productCode",
            effectiveFields:["productCode","productName"],
            effectiveFieldsAlias:{"productCode":"成品编号","productName":"成品名称"}
        }).on("onDataRequestSuccess", function (e, result) {
            //console.log("onDataRequestSuccess: ", result);
            var len = result.value.length;
            for(var i = 0; i<len;i++){
                //alert(result.value[i].hardware_code);
                $scope.productCodeData.push(result.value[i].productCode);

            }
        }).on("onSetSelectValue", function (e, keyword) {
            //console.log("onSetSelectValue: ", keyword);
            $scope.productName = keyword.id;
            $scope.productCode = keyword.key;
        }).on("onUnsetSelectValue", function (e) {
            //console.log("onUnsetSelectValue");
        })
    },100)


    $scope.save = function () {

        //判断成品列表不能为空
        var dataLength = $scope.productList.length;alert(dataLength);
        if(dataLength==0){
            ngTip.tip("成品列表不能为空");
            return;
        }

        $scope.getPutOnRecordDate = $scope.contractOrder.putOnRecordDate;
        $scope.getSignDate = $scope.contractOrder.signDate;
        $scope.contractOrder.putOnRecordDate = null;
        $scope.contractOrder.signDate = null;

        if (param != undefined) {
            $scope.title = '编辑';
            $scope.operateType = 'edit';
        }else{
            //新增
            $scope.operateType = 'add';
        }
        $http({
            method: "POST",
            url: "/plmcore/saveContractOrder",
            params: {
                id: $scope.contractOrder.id,
                contractNo: $scope.contractOrder.contractNo,
                getSignDate: $scope.getSignDate,
                getPutOnRecordDate: $scope.getPutOnRecordDate,
                contractDetails: $scope.contractOrder.contractDetails,
                saleUserId: $scope.saleUserId,
                productList: JSON.stringify($scope.productList),
                remarks: $scope.contractOrder.remarks,
                operateType: $scope.operateType
            }
        }).success(function (res) {
            ngTip.tip("保存成功");
            $("#contractOrderList").bootstrapTable('refresh');
            var time = setTimeout(function(){
                $uibModalInstance.close(true);
            },1000);
        })

    }

});
/*详情页面*/
app.controller('contractOrderDetailCtrl', function ($scope, $uibModalInstance, param, $http) {
    //关闭按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }

    $scope.title = '查看';
    $scope.contractOrder = {};
    $scope.contractOrder.id = 0;
    $scope.contractOrder.id = param;
    $http({
        url: '/plmcore/updateContractOrderView',
        method: 'post',
        params: {
            id: $scope.contractOrder.id,
            sign: 'true'
        }
    }).success(function (res) {
        $scope.contractOrder = res.contractOrderVo;
        $scope.saleUserId = res.contractOrderVo.saleUserId;
        $scope.productList = res.contractFinishedProductList;
    }).error(function () {
        ngTip.tip("网络不通请关闭窗口重试");
    });
});
/*详情内容*/
app.controller('contractOrderDetailContentCtrl', function ($scope, $http) {
    $("#productList").bootstrapTable({
        url: "js/lifeCycleManagement/lifeCycleManagement/contractOrderProductList.json",
        method: 'get',
        pagination: false,
        showRefresh: false,
        showToggle: false,
        showColumns: false,
        search: false,
        iconSize: "outline",
        columns: [
            {field: 'finishProductCode', title: '成品编码'},
            {field: 'productName', title: '产品名称'},
            {field: 'number', title: '数量'}
        ]
    });

})



