//自研产品组装
app.controller('selfStudyPackageListCtrl',  function($scope,NgTableParams, getDataService,$screenFactory, $uibModal,$compile) {

    $scope.options = [];
    $scope.events = [];
    $("#selfStudyPackageList").bootstrapTable({
        url: "js/lifeCycleManagement/lifeCycleManagement/contractOrder.json",
        method:'get',
        pagination: !0,
        showRefresh: false,
        showToggle: false,
        showColumns: false,
        search:true,
        iconSize: "outline",
        columns: [
            {checkbox: true},
            {field: 'contractNumber', title: '合同号'},
            {field: 'salesperson', title: '销售人员'},
            {field: 'projectStaus', title: '项目情况'},
            {field: 'finishProductCode', title: '成品编码'},
            {field: 'productName', title: '产品名称'},
            {field: 'number', title: '数量'},
            {field: 'date', title: '签订日期'},
            {field: 'createdDate', title: '建档日期'},
            {field: 'operate', title: '操作', formatter: function(value,row,index){
                var rtn = "<div id='option_"+index+"'></div>"
                var event= '<span title="编辑" ng-click="addOrEditContractOrder()"><a class="fa fa-edit"></a></span> &nbsp;'+
                    '<span title="查看详情" ng-click="contractOrderDetail()"><a class="fa fa-search"></a></span>'
                $scope.options.push("option_"+index)
                $scope.events.push(event)
                return rtn
            }}
        ],
        onLoadSuccess:function(){
            for(var i=0;i<$scope.options.length;i++){
                var _option = $scope.options[i]
                var _event = $scope.events[i];
                var $el = $(_event).appendTo('#'+_option)
                $compile($el)($scope)
            }
        }
    });

    //打开新增 、编辑页面
    $scope.addOrEditContractOrder = function(obj){
        $uibModal.open({
            templateUrl : 'lifeCycleManagement/contractOrder/contractOrderAddOrEdit.html',
            controller :'alarmDisposalCtrl',
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
    $scope.contractOrderDetail = function(obj){
        $uibModal.open({
            templateUrl : 'lifeCycleManagement/contractOrder/contractOrderDetail.html',
            controller :'alarmDisposalCtrl',
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
app.controller('alarmDisposalCtrl',function($scope,$uibModalInstance,param){
    //关闭按钮
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }
    $scope.alarmDisposal = param;
})




function addicon() {
    return [
        '<span class="edithardwareList" title="编辑"><a class="fa fa-edit"></a></span> &nbsp;',
        '<span class="openhardwareMesage" title="查看详情"><a class="fa fa-search"></a></span>',
    ].join('')
}
window.operateEvent = {
    'click .edithardwareList': function () {
        $("#addContractOrder").modal('show')
    },
    'click .openhardwareMesage': function () {
       /* $("#softwareReleaseMessage").modal('show')*/
    }
}
/*合同订单签订列表*/
$("#selfStudyPackageList").bootstrapTable({
    url: "../json/lifeCycleManagement/contractOrder.json",
    pagination: !0,
    showRefresh: false,
    showToggle: false,
    showColumns: false,
    search:true,
    iconSize: "outline",
    toolbar: "#hardwareProchaseToolbar",
    columns: [
        {checkbox: true},
        {field: 'contractNumber', title: '硬件序列号'},
        {field: 'salesperson', title: '制作人'},
        {field: 'projectStaus', title: '制作日期'},
        {field: 'finishProductCode', title: '管理版ID码'},
        {field: 'productName', title: '软件版本'},
        {field: 'number', title: '授权信息'},
        {field: 'date', title: '合同号'},
        {field: 'createdDate', title: '其他备注'},
        {field: 'operate', title: '操作', formatter: addicon, events: operateEvent}
    ]
});
var _date = null, _config = {};


/*
/!*初始化参数*!/
laydate.render({
    elem: "#issueDate",  //id
    type:'datetime',   //时间类型：year 、month 、date 、time 、datetime
    range:''     //开启左右面板范围选择，默认‘-’或者‘～’
});
laydate.render({
    elem: "#createDate",  //id
    type:'datetime',   //时间类型：year 、month 、date 、time 、datetime
    range:''     //开启左右面板范围选择，默认‘-’或者‘～’
});
*/

