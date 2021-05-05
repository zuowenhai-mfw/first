//软件平台发布
app.controller('softwareListCtrl', function ($scope, NgTableParams, getDataService, $screenFactory,$confirm, ngTip,$uibModal,$http, $compile) {

    $scope.options = [];
    $scope.events = [];
    $("#softwareList").bootstrapTable({
        url: "/plmcore/softwareplatformList",
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
            {field: 'productCode', title: '成品编码'},
            {field: 'productName', title: '产品名称'},
            {field: 'softwareVersion', title: '软件版本'},
            {field: 'hardwareCode', title: '硬件编码'},
            {field: 'productType', title: '产品类型'},
            {field: 'publishPerson', title: '发布人'},
            {field: 'publishDate', title: '发布日期'},
            {field: 'putOnRecordDate', title: '建档日期'},
            {field: 'expectPurpose', title: '版本用途'},
            {field: 'remarks', title: '备注'},
            {
                field: 'operate', title: '操作', formatter: function (value, row, index) {
                var rtn = "<div id='option_" + index + "'></div>"
                var event = '<span title="编辑" ng-click="addOrEditSoftwareRelease(' + row.id + ')"><a class="fa fa-edit"></a></span> &nbsp;'+
                    '<span title="查看详情" ng-click="openSoftwareDetail('+row.id+')"><a class="fa fa-search"></a></span>';
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
    $scope.addOrEditSoftwareRelease = function (obj) {
        $uibModal.open({
            templateUrl: 'baseInform/softwareList/softwareReleaseAddOrEdit.html',
            controller: 'addOrEditSoftwareCtrl',
            backdrop: 'static',
            size: 'lg',
            resolve: {
                param: function () {
                    return angular.copy(obj);
                }
            }
        });
    }
    $scope.openSoftwareDetail = function(obj){
        $uibModal.open({
            templateUrl : 'baseInform/softwareList/softwareReleaseDetail.html',
            controller :'softwareReleaseDetailCtrl',
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
    $scope.delSoftwareList = function(){
        var checkId = [];
        var rows = $("#softwareList").bootstrapTable('getSelections');
        for(var i=0;i<rows.length;i++){
            checkId.push(rows[i].id);
        }
        if(rows.length == 0){
            ngTip.tip("请选择要删除的数据！", "warning");
        }else if(rows.length>1){
            ngTip.tip("不能批量删除成品编码，只能单个删除！", "warning");
        }else{

            $confirm({text: "删除的数据无法恢复，您确认删除吗？", title: "删除数据", ok: "是", cancel: "否"})
                .then(function () {
                    $http({
                        method: 'post',
                        url: '/plmcore/deleteFinishedProductPublish',
                        params: {
                            checkId: checkId.join(",")
                        }
                    }).success(function (response) {
                        if(response.stateCode == '1'){
                            ngTip.tip(response.message, "success");
                        }else{
                            ngTip.tip(response.message, "warning");
                        }
                        $("#softwareList").bootstrapTable('refresh');
                    });
                });
        }
    }

});


/**
 *校验新增成品编码唯一的指令。
 */
app.directive('productcodeEnsureUnique',
    function ($http,ngTip) {
        return {
            restrict: 'EA',
            require: '?ngModel',
            link: function ($scope, element, attrs, c) {
                $scope.$watch(attrs.ngModel, function () {
                    var productCode = $scope.finishedProductPublish.productCode;
                    if ($scope.finishedProductPublish.productCode !== undefined) {
                        $http({
                            method: 'POST',
                            timeout: 10000,
                            url: '/plmcore/validateProductCode',
                            params: {
                                id: $scope.finishedProductPublish.id,
                                productCode: productCode
                            }
                        }).success(function (data) {
                            // 该方法用于改变验证状态，以及在控制变化的验证标准时通知表格（validationErrorKey,isValid）
                            c.$setValidity('productCodeUnique', data);
                        }).error(function () {
                            c.$setValidity('productCodeUnique', false);
                            ngTip.tip("网络不通请关闭窗口重试");
                        });
                    }else{
                        c.$setValidity('productCodeUnique', true);
                    }

                });
            }
        }
    });


/**
 *校验新增成品名称唯一的指令。
 */
app.directive('productnameEnsureUnique',
    function ($http) {
        return {
            restrict: 'EA',
            require: '?ngModel',
            link: function ($scope, element, attrs, c) {
                $scope.$watch(attrs.ngModel, function () {
                    var productName = $scope.finishedProductPublish.productName;
                    if ($scope.finishedProductPublish.productName !== undefined) {
                        $http({
                            method: 'POST',
                            timeout: 10000,
                            url: '/plmcore/validateProductName',
                            params: {
                                id: $scope.finishedProductPublish.id,
                                productName: productName
                            }
                        }).success(function (data) {
                            // 该方法用于改变验证状态，以及在控制变化的验证标准时通知表格（validationErrorKey,isValid）
                            c.$setValidity('productNameUnique', data);
                        }).error(function () {
                            c.$setValidity('productNameUnique', false);
                            ngTip.tip("网络不通请关闭窗口重试");
                        });
                    }else{
                        c.$setValidity('productNameUnique', true);
                    }

                });
            }
        }
    });

/*查看详情*/
app.controller('softwareReleaseDetailCtrl',function($scope,$uibModalInstance,param,$http){
    //关闭按钮
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }
    $scope.finishedProductPublish = {};
    $scope.params = param
    $scope.softwareFileList = [];
    $scope.finishedProductPublish.id = param;
    $http({
        method :'POST',
        url :'/plmcore/updateFinishedProductView',
        params: {
            id: $scope.finishedProductPublish.id
        }
    }).success(function(res) {
        $scope.finishedProductPublish = res;
        if($scope.finishedProductPublish.isHardware == '1'){
            $scope.yesHardwareSign = true;
            $scope.noHardwareSign = false;
        }else{
            $scope.yesHardwareSign = false;
            $scope.noHardwareSign = true;
        }
    }).error(function () {
        ngTip.tip("网络不通请关闭窗口重试");
    });

    $http({
        url: "/plmcore/getSoftwareBomFileList",
        method:'post',
        params: {
            softwarePlatformId: $scope.finishedProductPublish.id
        }
    }).success(function(res){
        console.log(res);
        var getDataArr = res;
        var dataLength = getDataArr.length;
        for(var i=0;i<dataLength;i++){
            $scope.softwareFileList.push({
                id:getDataArr[i].id,
                createTime:getDataArr[i].createTime,
                fileName:getDataArr[i].fileName,
                filePath:getDataArr[i].filePath,
                type:getDataArr[i].type,
                hardwarePlatformId: getDataArr[i].hardwarePlatformId
            });
        }
    }).error(function () {
        ngTip.tip("网络不通请关闭窗口重试");
    });

    /*详情中修改记录列表*/
    setTimeout(function(){
        $("#softwareEditRecordList").bootstrapTable({
            url: "/plmcore/checkHardwarePlatformPublishRecordById?id="+$scope.finishedProductPublish.id+"&sign=true&type=2",
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

    /*点击下载*/
    $scope.downloadFile = function(filePath,createTime){
        if(createTime== undefined){
            ngTip.tip("该文件还未上传");
        }else{
            filePath = encodeURI(filePath);
            location.href = "/plmcore/afterSaleDownloadFile?filePathAll=" + filePath;
        }
    }
})

app.controller('addOrEditSoftwareCtrl', function ($scope, $uibModalInstance,ngTip, $http, param,FileUploader) {
    //关闭按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.publishUser = {};
    $scope.finishedProductPublish = {};
    $scope.finishedProductPublish.id = 0;
    $scope.title = '新增';
    $scope.finishedProductPublish.isHardware = '1';
    $scope.yesHardwareSign = 'true';
    $scope.getPutOnRecordDate;
    $scope.getPublishDate;
    $scope.productCodeSign = false;
    $scope.hardwareData = [];
    $scope.jdDate=new Date().toLocaleDateString();
    $scope.operateDisableSign = false;
    $scope.softwareFileList = [];
    $scope.finishedProductPublish.putOnRecordDate=$scope.jdDate.replace(new RegExp("/","gm"),"-");

    if(param != undefined){
        //进入编辑页面，从后台获取值赋值给页面元素
        $scope.finishedProductPublish.id = param;
        $scope.title = '编辑';
        $http({
            method :'POST',
            url :'/plmcore/updateFinishedProductView',
            params: {
                id: $scope.finishedProductPublish.id
            }
        }).success(function(res) {
            $scope.finishedProductPublish = res;
            $scope.publishUserId = $scope.finishedProductPublish.userId;
            $scope.productCodeSign = true;
            $scope.productNameSign = true;
            if($scope.finishedProductPublish.isHardware == '1'){
                $scope.yesHardwareSign = true;
                $scope.noHardwareSign = false;
            }else{
                $scope.yesHardwareSign = false;
                $scope.noHardwareSign = true;
            }

        }).error(function () {
            ngTip.tip("网络不通请关闭窗口重试");
        });

        $http({
            url: "/plmcore/getSoftwareBomFileList",
            method:'post',
            params: {
                softwarePlatformId: $scope.finishedProductPublish.id
            }
        }).success(function(res){
            //console.log(res);
            var getDataArr = res;
            var dataLength = getDataArr.length;
            for(var i=0;i<dataLength;i++){
                $scope.softwareFileList.push({
                    id:getDataArr[i].id,
                    createTime:getDataArr[i].createTime,
                    fileName:getDataArr[i].fileName,
                    filePath:getDataArr[i].filePath,
                    type:getDataArr[i].type,
                    hardwarePlatformId: getDataArr[i].hardwarePlatformId
                });
            }
        }).error(function () {
            ngTip.tip("网络不通请关闭窗口重试");
        });

    }else{
        $scope.title='新增';
    }

    // 发布人名称下拉框
    $http({
        method :'POST',
        url :'/plmcore/businessUserListByType',
        params: {
            type: '1' //1为发布人员
        }
    }).success(function(res) {
        $scope.publish = res;
    }).error(function () {
        ngTip.tip("网络不通请关闭窗口重试");
    });












    //上传硬件bom清单文件
    var uploaderServicefile = $scope.uploaderServicefile = new FileUploader({
        url: '/plmcore/uploadSoftwareFile',
        queueLimit: 10,
        removeAfterUpload: true
    });

    /*$scope.clearItems = function () { // 重新选择文件时，清空队列，达到覆盖文件的效果
        uploaderServicefile.clearQueue();
    };*/

    uploaderServicefile.onBeforeUploadItem = function (fileItem) {
        var fileName = fileItem._file.name;
        fileItem.formData.push({"filename": fileName});
    };
    // 添加文件之后,去掉不符合格式的
    uploaderServicefile.onAfterAddingFile = function (fileItem) {
        var size = fileItem._file.size;
        var fileName = fileItem._file.name;
        $scope.getFileName = fileName;
        var index = fileName.lastIndexOf(".");
        var extName = fileName.substring(index + 1);
        var fileType = fileItem._file.type;
        $scope.serviceId = fileName.substring(0, fileName.length - 11);

        // 上传大小最大为1m
        if (size > 1024 * 1024) {
            uploaderServicefile.clearQueue();
            angular.element("#authIdFile").val('');
            ngTip.tip("上传文件不允许超过1M", "warning");
            return;
        }
        uploaderServicefile.uploadAll();
        $("#hardwarefileId").val(fileName);
    };

    // 添加文件成功
    uploaderServicefile.onSuccessItem = function (fileItem, response) {

        if (response.stateCode == "1") {
            $scope.disabledSign = "true";
            ngTip.tip("上传成功", "warning");
            $scope.filePath = response.uri;
            $scope.uploadSign = true;

            if($scope.softwareFileList.length>0){
                for(var i = 0; i<$scope.softwareFileList.length;i++){
                    if($scope.getFileName == $scope.softwareFileList[i].fileName){
                        ngTip.tip("该上传的文件已经存在！", "warning");
                        return false;
                    }
                }
            }

            if($scope.uploadSign){
                //只有上传成功后，上传文件才能添加到table表格中显示
                $scope.softwareFileList.push({fileName: $scope.getFileName,filePath: $scope.filePath,type: "2"});
            }



        } else {
            angular.element("#hardwarefileId").val('');
            ngTip.tip(response, "warning");
            $scope.uploadSign = false;
        }
    };

    /*点击删除*/
    $scope.delsoftwareFileList = function(index){
        $scope.softwareFileList.splice(index,1);
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
















    $scope.save = function () {

        $scope.getPutOnRecordDate = $scope.finishedProductPublish.putOnRecordDate;
        $scope.getPublishDate = $scope.finishedProductPublish.publishDate;

        //首先查询一下所选择的硬件编码是否存在，因为用户可以手动输入，为了防止用户手动输入，这里做一下检验
        if($scope.finishedProductPublish.isHardware=="1" && $scope.hardwareData.indexOf($scope.finishedProductPublish.hardwareCode)==-1){
            ngTip.tip("请从硬件编码下拉框中选择对应的硬件编号");
            return;
        }

        $scope.finishedProductPublish.publishDate = null;
        $scope.finishedProductPublish.putOnRecordDate = null;

        //当新增成品发布是否为硬件为否时,对应的硬件平台编码要设置为空
        if($scope.finishedProductPublish.isHardware=="2"){
            $scope.finishedProductPublish.hardwareCode = "";
        }

        if (param != undefined) {
            $scope.title = '编辑';
            $http({
                method: "POST",
                url: "/plmcore/updateFinishedProduct",
                params: {
                    id: $scope.finishedProductPublish.id,
                    productCode: $scope.finishedProductPublish.productCode,
                    productName: $scope.finishedProductPublish.productName,
                    softwareVersion: $scope.finishedProductPublish.softwareVersion,
                    productType: $scope.finishedProductPublish.productType,
                    type: $scope.finishedProductPublish.type,
                    hardwareCode: $scope.finishedProductPublish.hardwareCode,
                    userId: $scope.publishUserId,
                    getPublishDate: $scope.getPublishDate,
                    getPutOnRecordDate: $scope.getPutOnRecordDate,
                    expectPurpose: $scope.finishedProductPublish.expectPurpose,
                    isHardware: $scope.finishedProductPublish.isHardware,
                    hardwareCode: $scope.finishedProductPublish.hardwareCode,
                    remarks: $scope.finishedProductPublish.remarks,
                    bomFileVoArray: JSON.stringify($scope.softwareFileList)
                }
            }).success(function (res) {
                ngTip.tip(res.message, res.result);
            })
        }else{
            //新增
            $http({
                method: "POST",
                url: "/plmcore/saveFinishedProductPublish",
                params: {
                    id: $scope.finishedProductPublish.id,
                    productCode: $scope.finishedProductPublish.productCode,
                    productName: $scope.finishedProductPublish.productName,
                    softwareVersion: $scope.finishedProductPublish.softwareVersion,
                    productType: $scope.finishedProductPublish.productType,
                    type: $scope.finishedProductPublish.type,
                    hardwareCode: $scope.finishedProductPublish.hardwareCode,
                    userId: $scope.publishUserId,
                    getPublishDate: $scope.getPublishDate,
                    getPutOnRecordDate: $scope.getPutOnRecordDate,
                    expectPurpose: $scope.finishedProductPublish.expectPurpose,
                    isHardware: $scope.finishedProductPublish.isHardware,
                    hardwareCode: $scope.finishedProductPublish.hardwareCode,
                    remarks: $scope.finishedProductPublish.remarks,
                    bomFileVoArray: JSON.stringify($scope.softwareFileList)
                }
            }).success(function (res) {
                ngTip.tip(res.message, res.result);
            })

        }
        var time = setTimeout(function(){
            $uibModalInstance.close(true);
        },1000);
        //$("#softwareList").bootstrapTable('refresh');
        parent.location.reload();
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
            var len = result.value.length;
            for(var i = 0; i<len;i++){
                //alert(result.value[i].hardware_code);
                $scope.hardwareData.push(result.value[i].hardware_code);

            }
            //$scope.hardwareData
        }).on("onSetSelectValue", function (e, keyword) {
            //console.log("onSetSelectValue: ", keyword);
            $scope.finishedProductPublish.hardwareCode = keyword.key;
        }).on("onUnsetSelectValue", function (e) {
            //console.log("onUnsetSelectValue");
        })
    },100)

});






