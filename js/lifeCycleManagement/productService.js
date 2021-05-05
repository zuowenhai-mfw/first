//产品安装售后
app.controller('productServiceListCtrl',  function($rootScope,$scope) {
    /*初始化时展示列表*/
    $scope.productServiceUrl = 'lifeCycleManagement/productService/productServiceListContent.html';
    /*点击新增或者编辑*/
    $scope.addOrEditProductService = function(obj){
        $rootScope.obj = obj;
        $scope.productServiceUrl = 'lifeCycleManagement/productService/productServiceAddOrEdit.html';
    };
    /*点击返回按钮*/
    $scope.back = function(){
        $scope.productServiceUrl = 'lifeCycleManagement/productService/productServiceListContent.html'
    }

});
//产品安装售后列表
app.controller('productServiceListContentCtrl',  function($scope,NgTableParams, getDataService,$screenFactory, $uibModal,$compile) {
    $scope.options = [];
    $scope.events = [];
    $("#productServiceList").bootstrapTable({
        url: "/plmcore/productServiceList",
        method:'get',
        showRefresh: false,
        pageNumber: 1,
        pagination: true,
        sidePagination: 'server',
        pageSize: 10,
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
                var event= '<span title="编辑" ng-click="addOrEditProductService('+row.id+')"><a class="fa fa-edit"></a></span> &nbsp;'+
                    '<span title="查看详情" ng-click="productServiceDetail('+row.id+')"><a class="fa fa-search"></a></span>';
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

    //打开详情页面
    $scope.productServiceDetail = function(obj){
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
    }

});
/*新增或者编辑 产品安装售后列表的Ctrl*/
app.controller('addOrEditproductServiceCtrl',function($rootScope,$scope,$http,$uibModal,ngTip){
    $scope.title = '新增';
    $rootScope.addOrEditproductServiceForm = {};
    $rootScope.addOrEditproductServiceFormFor = {};
    $rootScope.addOrEditproductServiceForm.id = 0;
    $rootScope.addOrEditproductServiceForm.problemDescribe;
    $rootScope.addOrEditproductServiceForm.processingMethod;
    $rootScope.indexId;
    $scope.operateType = "add";
    $scope.addOrEditproductServiceForm.effectiveOld = [];
    $rootScope.addOrEditproductServiceForm.effective =[];
    $rootScope.addOrEditproductServiceForm.effective.describeArr = [];
    $rootScope.operateDisableSign = false;
    $scope.submitnum = 0;
    $rootScope.isReadOnlySign = false;

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
        ngTip.tip("网络不通请关闭窗口重试");
    });


    // 联系人名称下拉框
    $http({
        method :'POST',
        url :'/plmcore/receiveUserList'
    }).success(function(res) {
        $scope.receiveData = res;
    }).error(function () {
        ngTip.tip("网络不通请关闭窗口重试");
    });

    if($scope.obj != undefined){
        $rootScope.isReadOnlySign = true;
        $scope.operateType = "edit";
        $scope.title = '编辑';
        $rootScope.addOrEditproductServiceForm.id = $rootScope.obj;

        $http({
            url: "/plmcore/productServiceView",
            method:'post',
            params: {
                id: $scope.obj
            }
        }).success(function(res){
            //(res);
            $scope.addOrEditproductServiceFormFor = res;
            $scope.addOrEditproductServiceFormFor.customerId = res.customerId+"";
        }).error(function () {
            ngTip.tip("网络不通请关闭窗口重试");
        });


         $http({
             url: "/plmcore/getProductServiceRecordView",
             method:'post',
             params: {
                 id: $scope.obj
             }
         }).success(function(res){
             //console.log(res);
             var getDataArr = res;
             var dataLength = getDataArr.length;
             for(var i=0;i<dataLength;i++){
                 var getImpleUserId = getDataArr[i].impleUserId+"";
                 $scope.addOrEditproductServiceForm.effective.push({
                     id:getDataArr[i].id,
                     createTime:getDataArr[i].createTime,
                     impleUserId:getImpleUserId,
                     afterSaleType:getDataArr[i].afterSaleType,
                     problemDescribe:getDataArr[i].problemDescribe,
                     detailedDescribeList: getDataArr[i].detailedDescribeList
                 });
                 $scope.addOrEditproductServiceForm.effectiveOld.push({
                     id:getDataArr[i].createTime,
                     createTime:getDataArr[i].createTime,
                     impleUserId:getImpleUserId,
                     afterSaleType:getDataArr[i].afterSaleType,
                     problemDescribe:getDataArr[i].problemDescribe,
                     detailedDescribeList: getDataArr[i].detailedDescribeList
                 });
             }
         }).error(function () {
             ngTip.tip("网络不通请关闭窗口重试");
         })
    }

    $scope.changetype = function(customerId){

        //根据customerId查询对应的接收单位和联系方式
        $http({
            method :'POST',
            url :'/plmcore/getCustomerInfoMaintainById',
            params: {
                id: customerId
            }
        }).success(function(res) {
            $scope.addOrEditproductServiceFormFor.company = res.companyName;
            $scope.addOrEditproductServiceFormFor.contactInfo = res.contactInfo;
        }).error(function () {
            ngTip.tip("网络不通请关闭窗口重试");
        });

    }

    setTimeout(function(){
        $("#hardwareSerialNumber").bsSuggest({
            url: "/plmcore/hardwareSerialNoListForAfterService",
            showBtn:false,
            idField: "hardware_serial_number",
            keyField: "contract_no",
            effectiveFields:["hardware_serial_number","contract_no"],
            effectiveFieldsAlias:{"hardware_serial_number":"硬件SN号","contract_no":"合同号"}
        }).on("onDataRequestSuccess", function (e, result) {
            //console.log("onDataRequestSuccess: ", result);
        }).on("onSetSelectValue", function (e, keyword) {
            //console.log("onSetSelectValue: ", keyword);
            $scope.addOrEditproductServiceFormFor.hardwareSerialNumber = keyword.id;
            $scope.addOrEditproductServiceFormFor.contractNo = keyword.key;
        }).on("onUnsetSelectValue", function (e) {
            //("onUnsetSelectValue");
        })
    },100)


    /*点击新增问题记录按钮*/
    $scope.addlog = function($index){
        //$scope.addOrEditproductServiceForm.effective.push({"effectiveDate":'',"implementer":"","effectiveType":"","problemDescription":""});
        $scope.addOrEditproductServiceForm.effective.push({"createTime":'',"impleUserId":"","afterSaleType":"","problemDescribe":""});

    }

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

    /*点击保存按钮*/
    $scope.addSave =function(){

        if($scope.submitnum>=1){
            ngTip.tip("不能重复提交");
        }else {
            //避免用户不添加售后记录直接保存
            if($rootScope.addOrEditproductServiceForm.effective == null || $rootScope.addOrEditproductServiceForm.effective == ""){
                ngTip.tip("请添加售后记录");
                return;
            }
            //在提交保存之前，首先判断一下售后列表中的每一行记录对应的详细描述子页面中详细描述和处理方法是否都有值，上传文件可以不是必须要有
            //但是，每一行记录对应的详细描述子页面中详细描述和处理方法都必须要有值
            //这里这么做的目的就是为了避免用户不点击详细描述按钮，在详细描述界面填写详细描述和处理方法，就直接保存了
            var getLen = $rootScope.addOrEditproductServiceForm.effective.length;
            for(var i=0;i<getLen;i++){
                var getDetailedDescribeList = $rootScope.addOrEditproductServiceForm.effective[i].detailedDescribeList;

                if(getDetailedDescribeList == null || getDetailedDescribeList == ""){
                    ngTip.tip("售后记录对应的详细描述和处理方法不能为空");
                    return;
                }
            }

            $http({
                method: "POST",
                url: "/plmcore/saveProductService",
                params: {
                    //id: $rootScope.addOrEditproductServiceFormFor.id,
                    id: $rootScope.addOrEditproductServiceForm.id,
                    company: $scope.addOrEditproductServiceFormFor.company,
                    customerId: $scope.addOrEditproductServiceFormFor.customerId,
                    hardwareSerialNumber: $scope.addOrEditproductServiceFormFor.hardwareSerialNumber,
                    contactInfo: $scope.addOrEditproductServiceFormFor.contactInfo,
                    contractNo: $scope.addOrEditproductServiceFormFor.contractNo,

                    warZone: $scope.addOrEditproductServiceFormFor.warZone,
                    businessSystem: $scope.addOrEditproductServiceFormFor.businessSystem,
                    upperLowerGuanxi: $scope.addOrEditproductServiceFormFor.upperLowerGuanxi,
                    remarks: $scope.addOrEditproductServiceFormFor.remarks,
                    afterSaleRecordVoArray: JSON.stringify($rootScope.addOrEditproductServiceForm.effective),
                    operateType: $scope.operateType

                }
            }).success(function (res) {
                ngTip.tip(res.message, res.result);
                $scope.submitnum = 1;
            })

        }
    }
})
/*新增或者编辑 产品安装售后列表的的售后记录的详细描述Ctrl*/
app.controller('productServiceAddOrEditMsgCtrl',function($scope,$uibModalInstance,param,$http,ngTip,$rootScope,FileUploader){
    //关闭按钮
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }

    $rootScope.filePathArr = [];
    $scope.filePath;
    $scope.getFileName = 'nofile';
    $scope.uploadSign = true;
    $scope.detailedDescribe = {};
    $scope.param = param;

    $scope.serviceLogMsgForm = {};
    $scope.serviceLogMsg = [];
    $scope.serviceLogMsgFinal = [];


    if(param != undefined){

        //点击父页面售后记录列表中的某一行时，把对应的值赋给详细描述子窗口
        var serviceLogMsgData = param;
        var len = serviceLogMsgData.length
        for(var i=0;i<len;i++){
            //赋值给子窗口的table列表
            $scope.serviceLogMsg.push({fileName: serviceLogMsgData[i].fileName,questionDescribe: serviceLogMsgData[i].questionDescribe,filePath: serviceLogMsgData[i].filePath,
            problemDescribe:serviceLogMsgData[i].problemDescribe,processingMethod:serviceLogMsgData[i].processingMethod});
            //赋值给详细描述
            $scope.detailedDescribe.problemDescribe = serviceLogMsgData[i].problemDescribe;
            //赋值给处理方法
            $scope.detailedDescribe.processingMethod = serviceLogMsgData[i].processingMethod;
        }

    }


    //上传售后服务文件
    var uploaderServicefile = $scope.uploaderServicefile = new FileUploader({
        url: '/plmcore/uploadServiceFile',
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
        $("#servicefileId").val(fileName);
    };

    // 添加文件成功
    uploaderServicefile.onSuccessItem = function (fileItem, response) {

        if (response.stateCode == "1") {
            $scope.disabledSign = "true";
            ngTip.tip("上传成功", "warning");
            $scope.filePath = response.uri;
            $scope.uploadSign = true;
        } else {
            angular.element("#servicefileId").val('');
            ngTip.tip(response, "warning");
            $scope.uploadSign = false;
        }
    };

    /*点击新增*/
    $scope.addLogfile = function(){

        if(!$rootScope.operateDisableSign){
            if($scope.getFileName == 'nofile'){
                ngTip.tip("请选择要上传的文件！", "warning");
                return false;
            }

            if($scope.serviceLogMsg.length>0){
                for(var i = 0; i<$scope.serviceLogMsg.length;i++){
                    if($scope.getFileName == $scope.serviceLogMsg[i].fileName){
                        ngTip.tip("该上传的文件已经存在！", "warning");
                        return false;
                    }
                }
            }

            if($scope.uploadSign){
                //只有上传成功后，上传文件才能添加到table表格中显示
                $scope.serviceLogMsg.push({fileName: $scope.getFileName,questionDescribe: $scope.detailedDescribe.questionDescribe,filePath: $scope.filePath,
                    problemDescribe:$scope.detailedDescribe.problemDescribe,processingMethod:$scope.detailedDescribe.processingMethod});
            }
        }

    }
    /*点击删除*/
    $scope.delserviceLogMsg = function(index){
        $scope.serviceLogMsg.splice(index,1);
    }

    /*点击下载*/
    $scope.downloadFile = function(filePath){
        location.href = "/plmcore/afterSaleDownloadFile?filePathAll=" + filePath;
    }

    /*保存*/
    $scope.save = function(){

        var serviceLogMsgLen;
        //用户不上传附件
        if($scope.serviceLogMsg==null || $scope.serviceLogMsg==""){
            $scope.serviceLogMsgFinal.push({fileName: '',questionDescribe: '',filePath: '',
                problemDescribe:$scope.detailedDescribe.problemDescribe,processingMethod:$scope.detailedDescribe.processingMethod});
        }else{
            serviceLogMsgLen = $scope.serviceLogMsg.length;
        }

        //这里这样做的目的是为了获取最终的详细描述和处理方法的值，也就是在点击保存的时候获取最终的详细描述和处理方法的值
        if($scope.serviceLogMsg!=null && serviceLogMsgLen!=0){
            var serviceLogMsgData = $scope.serviceLogMsg;
            if(serviceLogMsgLen>1){
                for(var i=0;i<serviceLogMsgLen;i++){
                    //上传文件列表不为空
                    if(serviceLogMsgData[i].fileName!=''){
                        $scope.serviceLogMsgFinal.push({fileName: serviceLogMsgData[i].fileName,questionDescribe: serviceLogMsgData[i].questionDescribe,filePath: serviceLogMsgData[i].filePath,
                            problemDescribe:$scope.detailedDescribe.problemDescribe,processingMethod:$scope.detailedDescribe.processingMethod});
                    }
                }
            }else{
                for(var i=0;i<serviceLogMsgLen;i++){
                    //上传文件列表为空，serviceLogMsgFinal中实际存的是详细描述和处理方法的值
                    $scope.serviceLogMsgFinal.push({fileName: serviceLogMsgData[i].fileName,questionDescribe: serviceLogMsgData[i].questionDescribe,filePath: serviceLogMsgData[i].filePath,
                        problemDescribe:$scope.detailedDescribe.problemDescribe,processingMethod:$scope.detailedDescribe.processingMethod});
                }
            }

        }

        //子窗口保存时，每次都要根据id及record表格的主键序号index，来循环获取每条record对应的上传文件记录。
        //这里获取的是父页面中售后记录列表的长度
        var len = $rootScope.addOrEditproductServiceForm.effective.length;

        for(var i=0;i<len;i++){
            if(i == $rootScope.indexId){
                //这里这样做的目的，就是为了在父页面的售后列表中，点击第几行，弹出的详细描述子窗口中的值就付给第几行。
                $rootScope.addOrEditproductServiceForm.effective[i].detailedDescribeList = $scope.serviceLogMsgFinal;
            }

        }

        $uibModalInstance.close(false);

    }

})

/*打开详情页面的Ctrl*/
app.controller('productServiceDetailCtrl',function($scope,$uibModalInstance,param,$http,$rootScope,$uibModal,ngTip){
    //关闭按钮
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }
    $scope.param = param;


    //console.log("$scope.param==================================="+$scope.param);

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
        ngTip.tip("网络不通请关闭窗口重试");
    });


    // 联系人名称下拉框
    $http({
        method :'POST',
        url :'/plmcore/receiveUserList'
    }).success(function(res) {
        $scope.receiveData = res;
    }).error(function () {
        ngTip.tip("网络不通请关闭窗口重试");
    });

    if(param != undefined){

        $scope.operateType = "check";
        $rootScope.checkProductServiceForm.id = $scope.param;

        $http({
            url: "/plmcore/productServiceView",
            method:'post',
            params: {
                id: $scope.param
            }
        }).success(function(res){
            //(res);
            $scope.checkProductServiceFormFor = res;
            $scope.checkProductServiceFormFor.customerId = res.customerId+"";
        }).error(function () {
            ngTip.tip("网络不通请关闭窗口重试");
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
            ngTip.tip("网络不通请关闭窗口重试");
        });

    }



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


})

/*打开详情页面内容的Ctrl（有数据查询的页面调用）*/
app.controller('productServiceDetailContentCtrl',function($scope,$http){
    $scope.productServiceForm = {}
    $http({
        url:'js/lifeCycleManagement/lifeCycleManagement/productService.json',
        method:'get'
    }).success(function(res){
        $scope.productServiceForm.effective =[
            {"effectiveDate":'2020-01-02',"implementer":"小郑","effectiveType":"1","problemDescription":"安装产品"},
            {"effectiveDate":'2020-01-04',"implementer":"小郑","effectiveType":"2","problemDescription":"售后产品"},
        ]
    })
})