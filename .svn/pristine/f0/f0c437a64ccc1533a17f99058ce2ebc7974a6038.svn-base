//数据查询列表
app.controller('systemMessageListCtrl',  function($scope,NgTableParams, getDataService,$screenFactory,$confirm, ngTip,$uibModal,$http,$compile) {
    $scope.systemMessageListUrl = 'systemMessage/systemMessageResultsList.html';
    $scope.messageDate = {};
    $scope.messageDate.hardwareSerialNumber = "";
    $scope.messageDate.authCodeId = "";
    $scope.messageDate.hardwardExpiration = "";
    $scope.messageDate.productExpiration = "";
    setTimeout(function(){
        $("#systemMessageList").bootstrapTable('destroy');
        var table = new TableInit();
        table.Init();
    },100)


    // 点击查询按钮，进行查询.
    $scope.showQuery = function () {
        setTimeout(function(){
            $("#systemMessageList").bootstrapTable('destroy');
            var table = new TableInit();
            table.Init();
        },100)
    };

    // 重置
    $scope.reset = function () {
        $scope.messageDate.hardwareSerialNumber = "";
        $scope.messageDate.authCodeId = "";
        $scope.messageDate.hardwardExpiration = "";
        $scope.messageDate.productExpiration = "";
    }


    var TableInit = function(){
        var tableInte = new Object();
        tableInte.Init = function(){
            $("#systemMessageList").bootstrapTable({
                url: "/plmcore/getProductMessageList",
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
                        "hardwareSerialNumber":$scope.messageDate.hardwareSerialNumber,
                        "authCodeId":$scope.messageDate.authCodeId,
                        "hardwardExpiration":$scope.messageDate.hardwardExpiration,
                        "productExpiration":$scope.messageDate.productExpiration
                    }
                    return param;
                },
                columns: [
                    {field: 'id', title: 'id',visible: false},
                    {field: 'hardwareSerialNumber', title: '硬件序列号'},
                    {field: 'authCodeId', title: '授权码'},
                    {field: 'hardwardExpiration', title: '硬件到期时间'},
                    {field: 'productExpiration', title: '软件到期时间'},
                    {field: 'hardwareStatus', title: '硬件状态',formatter:function(value,row,index){
                            var value = "";
                            if(row.hardwareStatus=='0'){
                                return "未处理";
                            }else if(row.hardwareStatus=='1'){
                                return "已处理";
                            }else{
                                return "没有要处理的硬件记录";
                            }
                        }
                    },
                    {field: 'productStatus', title: '软件状态',formatter:function(value,row,index){
                            var value = "";
                            if(row.productStatus=='0'){
                                return "未处理";
                            }else if(row.productStatus=='1'){
                                return "已处理";
                            }else{
                                return "没有要处理的软件记录";
                            }
                        }
                    },
                    {field: 'createTime', title: '创建时间'}

                ],

            });
        }
        return tableInte
    }


});
