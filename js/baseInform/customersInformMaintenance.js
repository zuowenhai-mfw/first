//客户信息维护
app.controller('customersInformListCtrl',  function($scope,NgTableParams, getDataService,$screenFactory,$confirm, ngTip,$uibModal,$http,$compile) {

    $scope.customerOrder = false;
    $scope.customerReceive = false;
    $scope.customerAfterSale = false;
    $scope.customerFactory = false;
    if(sessionStorage.getItem("roleType") == "3" || sessionStorage.getItem("roleType") == "7"){
        //订单用户
        $scope.customerOrder = true;

    }
    if(sessionStorage.getItem("roleType") == "2" || sessionStorage.getItem("roleType") == "3"){
        //收货用户
        $scope.customerReceive = true;

    }
    if(sessionStorage.getItem("roleType") == "2" || sessionStorage.getItem("roleType") == "5"){
        //售后用户
        $scope.customerAfterSale = true;

    }
    if(sessionStorage.getItem("roleType") == "1" || sessionStorage.getItem("roleType") == "3" || sessionStorage.getItem("roleType") == "7"){
        //厂商用户
        $scope.customerFactory = true;

    }


    if(sessionStorage.getItem("roleType") == "1"){
        //角色为产品
        //厂商用户
        $("#customersInformFactoryList").bootstrapTable('destroy');
        $("#customersInformAfterSaleList").bootstrapTable('destroy');
        $("#customersInformOrderList").bootstrapTable('destroy');
        $("#customersInformReceiveList").bootstrapTable('destroy');
        $scope.factoryActive = true;
        setTimeout(function(){
            $scope.options = [];
            $scope.events = [];
            $("#customersInformFactoryList").bootstrapTable({
                url: "/plmcore/customersInformMaintenanceList",
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
                        "customerType": "4",
                        "keyword": keyword
                    }
                    return param;
                },
                columns: [
                    {checkbox: true},
                    {field: 'id', title: 'id',visible: false},
                    {field: 'companyName', title: '单位名称'},
                    {field: 'contactPerson', title: '联系人'},
                    {field: 'department', title: '部门'},
                    {field: 'post', title: '职务'},
                    {field: 'contactInfo', title: '联系方式'},
                    {field: 'warZone', title: '所属战区'},
                    {field: 'system', title: '所属系统'},
                    {field: 'putOnRecordDate', title: '建档日期'},
                    {field: 'remarks', title: '备注'},
                    {field: 'operate', title: '操作', formatter: function(value,row,index){
                            var rtn = "<div id='option_"+index+"'></div>"
                            var event= '<span title="编辑" ng-click="addOrEditcustomersInform('+row.id+')"><a class="fa fa-edit"></a></span> &nbsp;'+
                                '<span title="查看详情" ng-click="opencustomersMesage('+row.id+')"><a class="fa fa-search"></a></span>';

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
        },500)
    }

    if(sessionStorage.getItem("roleType") == "2"){
        //角色为销售
        //收货用户、售后用户
        $("#customersInformFactoryList").bootstrapTable('destroy');
        $("#customersInformAfterSaleList").bootstrapTable('destroy');
        $("#customersInformOrderList").bootstrapTable('destroy');
        $("#customersInformReceiveList").bootstrapTable('destroy');
        $scope.receiveActive = true;
        setTimeout(function(){
            $scope.options = [];
            $scope.events = [];
            $("#customersInformReceiveList").bootstrapTable({
                url: "/plmcore/customersInformMaintenanceList",
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
                        "customerType": "2",
                        "keyword": keyword
                    }
                    return param;
                },
                columns: [
                    {checkbox: true},
                    {field: 'id', title: 'id',visible: false},
                    {field: 'companyName', title: '单位名称'},
                    {field: 'contactPerson', title: '联系人'},
                    {field: 'department', title: '部门'},
                    {field: 'post', title: '职务'},
                    {field: 'contactInfo', title: '联系方式'},
                    {field: 'warZone', title: '所属战区'},
                    {field: 'system', title: '所属系统'},
                    {field: 'putOnRecordDate', title: '建档日期'},
                    {field: 'remarks', title: '备注'},
                    {field: 'operate', title: '操作', formatter: function(value,row,index){
                            var rtn = "<div id='option_"+index+"'></div>"
                            var event= '<span title="编辑" ng-click="addOrEditcustomersInform('+row.id+')"><a class="fa fa-edit"></a></span> &nbsp;'+
                                '<span title="查看详情" ng-click="opencustomersMesage('+row.id+')"><a class="fa fa-search"></a></span>';

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
        },500)
    }


    if(sessionStorage.getItem("roleType") == "3"){
        //角色为库房
        //订单用户、收货用户、厂商用户
        $("#customersInformFactoryList").bootstrapTable('destroy');
        $("#customersInformAfterSaleList").bootstrapTable('destroy');
        $("#customersInformOrderList").bootstrapTable('destroy');
        $("#customersInformReceiveList").bootstrapTable('destroy');
        $scope.orderActive = true;
        setTimeout(function(){
            $scope.options = [];
            $scope.events = [];
            $("#customersInformOrderList").bootstrapTable({
                url: "/plmcore/customersInformMaintenanceList",
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
                        "customerType": "1",
                        "keyword": keyword
                    }
                    return param;
                },
                columns: [
                    {checkbox: true},
                    {field: 'id', title: 'id',visible: false},
                    {field: 'companyName', title: '单位名称'},
                    {field: 'contactPerson', title: '联系人'},
                    {field: 'department', title: '部门'},
                    {field: 'post', title: '职务'},
                    {field: 'contactInfo', title: '联系方式'},
                    {field: 'warZone', title: '所属战区'},
                    {field: 'system', title: '所属系统'},
                    {field: 'putOnRecordDate', title: '建档日期'},
                    {field: 'remarks', title: '备注'},
                    {field: 'operate', title: '操作', formatter: function(value,row,index){
                            var rtn = "<div id='option_"+index+"'></div>"
                            var event= '<span title="编辑" ng-click="addOrEditcustomersInform('+row.id+')"><a class="fa fa-edit"></a></span> &nbsp;'+
                                '<span title="查看详情" ng-click="opencustomersMesage('+row.id+')"><a class="fa fa-search"></a></span>';

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
        },500)
    }

    if(sessionStorage.getItem("roleType") == "4"){
        //角色为生产
        //
    }

    if(sessionStorage.getItem("roleType") == "5"){
        //角色为技术
        //售后用户
        $("#customersInformFactoryList").bootstrapTable('destroy');
        $("#customersInformAfterSaleList").bootstrapTable('destroy');
        $("#customersInformOrderList").bootstrapTable('destroy');
        $("#customersInformReceiveList").bootstrapTable('destroy');
        $scope.afterSaleActive = true;
        setTimeout(function(){
            $scope.options = [];
            $scope.events = [];
            $("#customersInformAfterSaleList").bootstrapTable({
                url: "/plmcore/customersInformMaintenanceList",
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
                        "customerType": "3",
                        "keyword": keyword
                    }
                    return param;
                },
                columns: [
                    {checkbox: true},
                    {field: 'id', title: 'id',visible: false},
                    {field: 'companyName', title: '单位名称'},
                    {field: 'contactPerson', title: '联系人'},
                    {field: 'department', title: '部门'},
                    {field: 'post', title: '职务'},
                    {field: 'contactInfo', title: '联系方式'},
                    {field: 'warZone', title: '所属战区'},
                    {field: 'system', title: '所属系统'},
                    {field: 'putOnRecordDate', title: '建档日期'},
                    {field: 'remarks', title: '备注'},
                    {field: 'operate', title: '操作', formatter: function(value,row,index){
                            var rtn = "<div id='option_"+index+"'></div>"
                            var event= '<span title="编辑" ng-click="addOrEditcustomersInform('+row.id+')"><a class="fa fa-edit"></a></span> &nbsp;'+
                                '<span title="查看详情" ng-click="opencustomersMesage('+row.id+')"><a class="fa fa-search"></a></span>';

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
        },500)
    }

    if(sessionStorage.getItem("roleType") == "7"){
        //角色为商务
        //厂商用户
        $("#customersInformFactoryList").bootstrapTable('destroy');
        $("#customersInformAfterSaleList").bootstrapTable('destroy');
        $("#customersInformOrderList").bootstrapTable('destroy');
        $("#customersInformReceiveList").bootstrapTable('destroy');
        $scope.factoryActive = true;
        setTimeout(function(){
            $scope.options = [];
            $scope.events = [];
            $("#customersInformFactoryList").bootstrapTable({
                url: "/plmcore/customersInformMaintenanceList",
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
                        "customerType": "4",
                        "keyword": keyword
                    }
                    return param;
                },
                columns: [
                    {checkbox: true},
                    {field: 'id', title: 'id',visible: false},
                    {field: 'companyName', title: '单位名称'},
                    {field: 'contactPerson', title: '联系人'},
                    {field: 'department', title: '部门'},
                    {field: 'post', title: '职务'},
                    {field: 'contactInfo', title: '联系方式'},
                    {field: 'warZone', title: '所属战区'},
                    {field: 'system', title: '所属系统'},
                    {field: 'putOnRecordDate', title: '建档日期'},
                    {field: 'remarks', title: '备注'},
                    {field: 'operate', title: '操作', formatter: function(value,row,index){
                            var rtn = "<div id='option_"+index+"'></div>"
                            var event= '<span title="编辑" ng-click="addOrEditcustomersInform('+row.id+')"><a class="fa fa-edit"></a></span> &nbsp;'+
                                '<span title="查看详情" ng-click="opencustomersMesage('+row.id+')"><a class="fa fa-search"></a></span>';

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
        },500)
    }


    if(sessionStorage.getItem("roleType") == "6"){
        //订单用户、收货用户、售后用户、厂商用户
        //这里先初始化订单用户列表
        $scope.customerOrder = true;
        $scope.customerReceive = true;
        $scope.customerAfterSale = true;
        $scope.customerFactory = true;
        $scope.orderActive = true;
        $("#customersInformFactoryList").bootstrapTable('destroy');
        $("#customersInformAfterSaleList").bootstrapTable('destroy');
        $("#customersInformOrderList").bootstrapTable('destroy');
        $("#customersInformReceiveList").bootstrapTable('destroy');
        setTimeout(function(){
            $scope.options = [];
            $scope.events = [];
            $("#customersInformOrderList").bootstrapTable({
                url: "/plmcore/customersInformMaintenanceList",
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
                        "customerType": "1",
                        "keyword": keyword
                    }
                    return param;
                },
                columns: [
                    {checkbox: true},
                    {field: 'id', title: 'id',visible: false},
                    {field: 'companyName', title: '单位名称'},
                    {field: 'contactPerson', title: '联系人'},
                    {field: 'department', title: '部门'},
                    {field: 'post', title: '职务'},
                    {field: 'contactInfo', title: '联系方式'},
                    {field: 'warZone', title: '所属战区'},
                    {field: 'system', title: '所属系统'},
                    {field: 'putOnRecordDate', title: '建档日期'},
                    {field: 'remarks', title: '备注'},
                    {field: 'operate', title: '操作', formatter: function(value,row,index){
                            var rtn = "<div id='option_"+index+"'></div>"
                            var event= '<span title="编辑" ng-click="addOrEditcustomersInform('+row.id+')"><a class="fa fa-edit"></a></span> &nbsp;'+
                                '<span title="查看详情" ng-click="opencustomersMesage('+row.id+')"><a class="fa fa-search"></a></span>';

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
        },500)
    }


    $scope.customersInformOrder = function () {

        if($scope.customerOrder){
            $("#customersInformFactoryList").bootstrapTable('destroy');
            $("#customersInformAfterSaleList").bootstrapTable('destroy');
            $("#customersInformOrderList").bootstrapTable('destroy');
            $("#customersInformReceiveList").bootstrapTable('destroy');
            setTimeout(function(){
                $scope.options = [];
                $scope.events = [];
                $("#customersInformOrderList").bootstrapTable({
                    url: "/plmcore/customersInformMaintenanceList",
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
                            "customerType": "1",
                            "keyword": keyword
                        }
                        return param;
                    },
                    columns: [
                        {checkbox: true},
                        {field: 'id', title: 'id',visible: false},
                        {field: 'companyName', title: '单位名称'},
                        {field: 'contactPerson', title: '联系人'},
                        {field: 'department', title: '部门'},
                        {field: 'post', title: '职务'},
                        {field: 'contactInfo', title: '联系方式'},
                        {field: 'warZone', title: '所属战区'},
                        {field: 'system', title: '所属系统'},
                        {field: 'putOnRecordDate', title: '建档日期'},
                        {field: 'remarks', title: '备注'},
                        {field: 'operate', title: '操作', formatter: function(value,row,index){
                                var rtn = "<div id='option_"+index+"'></div>"
                                var event= '<span title="编辑" ng-click="addOrEditcustomersInform('+row.id+')"><a class="fa fa-edit"></a></span> &nbsp;'+
                                    '<span title="查看详情" ng-click="opencustomersMesage('+row.id+')"><a class="fa fa-search"></a></span>';

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
            },500)
        }


    }


    $scope.customersInformReceive = function () {

        if($scope.customerReceive){
            $("#customersInformFactoryList").bootstrapTable('destroy');
            $("#customersInformAfterSaleList").bootstrapTable('destroy');
            $("#customersInformOrderList").bootstrapTable('destroy');
            $("#customersInformReceiveList").bootstrapTable('destroy');
            setTimeout(function(){
                $scope.options = [];
                $scope.events = [];
                $("#customersInformReceiveList").bootstrapTable({
                    url: "/plmcore/customersInformMaintenanceList",
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
                            "customerType": "2",
                            "keyword": keyword
                        }
                        return param;
                    },
                    columns: [
                        {checkbox: true},
                        {field: 'id', title: 'id',visible: false},
                        {field: 'companyName', title: '单位名称'},
                        {field: 'contactPerson', title: '联系人'},
                        {field: 'department', title: '部门'},
                        {field: 'post', title: '职务'},
                        {field: 'contactInfo', title: '联系方式'},
                        {field: 'warZone', title: '所属战区'},
                        {field: 'system', title: '所属系统'},
                        {field: 'putOnRecordDate', title: '建档日期'},
                        {field: 'remarks', title: '备注'},
                        {field: 'operate', title: '操作', formatter: function(value,row,index){
                                var rtn = "<div id='option_"+index+"'></div>"
                                var event= '<span title="编辑" ng-click="addOrEditcustomersInform('+row.id+')"><a class="fa fa-edit"></a></span> &nbsp;'+
                                    '<span title="查看详情" ng-click="opencustomersMesage('+row.id+')"><a class="fa fa-search"></a></span>';

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
            },500)
        }


    }

    $scope.customersInformAfterSale = function () {

        if($scope.customerAfterSale){
            $("#customersInformFactoryList").bootstrapTable('destroy');
            $("#customersInformAfterSaleList").bootstrapTable('destroy');
            $("#customersInformOrderList").bootstrapTable('destroy');
            $("#customersInformReceiveList").bootstrapTable('destroy');
            setTimeout(function(){
                $scope.options = [];
                $scope.events = [];
                $("#customersInformAfterSaleList").bootstrapTable({
                    url: "/plmcore/customersInformMaintenanceList",
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
                            "customerType": "3",
                            "keyword": keyword
                        }
                        return param;
                    },
                    columns: [
                        {checkbox: true},
                        {field: 'id', title: 'id',visible: false},
                        {field: 'companyName', title: '单位名称'},
                        {field: 'contactPerson', title: '联系人'},
                        {field: 'department', title: '部门'},
                        {field: 'post', title: '职务'},
                        {field: 'contactInfo', title: '联系方式'},
                        {field: 'warZone', title: '所属战区'},
                        {field: 'system', title: '所属系统'},
                        {field: 'putOnRecordDate', title: '建档日期'},
                        {field: 'remarks', title: '备注'},
                        {field: 'operate', title: '操作', formatter: function(value,row,index){
                                var rtn = "<div id='option_"+index+"'></div>"
                                var event= '<span title="编辑" ng-click="addOrEditcustomersInform('+row.id+')"><a class="fa fa-edit"></a></span> &nbsp;'+
                                    '<span title="查看详情" ng-click="opencustomersMesage('+row.id+')"><a class="fa fa-search"></a></span>';

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
            },500)
        }

    }

    $scope.customersInformFactory = function () {
        if($scope.customerFactory){
            $("#customersInformFactoryList").bootstrapTable('destroy');
            $("#customersInformAfterSaleList").bootstrapTable('destroy');
            $("#customersInformOrderList").bootstrapTable('destroy');
            $("#customersInformReceiveList").bootstrapTable('destroy');
            setTimeout(function(){
                $scope.options = [];
                $scope.events = [];
                $("#customersInformFactoryList").bootstrapTable({
                    url: "/plmcore/customersInformMaintenanceList",
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
                            "customerType": "4",
                            "keyword": keyword
                        }
                        return param;
                    },
                    columns: [
                        {checkbox: true},
                        {field: 'id', title: 'id',visible: false},
                        {field: 'companyName', title: '单位名称'},
                        {field: 'contactPerson', title: '联系人'},
                        {field: 'department', title: '部门'},
                        {field: 'post', title: '职务'},
                        {field: 'contactInfo', title: '联系方式'},
                        {field: 'warZone', title: '所属战区'},
                        {field: 'system', title: '所属系统'},
                        {field: 'putOnRecordDate', title: '建档日期'},
                        {field: 'remarks', title: '备注'},
                        {field: 'operate', title: '操作', formatter: function(value,row,index){
                                var rtn = "<div id='option_"+index+"'></div>"
                                var event= '<span title="编辑" ng-click="addOrEditcustomersInform('+row.id+')"><a class="fa fa-edit"></a></span> &nbsp;'+
                                    '<span title="查看详情" ng-click="opencustomersMesage('+row.id+')"><a class="fa fa-search"></a></span>';

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
            },500)
        }

    }


    //打开新增 、编辑页面
    $scope.addOrEditcustomersInform = function(obj){
        $uibModal.open({
            templateUrl : 'baseInform/customersInformList/customersInformAddOrEdit.html',
            controller :'addOrEditCustomersInformCtrl',
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
    $scope.opencustomersMesage = function(obj){
        $uibModal.open({
            templateUrl : 'baseInform/customersInformList/customersInformDetail.html',
            controller :'customersDetailCtrl',
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
    $scope.delCustomersInfoList = function(){
        var checkId = [];
        var rows_order = $("#customersInformOrderList").bootstrapTable('getSelections');
        var rows_receive = $("#customersInformReceiveList").bootstrapTable('getSelections');
        var rows_afterSale = $("#customersInformAfterSaleList").bootstrapTable('getSelections');
        var rows_factory = $("#customersInformFactoryList").bootstrapTable('getSelections');


        if(rows_order.length!=0 && rows_order[0].id!="customersInformOrderList"){
            for(var i=0;i<rows_order.length;i++){
                checkId.push(rows_order[i].id);
            }
        }else if(rows_receive.length!=0 && rows_receive[0].id!="customersInformReceiveList"){
            for(var i=0;i<rows_receive.length;i++){
                checkId.push(rows_receive[i].id);
            }
        }else if(rows_afterSale.length!=0 && rows_afterSale[0].id!="customersInformAfterSaleList"){
            for(var i=0;i<rows_afterSale.length;i++){
                checkId.push(rows_afterSale[i].id);
            }
        }else if(rows_factory.length!=0 && rows_factory[0].id!="customersInformFactoryList"){
            for(var i=0;i<rows_factory.length;i++){
                checkId.push(rows_factory[i].id);
            }
        }
        if(rows_order.length == 0 && rows_receive.length == 0 && rows_afterSale.length == 0 && rows_factory.length == 0){
            ngTip.tip("请选择要删除的数据！", "warning");
        }else{

            $confirm({text: "删除的数据无法恢复，您确认删除吗？", title: "删除数据", ok: "是", cancel: "否"})
                .then(function () {
                    $http({
                        method: 'post',
                        url: '/plmcore/deleteCustomersInformMaintenance',
                        params: {
                            checkId: checkId.join(",")
                        }
                    }).success(function (response) {
                        if(response.stateCode == '1'){
                            ngTip.tip(response.message, "success");
                        }else{
                            ngTip.tip(response.message, "warning");
                        }
                        $("#customersInformOrderList").bootstrapTable('refresh');
                        $("#customersInformReceiveList").bootstrapTable('refresh');
                        $("#customersInformAfterSaleList").bootstrapTable('refresh');
                        $("#customersInformFactoryList").bootstrapTable('refresh');
                    });
                });
        }
    }


});


/*点击编辑或者新增的模态框*/
app.controller('addOrEditCustomersInformCtrl',function($scope,$uibModalInstance,ngTip,param,$http){
    //关闭按钮
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }
    $scope.customerInfoMaintain = {};
    $scope.customerInfoMaintain.id = 0;
    $scope.customerType = "1";
    $scope.title = '新增'
    $scope.getRoleType = sessionStorage.getItem("roleType");
    $scope.jdDate=new Date().toLocaleDateString();
    $scope.customerInfoMaintain.putOnRecordDate=$scope.jdDate.replace(new RegExp("/","gm"),"-");
    if($scope.getRoleType == '2'){
        $scope.customerType = "2";
    }else if($scope.getRoleType == '5'){
        $scope.customerType = "3";
    }else if($scope.getRoleType == '1'){
        $scope.customerType = "4";
    }


    if(param != undefined){
        $scope.title = '编辑';
        $scope.customerInfoMaintain.id = param;
        $http({
            url:'/plmcore/updateCustomersInformMaintenanceView',
            method :'POST',
            params: {
                id: $scope.customerInfoMaintain.id
            }
        }).success(function(res){
            $scope.customerInfoMaintain = res;
            if(res.customerType=="1"){
                //订单用户
                $scope.customerType = "1";
            }else if(res.customerType=="2"){
                //收货用户
                $scope.customerType = "2";
            }else if(res.customerType=="3"){
                //售后用户
                $scope.customerType = "3";
            }else if(res.customerType=="4"){
                //厂商用户
                $scope.customerType = "4";
            }
        }).error(function () {
            ngTip.tip("网络不通请关闭窗口重试");
        });
    }else{
        $scope.title = '新增';
    }

    $scope.save = function () {

        $scope.getPutOnRecordDate = $scope.customerInfoMaintain.putOnRecordDate;
        $scope.customerInfoMaintain.putOnRecordDate = null;
        if (param != undefined) {
            $scope.title = '编辑';
            $http({
                method: "POST",
                url: "/plmcore/saveCustomersInformMaintenance",
                params: {
                    id: $scope.customerInfoMaintain.id,
                    companyName: $scope.customerInfoMaintain.companyName,
                    contactPerson: $scope.customerInfoMaintain.contactPerson,
                    contactInfo: $scope.customerInfoMaintain.contactInfo,
                    department: $scope.customerInfoMaintain.department,
                    post: $scope.customerInfoMaintain.post,
                    warZone: $scope.customerInfoMaintain.warZone,
                    system: $scope.customerInfoMaintain.system,
                    getPutOnRecordDate: $scope.getPutOnRecordDate,
                    customerType: $scope.customerType,
                    remarks: $scope.customerInfoMaintain.remarks
                }
            }).success(function (res) {
                ngTip.tip(res.message, res.result);
            })
        }else{
            //新增
            $http({
                method: "POST",
                url: "/plmcore/saveCustomersInformMaintenance",
                params: {
                    id: $scope.customerInfoMaintain.id,
                    companyName: $scope.customerInfoMaintain.companyName,
                    contactPerson: $scope.customerInfoMaintain.contactPerson,
                    contactInfo: $scope.customerInfoMaintain.contactInfo,
                    department: $scope.customerInfoMaintain.department,
                    post: $scope.customerInfoMaintain.post,
                    warZone: $scope.customerInfoMaintain.warZone,
                    system: $scope.customerInfoMaintain.system,
                    getPutOnRecordDate: $scope.getPutOnRecordDate,
                    customerType: $scope.customerType,
                    remarks: $scope.customerInfoMaintain.remarks
                }
            }).success(function (res) {
                ngTip.tip(res.message, res.result);
            })
        }

        var time = setTimeout(function(){
            $uibModalInstance.close(true);
        },1000);
        parent.location.reload();
    }

})

/*查看详情*/
app.controller('customersDetailCtrl',function($scope,$uibModalInstance,param,$http){

    //关闭按钮
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }
    $scope.customerInfoMaintain = {};
    $scope.customerInfoMaintain.id = 0;
    $scope.customerType = "1";
    $scope.getRoleType = sessionStorage.getItem("roleType");
    $scope.title = '新增'
    $scope.jdDate=new Date().toLocaleDateString();
    $scope.customerInfoMaintain.putOnRecordDate=$scope.jdDate.replace(new RegExp("/","gm"),"-");
    if(param != undefined){
        $scope.title = '编辑';
        $scope.customerInfoMaintain.id = param;
        $http({
            url:'/plmcore/updateCustomersInformMaintenanceView',
            method :'POST',
            params: {
                id: $scope.customerInfoMaintain.id
            }
        }).success(function(res){
            $scope.customerInfoMaintain = res;
            if(res.customerType=="1"){
                //订单用户
                $scope.customerType = "1";
            }else if(res.customerType=="2"){
                //收货用户
                $scope.customerType = "2";
            }else if(res.customerType=="3"){
                //售后用户
                $scope.customerType = "3";
            }else if(res.customerType=="4"){
                //厂商用户
                $scope.customerType = "4";
            }
        }).error(function () {
            ngTip.tip("网络不通请关闭窗口重试");
        });
    }else{
        $scope.title = '新增';
    }

})