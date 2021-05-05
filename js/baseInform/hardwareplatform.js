//硬件平台发布
app.controller('hardwareListCtrl',  function($scope,NgTableParams, getDataService,$screenFactory, $uibModal,ngTip, $confirm,$http,$compile) {

    $scope.options = [];
    $scope.events = [];
    $("#hardwareList").bootstrapTable({
        url: "/plmcore/queryHardwareplatformList",
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
            {field: 'hardwareCode', title: '硬件编码'},
            {field: 'hardwarePlatform', title: '硬件平台'},
            {field: 'factoryCode', title: '厂商编码'},
            {field: 'factoryInfo', title: '厂商信息'},
            {field: 'userName', title: '发布人'},
            {field: 'publishDate', title: '发布日期'},
            {field: 'putOnRecordDate', title: '建档日期'},
            {field: 'expectPurpose', title: '预期用途'},
            {field: 'operate', title: '操作', formatter: function(value,row,index){

                var rtn = "<div id='option_"+index+"' ></div>"
                var event= '<span title="编辑" ng-click="addOredithardwareList('+row.id+')"><a class="fa fa-edit"></a></span> &nbsp;'+
                    '<span title="查看详情" ng-click="openhardwareMesage('+row.id+')"><a class="fa fa-search"></a></span>';
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

    //打开新增 、编辑页面
    $scope.addOredithardwareList = function(obj){
        $uibModal.open({
            templateUrl : 'baseInform/hardwareList/hardwareReleaseAddOrEdit.html',
            controller :'addOredithardwareCtrl',
            backdrop :'static',
            size : 'lg',
            resolve : {
                param : function() {
                    return   angular.copy(obj);
                }
            }
        });
    }

    //打开详情页面
    $scope.openhardwareMesage = function(obj){
        $uibModal.open({
            templateUrl : 'baseInform/hardwareList/hardwareReleaseDetail.html',
            controller :'hardwareReleaseDetailCtrl',
            backdrop :'static',
            size : 'lg',
            resolve : {
                param : function() {
                    return   angular.copy(obj);
                }
            }
        });
    };


    //删除列表
    $scope.delhardwareList = function(){
        var checkId = [];
        var rows = $("#hardwareList").bootstrapTable('getSelections');
        for(var i=0;i<rows.length;i++){
            checkId.push(rows[i].id);
        }
        if(rows.length == 0){
            ngTip.tip("请选择要删除的数据！", "warning");
        }else if(rows.length>1){
            ngTip.tip("不能批量删除硬件编码，只能单个删除！", "warning");
        }else{

            $confirm({text: "删除的数据无法恢复，您确认删除吗？", title: "删除数据", ok: "是", cancel: "否"})
                .then(function () {
                    $http({
                        method: 'post',
                        url: '/plmcore/deleteHardwarePlatformPublish',
                        params: {
                            checkId: checkId.join(",")
                        }
                    }).success(function (response) {
                        if(response.stateCode == '1'){
                            ngTip.tip(response.message, "success");
                        }else{
                            ngTip.tip(response.message, "warning");
                        }
                        $("#hardwareList").bootstrapTable('refresh')
                        //$scope.parentTableParams.reload();
                        //$(".allChecked").prop('checked', false);
                    }).error(function () {
                        ngTip.tip("网络不通请重试");
                    });
                });
            //$("#hardwareList").bootstrapTable('destroy')
        }
    }
});

/**
 *校验新增硬件平台编码唯一的指令。
 */
app.directive('hardwarecodeEnsureUnique',
    function ($http,ngTip) {
        return {
            restrict: 'EA',
            require: '?ngModel',
            link: function ($scope, element, attrs, c) {
                $scope.$watch(attrs.ngModel, function () {
                    var hardwareCode = $scope.hardwarePlatformPublish.hardwareCode;
                    if ($scope.hardwarePlatformPublish.hardwareCode !== undefined) {
                        $http({
                            method: 'POST',
                            timeout: 10000,
                            url: '/plmcore/validateHardwareCode',
                            params: {
                                id: $scope.hardwarePlatformPublish.id,
                                hardwareCode: hardwareCode
                            }
                        }).success(function (data) {
                            // 该方法用于改变验证状态，以及在控制变化的验证标准时通知表格（validationErrorKey,isValid）
                            c.$setValidity('hardwareCodeUnique', data);
                        }).error(function () {
                            c.$setValidity('unique', false);
                            ngTip.tip("网络不通请关闭窗口重试");
                        });
                    }else{
                        c.$setValidity('hardwareCodeUnique', true);
                    }

                });
            }
        }
    });


/**
 *校验新增硬件平台名称唯一的指令。
 */
app.directive('hardwareplatformEnsureUnique',
    function ($http,ngTip) {
        return {
            restrict: 'EA',
            require: '?ngModel',
            link: function ($scope, element, attrs, c) {
                $scope.$watch(attrs.ngModel, function () {
                    var hardwarePlatform = $scope.hardwarePlatformPublish.hardwarePlatform;
                    if ($scope.hardwarePlatformPublish.hardwarePlatform !== undefined) {
                        $http({
                            method: 'POST',
                            timeout: 10000,
                            url: '/plmcore/validateHardwarePlatform',
                            params: {
                                id: $scope.hardwarePlatformPublish.id,
                                hardwarePlatform: hardwarePlatform
                            }
                        }).success(function (data) {
                            // 该方法用于改变验证状态，以及在控制变化的验证标准时通知表格（validationErrorKey,isValid）
                            c.$setValidity('hardwarePlatformUnique', data);
                        }).error(function () {
                            c.$setValidity('unique', false);
                            ngTip.tip("网络不通请关闭窗口重试");
                        });
                    }else{
                        c.$setValidity('hardwarePlatformUnique', true);
                    }

                });
            }
        }
    });


/*点击编辑或者新增的模态框*/
app.controller('addOredithardwareCtrl',function($scope,$uibModalInstance,$uibModal,param,FileUploader,$http, ngTip){
    //关闭按钮
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }
    $scope.Vtype = 'oneV';
    $scope.getPutOnRecordDate;
    $scope.getPublishDate;
    $scope.publishUser = {};
    $scope.submitted = false;
    $scope.hardwarePlatformPublish = {};
    $scope.hardwarePlatformPublish.id = 0;
    $scope.hardwarePlatformCodeSign = false;
    $scope.jdDate=new Date().toLocaleDateString();
    $scope.operateDisableSign = false;
    $scope.hardwareFileList = [];
    $scope.hardwarePlatformPublish.putOnRecordDate=$scope.jdDate.replace(new RegExp("/","gm"),"-");
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

    if(param != undefined){
        $scope.hardwarePlatformPublish.id = param;
        $scope.title = '编辑';
        $scope.hardwarePlatformCodeSign = true;
        $http({
            method :'POST',
            url :'/plmcore/updateHardwarePlatformPublishView',
            params: {
                id: $scope.hardwarePlatformPublish.id
            }
        }).success(function(res) {
            $scope.hardwarePlatformPublish = res;
            $scope.publishUserId = $scope.hardwarePlatformPublish.publishUserId;
            //console.log("$scope.publishUserId=="+$scope.publishUserId);
            if($scope.hardwarePlatformPublish.version == '1'){
                $scope.Vtype = 'oneV';
                $scope.twoVconfig = false;
            }else{
                $scope.Vtype = 'twoV';
                $scope.twoVconfig = true;
            }

        }).error(function () {
            ngTip.tip("网络不通请关闭窗口重试");
        });

        $http({
            url: "/plmcore/getHardwareBomFileList",
            method:'post',
            params: {
                hardwarePlatformId: $scope.hardwarePlatformPublish.id,
                hardwareCode:"",
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
            ngTip.tip("网络不通请关闭窗口重试");
        });

    }else{
        $scope.title='新增';
    }

    $scope.changeVtype = function(type){
        $scope.twoVconfig = type == 'twoV' ? true :false;
    }











    //上传硬件bom清单文件
    var uploaderServicefile = $scope.uploaderServicefile = new FileUploader({
        url: '/plmcore/uploadHardwareFile',
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

            if($scope.hardwareFileList.length>0){
                for(var i = 0; i<$scope.hardwareFileList.length;i++){
                    if($scope.getFileName == $scope.hardwareFileList[i].fileName){
                        ngTip.tip("该上传的文件已经存在！", "warning");
                        return false;
                    }
                }
            }

            if($scope.uploadSign){
                //只有上传成功后，上传文件才能添加到table表格中显示
                $scope.hardwareFileList.push({fileName: $scope.getFileName,filePath: $scope.filePath,type: "1"});
            }



        } else {
            angular.element("#hardwarefileId").val('');
            ngTip.tip(response, "warning");
            $scope.uploadSign = false;
        }
    };

    /*点击删除*/
    $scope.delhardwareFileList = function(index){
        $scope.hardwareFileList.splice(index,1);
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

        /*var jDate = new Date($scope.hardwarePlatformPublish.putOnRecordDate);
        var fDate = new Date($scope.hardwarePlatformPublish.publishDate);
        if(jDate>fDate){
            ngTip.tip("建档日期不能大于发布日期");
            return;
        }*/

        //var endTime = $("#addEventRuleDate").val() == '' ? '' : $("#addEventRuleDate").val().split(' - ')[1];
        if ($scope.submitted) {
            ngTip.tip("请勿重复提交","warning");
            return;
        }
        $scope.submitted = true;
        $scope.getPutOnRecordDate = $scope.hardwarePlatformPublish.putOnRecordDate;
        $scope.getPublishDate = $scope.hardwarePlatformPublish.publishDate;
        $scope.hardwarePlatformPublish.publishDate = null;
        $scope.hardwarePlatformPublish.putOnRecordDate = null;
        if ($scope.hardwarePlatformPublish.id > 0) {
            $http({
                method: "POST",
                url: "/plmcore/updateHardwarePlatformPublish",
                params: {
                    id: $scope.hardwarePlatformPublish.id,
                    hardwareCode: $scope.hardwarePlatformPublish.hardwareCode,
                    hardwarePlatform: $scope.hardwarePlatformPublish.hardwarePlatform,
                    factoryCode: $scope.hardwarePlatformPublish.factoryCode,
                    factoryInfo: $scope.hardwarePlatformPublish.factoryInfo,
                    publishUserId: $scope.publishUserId,
                    getPublishDate: $scope.getPublishDate,
                    getPutOnRecordDate: $scope.getPutOnRecordDate,
                    expectPurpose: $scope.hardwarePlatformPublish.expectPurpose,
                    version: $scope.Vtype == 'oneV' ? '1':'2',
                    firstChipset: $scope.hardwarePlatformPublish.firstChipset,
                    firstCpu: $scope.hardwarePlatformPublish.firstCpu,
                    firstMemory: $scope.hardwarePlatformPublish.firstMemory,
                    firstPowerSupply: $scope.hardwarePlatformPublish.firstPowerSupply,
                    secondChipset: $scope.hardwarePlatformPublish.secondChipset,
                    secondCpu: $scope.hardwarePlatformPublish.secondCpu,
                    secondMemory: $scope.hardwarePlatformPublish.secondMemory,
                    remarks: $scope.hardwarePlatformPublish.remarks,
                    bomFileVoArray: JSON.stringify($scope.hardwareFileList)
                }
            }).success(function (res) {
                if(res){
                    ngTip.tip("保存成功");
                    $("#hardwareList").bootstrapTable('refresh');
                    var time = setTimeout(function(){
                        $uibModalInstance.close(true);
                    },1000);
                }else{
                    ngTip.tip("保存失败");
                }
            }).error(function () {
                ngTip.tip("网络不通请关闭窗口重试");
            });
        } else {
            $http({
                method: "POST",
                url: "/plmcore/saveHardwarePlatformPublish",
                params: {
                    id: $scope.hardwarePlatformPublish.id,
                    hardwareCode: $scope.hardwarePlatformPublish.hardwareCode,
                    hardwarePlatform: $scope.hardwarePlatformPublish.hardwarePlatform,
                    factoryCode: $scope.hardwarePlatformPublish.factoryCode,
                    factoryInfo: $scope.hardwarePlatformPublish.factoryInfo,
                    publishUserId: $scope.publishUserId,
                    getPublishDate: $scope.getPublishDate,
                    getPutOnRecordDate: $scope.getPutOnRecordDate,
                    expectPurpose: $scope.hardwarePlatformPublish.expectPurpose,
                    version: $scope.Vtype == 'oneV' ? '1':'2',
                    firstChipset: $scope.hardwarePlatformPublish.firstChipset,
                    firstCpu: $scope.hardwarePlatformPublish.firstCpu,
                    firstMemory: $scope.hardwarePlatformPublish.firstMemory,
                    firstPowerSupply: $scope.hardwarePlatformPublish.firstPowerSupply,
                    secondChipset: $scope.hardwarePlatformPublish.secondChipset,
                    secondCpu: $scope.hardwarePlatformPublish.secondCpu,
                    secondMemory: $scope.hardwarePlatformPublish.secondMemory,
                    remarks: $scope.hardwarePlatformPublish.remarks,
                    bomFileVoArray: JSON.stringify($scope.hardwareFileList)
                }
            }).success(function (res) {

                if(res){
                    ngTip.tip("保存成功");
                    $("#hardwareList").bootstrapTable('refresh');
                    var time = setTimeout(function(){
                        $uibModalInstance.close(true);
                    },1000);
                }else{
                    ngTip.tip("保存失败");
                }
            }).error(function () {
                ngTip.tip("网络不通请关闭窗口重试");
            });
        }
        /*var time = setTimeout(function(){
            $uibModalInstance.close(true);
        },1000);
        parent.location.reload();*/

    }
    /**
     * 返回按钮
     * @param state
     */
    $scope.back = function () {
        $scope.submitted = false;
        $scope.url = 'baseInform/hardwareList/hardwareplatList.html';
        $scope.hardwarePlatformPublish = {};
        $scope.hardwarePlatformPublish.id = 0;
        //$scope.clear();
    }

    /**
     * 返回列表页时更改查询条件时清理值
     * @param conditionType
     */
    $scope.clear = function () {

    }

})

/*查看详情*/
app.controller('hardwareReleaseDetailCtrl',function($scope,$uibModalInstance,param,$http,ngTip){
    //关闭按钮
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }

    $scope.hardwarePlatformPublish = {};
    $scope.params = param;
    $scope.hardwareFileList = [];
    $scope.hardwarePlatformPublish.id = param;
    $http({
        method :'POST',
        url :'/plmcore/checkHardwarePlatformPublishById',
        params: {
            id: $scope.hardwarePlatformPublish.id,
            sign: 'true'
        }
    }).success(function(res) {
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
        ngTip.tip("网络不通请关闭窗口重试");
    });

    $http({
        url: "/plmcore/getHardwareBomFileList",
        method:'post',
        params: {
            hardwarePlatformId: $scope.hardwarePlatformPublish.id,
            hardwareCode:""
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
        ngTip.tip("网络不通请关闭窗口重试");
    });

    /*详情中修改记录列表*/
    setTimeout(function(){
        $("#editRecordList").bootstrapTable({
            url: "/plmcore/checkHardwarePlatformPublishRecordById?id="+$scope.hardwarePlatformPublish.id+"&sign=true&type=1",
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
/*查看详情*/
app.controller('hardwareReleaseDetailContentCtrl',function(param,$scope,$http){


    $http({
        url:'js/baseInform/baseInform/hardwareplatform.json',
        method:'get'
    }).success(function(res){
        for(var i = 0;i<res.length;i++){
            if(res[i].hardwareId ==  $scope.params){
                $scope.hardwareReleaseInfo = res[i]
            }
        }
    })
    /*详情中修改记录列表*/
    setTimeout(function(){
        $("#editRecordList").bootstrapTable({
            url: "js/baseInform/baseInform/hardwareplatform2.json",
            search: false,
            pagination: !0,
            showRefresh: false,
            showToggle: false,
            showColumns: false,
            columns: [
                {field: 'Id', title: '序号'},
                {field: 'operator', title: '操作人'},
                {field: 'operatype', title: '操作类型'},
                {field: 'operatime', title: '操作时间'},
                {field: 'detailed', title: '详情'}
            ]
        });
    },500)
})
