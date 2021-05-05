//硬件平台采购
app.controller('licenseMakeListCtrl',  function($scope,$confirm,ngTip,$http ,$uibModal,$compile) {

    $scope.options = [];
    $scope.events = [];
    $("#licenseMakeList").bootstrapTable({
        url: "/plmcore/authorizationCodeList",
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
            {field: 'authCodeFileName', title: '授权码文件名称'},
            {field: 'authCodeId', title: '授权码ID号'},
            {field: 'hardwareSerialNumber', title: '硬件序列号'},
            {field: 'contractNo', title: '合同号'},
            {field: 'importTime', title: '导入时间'},
            {field: 'status', title: '状态',formatter:function(value,row,index){
                    var value = "";
                    if(row.status=='1'){
                        return "未制作";
                    }else if(row.status=='2'){
                        return "已制作";
                    }else{
                        return "制作失败";
                    }
                }
            },
            {field: 'operate', title: '操作', formatter: function(value,row,index){
                var rtn = "<div id='option_"+index+"'></div>";
                var event = "";
                if(row.status=='2'){
                    event= '<span title="编辑" ng-click="addOreEditlicenseList('+row.id+')"><a class="fa fa-edit"></a></span> &nbsp;' +
                        '<span title="导出license"  ng-click="leadOutlicense('+row.id+')"><a class="fa fa-sign-out"></a></span>'
                }else{
                    event= '<span title="编辑" ng-click="addOreEditlicenseList('+row.id+')"><a class="fa fa-edit"></a></span>'
                }
                /*var event= '<span title="编辑" ng-click="addOreEditlicenseList('+row.id+')"><a class="fa fa-edit"></a></span> &nbsp;' +
                    '<span title="导出license"  ng-click="leadOutlicense('+row.id+')"><a class="fa fa-sign-out"></a></span>'*/

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

    $scope.isEmpty = function(obj){

        if(typeof obj == "undefined" || obj == null || obj == ""){
            return true;
        }else{
            return false;
        }
    }

    //点击制作license
    $scope.openlicenseMake = function(obj){

        var checkId = [];
        var rows = $("#licenseMakeList").bootstrapTable('getSelections');
        for(var i=0;i<rows.length;i++){
            checkId.push(rows[i].id);
            if($scope.isEmpty(rows[i].contractNo)){
                ngTip.tip("选择的数据中存在没有合同号的授权码！", "warning");
                return;
            }
        }
        if(rows.length == 0){
            ngTip.tip("请选择要制作的授权码ID！", "warning");
        }else if(rows.length>20){
            ngTip.tip("一次只能制作20个授权码ID！", "warning");
        }else{
            $uibModal.open({
                templateUrl : 'lifeCycleManagement/license/licenseMake/licenseMakeConfig.html',
                controller :'licenseMakeCtrl',
                backdrop :'static',
                size : 'lg',
                resolve : {
                    param : function() {
                        return   angular.copy(obj);
                    }
                }
            });
        }
    }


    //打开新增 、编辑页面
    $scope.addOreEditlicenseList = function(obj){
        //判断一下，已发货的硬件序列号不能修改
        $http({
            url:'/plmcore/hardwareSerialNumberIsSend',
            method:'post',
            params: {
                id: obj
            }
        }).success(function(res){
            if(res){
                $uibModal.open({
                    templateUrl : 'lifeCycleManagement/license/licenseMake/licenseMakeListAddOrEdit.html',
                    controller :'addOrEditlicenseMakeListCtrl',
                    backdrop :'static',
                    size : 'md',
                    resolve : {
                        param : function() {
                            return   angular.copy(obj);
                        }
                    }
                });
                }else{
                ngTip.tip("该授权码ID关联的硬件序列号已发货，不能修改！");
            }

        })
    }

    //点击导出license
    $scope.leadOutlicense = function(obj){
        var checkId = [];
        var rows = $("#licenseMakeList").bootstrapTable('getSelections');
        for(var i=0;i<rows.length;i++){
            checkId.push(rows[i].id);
        }

        var sign = true;

        //首先，判断在列表上选择某一条单个导出
        if(obj != undefined){
            sign = false;
            $uibModal.open({
                templateUrl : 'lifeCycleManagement/license/licenseMake/licenseleadOutList.html',
                controller :'licenseleadOutCtrl',
                backdrop :'static',
                size : 'lg',
                resolve : {
                    param : function() {
                        return   angular.copy(obj);
                    }
                }
            });
        }


        if(rows.length == 0){
            if(sign){
                ngTip.tip("请选择要导出的授权码！", "warning");
                return;
            }

        }else{
            obj = checkId;
            $uibModal.open({
                templateUrl : 'lifeCycleManagement/license/licenseMake/licenseleadOutList.html',
                controller :'licenseleadOutCtrl',
                backdrop :'static',
                size : 'lg',
                resolve : {
                    param : function() {
                        return   angular.copy(obj);
                    }
                }
            });
        }


    }


    $scope.deleteAuthorizationCode = function(obj){

        var checkId = [];
        var rows = $("#licenseMakeList").bootstrapTable('getSelections');
        for(var i=0;i<rows.length;i++){
            checkId.push(rows[i].id);
        }
        if(rows.length == 0){
            ngTip.tip("请选择要授权的数据！", "warning");
            return;
        }/*else if(rows.length>1){
            ngTip.tip("一次只能删除一个授权码ID！", "warning");
            return;
        }*/else {
            $confirm({text: "删除的数据无法恢复，您确认删除吗？", title: "删除数据", ok: "是", cancel: "否"})
                .then(function () {
                    $http({
                        method: "POST",
                        url: "/plmcore/deleteAuthorizationCode",
                        params: {
                            codeType: "1",
                            checkId: checkId
                        }
                    }).success(function (res) {
                        ngTip.tip(res.message, res.result);
                        $("#licenseMakeList").bootstrapTable('refresh');
                    })

                });

        }

    }


});
/*新增授权码序列号*/
app.controller('addOrEditlicenseMakeListCtrl',function($scope,$uibModalInstance,param,FileUploader,ngTip,$http,$compile,$uibModal,$rootScope){
    //关闭按钮
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }
    $scope.contractNoData = [];
    $scope.title = '新增';
    $scope.addAuthorization = {};
    $scope.addAuthorization.id = 0;
    $scope.disabledSign = "false";
    $scope.operateSign = true;
    $scope.operateType = "add";
    if(param != undefined){
        $scope.title = '编辑';
        $scope.addAuthorization.id = param;
        $scope.operateType = "edit";
        $http({
            url:'/plmcore/updateAuthorizationCodeView',
            method:'post',
            params: {
                id: param
            }
        }).success(function(res){
            $scope.addAuthorization = res;

            //根据所选择的合同号，查询该合同号下的成品编码
            $http({
                method :'POST',
                url :'/plmcore/productCodeListByContractNo',
                params: {
                    contractNo: $scope.addAuthorization.contractNo //合同号
                }
            }).success(function(res) {
                $scope.productValue = res;
            }).error(function () {
                ngTip.tip("网络不通请关闭窗口重试");
            });

        }).error(function () {
            ngTip.tip("网络不通请关闭窗口重试");
        });
    }

    setTimeout(function(){
        $("#hardwareSerialNumber").bsSuggest({
            url: "/plmcore/hardwareSerialNoListView",
            showBtn:false,
            idField: "bind_contract_no",
            keyField: "hardware_serial_number",
            effectiveFields:["hardware_serial_number","bind_contract_no"],
            effectiveFieldsAlias:{"hardware_serial_number":"硬件SN号","bind_contract_no":"合同号"}
        }).on("onDataRequestSuccess", function (e, result) {
            //console.log("onDataRequestSuccess: ", result);
        }).on("onSetSelectValue", function (e, keyword) {
            //console.log("onSetSelectValue: ", keyword);
            $scope.addAuthorization.contractNo = keyword.id;
            $scope.addAuthorization.hardwareSerialNumber = keyword.key;

            //根据所选择的合同号，查询该合同号下的成品编码
            $http({
                method :'POST',
                url :'/plmcore/productCodeListByContractNo',
                params: {
                    contractNo: $scope.addAuthorization.contractNo //合同号
                }
            }).success(function(res) {
                $scope.productValue = res;
            }).error(function () {
                ngTip.tip("网络不通请关闭窗口重试");
            });



        }).on("onUnsetSelectValue", function (e) {
            //console.log("onUnsetSelectValue");
        })
    },500)

    setTimeout(function(){
        $("#contractNo").bsSuggest({
            url: "/plmcore/contractNoListView",
            showBtn:false,
            idField: "contractNo",
            keyField: "contractNo",
            effectiveFields:["contractNo"],
            effectiveFieldsAlias:{"contractNo":"合同号"}
        }).on("onDataRequestSuccess", function (e, result) {
            //console.log("onDataRequestSuccess: ", result);
            var len = result.value.length;
            for(var i = 0; i<len;i++){
                $scope.contractNoData.push(result.value[i].contractNo);

            }
        }).on("onSetSelectValue", function (e, keyword) {
            //console.log("onSetSelectValue: ", keyword);
            $scope.addAuthorization.contractNo = keyword.key;
            //根据所选择的合同号，查询该合同号下的成品编码
            $http({
                method :'POST',
                url :'/plmcore/productCodeListByContractNo',
                params: {
                    contractNo: $scope.addAuthorization.contractNo //合同号
                }
            }).success(function(res) {
                $scope.productValue = res;
            }).error(function () {
                ngTip.tip("网络不通请关闭窗口重试");
            });
        }).on("onUnsetSelectValue", function (e) {
            //console.log("onUnsetSelectValue");
        })
    },100);


    $scope.hardwareSerialNumberChange = function(){

        //根据所选择的合同号，查询该合同号下的成品编码
        $http({
            method :'POST',
            url :'/plmcore/productCodeListByContractNo',
            params: {
                contractNo: $scope.addAuthorization.contractNo //合同号
            }
        }).success(function(res) {
            $scope.productValue = res;
        }).error(function () {
            ngTip.tip("网络不通请关闭窗口重试");
        });;

    }

    //上传授权licenseID文件
    var uploaderAuthFile = $scope.uploaderAuthFile = new FileUploader({
        url: '/plmcore/addLicenseCode',
        queueLimit: 1,
        removeAfterUpload: true
    });

    $scope.clearItems = function () { // 重新选择文件时，清空队列，达到覆盖文件的效果
        uploaderAuthFile.clearQueue();
    };
    uploaderAuthFile.onBeforeUploadItem = function (fileItem) {
        var fileName = fileItem._file.name;
        fileItem.formData.push({"filename": fileName});
    };
    // 添加文件之后,去掉不符合格式的
    uploaderAuthFile.onAfterAddingFile = function (fileItem) {
        var size = fileItem._file.size;
        var fileName = fileItem._file.name;
        var index = fileName.lastIndexOf(".");
        var extName = fileName.substring(index + 1);
        var fileType = fileItem._file.type;
        $scope.serviceId = fileName.substring(0, fileName.length - 11);
        /*if ("p12" !== extName) {
            uploaderAuthFile.clearQueue();
            angular.element("#authIdFile").val('');
            ngTip.tip("文件格式错误，请重新选择文件", "warning");
            return;
        }*/

        // 上传大小最大为10m
        if (size > 1024 * 1024 * 10) {
            uploaderAuthFile.clearQueue();
            angular.element("#authIdFile").val('');
            ngTip.tip("上传文件不允许超过10M", "warning");
            return;
        }
        uploaderAuthFile.uploadAll();
        $("#authId").val(fileName);
    };

    // 添加文件成功
    uploaderAuthFile.onSuccessItem = function (fileItem, response) {
        $rootScope.importLicenseResultList = [];
        $rootScope.importSuccessCount = "";
        $rootScope.importFailCount = "";
        //console.log(response);
        if (response.stateCode === 0) {
            $rootScope.disabledSign = "true";
            //ngTip.tip("上传成功", "warning");
            var getDataArr = eval('(' + response.message + ')');
            var dataLength = getDataArr.length;
            for(var i=0;i<dataLength;i++){
                $rootScope.importSuccessCount = getDataArr[i].successCount;
                $rootScope.importFailCount = getDataArr[i].failCount;
                $rootScope.importLicenseResultList.push({
                    id:getDataArr[i].id,
                    invalidAuthCodeId:getDataArr[i].invalidAuthCodeId,
                    existAuthCodeId:getDataArr[i].existAuthCodeId,
                    invalidHardwareSerialNumber:getDataArr[i].invalidHardwareSerialNumber,
                    existHardwareSerialNumber: getDataArr[i].existHardwareSerialNumber
                });
            }
            $uibModal.open({
                templateUrl : 'lifeCycleManagement/license/licenseMake/licenseResult.html',
                controller :'addOrEditlicenseMakeListCtrl',
                backdrop :'static',
                size : 'lg',
                resolve : {
                    param : function() {
                        return   angular.copy();
                    }
                }
            });
            /*angular.element("#authIdFile").val('');
            ngTip.tip(response.message, "warning");*/
            $uibModalInstance.close('cancel');
            $("#licenseMakeList").bootstrapTable('refresh');
        } else if(response.httpStatus === 200 && response.stateCode === 1){
            $uibModalInstance.close('cancel');
            ngTip.tip(response.message, "warning");
            $("#licenseMakeList").bootstrapTable('refresh');
        }
    };


    //导入license时后端返回结果
    $scope.licenseResult = function(obj){
        $uibModal.open({
            templateUrl : 'lifeCycleManagement/license/licenseMake/licenseResult.html',
            controller :'addOrEditlicenseMakeListCtrl',
            backdrop :'static',
            size : 'lg',
            resolve : {
                param : function() {
                    return   angular.copy(obj);
                }
            }
        });
    }


    $scope.changetype = function(operateType){

        if(operateType=='multiple'){
            $scope.operateSign = false;
        }else{
            $scope.operateSign = true;
        }
    }

    $scope.isEmpty = function(obj){

        if(typeof obj == "undefined" || obj == null || obj == ""){
            return true;
        }else{
            return false;
        }
    }


    $scope.save = function () {

        if($scope.addLicenseType == 'single'){
            //授权码ID和合同号不能为空
            if($scope.addAuthorization.authCodeId==null || $scope.addAuthorization.authCodeId==''){
                ngTip.tip("授权码ID为必填");
                return;
            }

            //首先判断一下所选择的硬件编码是否存在，因为用户可以手动输入，为了防止用户手动输入，这里做一下检验
            if($scope.contractNoData.indexOf($scope.addAuthorization.contractNo)==-1){
                ngTip.tip("请从合同号下拉框中选择对应的合同号");
                return;
            }

            //正则表达式匹配数字和字母混合(限定位数为32至36)
            var regCodeId = new RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{32,36}$/);
            //首先，把$scope.addAuthorization.authCodeId中的”-“全部替换为”0“
            var uapCodeId = $scope.addAuthorization.authCodeId.replace(new RegExp("-","gm"),"0");
            //uap序列号样例：3d926a6e-bd65-4cc1-865e-62ac8c21c8d3
            //判断是否包含数字、字母和-
            var uapSign = (regCodeId.test(uapCodeId) && $scope.addAuthorization.authCodeId.indexOf("-")>-1);
            if($scope.addAuthorization.authCodeId=="" || (!regCodeId.test($scope.addAuthorization.authCodeId) && !uapSign)){
                ngTip.tip("管理版序列号是由字母与数字或字母、数字和-组成且长度为32到36位");
                return;
            }
            //正则表达式匹配全数字或全字母(限定位数为10,16)
            var regHardwareSerialNumber = new RegExp(/^[a-zA-Z0-9]{10,16}$/);
            //正则表达式匹配数字和字母混合(限定位数为4,20)
            //var regHardwareSerialNumber = new RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4,20}/);
            if(!$scope.isEmpty($scope.addAuthorization.hardwareSerialNumber)){
                if($scope.addAuthorization.hardwareSerialNumber=="" || !regHardwareSerialNumber.test($scope.addAuthorization.hardwareSerialNumber)){
                    ngTip.tip("硬件序列号是由字母与数字组成且长度在10到16之间");
                    return;
                }
            }

            if($scope.isEmpty($scope.addAuthorization.productCode)){
                ngTip.tip("成品编码不能为空");
                return;
            }

            //正则表达式匹配纯数字(限定位数为6,20)
            var regContractNo = new RegExp(/^[0-9a-zA-Z]*$/g);
            if($scope.addAuthorization.contractNo=="" || !regContractNo.test($scope.addAuthorization.contractNo) || $scope.addAuthorization.contractNo.length<6 || $scope.addAuthorization.contractNo.length>20){
                ngTip.tip("合同号是由全数字、全字母或字母数字混合组成且长度在6到20");
                return;
            }

            $http({
                method: "POST",
                url: "/plmcore/addLicenseCode",
                params: {
                    authCodeId: $scope.addAuthorization.authCodeId,
                    hardwareSerialNumber: $scope.addAuthorization.hardwareSerialNumber,
                    contractNo: $scope.addAuthorization.contractNo,
                    productCode: $scope.addAuthorization.productCode,
                    id:$scope.addAuthorization.id,
                    type: $scope.addLicenseType,
                    operateType: $scope.operateType
                }
            }).success(function (res) {
                //ngTip.tip(res.message, res.result);
                $rootScope.importLicenseResultList = [];



                if (res.stateCode === 0) {
                    $rootScope.disabledSign = "true";
                    //ngTip.tip("上传成功", "warning");
                    var getDataArr = eval('(' + res.message + ')');
                    var dataLength = getDataArr.length;
                    for(var i=0;i<dataLength;i++){
                        $rootScope.importSuccessCount = getDataArr[i].successCount;
                        $rootScope.importFailCount = getDataArr[i].failCount;
                        $rootScope.importLicenseResultList.push({
                            id:getDataArr[i].id,
                            invalidAuthCodeId:getDataArr[i].invalidAuthCodeId,
                            existAuthCodeId:getDataArr[i].existAuthCodeId,
                            invalidHardwareSerialNumber:getDataArr[i].invalidHardwareSerialNumber,
                            existHardwareSerialNumber: getDataArr[i].existHardwareSerialNumber
                        });
                    }
                    $uibModal.open({
                        templateUrl : 'lifeCycleManagement/license/licenseMake/licenseResult.html',
                        controller :'addOrEditlicenseMakeListCtrl',
                        backdrop :'static',
                        size : 'lg',
                        resolve : {
                            param : function() {
                                return   angular.copy();
                            }
                        }
                    });
                    /*angular.element("#authIdFile").val('');
                    ngTip.tip(response.message, "warning");*/
                    $uibModalInstance.close('cancel');
                    $("#licenseMakeList").bootstrapTable('refresh');
                    var time = setTimeout(function(){
                        $uibModalInstance.close(true);
                    },1000);
                } else if(res.httpStatus === 200 && res.stateCode === 1){
                    $uibModalInstance.close('cancel');
                    ngTip.tip(res.message, "warning");
                    $("#licenseMakeList").bootstrapTable('refresh');
                    var time = setTimeout(function(){
                        $uibModalInstance.close(true);
                    },1000);
                }




                /*$("#licenseMakeList").bootstrapTable('refresh');
                var time = setTimeout(function(){
                    $uibModalInstance.close(true);
                },1000);*/
            })
        }else{
            ngTip.tip("文件上传并保存成功");

            $("#licenseMakeList").bootstrapTable('refresh');
            var time = setTimeout(function(){
                $uibModalInstance.close(true);
            },1000);

        }
        //下面这种方式都可以刷新父页面列表页
        //parent.location.reload();
    }
})
/*配置license的Ctrl*/
app.controller('licenseMakeCtrl',function($scope,$uibModalInstance,ngTip,$http,param){
    //关闭按钮
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }
    $scope.productCodeData = [];
    $scope.anguanSign = true;
    $scope.authorizationConfig = {};
    $scope.authorizationId = 0;
    $scope.makeSign = false;

    $scope.changetype = function(productCode){
        var getProductCode = productCode.split(":");
        var productType = getProductCode[1];
        $scope.authorizationConfig.productType = productType;
        if(productType == 'NSM'){
            //网络安全防护管控软件
            $scope.anguanSign = true;
            $scope.jianchaSign = false;
            $scope.yitihuaOneSign = false;
            $scope.yitihuaTwoSign = false;
            $scope.fangHuAnQuanSign = false;
            $scope.uapSign = false;
            $scope.otherSign = false;

            $scope.authorizationConfig.authAging = '永久';
            $scope.authorizationConfig.softwareVersion = 'V3.0.0.0';
            $scope.authorizationConfig.hardwarePlatform = 'a100';
            $scope.authorizationConfig.authPoints = '100';
            $scope.authorizationConfig.areaType = 'kjzhw';
            $scope.authorizationConfig.situaTemplate = 'yes';
        }else if(productType == 'TNSM'){
            //网络安全管理与监察系统
            $scope.anguanSign = false;
            $scope.jianchaSign = true;
            $scope.yitihuaOneSign = false;
            $scope.yitihuaTwoSign = false;
            $scope.fangHuAnQuanSign = false;
            $scope.uapSign = false;
            $scope.otherSign = false;

            $scope.authorizationConfig.authAging = '永久';
            $scope.authorizationConfig.softwareVersion = 'V3.0.0.0';
            $scope.authorizationConfig.hardwarePlatform = 'a100';
            $scope.authorizationConfig.authPoints = '100';
            $scope.authorizationConfig.areaType = 'kjyww';
            $scope.authorizationConfig.situaTemplate = 'yes';

        }else if(productType == 'UPM1000'){
            //I型一体化安全防护设备
            $scope.anguanSign = false;
            $scope.jianchaSign = false;
            $scope.yitihuaOneSign = true;
            $scope.yitihuaTwoSign = false;
            $scope.fangHuAnQuanSign = false;
            $scope.uapSign = false;
            $scope.otherSign = false;

            $scope.authorizationConfig.authAging = '永久';
            $scope.authorizationConfig.softwareVersion = 'V3.0.0.0';
            $scope.authorizationConfig.hardwarePlatform = 'a110';
            $scope.authorizationConfig.authPoints = '100';
            $scope.authorizationConfig.areaType = 'kjzhw';
            $scope.authorizationConfig.situaTemplate = 'no';
        }else if(productType == 'UPM1000E'){
            //II型一体化安全防护设备
            $scope.anguanSign = false;
            $scope.jianchaSign = false;
            $scope.yitihuaOneSign = false;
            $scope.yitihuaTwoSign = true;
            $scope.fangHuAnQuanSign = false;
            $scope.uapSign = false;
            $scope.otherSign = false;

            $scope.authorizationConfig.authAging = '永久';
            $scope.authorizationConfig.softwareVersion = 'V3.0.0.0';
            $scope.authorizationConfig.hardwarePlatform = 'a112';
            $scope.authorizationConfig.authPoints = '100';
            $scope.authorizationConfig.areaType = 'kjzhw';
            $scope.authorizationConfig.situaTemplate = 'no';
        }else if(productType == 'UPM1000E-B'){
            //统一防护与安全防护系统
            $scope.anguanSign = false;
            $scope.jianchaSign = false;
            $scope.yitihuaOneSign = false;
            $scope.yitihuaTwoSign = false;
            $scope.fangHuAnQuanSign = true;
            $scope.uapSign = false;
            $scope.otherSign = false;

            $scope.authorizationConfig.authAging = '永久';
            $scope.authorizationConfig.softwareVersion = 'V3.0.0.0';
            $scope.authorizationConfig.hardwarePlatform = 'a104';
            $scope.authorizationConfig.authPoints = '100';
            $scope.authorizationConfig.areaType = 'kjzhw';
            $scope.authorizationConfig.situaTemplate = 'no';
        }else if(productType == 'UAP'){
            //UAP认证授权设备
            $scope.anguanSign = false;
            $scope.jianchaSign = false;
            $scope.yitihuaOneSign = false;
            $scope.yitihuaTwoSign = false;
            $scope.fangHuAnQuanSign = false;
            $scope.uapSign = true;
            $scope.otherSign = false;

            $scope.authorizationConfig.authAging = '永久';
            $scope.authorizationConfig.softwareVersion = 'V2.0.0.0';
            $scope.authorizationConfig.hardwarePlatform = 'a100';
            $scope.authorizationConfig.authPoints = '100';
            $scope.authorizationConfig.areaType = 'error';
            $scope.authorizationConfig.situaTemplate = 'error';
        }else if(productType == '其它'){
            //其它
            $scope.anguanSign = false;
            $scope.jianchaSign = false;
            $scope.yitihuaOneSign = false;
            $scope.yitihuaTwoSign = false;
            $scope.fangHuAnQuanSign = false;
            $scope.uapSign = false;
            $scope.otherSign = true;

            $scope.authorizationConfig.authAging = '永久';
            $scope.authorizationConfig.softwareVersion = 'V2.0.0.0';
            $scope.authorizationConfig.hardwarePlatform = 'a100';
            $scope.authorizationConfig.authPoints = '100';
            $scope.authorizationConfig.areaType = 'error';
            $scope.authorizationConfig.situaTemplate = 'error';
        }

    }

    setTimeout(function(){
        $("#productCode").bsSuggest({
            url: "/plmcore/productCodeList",
            showBtn:false,
            getDataMethod: "url",
            idField: "new_product_code",
            keyField: "product_code",
            showHeader: true,
            effectiveFields:["product_name","software_version","hardware_platform","product_code"],
            effectiveFieldsAlias:{"product_name":"成品名称","software_version":"软件版本","hardware_platform":"硬件平台","product_code":"成品编号"}
        }).on("onDataRequestSuccess", function (e, result) {
            //console.log("onDataRequestSuccess: ", result);
            var len = result.value.length;
            for(var i = 0; i<len;i++){
                $scope.productCodeData.push(result.value[i].product_code);
            }
        }).on("onSetSelectValue", function (e, keyword) {
            //console.log("onSetSelectValue: ", keyword);
            //console.log("onSetSelectValue: ", keyword.id);
            $scope.authorizationConfig.productCode = keyword.key;
            $scope.changetype(keyword.id);
        }).on("onUnsetSelectValue", function (e) {
            //console.log("onUnsetSelectValue");
        })
    },100)


    $scope.beginMake = function () {

        var checkIdLen = 0;
        var checkId = [];
        var rows = $("#licenseMakeList").bootstrapTable('getSelections');
        for(var i=0;i<rows.length;i++){
            checkId.push(rows[i].id);
            checkIdLen=checkIdLen+1;
        }
        if(rows.length == 0){
            ngTip.tip("请选择要授权的数据！", "warning");
        }

        //首先判断一下所选择的成品编码是否存在，因为用户可以手动输入，为了防止用户手动输入，这里做一下检验
        if($scope.productCodeData.indexOf($scope.authorizationConfig.productCode)==-1){
            ngTip.tip("请从产品类型下拉框中选择对应的产品");
            return;
        }
        $scope.makeSign = true;
        $http({
            method: "POST",
            timeout: 200000,
            url: "/plmcore/licenseMake",
            params: {
                productType: $scope.authorizationConfig.productType,
                productCode: $scope.authorizationConfig.productCode,
                authAging: $scope.authorizationConfig.authAging,
                softwareVersion: $scope.authorizationConfig.softwareVersion,
                hardwarePlatform: $scope.authorizationConfig.hardwarePlatform,
                authPoints: $scope.authorizationConfig.authPoints,
                areaType: $scope.authorizationConfig.areaType,
                situaTemplate: $scope.authorizationConfig.situaTemplate,
                descirbe: $scope.authorizationConfig.descirbe,
                authorizationId: checkId
            }
        }).success(function (res) {

            //根据checkIdLen的长度判断休眠多长时间，制作一个license需要5s
            setTimeout(function(){
                ngTip.tip(res.message);
                //$("#licenseMakeList").bootstrapTable('refresh');
                var time = setTimeout(function(){
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.location.reload();
                    parent.layer.close(index);
                },1000);
            },checkIdLen*6*1000)
        })
    }


})
/*导出license的Ctrl*/
app.controller('licenseleadOutCtrl',function($scope,$uibModalInstance,ngTip,$http,param){
    //关闭按钮
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }

    //console.log("param==="+param);

    setTimeout(function(){
        $("#licenseLeadOutList").bootstrapTable({
            url: "/plmcore/queryAuthorizationCodeListByIdTable?idArr="+param,
            method:'get',
            pagination: false,
            showRefresh: false,
            showToggle: false,
            showColumns: false,
            search:false,
            iconSize: "outline",
            columns: [
                {checkbox: true},
                {field: 'hardwareSerialNumber', title: '硬件序列号'},
                {field: 'authCodeFileName', title: 'Lincense文件名称'},
                {field: 'productType', title: '产品类型'},
                {field: 'authAging', title: '授权截止日期'},
                {field: 'softwareVersion', title: '软件版本'},
                {field: 'hardwarePlatform', title: '硬件平台'},
                {field: 'areaType', title: '业务类型'},
                {field: 'situaTemplate', title: '态势模块'},
                {field: 'executeTime', title: '完成时间'}
            ]
        });
    },100)



    $scope.exportAuthCode = function (param) {

        var checkId = [];
        if(param != undefined){
            checkId = param;
        }

        var rows = $("#licenseLeadOutList").bootstrapTable('getSelections');
        for(var i=0;i<rows.length;i++){
            checkId.push(rows[i].id);
        }
        if(rows.length == 0){
            ngTip.tip("请选择要导出的数据！", "warning");
            return;
        }

        location.href = "/plmcore/downloadFile?idArr=" + checkId;

    }


})