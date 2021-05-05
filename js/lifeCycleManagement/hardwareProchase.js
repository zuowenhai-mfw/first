//硬件平台采购
app.controller('hardwareProchaseListCtrl',  function($scope,NgTableParams, getDataService,$screenFactory, $uibModal,$compile,$confirm,ngTip,$http) {

    $scope.options = [];
    $scope.events = [];
    $("#hardwareProchaseList").bootstrapTable({
        url: "/plmcore/hardwarePlatformPurchaseList",
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
            {field: 'purchaseNo', title: '请购单号'},
            {field: 'orderUser', title: '下单人员'},
            {field: 'hardwareNo', title: '硬件编码'},
           /* {field: 'hardwareNumber', title: '硬件序列号'},*/
            {field: 'hardwarePlatform', title: '硬件平台'},
            {field: 'orderDate', title: '下单日期'},
            {field: 'arrivalDate', title: '到货日期'},

            {field: 'contractNo', title: '合同号'},
            {field: 'remarks', title: '备注'},
            {field: 'operate', title: '操作', formatter: function(value,row,index){
                var rtn = "<div id='option_"+index+"'></div>"
                var event= '<span title="编辑" ng-click="addOrEditHardwareProchase('+row.id+')"><a class="fa fa-edit"></a></span> &nbsp;'+
                    '<span title="查看详情" ng-click="hardwareProchaseDetail('+row.id+')"><a class="fa fa-search"></a></span>';

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
    $scope.addOrEditHardwareProchase = function(obj){

        if(obj != undefined){
            //编辑
            $http({
                method: 'post',
                url: '/plmcore/isUpdateHardwarePlatformProchase',
                params: {
                    id: obj
                }
            }).success(function (response) {
                if(response.stateCode == '1'){
                    //可以修改

                    $uibModal.open({
                        templateUrl : 'lifeCycleManagement/hardwareProchase/hardwareProchaseAddOrEdit.html',
                        controller :'addOrEditHardwareProchaseCtrl',
                        backdrop :'static',
                        size : 'lg',
                        resolve : {
                            param : function() {
                                return   angular.copy(obj);
                            }
                        }
                    });

                }else{
                    //不可以修改
                    ngTip.tip(response.message, "warning");
                    return;
                }
            }).error(function () {
                ngTip.tip("网络不通请重试");
            });

        }else{
            //新增
            $uibModal.open({
                templateUrl : 'lifeCycleManagement/hardwareProchase/hardwareProchaseAddOrEdit.html',
                controller :'addOrEditHardwareProchaseCtrl',
                backdrop :'static',
                size : 'lg',
                resolve : {
                    param : function() {
                        return   angular.copy(obj);
                    }
                }
            });
        }
    };

    //打开详情页面
    $scope.hardwareProchaseDetail = function(obj){
        $uibModal.open({
            templateUrl : 'lifeCycleManagement/hardwareProchase/hardwareProchaseDetail.html',
            controller :'hardwareProchaseDetailContentCtrl',
            backdrop :'static',
            size : 'lg',
            resolve : {
                param : function() {
                    return   angular.copy(obj);
                }
            }
        });
    }



    //删除列表
    $scope.deleHardwareProchase = function(){
        var checkId = [];
        var rows = $("#hardwareProchaseList").bootstrapTable('getSelections');
        for(var i=0;i<rows.length;i++){
            checkId.push(rows[i].id);
        }
        if(rows.length == 0){
            ngTip.tip("请选择要删除的数据！", "warning");
        }else if(rows.length>1){
            ngTip.tip("不能批量删除硬件采购单号，只能单个删除！", "warning");
        }else{

            $confirm({text: "删除的数据无法恢复，您确认删除吗？", title: "删除数据", ok: "是", cancel: "否"})
                .then(function () {
                    $http({
                        method: 'post',
                        url: '/plmcore/deleteHardwarePlatformProchase',
                        params: {
                            checkId: checkId.join(",")
                        }
                    }).success(function (response) {
                        if(response.stateCode == '1'){
                            ngTip.tip(response.message, "success");
                        }else{
                            ngTip.tip(response.message, "warning");
                        }
                        $("#hardwareProchaseList").bootstrapTable('refresh');
                    });
                });
        }
    }



});

/**
 *校验硬件平台采购单号唯一的指令。
 */
app.directive('purchasenoEnsureUnique',
    function ($http,ngTip) {
        return {
            restrict: 'EA',
            require: '?ngModel',
            link: function ($scope, element, attrs, c) {
                $scope.$watch(attrs.ngModel, function () {
                    var purchaseNo = $scope.hardwarePlatformPurchase.purchaseNo;
                    if ($scope.hardwarePlatformPurchase.purchaseNo !== undefined) {
                        $http({
                            method: 'POST',
                            timeout: 10000,
                            url: '/plmcore/validatePurchaseNo',
                            params: {
                                id: $scope.hardwarePlatformPurchase.id,
                                purchaseNo: purchaseNo
                            }
                        }).success(function (data) {
                            // 该方法用于改变验证状态，以及在控制变化的验证标准时通知表格（validationErrorKey,isValid）
                            c.$setValidity('purchaseNoUnique', data);
                        }).error(function () {
                            c.$setValidity('unique', false);
                            ngTip.tip("网络不通请关闭窗口重试");
                        });
                    }else{
                        c.$setValidity('purchaseNoUnique', true);
                    }

                });
            }
        }
    });

/*新增或者编辑*/
app.controller('addOrEditHardwareProchaseCtrl',function($scope,$uibModalInstance,ngTip,param,$http,$uibModal,$rootScope){
    //关闭按钮
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }
    $scope.title = '新增';
    $scope.hardwarePlatformPurchase = {};
    $scope.hardwarePlatformPurchase.id=0;
    $scope.serialNumberType = 'single';
    $scope.singleSerialNumberType = true;
    $scope.multipleSerialNumberType = false;
    $scope.addHardwareSerialNumber = {};
    $scope.purchaseNoSign = false;

    //下单人员名称下拉框
    $http({
        method :'POST',
        url :'/plmcore/businessUserListByType',
        params: {
            type: '3'
        }
    }).success(function(res) {
        $scope.order = res;
    }).error(function () {
        ngTip.tip("网络不通请关闭窗口重试");
    });

    //合同号下拉框
    $http({
        method :'POST',
        url :'/plmcore/queryAllContractOrder'
    }).success(function(res) {
        $scope.contract = res;
    }).error(function () {
        ngTip.tip("网络不通请关闭窗口重试");
    });

    if(param != undefined){
        $scope.title = '编辑';
        $scope.hardwarePlatformPurchase.id = param;
        $scope.purchaseNoSign = true;
        $http({
            url:'/plmcore/updateHardwareProchaseView',
            method:'post',
            params: {
                id: $scope.hardwarePlatformPurchase.id,
                sign: 'true'
            }
        }).success(function(res){
            $scope.hardwarePlatformPurchase = res;
            $scope.hardwarePlatformPurchase.id = param;
        }).error(function () {
            ngTip.tip("网络不通请关闭窗口重试");
        });


        $scope.options = [];
        $scope.events = [];
        setTimeout(function(){

            $scope.options = [];
            $scope.events = [];
            $("#serialNumberList").bootstrapTable({
                url: "/plmcore/purchaseSerialNumberRecord",
                method:'get',
                showRefresh: false,
                pageNumber: 1,
                pagination: true,
                sidePagination: 'server',
                pageSize: 100,
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
                    var paramm = {
                        "pageNo":params.offset / params.limit + 1,
                        "pageSize":params.limit,
                        "id":param,
                        "sign":true,
                        "keyword": keyword
                    }
                    return paramm;
                },
                columns: [
                    { title: '序号',formatter:function(val,row,index){
                            //获取每页显示的数据
                            var pageSize = $("#serialNumberList").bootstrapTable('getOptions').pageSize;
                            //获取当前第几页
                            var pageNumber = $("#serialNumberList").bootstrapTable('getOptions').pageNumber;
                            return pageSize * (pageNumber - 1) + index +1
                        }},
                    {field: 'hardwareSerialNumber', title: '硬件序列号'},
                    {field: 'myHardwareSerialNumber', title: '我司硬件序列号'},
                    {field: 'status', title: '状态',formatter:function(value,row,index){
                            var value = "";
                            if(row.status=='1'){
                                return "已生产";
                            }else if(row.status=='2'){
                                return "未生产";
                            }else{
                                return "未生产";
                            }
                        }
                    },
                    {field: 'operate', title: '操作', formatter: function(value,row,index){

                            var rtn = "<div id='remove_"+index+"'></div>"
                            var event= '<span title="编辑"  id="delserialNumberList"><a class="fa fa-remove"></a></span> &nbsp;'

                            return event;
                        },events:delserialNumber}
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
        },100)


    }else{
        $scope.options = [];
        $scope.events = [];
        setTimeout(function(){
            $("#serialNumberList").bootstrapTable({
                url: "",
                method:'get',
                pagination: true,
                showRefresh: false,
                showToggle: false,
                showColumns: false,
                search:false,
                iconSize: "outline",
                columns: [
                    { title: '序号',formatter:function(value,row,index){
                            //获取每页显示的数据
                            var pageSize = $("#serialNumberList").bootstrapTable('getOptions').pageSize;
                            //获取当前第几页
                            var pageNumber = $("#serialNumberList").bootstrapTable('getOptions').pageNumber;
                            return pageSize * (pageNumber - 1) + index +1
                        }},
                    {field: 'hardwareSerialNumber', title: '硬件序列号'},
                    {field: 'myHardwareSerialNumber', title: '我司硬件序列号'},
                    {field: 'salesperson', title: '状态'},

                    {field: 'operate', title: '操作', formatter: function(value,row,index){

                            /*var rtn = "<div id='remove_"+index+"'></div>"
                            var event= '<span title="编辑"  id="delserialNumberList"><a class="fa fa-remove"></a></span> &nbsp;'*/

                            var rtn = '<a title="删除" id="delserialNumberList">删除</a>'

                            return rtn;
                        },events:delserialNumber}
                ]

            });
        },100)

    }

    $scope.changetype = function(type){

        if(type == 'single'){
            $scope.serialNumberType = 'single';
            $scope.singleSerialNumberType = true;
            $scope.multipleSerialNumberType = false;
        }else{
            $scope.serialNumberType = 'multiple';
            $scope.singleSerialNumberType = false;
            $scope.multipleSerialNumberType = true;
        }

    }

    window.delserialNumber = {
        "click #delserialNumberList":function(value,row,index){
            $("#serialNumberList").bootstrapTable('remove',{field:"hardwareSerialNumber",values:[index.hardwareSerialNumber]})
        }
    }
    $scope.addHardwareSerialNumber = {}
    $scope.addserialNumber = function(){

        if($scope.serialNumberType == 'multiple'){

            if($scope.isEmpty($scope.addHardwareSerialNumber.originalFixed) || $scope.isEmpty($scope.addHardwareSerialNumber.beginOriginalSerial) ||
                $scope.isEmpty($scope.addHardwareSerialNumber.endOriginalSerial) || $scope.isEmpty($scope.addHardwareSerialNumber.myCompanyFixed) ||
                $scope.isEmpty($scope.addHardwareSerialNumber.beginMyCompanySerial) || $scope.isEmpty($scope.addHardwareSerialNumber.endMyCompanySerial)){
                ngTip.tip("原始固定值和我司固定值和范围都不能为空");
                return;
            }

            //这里判断 原始固定值的长度+原始序列号开始范围
            var originalBegin = $scope.addHardwareSerialNumber.originalFixed.replace(/\s+/g,"")+$scope.addHardwareSerialNumber.beginOriginalSerial.replace(/\s+/g,"");
            //原始固定值的长度+原始序列号结束范围
            var originalend = $scope.addHardwareSerialNumber.originalFixed.replace(/\s+/g,"")+$scope.addHardwareSerialNumber.endOriginalSerial.replace(/\s+/g,"");
            //我司固定值+我司序列号开始范围
            var myCompanyBegin = $scope.addHardwareSerialNumber.myCompanyFixed.replace(/\s+/g,"")+$scope.addHardwareSerialNumber.beginMyCompanySerial.replace(/\s+/g,"");
            //我司固定值+我司序列号结束范围
            var myCompanyEnd = $scope.addHardwareSerialNumber.myCompanyFixed.replace(/\s+/g,"")+$scope.addHardwareSerialNumber.endMyCompanySerial.replace(/\s+/g,"");

            var originalFixedReg = new RegExp(/^[0-9a-zA-Z]*$/g);
            var myCompanyFixedReg = new RegExp(/^[0-9a-zA-Z]*$/g);
            if(!originalFixedReg.test($scope.addHardwareSerialNumber.originalFixed) || !myCompanyFixedReg.test($scope.addHardwareSerialNumber.myCompanyFixed)){
                ngTip.tip("原始固定值和我司固定值必须为字母或数字");
                return;
            }

            var beginOriginalReg = new RegExp(/^[0-9]*$/g);
            var endOriginalReg = new RegExp(/^[0-9]*$/g);
            var beginMyCompanyReg = new RegExp(/^[0-9]*$/g);
            var endMyCompanyReg = new RegExp(/^[0-9]*$/g);
            //首先判断范围的beginOriginalSerial和endOriginalSerial是否都为数字
            //beginMyCompanySerial和endMyCompanySerial是否都为数字
            if(!beginOriginalReg.test($scope.addHardwareSerialNumber.beginOriginalSerial) || !endOriginalReg.test($scope.addHardwareSerialNumber.endOriginalSerial) ||
                !beginMyCompanyReg.test($scope.addHardwareSerialNumber.beginMyCompanySerial) || !endMyCompanyReg.test($scope.addHardwareSerialNumber.endMyCompanySerial)){
                ngTip.tip("原始序列号范围和我司序列号范围都必须为数字");
                return;
            }

            beginOriginalReg = new RegExp(/^[0-9]*$/g);
            endOriginalReg = new RegExp(/^[0-9]*$/g);
            beginMyCompanyReg = new RegExp(/^[0-9]*$/g);
            endMyCompanyReg = new RegExp(/^[0-9]*$/g);

            var originSign = false;
            var myCompanySign = false;
            var beginOrigin = "";
            var endOrigin = "";
            if(beginOriginalReg.test($scope.addHardwareSerialNumber.beginOriginalSerial) && endOriginalReg.test($scope.addHardwareSerialNumber.endOriginalSerial)){
                //如果都为数字，还要判断他们长度是否相等
                var beginOriginLen = $scope.addHardwareSerialNumber.beginOriginalSerial.length;
                var endOriginLen = $scope.addHardwareSerialNumber.endOriginalSerial.length;
                if(beginOriginLen==endOriginLen){
                    //如果长度一致，在判断endOriginalSerial的值是否大于beginOriginalSerial
                    beginOrigin = $scope.addHardwareSerialNumber.beginOriginalSerial.replace(/\b(0+)/gi,"");
                    endOrigin = $scope.addHardwareSerialNumber.endOriginalSerial.replace(/\b(0+)/gi,"");
                    if(parseInt(beginOrigin)>=parseInt(endOrigin)){
                        ngTip.tip("原始序列号范围,前者不能大于后者");
                        return;
                    }else{
                        originSign = true;
                    }
                }else{
                    ngTip.tip("原始序列号范围的数字长度必须一致");
                    return;
                }
            }

            var beginMy = "";
            var endMy = "";

            if(beginMyCompanyReg.test($scope.addHardwareSerialNumber.beginMyCompanySerial) && endMyCompanyReg.test($scope.addHardwareSerialNumber.endMyCompanySerial)){
                var beginMyLen = $scope.addHardwareSerialNumber.beginMyCompanySerial.length;
                var endMyLen = $scope.addHardwareSerialNumber.endMyCompanySerial.length;
                if(beginMyLen==endMyLen){
                    beginMy = $scope.addHardwareSerialNumber.beginMyCompanySerial.replace(/\b(0+)/gi,"");
                    endMy = $scope.addHardwareSerialNumber.endMyCompanySerial.replace(/\b(0+)/gi,"");

                    if(parseInt(beginMy)>=parseInt(endMy)){
                        ngTip.tip("我司序列号范围,前者不能大于后者");
                        return;
                    }else{
                        myCompanySign = true;
                    }
                }else{
                    ngTip.tip("我司序列号范围的数字长度必须一致");
                    return;
                }
            }
            if(originSign && myCompanySign){
                //只有原始序列号的范围，前者小于后者 且 我司序列号的范围前者小于后者
                //才能比较原始序列号后者减去前者是否等于我司序列号范围后者减去前者
                var originDiffer = parseInt(endOrigin)-parseInt(beginOrigin);
                var companyDiffer = parseInt(endMy)-parseInt(beginMy);
                if(originDiffer==companyDiffer){

                }else{
                    ngTip.tip("原始序列号范围长度与我司序列号范围的长度不一致");
                    return;
                }

                if(originDiffer+1>100 || companyDiffer+1>100){
                    ngTip.tip("生成的原始序列号或我司序列号不能超过100条");
                    return;
                }
            }
            if(originalBegin.length<10 || originalBegin.length>16){
                ngTip.tip("硬件序列号是由字母与数字组成且长度在10到16");
                return;
            }

            if(originalend.length<10 || originalend.length>16){
                ngTip.tip("硬件序列号是由字母与数字组成且长度在10到16");
                return;
            }

            if(myCompanyBegin.length<10 || myCompanyBegin.length>16){
                ngTip.tip("硬件序列号是由字母与数字组成且长度在10到16");
                return;
            }

            if(myCompanyEnd.length<10 || myCompanyEnd.length>16){
                ngTip.tip("硬件序列号是由字母与数字组成且长度在10到16");
                return;
            }

            //这里判断如果是多个序列号的时候，请求后台
            $http({
                url:'/plmcore/getSerialNumberList',
                method:'post',
                params: {
                    originalFixed: $scope.addHardwareSerialNumber.originalFixed,
                    beginOriginalSerial: $scope.addHardwareSerialNumber.beginOriginalSerial,
                    endOriginalSerial: $scope.addHardwareSerialNumber.endOriginalSerial,
                    myCompanyFixed: $scope.addHardwareSerialNumber.myCompanyFixed,
                    beginMyCompanySerial: $scope.addHardwareSerialNumber.beginMyCompanySerial,
                    endMyCompanySerial: $scope.addHardwareSerialNumber.endMyCompanySerial
                }
            }).success(function(res){

                if(res.stateCode==1){
                    $("#serialNumberList").bootstrapTable('removeAll');
                    $scope.serialNumberArr = eval('(' + res.message + ')');
                    var dataLength = $scope.serialNumberArr.length;
                    var getSerialNumberArr = JSON.parse(res.message);
                    //console.log(getSerialNumberArr.length);

                    for(var i=0;i<dataLength;i++){
                        //console.log(getSerialNumberArr[i].originalSerialNumber);
                        $("#serialNumberList").bootstrapTable('insertRow',{index:0,row:{hardwareSerialNumber:getSerialNumberArr[i].originalSerialNumber,myHardwareSerialNumber:getSerialNumberArr[i].myCompanySerialNumber,salesperson:"未生产"}});
                    }
                }else if(res.stateCode==2) {
                    $("#serialNumberList").bootstrapTable('removeAll');
                    //$scope.addHardwareSerialNumber = {};
                    $scope.serialNumberArr = eval('(' + res.message + ')');
                    var dataLength = $scope.serialNumberArr.length;
                    var getSerialNumberArr = JSON.parse(res.message);
                    $rootScope.orginalLen = "";
                    $rootScope.myCompanyLen = "";
                    //console.log(getSerialNumberArr.length);
                    $rootScope.existResultList = [];
                    for (var i = 0; i < dataLength; i++) {
                        //console.log(getSerialNumberArr[i].originalSerialNumber);
                        $rootScope.orginalLen = getSerialNumberArr[i].orginalLen;
                        $rootScope.myCompanyLen = getSerialNumberArr[i].myCompanyLen;
                        $rootScope.existResultList.push({
                            hardwareSerialNumber: getSerialNumberArr[i].originalSerialNumber,
                            myHardwareSerialNumber: getSerialNumberArr[i].myCompanySerialNumber
                        });
                    }
                    $uibModal.open({
                        templateUrl: 'lifeCycleManagement/hardwareProchase/hardwareSerialNumberResult.html',
                        controller: 'addOrEditHardwareProchaseCtrl',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            param: function () {
                                return angular.copy();
                            }
                        }
                    });
                }else{
                    ngTip.tip(res.message);
                }

            }).error(function () {
                ngTip.tip("网络不通请关闭窗口重试");
            });
        }else{
            var singleSerialNumber = $scope.addHardwareSerialNumber.singleSerialNumber;
            var mysingleSerialNumber = $scope.addHardwareSerialNumber.mysingleSerialNumber;
            var singleSerialReg = new RegExp(/^[0-9a-zA-Z]*$/g);
            var mysingleSerialReg = new RegExp(/^[0-9a-zA-Z]*$/g);

            if($scope.isEmpty(singleSerialNumber) || $scope.isEmpty(mysingleSerialNumber)){
                ngTip.tip("原始硬件序列号和我司硬件序列号不能为空");
                return;
            }

            if(!singleSerialReg.test(singleSerialNumber) || !mysingleSerialReg.test(mysingleSerialNumber)){
                ngTip.tip("原始硬件序列号和我司硬件序列号必须为字母或数字");
                return;
            }

            if(!$scope.isEmpty(singleSerialNumber)){
                if(singleSerialNumber.length>16 || singleSerialNumber.length<10){
                    ngTip.tip("硬件序列号是由字母与数字组成且长度在10到16");
                    return;
                }
            }

            if(!$scope.isEmpty(mysingleSerialNumber)){
                if(mysingleSerialNumber.length>16 || mysingleSerialNumber.length<10){
                    ngTip.tip("硬件序列号是由字母与数字组成且长度在10到16");
                    return;
                }
            }

            //singleSerialNumber和mysingleSerialNumber是否已存在
            $http({
                method :'POST',
                url :'/plmcore/hardwareSerialNumberIsExist',
                params: {
                    singleSerialNumber: singleSerialNumber, //原始硬件序列号
                    mysingleSerialNumber: mysingleSerialNumber //我司硬件序列号
                }
            }).success(function(res) {
                if (res.stateCode === 0) {
                    //表示硬件序列号已存在
                    ngTip.tip(res.message);
                    return;
                }else{
                    $("#serialNumberList").bootstrapTable('insertRow',{index:0,row:{hardwareSerialNumber:singleSerialNumber,myHardwareSerialNumber:mysingleSerialNumber,salesperson:"未生产"}});
                    $scope.addHardwareSerialNumber = {};
                }
            }).error(function () {
                ngTip.tip("网络不通请关闭窗口重试");
            });
        }
        //$scope.addHardwareSerialNumber = {};
    }

    setTimeout(function(){
        $("#hardware").bsSuggest({
            url: "/plmcore/hardwareCodeListView",
            showBtn:false,
            idField: "hardware_platform",
            keyField: "hardware_code",
            effectiveFields:["hardware_code","hardware_platform"],
            effectiveFieldsAlias:{"hardware_code":"编号","hardware_platform":"硬件平台"}
        }).on("onDataRequestSuccess", function (e, result) {
            //console.log("onDataRequestSuccess: ", result);
        }).on("onSetSelectValue", function (e, keyword) {
            //console.log("onSetSelectValue: ", keyword);
            $scope.hardwarePlatformPurchase.hardwareNo = keyword.key;
            $scope.hardwarePlatformPurchase.hardwarePlatform = keyword.id;
        }).on("onUnsetSelectValue", function (e) {
            //console.log("onUnsetSelectValue");
        })
    },100)


    $scope.isEmpty = function(obj){

        if(typeof obj == "undefined" || obj == null || obj == ""){
            return true;
        }else{
            return false;
        }
    }


    $scope.save = function () {

        var orderDate = new Date($scope.hardwarePlatformPurchase.orderDate);
        var arrivalDate = new Date($scope.hardwarePlatformPurchase.arrivalDate);
        if(orderDate>arrivalDate){
            ngTip.tip("下单日期不能大于到货日期");
            return;
        }

        var allTableData = $('#serialNumberList').bootstrapTable('getData');
        var operateType = "add";
        if(param != undefined){
            operateType = "edit";
        }
        $scope.serialNumberListParam = [];
        var serialNumberLen = 0;
        $.each(allTableData,function (i,e) {
            //console.log(e.hardwareNumber+"   "+e.myhardwareNumber);
            //console.log(e.hardwareSerialNumber+"   "+e.myHardwareSerialNumber);
            $scope.serialNumberListParam.push({
                originalSerialNumber:e.hardwareSerialNumber,
                myCompanySerialNumber:e.myHardwareSerialNumber
                });
            serialNumberLen=serialNumberLen+1;
            //console.log("serialNumberLen==========="+serialNumberLen);
        })
        //如果硬件序列号列表不为空，那么到货日期必填
        if(serialNumberLen>0 && $scope.isEmpty($scope.hardwarePlatformPurchase.arrivalDate)){
            ngTip.tip("请填写到货日期");
            return;
        }

        if(serialNumberLen>110){
            ngTip.tip("原型硬件序列号的条数不能超过110条");
            return;
        }

        $scope.getMaintenanceStartTime = $scope.hardwarePlatformPurchase.maintenanceStartTime;
        $scope.getOrderDate = $scope.hardwarePlatformPurchase.orderDate;
        $scope.getArrivalDate = $scope.hardwarePlatformPurchase.arrivalDate;
        $scope.hardwarePlatformPurchase.maintenanceStartTime = null;
        $scope.hardwarePlatformPurchase.orderDate = null;
        $scope.hardwarePlatformPurchase.arrivalDate = null;
        $http({
            method: "POST",
            url: "/plmcore/saveHardwareProchase",
            params: {
                id: param,
                purchaseNo: $scope.hardwarePlatformPurchase.purchaseNo,
                orderUserId: $scope.hardwarePlatformPurchase.orderUserId,
                hardwareNo: $scope.hardwarePlatformPurchase.hardwareNo,
                hardwarePlatform: $scope.hardwarePlatformPurchase.hardwarePlatform,
                getMaintenanceStartTime: $scope.getMaintenanceStartTime,
                purchaseSerialNumberArray: JSON.stringify($scope.serialNumberListParam),
                getOrderDate: $scope.getOrderDate,
                getArrivalDate: $scope.getArrivalDate,
                maintenancePeriod: $scope.hardwarePlatformPurchase.maintenancePeriod,
                contractNo: $scope.hardwarePlatformPurchase.contractNo,
                remarks: $scope.hardwarePlatformPurchase.remarks,
                operateType: operateType

            }
        }).success(function (res) {
            ngTip.tip(res.message, res.result);
            $("#hardwareProchaseList").bootstrapTable('refresh');
            var time = setTimeout(function(){
                $uibModalInstance.close(true);
            },1000);
        })


    }

});
/*详情弹出框*/
app.controller('ardwareProchaseDetailCtrl',function($scope,$uibModalInstance,param){
    //关闭按钮
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }
    $scope.param = param
});
/*详情内容*/
app.controller('hardwareProchaseDetailContentCtrl',function($scope,$uibModalInstance,ngTip,param,$http){


    //关闭按钮
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }
    $scope.title = '新增';
    $scope.hardwarePlatformPurchase = {};
    $scope.hardwarePlatformPurchase.id=0;
    $scope.serialNumberType = 'single';
    $scope.singleSerialNumberType = true;
    $scope.multipleSerialNumberType = false;
    $scope.addHardwareSerialNumber = {};
    $scope.purchaseNoSign = false;

    //下单人员名称下拉框
    $http({
        method :'POST',
        url :'/plmcore/businessUserListByType',
        params: {
            type: '3'
        }
    }).success(function(res) {
        $scope.order = res;
    }).error(function () {
        ngTip.tip("网络不通请关闭窗口重试");
    });

    //合同号下拉框
    $http({
        method :'POST',
        url :'/plmcore/queryAllContractOrder'
    }).success(function(res) {
        $scope.contract = res;
    }).error(function () {
        ngTip.tip("网络不通请关闭窗口重试");
    });

    if(param != undefined){
        $scope.title = '编辑';
        $scope.hardwarePlatformPurchase.id = param;
        $scope.purchaseNoSign = true;
        $http({
            url:'/plmcore/updateHardwareProchaseView',
            method:'post',
            params: {
                id: $scope.hardwarePlatformPurchase.id,
                sign: 'true'
            }
        }).success(function(res){
            $scope.hardwarePlatformPurchase = res;
            $scope.hardwarePlatformPurchase.id = param;
        }).error(function () {
            ngTip.tip("网络不通请关闭窗口重试");
        });


        $scope.options = [];
        $scope.events = [];
        setTimeout(function(){

            $scope.options = [];
            $scope.events = [];
            $("#serialNumberList").bootstrapTable({
                url: "/plmcore/purchaseSerialNumberRecord",
                method:'get',
                showRefresh: false,
                pageNumber: 1,
                pagination: true,
                sidePagination: 'server',
                pageSize: 100,
                pageList:[10,25,50,100],
                showToggle: false,
                showColumns: false,
                signleSelect: true,
                search:false,
                iconSize: "outline",
                toolbar: "#toolbar",
                queryParams:function queryParams(params){
                    var keyword = params.search;
                    if(keyword!== undefined){

                    }else{
                        keyword = "";
                    }
                    var paramm = {
                        "pageNo":params.offset / params.limit + 1,
                        "pageSize":params.limit,
                        "id":param,
                        "sign":true,
                        "keyword": keyword
                    }
                    return paramm;
                },
                columns: [
                    { title: '序号',formatter:function(val,row,index){
                            //获取每页显示的数据
                            var pageSize = $("#serialNumberList").bootstrapTable('getOptions').pageSize;
                            //获取当前第几页
                            var pageNumber = $("#serialNumberList").bootstrapTable('getOptions').pageNumber;
                            return pageSize * (pageNumber - 1) + index +1
                        }},
                    {field: 'hardwareSerialNumber', title: '硬件序列号'},
                    {field: 'myHardwareSerialNumber', title: '我司硬件序列号'},
                    {field: 'status', title: '状态',formatter:function(value,row,index){
                            var value = "";
                            if(row.status=='1'){
                                return "已生产";
                            }else if(row.status=='2'){
                                return "未生产";
                            }else{
                                return "未生产";
                            }
                        }
                    },
                    {field: 'operate', title: '操作', formatter: function(value,row,index){

                            var rtn = "<div id='remove_"+index+"'></div>"
                            var event= '<span title="编辑"  id="delserialNumberList"><a class="fa fa-remove"></a></span> &nbsp;'

                            return event;
                        },events:delserialNumber}
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
        },100)


    }else{
        $scope.options = [];
        $scope.events = [];
        setTimeout(function(){
            $("#serialNumberList").bootstrapTable({
                url: "",
                method:'get',
                pagination: true,
                showRefresh: false,
                showToggle: false,
                showColumns: false,
                search:false,
                iconSize: "outline",
                columns: [
                    { title: '序号',formatter:function(value,row,index){
                            //获取每页显示的数据
                            var pageSize = $("#serialNumberList").bootstrapTable('getOptions').pageSize;
                            //获取当前第几页
                            var pageNumber = $("#serialNumberList").bootstrapTable('getOptions').pageNumber;
                            return pageSize * (pageNumber - 1) + index +1
                        }},
                    {field: 'hardwareSerialNumber', title: '硬件序列号'},
                    {field: 'myHardwareSerialNumber', title: '我司硬件序列号'},
                    {field: 'salesperson', title: '状态'},

                    {field: 'operate', title: '操作', formatter: function(value,row,index){

                            /*var rtn = "<div id='remove_"+index+"'></div>"
                            var event= '<span title="编辑"  id="delserialNumberList"><a class="fa fa-remove"></a></span> &nbsp;'*/

                            var rtn = '<a title="删除" id="delserialNumberList">删除</a>'

                            return rtn;
                        },events:delserialNumber}
                ]

            });
        },100)

    }

    window.delserialNumber = {
        "click #delserialNumberList":function(value,row,index){
            $("#serialNumberList").bootstrapTable('remove',{field:"hardwareSerialNumber",values:[index.hardwareSerialNumber]})
        }
    }

})
