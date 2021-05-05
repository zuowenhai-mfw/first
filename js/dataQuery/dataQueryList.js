//数据查询列表
app.controller('dataQueryListCtrl',  function($scope,$compile,$rootScope,NgTableParams,ngTableCountFactory) {
    $scope.dataQueryUrl = 'dataQuery/dataQueryResultsList.html';
    $scope.searchData = {};
    $scope.searchData.hardwareSerialNumber = "";
    $scope.searchData.authCodeId = "";
    $scope.searchData.protectivePlateId = "";
    $scope.searchData.softwareVersion = "";
    $scope.searchData.contractNo = "";
    $scope.searchData.hardwardPurchaseNo = "";
    $scope.searchData.hardwarePlatform = "";
    $scope.searchData.sendBillNo = "";
    $scope.searchData.sendDate = "";
    setTimeout(function(){
        $("#dataQueryList").bootstrapTable('destroy');
        var table = new TableInit();
        table.Init();
    },100)

    window.opendataQueryDetail = {
        "click #dataQueryDetail":function(value,row,index){
            $rootScope.params = index;
            $scope.dataQueryUrl = 'dataQuery/dataQueryResultsDetails.html';
        }
    }

    //打开查看详情页面
    $scope.back = function(){
        $scope.dataQueryUrl = 'dataQuery/dataQueryResultsList.html';
        setTimeout(function(){
            var table = new TableInit()
            table.Init();
        },100)
    }

    // 点击查询按钮，进行查询.
    $scope.showQuery = function () {
        setTimeout(function(){
            $("#dataQueryList").bootstrapTable('destroy');
            var table = new TableInit();
            table.Init();
        },100)
    };

    // 重置
    $scope.reset = function () {
        $scope.searchData.hardwareSerialNumber = "";
        $scope.searchData.authCodeId = "";
        $scope.searchData.softwareVersion = "";
        $scope.searchData.contractNo = "";
        $scope.searchData.hardwardPurchaseNo = "";
        $scope.searchData.hardwarePlatform = "";
        $scope.searchData.sendBillNo = "";
        $scope.searchData.sendDate = "";
        $scope.searchData.protectivePlateId = "";
    }

    var TableInit = function(){
        var tableInte = new Object();
        //$scope.options = [];
        //$scope.events = [];
        tableInte.Init = function(){
            $("#dataQueryList").bootstrapTable({
                url: "/plmcore/dataQueryList",
                method:'get',
                pagination: true,
                sidePagination: 'server',
                showRefresh: false,
                pageNumber: 1,
                pageSize: 10,
                pageList:[10,25,50,100],
                showToggle: false,
                showColumns: false,
                search:false,
                iconSize: "outline",
                queryParams:function queryParams(params){
                    var param = {
                        "pageNo":params.offset / params.limit + 1,
                        "pageSize":params.limit,
                        "hardwareSerialNumber":$scope.searchData.hardwareSerialNumber,
                        "authCodeId":$scope.searchData.authCodeId,
                        "protectivePlateId":$scope.searchData.protectivePlateId,
                        "softwareVersion":$scope.searchData.softwareVersion,
                        "contractNo":$scope.searchData.contractNo,
                        "hardwardPurchaseNo":$scope.searchData.hardwardPurchaseNo,
                        "hardwarePlatform":$scope.searchData.hardwarePlatform,
                        "sendBillNo":$scope.searchData.sendBillNo,
                        "sendDate":$scope.searchData.sendDate
                    }
                    return param;
                },
                columns: [
                    {field: 'id', title: 'id',visible: false},
                    {field: 'hardwareSerialNumber', title: '硬件序列号'},
                    {field: 'authCodeId', title: '管理板授权码'},
                    {field: 'protectivePlateId', title: '防护板授权码'},
                    {field: 'softwareVersion', title: '软件版本'},
                    {field: 'contractNo', title: '合同号'},
                    {field: 'hardwardPurchaseNo', title: '采购单号'},
                    {field: 'sendBillNo', title: '发货单号'},
                    {field: 'hardwarePlatform', title: '硬件平台'},
                    {field: 'productStatus', title: '产品状态',formatter: function(value,row,index){
                            var rtn
                            if(value == '1'){
                                rtn = "<div class='color_1'>在保</div>"
                            }else if(value == '0'){
                                rtn = "<div class='color_4'>即将过保</div>"
                            }else if(value == '2'){
                                rtn = "<div class='color_5'>已过保</div>"
                            }

                            return rtn
                        }},

                    {field: 'operate', title: '操作', formatter: function(value,row,index){
                            var rtn = '<a title="查看详情" id="dataQueryDetail">查看详情</a>'
                            return rtn
                        },events:opendataQueryDetail}
                    /*{field: 'operate', title: '操作', formatter: function(value,row,index){
                            var rtn = "<div id='option_"+index+"'></div>"
                            var event= '<a title="查看详情" ng-click="opendataQueryDetail('+row.id+')">查看详情</a> &nbsp;'

                            $scope.options.push("option_"+index)
                            $scope.events.push(event)
                            return rtn
                     }}*/

                ],
                /*onLoadSuccess:function(){
                    for(var i=0;i<$scope.options.length;i++){
                        var _option = $scope.options[i]
                        var _event = $scope.events[i];
                        $('#'+_option).empty();
                        var $el = $(_event).appendTo('#'+_option);
                        $compile($el)($scope);
                    }
                }*/

            });
        }
        return tableInte
    }

});


/*查看详情*/
app.controller('dataQueryDetails',function($scope,$http,$rootScope,$uibModal,ngTip, $compile){
    //console.log($rootScope.params);
    var authorizationCode = $rootScope.params;
    $scope.maintenanceInfo = {};
    //硬件平台信息
    if(authorizationCode.hardwareNo!=''){
        $scope.hardwarePlatformPublish = {};
        $http({
            method :'POST',
            url :'/plmcore/checkHardwarePlatformPublishById',
            params: {
                id: authorizationCode.hardwareNo,
                sign: 'false'
            }
        }).success(function(res) {
            //console.log(res);
            $scope.hardwarePlatformPublish = res;
            if($scope.hardwarePlatformPublish.version=='1'){
                $scope.version = '单版';
                $scope.signleChecked = "false";
                $scope.twoVconfig = false;
            }else{
                $scope.version = '双版';
                $scope.doubleChecked = "true";
                $scope.twoVconfig = true;
            }
        }).error(function () {
            ngTip.tip("网络不通请重试");
        });

        /*详情中修改记录列表*/
        setTimeout(function(){
            $("#editRecordList").bootstrapTable({
                url: "/plmcore/checkHardwarePlatformPublishRecordById?id="+authorizationCode.hardwareNo+"&sign=false&type=1",
                method: 'get',
                showRefresh: false,
                pageNumber: 1,
                pagination: true,
                sidePagination: 'server',
                pageSize: 10,
                pageList:[10,25,50,100],
                showToggle: false,
                showColumns: false,
                signleSelect: true,
                search:false,
                queryParams:function queryParams(params){
                    var param = {
                        "pageNo":params.offset / params.limit + 1,
                        "pageSize":params.limit
                    }
                    return param;
                },
                columns: [
                    {field: 'id', title: '序号'},
                    {field: 'userName', title: '操作人'},
                    {field: 'operateType', title: '操作类型'},
                    {field: 'operateTime', title: '操作时间'},
                    {field: 'details', title: '详情'}
                ]
            });
        },500)
        $scope.hardwareFileList = [];
        $http({
            url: "/plmcore/getHardwareBomFileList",
            method:'post',
            params: {
                hardwareCode: authorizationCode.hardwareNo,
                hardwarePlatformId: "",
            }
        }).success(function(res){
            //console.log(res);
            var getDataArr = res;
            var dataLength = getDataArr.length;
            for(var i=0;i<dataLength;i++){
                $scope.hardwareFileList.push({
                    id:getDataArr[i].id,
                    createTime:getDataArr[i].createTime,
                    fileName:getDataArr[i].fileName,
                    filePath:getDataArr[i].filePath,
                    type:getDataArr[i].type,
                    hardwarePlatformId: getDataArr[i].hardwarePlatformId
                });
            }
        }).error(function () {
            ngTip.tip("网络不通请重试");
        });

    }else{
        /*详情中修改记录列表*/
        setTimeout(function(){
            $("#editRecordList").bootstrapTable({
                url: "",
                search: false,
                pagination: true,
                showRefresh: false,
                showToggle: false,
                showColumns: false,
                columns: [
                    {field: 'id', title: '序号'},
                    {field: 'userName', title: '操作人'},
                    {field: 'operateType', title: '操作类型'},
                    {field: 'operateTime', title: '操作时间'},
                    {field: 'details', title: '详情'}
                ]
            });
        },500)
    }


    /*点击下载*/
    $scope.downloadFile = function(filePath,createTime){
        if(createTime== undefined){
            ngTip.tip("该文件还未上传");
        }else{
            filePath = encodeURI(filePath);
            location.href = "/plmcore/afterSaleDownloadFile?filePathAll=" + filePath;
        }
    }


    //合同信息
    $scope.contractDetails = function(){
        $scope.contractOrder = {};
        $scope.contractOrder.id = authorizationCode.contractNo;
        if($scope.contractOrder.id!=''){
            $http({
                url: '/plmcore/updateContractOrderView',
                method: 'post',
                params: {
                    id: $scope.contractOrder.id,
                    sign: 'false'
                }
            }).success(function (res) {
                $scope.contractOrder = res.contractOrderVo;
                $scope.saleUserId = res.contractOrderVo.saleUserId;
                $scope.productList = res.contractFinishedProductList;
            }).error(function () {
                ngTip.tip("网络不通请重试");
            });

        }
    }
    //采购信息
    $scope.purchaseDetails = function(){
        $scope.title = '新增';
        $scope.hardwarePlatformPurchase = {};
        $scope.hardwarePlatformPurchase.id = 0;
        $scope.serialNumberType = 'single';
        $scope.singleSerialNumberType = true;
        $scope.multipleSerialNumberType = false;
        $scope.addHardwareSerialNumber = {};
        if(authorizationCode.hardwardPurchaseNo!=''){
            $http({
                url:'/plmcore/updateHardwareProchaseView',
                method:'post',
                params: {
                    id: authorizationCode.hardwardPurchaseNo,
                    sign: 'false'
                }
            }).success(function(res){
                $scope.hardwarePlatformPurchase = res;
            }).error(function () {
                ngTip.tip("网络不通请重试");
            });

            setTimeout(function(){
                $("#serialNumberList").bootstrapTable({
                    url: "/plmcore/purchaseSerialNumberRecord",
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
                    search:false,
                    iconSize: "outline",
                    toolbar: "#toolbar",
                    queryParams:function queryParams(params){
                        var id = authorizationCode.hardwardPurchaseNo;
                        var keyword = params.search;
                        if(keyword!== undefined){

                        }else{
                            keyword = "";
                        }
                        var param = {
                            "pageNo":params.offset / params.limit + 1,
                            "pageSize":params.limit,
                            "sign": false,
                            "id": id,
                            "keyword":keyword
                        }
                        return param;
                    },
                    columns: [
                        {field: 'hardwareSerialNumber', title: '硬件序列号'},
                        {field: 'myHardwareSerialNumber', title: '我司硬件序列号'},
                        {field: 'status', title: '状态',formatter:function(value,row,index){
                                var value = "";
                                if(row.status=='1'){
                                    return "已生产";
                                }else if(row.status=='2'){
                                    return "未生产";
                                }
                            }
                        },
                    ],
                });
            },500)
        }
    }


    //产品授权信息
    //如果该授权码不是UTM登记产生的，那么License类型(正式授权或临时授权)是同授权时间来计算出来的，授权时间小于等于90天的为临时授权，大于90天的为正式授权
    //这里需要根据授权时间计算一下
    //这里还要能够查询硬件序列号对应的历史记录，即一个硬件关联多个授权码ID进行制作，查询authorization_code_history表
    $scope.authDetails = function(){
        $scope.options = [];
        $scope.events = [];
        if(authorizationCode.id!=''){
            setTimeout(function(){
                $("#licenseLogList").bootstrapTable({
                    url: "/plmcore/queryProductAuthInfo?id="+authorizationCode.id,
                    method:'get',
                    pagination: false,
                    showRefresh: false,
                    showToggle: false,
                    showColumns: false,
                    search:false,
                    iconSize: "outline",
                    columns: [
                        {field: 'userName', title: '用户名称'},
                        {field: 'executeDate', title: '制作日期'},
                        {field: 'executeTime', title: '制作时间'},
                        {field: 'fileName', title: '授权码文件'},
                        {field: 'authCodeId', title: 'License ID'},
                        {field: 'hardwareSerialNumber', title: 'SN序列号'},
                        {field: 'status', title: '制作状态'},
                        {field: 'authType', title: 'License类型'},
                        {field: 'authConfigId', title: '', visible:false},
                        /*{field: 'msg', title: '详情信息', formatter: function(value,row,index){
                                alert(index);
                                var rtn = "<div id='msg_"+index+"'></div>"
                                var event= '<a title="详细信息"  id="message">详细信息</a> &nbsp;'
                                return event;
                            },events:openmsg}*/
                        {
                            field: 'operate', title: '操作', formatter: function (value, row, index) {
                                var rtn = "<div id='option_" + index + "'></div>"
                                var event = '<span title="详情信息" ng-click="openmsg(' + row.authConfigId + ')"><a class="fa fa-search"></a></span>';
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

            },500)
        }
    }

    /*window.openmsg = {
        "click #message":function(value,row,index){
            $uibModal.open({
                templateUrl : 'lifeCycleManagement/license/license_log/license_logMessage.html',
                controller :'licenseLogMessageCtrl',
                backdrop :'static',
                size : 'md',
                resolve : {
                    param : function() {
                        return   angular.copy(index);
                    }
                }
            });
        }
    }*/

    //打开新增 、编辑页面
    $scope.openmsg = function(obj){
        $uibModal.open({
                templateUrl : 'lifeCycleManagement/license/license_log/license_logMessage.html',
                controller :'licenseLogMessageCtrl',
                backdrop :'static',
                size : 'md',
                resolve : {
                    param : function() {
                        return   angular.copy(obj);
                    }
                }
            });
    }

    $scope.productDeliver = {};
    $scope.sendDetails = function(){
        //发货信息
        if(authorizationCode.sendBillNo!=''){
            $http({
                url: "/plmcore/productDeliverView",
                method:'post',
                params: {
                    id: authorizationCode.sendBillNo,
                    sign: 'false'
                }
            }).success(function(res){
                $scope.productDeliver = res;
                $scope.productDeliver.contractNo = authorizationCode.contractNo;
            }).error(function () {
                ngTip.tip("网络不通请重试");
            });

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
                ngTip.tip("网络不通请重试");
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
                ngTip.tip("网络不通请重试");
            });

            // 接收人名称下拉框
            $http({
                method :'POST',
                url :'/plmcore/receiveUserList'
            }).success(function(res) {
                $scope.receiveData = res;
            }).error(function () {
                ngTip.tip("网络不通请重试");
            });

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
                            "productDeliverId":authorizationCode.sendBillNo,
                            "sign": false
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
            },500)

        }
    }

    //安装售后信息
    $scope.afterService = function(){
        //这里会调用执行dataQueryProductServiceListCtrl
    }

    //维保信息
    $scope.maintenanceDetails = function(){
        $scope.buttonHardware = false;
        $scope.buttonProduct = false;
        if(authorizationCode.id!=''){
            //根据authorizationCode.id查询authorization_code表中的硬件状态(hardware_status)和硬件处理方式(hardware_deal_mode)
            //根据authorizationCode.id查询authorization_code表中的软件状态(product_status)和软件处理方式(software_deal_mode)
            $http({
                method :'POST',
                url :'/plmcore/queryAuthorizationCodeById',
                params: {
                    id: authorizationCode.id
                }
            }).success(function(res) {
                $scope.maintenanceInfo = res;
                //如果硬件处于在保状态，对应的处理方式按钮是不可以点击的，提交确定按钮也是不可点击的
                //如果如果处于在保状态，对应的处理方式按钮是不可以点击的，提交确定按钮也是不可点击的
                if($scope.maintenanceInfo.hardwareStatus=='1'){
                    $scope.hardwareDisplay = "在保";
                    $scope.invalidHardware = true;
                }else{
                    $scope.hardwareDisplay = "已过保";
                    $scope.invalidHardware = false;
                }
                if($scope.maintenanceInfo.productStatus=='1'){
                    $scope.productDisplay = "在保";
                    $scope.invalidProduct = true;
                }else{
                    $scope.productDisplay = "已过保";
                    $scope.invalidProduct = false;
                }

            }).error(function () {
                ngTip.tip("网络不通请重试");
            });

        }
    }

    //硬件已过保或软件已过保的处理方法
    $scope.expirationDeal = function(type){
        var dealMode = "";
        if(type=='1'){
            dealMode = $scope.maintenanceInfo.hardwareDealMode;
        }else{
            dealMode = $scope.maintenanceInfo.productDealMode;
        }
        $http({
            method :'POST',
            url :'/plmcore/expirationDeal',
            params: {
                id: authorizationCode.id,
                type: type,
                dealMode: dealMode
            }
        }).success(function(res) {
            if(res.stateCode==1){
                ngTip.tip(res.message);
            }else{
                ngTip.tip("处理失败");
            }
            if(type=='1'){
                //防止重复提交
                $scope.buttonHardware = true;
            }else{
                //防止重复提交
                $scope.buttonProduct = true;
            }
        }).error(function () {
            ngTip.tip("网络不通请重试");
        });

    }

})

app.controller('licenseLogMessageCtrl',function($scope,$uibModalInstance,param,$http,$compile){
    //关闭按钮
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }

    $scope.productAuthInfo = {};
    //获取license对应的配置信息
    $http({
        method :'POST',
        url :'/plmcore/queryAuthCodeConfigById',
        params: {
            id: param
        }
    }).success(function(res) {
        $scope.productAuthInfo = res;
    }).error(function () {
        ngTip.tip("网络不通请重试");
    });
})

//产品安装售后
app.controller('dataQueryProductServiceListCtrl',  function($scope) {
    /*初始化时展示列表*/
    $scope.productServiceUrl = 'lifeCycleManagement/productService/dataQueryProductServiceListContent.html';
    /*点击查看详情*/
    $scope.productServiceDetail = function(obj){
        $scope.obj = obj;
        $scope.productServiceUrl = 'lifeCycleManagement/productService/dataQueryProductServiceDetail.html';
    };
    /*点击返回按钮*/
    $scope.back = function(){
        $scope.productServiceUrl = 'lifeCycleManagement/productService/dataQueryProductServiceListContent.html'
    }

});

//产品安装售后列表
app.controller('dataQueryProductServiceListContentCtrl',  function($scope,$rootScope,NgTableParams, getDataService,$screenFactory, $uibModal,$compile) {
    $scope.options = [];
    $scope.events = [];
    if($rootScope.params.hardwareSerialNumber!=''){
        $("#productServiceList").bootstrapTable({
            url: "/plmcore/productServiceList",
            method:'get',
            showRefresh: false,
            pageNumber: 1,
            pagination: true,
            sidePagination: 'server',
            pageSize: 2,
            pageList:[5,25,50,100],
            showToggle: false,
            showColumns: false,
            signleSelect: true,
            search:false,
            iconSize: "outline",
            toolbar: "#toolbar",
            queryParams:function queryParams(params){
                var param = {
                    "pageNo":params.offset / params.limit + 1,
                    "pageSize":params.limit,
                    "hardwareSerialNumber":$rootScope.params.hardwareSerialNumber
                }
                return param;
            },
            columns: [
                {checkbox: true},
                {field: 'hardwareSerialNumber', title: '硬件序列号'},
                {field: 'impleUser', title: '实施人'},
                {field: 'createTime', title: '实施时间'},
                {field: 'company', title: '用户单位'},
                {field: 'contactPerson', title: '联系人'},
                {field: 'contactInfo', title: '联系方式'},
                {field: 'contractNo', title: '合同号'},
                {field: 'operate', title: '操作', formatter: function(value,row,index){
                        var rtn = "<div id='option_"+index+"'></div>"
                        var event= '<span title="查看详情" ng-click="productServiceDetail('+row.id+')"><a class="fa fa-search"></a></span>';
                        $scope.options.push("option_"+index);
                        $scope.events.push(event);
                        return rtn;
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
    }else{
        $("#productServiceList").bootstrapTable({
            url: "",
            method:'get',
            showRefresh: false,
            pageNumber: 1,
            pagination: true,
            sidePagination: 'server',
            pageSize: 2,
            pageList:[5,25,50,100],
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
                {field: 'hardwareSerialNumber', title: '硬件序列号'},
                {field: 'impleUser', title: '实施人'},
                {field: 'createTime', title: '实施时间'},
                {field: 'company', title: '用户单位'},
                {field: 'contactPerson', title: '联系人'},
                {field: 'contactInfo', title: '联系方式'},
                {field: 'contractNo', title: '合同号'},
                {field: 'operate', title: '操作', formatter: function(value,row,index){
                        var rtn = "<div id='option_"+index+"'></div>"
                        var event= '<span title="查看详情" ng-click="productServiceDetail('+row.id+')"><a class="fa fa-search"></a></span>';
                        $scope.options.push("option_"+index);
                        $scope.events.push(event);
                        return rtn;
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
    }


    //打开详情页面
    /*$scope.productServiceDetail = function(obj){
        $uibModal.open({
            templateUrl : 'lifeCycleManagement/productService/productServiceDetail.html',
            controller :'productServiceDetailCtrl',
            backdrop :'static',
            size : 'lg',
            resolve : {
                param : function() {
                    return   angular.copy(obj);
                }
            }
        });
    }*/

});

//查看产品安装售后详情
app.controller('dataQueryProductServiceDetailCtrl',  function($scope,$rootScope,$http,$uibModal) {

    $scope.param = $scope.obj;

    $scope.title = '查看详情';
    $rootScope.checkProductServiceForm = {};
    $rootScope.checkProductServiceFormFor = {};
    $rootScope.checkProductServiceForm.id = 0;
    $rootScope.checkProductServiceForm.problemDescribe;
    $rootScope.checkProductServiceForm.processingMethod;
    $rootScope.indexId;
    $scope.operateType = "add";
    $scope.checkProductServiceForm.effectiveOld = [];
    $rootScope.checkProductServiceForm.effective =[];
    $rootScope.checkProductServiceForm.effective.describeArr = [];

    $rootScope.operateDisableSign = true;


    // 实施人名称下拉框
    $http({
        method :'POST',
        url :'/plmcore/businessUserListByType',
        params: {
            type: '6'
        }
    }).success(function(res) {
        $scope.impleData = res;
    }).error(function () {
        ngTip.tip("网络不通请重试");
    });


    // 联系人名称下拉框
    $http({
        method :'POST',
        url :'/plmcore/receiveUserList'
    }).success(function(res) {
        $scope.receiveData = res;
    }).error(function () {
        ngTip.tip("网络不通请重试");
    });

    $scope.operateType = "check";
    $rootScope.checkProductServiceForm.id = $scope.param;

    $http({
        url: "/plmcore/productServiceView",
        method:'post',
        params: {
            id: $scope.param
        }
    }).success(function(res){
        //console.log(res);
        $scope.checkProductServiceFormFor = res;
        $scope.checkProductServiceFormFor.customerId = res.customerId+"";
    }).error(function () {
        ngTip.tip("网络不通请重试");
    });


    $http({
        url: "/plmcore/getProductServiceRecordView",
        method:'post',
        params: {
            id: $scope.param
        }
    }).success(function(res){
        //console.log(res);
        var getDataArr = res;
        var dataLength = getDataArr.length;
        for(var i=0;i<dataLength;i++){
            var getImpleUserId = getDataArr[i].impleUserId+"";
            $scope.checkProductServiceForm.effective.push({
                id:getDataArr[i].id,
                createTime:getDataArr[i].createTime,
                impleUserId:getImpleUserId,
                afterSaleType:getDataArr[i].afterSaleType,
                problemDescribe:getDataArr[i].problemDescribe,
                detailedDescribeList: getDataArr[i].detailedDescribeList
            });
            $scope.checkProductServiceForm.effectiveOld.push({
                id:getDataArr[i].createTime,
                createTime:getDataArr[i].createTime,
                impleUserId:getImpleUserId,
                afterSaleType:getDataArr[i].afterSaleType,
                problemDescribe:getDataArr[i].problemDescribe,
                detailedDescribeList: getDataArr[i].detailedDescribeList
            });
        }
    }).error(function () {
        ngTip.tip("网络不通请重试");
    });



    /*点击详细描述按钮*/
    $scope.openDescribe = function(indexId,obj){
        $rootScope.indexId = indexId;
        $uibModal.open({
            templateUrl : 'lifeCycleManagement/productService/productServiceAddOrEditMsg.html',
            controller :'productServiceAddOrEditMsgCtrl',
            backdrop :'static',
            resolve : {
                param : function() {
                    return   angular.copy(obj);
                }
            }
        });

    }

});
