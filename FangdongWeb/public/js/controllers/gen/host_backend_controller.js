var app = angular.module('HostBackendApp', ['tm.pagination', 'ui.grid', 'ui.grid.resizeColumns', 'ui.grid.selection', 'ui.grid.edit', 'angularFileUpload', 'fundoo.services', 'simditor', 'ui.grid.autoFitColumns']);

var uploadImageTemplateHost = '<div> <input type="file" name="files[]" accept="image/gif,image/jpeg,image/jpg,image/png" ng-file-select="grid.appScope.uploadImage($files, \'MODEL_COL_FIELD\', row.entity)"/> <div ng-repeat="imageName in MODEL_COL_FIELD.split(\',\')"> <div ng-show="imageName"> <a class="fancybox" target="_blank" data-fancybox-group="gallery" fancybox ng-href="/showImage/{{imageName}}"><img ng-src="/showimg/thumb/{{imageName}}" style="width:50px;height:50px;float:left"></a><input type="button" ng-click="grid.appScope.deleteImage(row.entity, \'MODEL_COL_FIELD\', imageName)" value="删除" style="float:left" /></div></div></div>';
var checkboxTemplateHost = '<div><input type="checkbox" ng-model="MODEL_COL_FIELD" ng-click="grid.appScope.updateEntity(col, row)" /></div>';
var childButtonTemplateHostBankCard = '<div align="center" style="height:26px;line-height:24px"><a href="#" data-toggle="tooltip" title="弹窗显示"><button class="btn btn-xs btn-success" ng-click="grid.appScope.popChildBankCard(row.entity)"><i class="icon-list-alt icon-white"></i></button></a> <a href="#" data-toggle="tooltip" title="跳转"><button class="btn btn-xs btn-primary" ng-click="grid.appScope.goToChildPageBankCard(row.entity.id)"><i class="icon-share icon-white"></i></button></a></div>';
var childButtonTemplateHostContractRecord = '<div align="center" style="height:26px;line-height:24px"><a href="#" data-toggle="tooltip" title="弹窗显示"><button class="btn btn-xs btn-success" ng-click="grid.appScope.popChildContractRecord(row.entity)"><i class="icon-list-alt icon-white"></i></button></a> <a href="#" data-toggle="tooltip" title="跳转"><button class="btn btn-xs btn-primary" ng-click="grid.appScope.goToChildPageContractRecord(row.entity.id)"><i class="icon-share icon-white"></i></button></a></div>';
var childButtonTemplateHostCreditRecord = '<div align="center" style="height:26px;line-height:24px"><a href="#" data-toggle="tooltip" title="弹窗显示"><button class="btn btn-xs btn-success" ng-click="grid.appScope.popChildCreditRecord(row.entity)"><i class="icon-list-alt icon-white"></i></button></a> <a href="#" data-toggle="tooltip" title="跳转"><button class="btn btn-xs btn-primary" ng-click="grid.appScope.goToChildPageCreditRecord(row.entity.id)"><i class="icon-share icon-white"></i></button></a></div>';
var childButtonTemplateHostFundBackRecord = '<div align="center" style="height:26px;line-height:24px"><a href="#" data-toggle="tooltip" title="弹窗显示"><button class="btn btn-xs btn-success" ng-click="grid.appScope.popChildFundBackRecord(row.entity)"><i class="icon-list-alt icon-white"></i></button></a> <a href="#" data-toggle="tooltip" title="跳转"><button class="btn btn-xs btn-primary" ng-click="grid.appScope.goToChildPageFundBackRecord(row.entity.id)"><i class="icon-share icon-white"></i></button></a></div>';
var childButtonTemplateHostHouse = '<div align="center" style="height:26px;line-height:24px"><a href="#" data-toggle="tooltip" title="弹窗显示"><button class="btn btn-xs btn-success" ng-click="grid.appScope.popChildHouse(row.entity)"><i class="icon-list-alt icon-white"></i></button></a> <a href="#" data-toggle="tooltip" title="跳转"><button class="btn btn-xs btn-primary" ng-click="grid.appScope.goToChildPageHouse(row.entity.id)"><i class="icon-share icon-white"></i></button></a></div>';
var childButtonTemplateHostProductRecord = '<div align="center" style="height:26px;line-height:24px"><a href="#" data-toggle="tooltip" title="弹窗显示"><button class="btn btn-xs btn-success" ng-click="grid.appScope.popChildProductRecord(row.entity)"><i class="icon-list-alt icon-white"></i></button></a> <a href="#" data-toggle="tooltip" title="跳转"><button class="btn btn-xs btn-primary" ng-click="grid.appScope.goToChildPageProductRecord(row.entity.id)"><i class="icon-share icon-white"></i></button></a></div>';
var childButtonTemplateHostRentRecord = '<div align="center" style="height:26px;line-height:24px"><a href="#" data-toggle="tooltip" title="弹窗显示"><button class="btn btn-xs btn-success" ng-click="grid.appScope.popChildRentRecord(row.entity)"><i class="icon-list-alt icon-white"></i></button></a> <a href="#" data-toggle="tooltip" title="跳转"><button class="btn btn-xs btn-primary" ng-click="grid.appScope.goToChildPageRentRecord(row.entity.id)"><i class="icon-share icon-white"></i></button></a></div>';
//var friendButtonTemplateHost = '<div align="center" style="height:26px;line-height:24px"><a href="#" data-toggle="tooltip" title="跳转"><button class="btn btn-xs btn-primary" ng-click="grid.appScope.goToFriendPage(row.entity.id)"><i class="icon-share icon-white"></i></button></a></div>';
var friendButtonTemplateHostGuest = '<div align="center" style="height:26px;line-height:24px"><a href="#" data-toggle="tooltip" title="弹窗显示"><button class="btn btn-xs btn-success" ng-click="grid.appScope.popFriendGuest(row.entity)"><i class="icon-list-alt icon-white"></i></button></a> <a href="#" data-toggle="tooltip" title="跳转"><button class="btn btn-xs btn-primary" ng-click="grid.appScope.goToFriendPageGuest(row.entity.id)"><i class="icon-share icon-white"></i></button></a></div>';
var readonlyImageTemplateHost = '<div><div ng-repeat="imageName in MODEL_COL_FIELD.split(\',\')"><div ng-show="imageName"><a class="fancybox" target="_blank" data-fancybox-group="gallery" fancybox ng-href="/showImage/{{imageName}}"><img ng-src="/showimg/thumb/{{imageName}}" style="width:50px;height:50px;float:left"></a></div></div></div>';
var readonlyCheckboxTemplateHost = '<div><input type="checkbox" ng-model="MODEL_COL_FIELD" disabled="disabled" /></div>';

app.filter('safehtml', function ($sce) {
    return function (htmlString) {
        return $sce.trustAsHtml(htmlString);
    }
});


app.controller('HostBackendController', ['$scope', '$http', '$upload', 'createDialog', '$log', function ($scope, $http, $upload, createDialogService, $log) {
	$scope.isHost = true;
    
    if(GetQueryString('relate') && GetQueryString('relateValue')) {
        $scope.relate = GetQueryString('relate')
        $scope.relateValue = GetQueryString('relateValue')
    }
    
    var rowLowHeight = 26
    var rowHighHeight = 100 
    
    $scope.objFieldInfo = objFieldInfo
    $scope.objEnumInfo = objEnumInfo   
    
    $scope.status = [{"id": -100, "name": "全部"}]
    dropdownTemplateHostStatus = '<div>' +
        '<select ng-model="MODEL_COL_FIELD" ' +
        'ng-change="grid.appScope.updateEntity(col, row)" style="padding: 2px;">'
    for (var i = 0; i < Object.keys(objEnumInfo.Host.status).length; i++) {
        $scope.status.push({"id": i, "name": objEnumInfo.Host.status[i]})
        dropdownTemplateHostStatus += '<option ng-selected="MODEL_COL_FIELD==' + i
            + '" value=' + i + '>' + objEnumInfo.Host.status[i] + '</option>'
    }
    dropdownTemplateHostStatus += '</select></div>'

    // -100即选择"全部"
    $scope.selectedStatus = -100 
    $scope.$watch('selectedStatus', function (newValue, oldValue, scope) {
        if (newValue != oldValue) {
            if ($scope.list.length > 0) {
                if ($scope.paginationConf.currentPage != 1) {
                    $scope.paginationConf.currentPage = 1
                }
            }
            refreshData(true);
        }
    }, false);
    
    $scope.sexEnum = []
    dropdownTemplateHostSexEnum = '<div>' +
        '<select ng-model="MODEL_COL_FIELD" ' +
        'ng-change="grid.appScope.updateEntity(col, row)" style="padding: 2px;">'
    for (var i = 0; i < Object.keys(objEnumInfo.Host.sexEnum).length; i++) {
        $scope.sexEnum.push({"id": i, "name": objEnumInfo.Host.sexEnum[i]})
        dropdownTemplateHostSexEnum += '<option ng-selected="MODEL_COL_FIELD==' + i
            + '" value=' + i + '>' + objEnumInfo.Host.sexEnum[i] + '</option>'
    }
    dropdownTemplateHostSexEnum += '</select></div>'
    
    $scope.userRoleEnum = []
    dropdownTemplateHostUserRoleEnum = '<div>' +
        '<select ng-model="MODEL_COL_FIELD" ' +
        'ng-change="grid.appScope.updateEntity(col, row)" style="padding: 2px;">'
    for (var i = 0; i < Object.keys(objEnumInfo.Host.userRoleEnum).length; i++) {
        $scope.userRoleEnum.push({"id": i, "name": objEnumInfo.Host.userRoleEnum[i]})
        dropdownTemplateHostUserRoleEnum += '<option ng-selected="MODEL_COL_FIELD==' + i
            + '" value=' + i + '>' + objEnumInfo.Host.userRoleEnum[i] + '</option>'
    }
    dropdownTemplateHostUserRoleEnum += '</select></div>'
    
    $scope.mySelections = [];
    $scope.gridOptions = {
        data: 'list',
        rowHeight: hasImageField ? rowHighHeight : rowLowHeight,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function (rows) {
                $scope.mySelections = gridApi.selection.getSelectedRows();
            });
        }
    };

    $scope.gridOptions.columnDefs = [        
        {field: 'id', displayName: 'Id', width: '40', headerTooltip: '点击表头可进行排序', enableCellEdit: false},
        {field: 'name', displayName: objFieldInfo.Host.name, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'loginName', displayName: objFieldInfo.Host.loginName, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'wxId', displayName: objFieldInfo.Host.wxId, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'sexEnum', displayName: objFieldInfo.Host.sexEnum, width: 120, headerTooltip: '点击表头可进行排序, 通过直接下拉选取操作来更新数据', enableCellEdit: false, cellTemplate: dropdownTemplateHostSexEnum},
        {field: 'phone', displayName: objFieldInfo.Host.phone, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'cardNumber', displayName: objFieldInfo.Host.cardNumber, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'email', displayName: objFieldInfo.Host.email, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'address', displayName: objFieldInfo.Host.address, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'birth', displayName: objFieldInfo.Host.birth, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'password', displayName: objFieldInfo.Host.password, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'createdAt', displayName: objFieldInfo.Host.createdAt, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'lastUpdateTime', displayName: objFieldInfo.Host.lastUpdateTime, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'headImages', displayName: objFieldInfo.Host.headImages, width: 170, enableCellEdit: false, cellTemplate: uploadImageTemplateHost},
        {field: 'images', displayName: objFieldInfo.Host.images, width: 170, enableCellEdit: false, cellTemplate: uploadImageTemplateHost},
        {field: 'lastLoginIp', displayName: objFieldInfo.Host.lastLoginIp, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'lastLoginTime', displayName: objFieldInfo.Host.lastLoginTime, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'lastLoginIpArea', displayName: objFieldInfo.Host.lastLoginIpArea, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'status', displayName: objFieldInfo.Host.status, width: 120, headerTooltip: '点击表头可进行排序, 通过直接下拉选取操作来更新数据', enableCellEdit: false, cellTemplate: dropdownTemplateHostStatus},
        {field: 'credit', displayName: objFieldInfo.Host.credit, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'userRoleEnum', displayName: objFieldInfo.Host.userRoleEnum, width: 120, headerTooltip: '点击表头可进行排序, 通过直接下拉选取操作来更新数据', enableCellEdit: false, cellTemplate: dropdownTemplateHostUserRoleEnum},
        {field: 'comment', displayName: objFieldInfo.Host.comment, width: '100', headerTooltip: '点击表头可进行排序', enableCellEdit: true, cellTemplate: '<div ng-bind-html="COL_FIELD | safehtml"></div>'},
        {field: 'refPartnerId', displayName: objFieldInfo.Host.refPartnerId, headerTooltip: '点击表头可进行排序', enableCellEdit: false, cellTemplate: '<a href="/admin/partner?relate=id&relateValue={{COL_FIELD}}"><span ng-bind="COL_FIELD"></span></a>'},
        {field: 'childBankCard', displayName: objFieldInfo.Host.bankCards, width: '80', headerTooltip: '弹窗/跳转显示', enableCellEdit: false, cellTemplate: childButtonTemplateHostBankCard},
        {field: 'childContractRecord', displayName: objFieldInfo.Host.contractRecords, width: '80', headerTooltip: '弹窗/跳转显示', enableCellEdit: false, cellTemplate: childButtonTemplateHostContractRecord},
        {field: 'childCreditRecord', displayName: objFieldInfo.Host.creditRecords, width: '80', headerTooltip: '弹窗/跳转显示', enableCellEdit: false, cellTemplate: childButtonTemplateHostCreditRecord},
        {field: 'childFundBackRecord', displayName: objFieldInfo.Host.fundBackRecords, width: '80', headerTooltip: '弹窗/跳转显示', enableCellEdit: false, cellTemplate: childButtonTemplateHostFundBackRecord},
        {field: 'childHouse', displayName: objFieldInfo.Host.houses, width: '80', headerTooltip: '弹窗/跳转显示', enableCellEdit: false, cellTemplate: childButtonTemplateHostHouse},
        {field: 'childProductRecord', displayName: objFieldInfo.Host.productRecords, width: '80', headerTooltip: '弹窗/跳转显示', enableCellEdit: false, cellTemplate: childButtonTemplateHostProductRecord},
        {field: 'childRentRecord', displayName: objFieldInfo.Host.rentRecords, width: '80', headerTooltip: '弹窗/跳转显示', enableCellEdit: false, cellTemplate: childButtonTemplateHostRentRecord},
        {field: 'friendGuest', displayName: objFieldInfo.Host.guests, width: '80', headerTooltip: '弹窗/跳转显示', enableCellEdit: false, cellTemplate: friendButtonTemplateHostGuest},

        {field: 'partner', displayName: objFieldInfo.Host.partner, headerTooltip: '点击表头可进行排序', enableCellEdit: false, cellTemplate: '<a href="/admin/partner?relate=id&relateValue={{COL_FIELD.id}}"><span ng-bind="COL_FIELD.name"></span></a>'},
    ];
    
    $scope.goToChildPageBankCard = function(pid) { location = '/admin/bankcard?relate=host.id&relateValue=' + pid }
    $scope.goToChildPageContractRecord = function(pid) { location = '/admin/contractrecord?relate=host.id&relateValue=' + pid }
    $scope.goToChildPageCreditRecord = function(pid) { location = '/admin/creditrecord?relate=host.id&relateValue=' + pid }
    $scope.goToChildPageFundBackRecord = function(pid) { location = '/admin/fundbackrecord?relate=host.id&relateValue=' + pid }
    $scope.goToChildPageHouse = function(pid) { location = '/admin/house?relate=host.id&relateValue=' + pid }
    $scope.goToChildPageProductRecord = function(pid) { location = '/admin/productrecord?relate=host.id&relateValue=' + pid }
    $scope.goToChildPageRentRecord = function(pid) { location = '/admin/rentrecord?relate=host.id&relateValue=' + pid }
    $scope.goToFriendPageGuest = function(pid) { location = '/admin/guest?relate=hosts.id&relateValue=' + pid }
    
    $scope.selectedParentPartnerId = 0
    $scope.parentPartners = []
    $scope.parentPartners4grid = []
    $scope.pageInfo4ParentPartner = {}
    $scope.searchFieldNamePartner = searchFieldNamePartner
    $scope.searchFieldNamePartnerComment = searchFieldNamePartnerComment
    

    $scope.$watch('selectedParentPartnerId', function(newValue, oldValue, scope){
        if(newValue != oldValue) {
            if($scope.parentPartners.length > 0) {
                if ($scope.selectedParentPartnerId) {
                    if ($scope.paginationConf.currentPage != 1) {
                        $scope.paginationConf.currentPage = 1
                    }
                } else {
                    if ($scope.paginationConf.currentPage != 1) {
                        $scope.paginationConf.currentPage = 1
                    }
                    $scope.selectedParentPartnerId = 0
                }
                refreshData(true)
            }
        }
    }, false);

    $scope.$watch('paginationConf4ParentPartner.itemsPerPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithParentPartners();
        }
    }, false);

    $scope.$watch('paginationConf4ParentPartner.currentPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithParentPartners();
        }
    }, false);

    $scope.paginationConf4ParentPartner = {
        currentPage: 1, //首页
        itemsPerPage: 10, //每页显示数量
        pagesLength: 5,  //显示多少个页数格子
        perPageOptions: [1, 2, 5, 10, 20, 50, 100],//选择每页显示数量
        rememberPerPage: 'itemsPerPage4ParentPartner'
    };
    
    $http.get('/base/Partner/all').success(function (data, status, headers, config) {
    	if (data.flag) {
            $scope.parentPartners = [{"id": 0, "name": "全部"}]
    		$scope.parentPartners = $scope.parentPartners.concat(data.data);
            if ((GetQueryString('relate') == 'partner.id' || GetQueryString('relate') == 'refPartnerId') 
                && GetQueryString('relateValue')) 
                $scope.selectedParentPartnerId = parseInt(GetQueryString('relateValue'))
    	}
    });
    
    function fillGridWithParentPartners() {
        url = '/base/Partner/all?page=' 
                    + $scope.paginationConf4ParentPartner.currentPage 
                    + '&size=' + $scope.paginationConf4ParentPartner.itemsPerPage
                    
        if ($scope.currentObj.queryKeyword4Partner)
            url += '&searchOn=' + $scope.searchFieldNamePartner + '&kw=' + $scope.currentObj.queryKeyword4Partner
            
        $http.get(url)
            .success(function (data, status, headers, config) {
            if (data.flag) {
                $scope.parentPartners4grid = data.data;
                $scope.pageInfo4ParentPartner = data.page;
                $scope.paginationConf4ParentPartner.totalItems = data.page.total;
                
                for (x in $scope.parentPartners4grid) {
                    if ($scope.parentPartners4grid[x].id === $scope.currentObj.refPartnerId) {
                        $scope.parentPartners4grid[x].refParentPartner = true
                        break
                    }
                    else {
                        $scope.parentPartners4grid[x].refParentPartner = false
                    }
                }
            }
            else {
                $scope.parentPartners4grid = [];
                //showAlert('错误: ', data.message, 'danger')
            }
        });
    }
    
    $scope.myParentPartnerSelections = [];
    $scope.gridParentPartners = {
        data: 'parentPartners4grid',
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function (rows) {
                $scope.myParentPartnerSelections = gridApi.selection.getSelectedRows();
            });
        },
        isRowSelectable: function(row){
            if(row.entity.refParentPartner == true){
                row.grid.api.selection.selectRow(row.entity);
            }
        },
        columnDefs: [        
            {field: 'id', displayName: 'Id', width: '30', enableCellEdit: false},
            {field: 'name', displayName: '名称', width: '45%', enableCellEdit: true},
            {field: 'createdAt', displayName: '创建时间', width: '45%', enableCellEdit: true},
        ]
    };

    $scope.searchContent4Partner = function(){
        if($scope.paginationConf4ParentPartner.currentPage != 1){
            $scope.paginationConf4ParentPartner.currentPage = 1
        }
        else{
            fillGridWithParentPartners()
        }
    }
    $scope.friends4gridGuest = []
    $scope.pageInfo4FriendGuest = {}
    $scope.searchFieldNameGuest = searchFieldNameGuest
    $scope.searchFieldNameGuestComment = searchFieldNameGuestComment

    $scope.$watch('paginationConf4FriendGuest.itemsPerPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithFriendsGuest();
        }
    }, false);

    $scope.$watch('paginationConf4FriendGuest.currentPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithFriendsGuest();
        }
    }, false);

    $scope.paginationConf4FriendGuest = {
        currentPage: 1, //首页
        itemsPerPage: 10, //每页显示数量
        pagesLength: 5,  //显示多少个页数格子
        perPageOptions: [1, 2, 5, 10, 20, 50, 100],//选择每页显示数量
        rememberPerPage: 'itemsPerPage4FriendGuest'
    };
    
    function fillGridWithFriendsGuest() {
        url = '/base/Guest/all?page=' 
                    + $scope.paginationConf4FriendGuest.currentPage 
                    + '&size=' + $scope.paginationConf4FriendGuest.itemsPerPage
                    
        if ($scope.currentObj.queryKeyword4Guest)
            url += '&searchOn=' + $scope.searchFieldNameGuest + '&kw=' + $scope.currentObj.queryKeyword4Guest
            
        $http.get(url)
            .success(function (data, status, headers, config) {
            if (data.flag) {
                $scope.pageInfo4FriendGuest = data.page;
                $scope.paginationConf4FriendGuest.totalItems = data.page.total;
                
                if ($scope.currentObj.id) {
                    var allFriends = data.data;
                    
                    //用于比较, 全取不分页
                    $http.get('/host/' + $scope.currentObj.id + '/guests?page=1&size=1000000')
                    .success(function (data, status, headers, config) {
                        if (data.flag){
                            for (x in allFriends) {
                                allFriends[x].refFriend = false
                                for (y in data.data) {
                                    if (allFriends[x].id === data.data[y].id) {
                                        allFriends[x].refFriend = true
                                        break
                                    }
                                }
                            }
                        }
                        $scope.friends4gridGuest = allFriends;
                    })
                }
                else {
                    $scope.friends4gridGuest = data.data;
                }
            }
            else {
                $scope.parentGuests4grid = [];
                //showAlert('错误: ', data.message, 'danger')
            }
        });
    }
    
    $scope.myFriendSelectionsGuest = [];
    $scope.gridFriendsGuest = {
        data: 'friends4gridGuest',
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function (rows) {
                $scope.myFriendSelectionsGuest = gridApi.selection.getSelectedRows();
            });
        },
        isRowSelectable: function(row){
            if(row.entity.refFriend == true){
                row.grid.api.selection.selectRow(row.entity);
            }
        },
        columnDefs: [        
            {field: 'id', displayName: 'Id', width: '30', enableCellEdit: false},
            {field: 'name', displayName: '名称', width: '45%', enableCellEdit: true},
            {field: 'createdAt', displayName: '创建时间', width: '45%', enableCellEdit: true},
        ]
    };

    $scope.searchContent4Guest = function(){
        if($scope.paginationConf4FriendGuest.currentPage != 1){
            $scope.paginationConf4FriendGuest.currentPage = 1
        }
        else{
            fillGridWithFriendsGuest()
        }
    }
    
    $scope.currentObj = {}
    $scope.list = []
    $scope.pageInfo = {}
    $scope.queryKeyword = ''
    $scope.startTime = ''
    $scope.endTime = ''
    
    $scope.$watch('paginationConf.itemsPerPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            refreshData(false);
        }
    }, false);

    $scope.$watch('paginationConf.currentPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            refreshData(false);
        }
    }, false);

    $scope.paginationConf = {
        currentPage: 1, //首页
        itemsPerPage: 10, //每页显示数量
        pagesLength: 10,  //显示多少个页数格子
        perPageOptions: [1, 2, 5, 10, 20, 50, 100],//选择每页显示数量
        rememberPerPage: 'itemsPerPage'
    };
    
    if (!GetQueryString('relate')) {
        refreshData(false);
    } 
    else {
        refreshData(true);
    }
    $scope.getRefObjName = function (obj, pascalFieldName) {
        if (!obj['ref' + pascalFieldName + 'Id']) return
        $http.get('/base/' + pascalFieldName + '/' + obj['ref' + pascalFieldName + 'Id']).success(function (data, status, headers, config) {
            if (data.flag) obj[pascalFieldName.toLowerCase()] = data.data
        });
    }

    function refreshData(showMsg){
        var url = '/base/Host/all?page=' 
                    + $scope.paginationConf.currentPage 
                    + '&size=' + $scope.paginationConf.itemsPerPage
                    + '&startTime=' + $scope.startTime + '&endTime=' + $scope.endTime
                    + '&status=' + $scope.selectedStatus
                    
        
        var fieldOnParam = '';
        var fieldValueParam = '';
        
        if ($scope.selectedParentPartnerId != 0) {
            fieldOnParam += 'refPartnerId';
            fieldValueParam += $scope.selectedParentPartnerId;
        }
        url += '&fieldOn=' + fieldOnParam + '&fieldValue=' + fieldValueParam
        
        if ($scope.relate) {
            url += '&fieldOn=' + $scope.relate + '&fieldValue=' + $scope.relateValue
        }
        
        if ($scope.queryKeyword)
            url += '&searchOn=' + searchFieldName + '&kw=' + $scope.queryKeyword

        $http.get(url).success(function (data, status, headers, config) {
            if (data.flag) {
                for (x in data.data) {
                    if (!data.data[x].partner) $scope.getRefObjName(data.data[x], 'Partner')
                }
                $scope.list = data.data;
                $scope.pageInfo = data.page;
                $scope.paginationConf.totalItems = data.page.total;
            }
            else {
                if (showMsg) {
                    $scope.list = [];
                    showAlert('错误: ', data.message, 'danger')
                }
            }
        });
    }
    
	$scope.uploadImage = function($files, imageField, parentObj, needUpdateObj) {// imageField example: imagesList
        var needUpdateObj = (arguments[3] === undefined) ? true : arguments[3]
        imageField = imageField.replace('row.entity.', '')
        for (var i = 0; i < $files.length; i++) {
            var file = $files[i];

            $log.log('start upload image file on id: ' + parentObj.id + ', file: ' + file
                + ', property: ' + imageField)

            $scope.upload = $upload.upload({
                    url : '/upload/image',
                    file : file
                })
                .progress(
                    function(evt) {
                        $log.log('upload image percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                    })
                .success(function(data, status, headers, config) {
                    $log.log(data);
                    if (data.flag) {
                        if (imageField.indexOf("mages") != -1) {
                            if(parentObj[imageField])
                                parentObj[imageField] += ',' + data.data;
                            else
                                parentObj[imageField] = data.data;
                            
                            if (needUpdateObj == true) {
                                $scope.currentObj = parentObj;
                                $scope.saveContent()
                            }
                        } else {
                            showAlert('错误: ', '字段不存在: ' + imageField, 'danger')
                        }
                    } else {
                        showAlert('错误: ', data.message, 'danger')
                    }
                });
            // .error(...)
            // .then(success, error, progress);
        }
    };
    
    // 删除图片
	$scope.deleteImage = function(obj, property, imageName) {
        $scope.currentObj = obj;
        property = property.replace('row.entity.', '')
        var imgList = obj[property].split(',')
        var index = imgList.indexOf(imageName)
        imgList.splice(index, 1)//在数组中删掉这个图片文件名
        obj[property] = imgList.join(",")//数组转为字符串, 以逗号分隔
        $log.log('更新后的images字符串: ' + obj[property])
        
        $scope.saveContent();
	};

    // 当前行更新字段 (only for checkbox & dropdownlist)
    $scope.updateEntity = function(column, row) {
        $scope.currentObj = row.entity;
        $scope.saveContent();
    };

    // 新建或更新对象
    $scope.saveContent = function() {
        var content = $scope.currentObj;
        if ($scope.myParentPartnerSelections.length > 0) content.refPartnerId = $scope.myParentPartnerSelections[0].id
        if ($scope.myFriendSelectionsGuest.length > 0) content.guests = $scope.myFriendSelectionsGuest
        
        var isNew = !content.id
        var url = '/host'
        if(isNew){
        	var http_method = "POST";
        }else{
        	var http_method = "PUT";
        	url += '/' + content.id
        }
        
        $http({method: http_method, url: url, data:content}).success(function(data, status, headers, config) {
            if(data.flag){
                if(isNew){
                    $scope.list.unshift(data.data);
                    showAlert('操作成功: ', '', 'success')
                }else{
                    showAlert('操作成功', '', 'success')
                    gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL)
                }
            }else{
                if (data.message)
                    showAlert('错误: ', data.message, 'danger')
                else {
                    if(data.indexOf('<html') > 0){
                        showAlert('错误: ', '您没有修改权限, 请以超级管理员登录系统.', 'danger');
                        refreshData(false)
                        return
                    }
                }
            }
        });
    };

    $scope.deleteContent = function(){
        var items = $scope.mySelections;
        if(items.length == 0){
            showAlert('错误: ', '请至少选择一个对象', 'warning');
        }else{
            var content = items[0];
            if(content.id){
                bootbox.confirm("您确定要删除这个对象吗?", function(result) {
                    if(result) {
                        var deleteUrl = '/host/' + content.id
                        $http.delete(deleteUrl).success(function(data, status, headers, config) {
                            if (data.flag) {
                            	var index = $scope.list.indexOf(content);
                                $scope.list.splice(index, 1);
                                $scope.mySelections = [];
                                showAlert('操作成功', '', 'success');
                            }
                            else {
                                showAlert('错误: ', data.message, 'danger');
                            }
                        });
                    }
                });
            }
        }
    };

    $scope.formSave = function(formOk){
    	if(!formOk){
            showAlert('错误: ', '输入项验证有误, 请重试', 'warning');
            return
    	}
        $scope.saveContent();
        $scope.$modalClose();
    };

    $scope.dialogClose = function(){
        $scope.myParentPartnerSelections = [];
        $scope.$modalClose();
        refreshData(false)
    };
    
    $scope.addContent = function(){
        $scope.currentObj = {};
        
        fillGridWithParentPartners();
        fillGridWithFriendsGuest();
        
        createDialogService("/assets/html/edit_templates/host.html",{
            id: 'editor',
            title: '新增',
            scope: $scope,
            footerTemplate: '<div></div>'
        });
    };

    $scope.updateContent = function(){
        var items = $scope.mySelections;
        if(items.length == 0){
            showAlert('错误: ', '请至少选择一个对象', 'warning');
        }else{
            var content = items[0];
            if(content.id) {
                $scope.currentObj = items[0];
            }
        
            fillGridWithParentPartners();
            fillGridWithFriendsGuest();

            createDialogService("/assets/html/edit_templates/host.html",{
                id: 'editor',
                title: '编辑',
                scope: $scope,
                footerTemplate: '<div></div>'
            });
        }
    };
    
    $scope.searchContent = function(){
        if($scope.paginationConf.currentPage != 1){
            $scope.paginationConf.currentPage = 1
        }
        else{
            refreshData(true)
        }
    }
    
    $scope.report = function () {
        var notifyMsg = "将导出所有的数据, 确定吗?"
        if($scope.startTime && $scope.endTime) {
            notifyMsg = "将导出从 " + $scope.startTime + " 至 " + $scope.endTime + "之间的数据, 确定吗? (通过调整时间范围可以导出不同时间阶段的数据)"
        }
        bootbox.confirm(notifyMsg, function(result) {
            if(result) {
                location.href = '/report/host?startTime='
                    + $scope.startTime + '&endTime=' + $scope.endTime
            }
        });
    }
    
    $scope.refresh = function(){
        refreshData(true)
    }
    
    $.fn.datetimepicker.dates['zh-CN'] = {
        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
        daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        today: "今天",
        suffix: [],
        meridiem: ["上午", "下午"]
    };

    $('#startTime').datetimepicker({
        language: 'zh-CN',
        format: 'yyyy-mm-dd',
        minView: 'month',
        todayBtn: true,
        todayHighlight: true,
        autoclose: true
    });

    $('#endTime').datetimepicker({
        language: 'zh-CN',
        format: 'yyyy-mm-dd',
        minView: 'month',
        todayBtn: true,
        todayHighlight: true,
        autoclose: true
    });

    ////////// child BankCard popup show //////////
    
    $scope.gridChildBankCard = {
        data: 'childBankCard4grid',
        rowHeight: rowLowHeight,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false
    };
    
    $scope.gridChildBankCard.columnDefs = [        
        {field: 'id', displayName: 'Id', width: '40', enableCellEdit: false},
        {field: 'name', displayName: objFieldInfo.BankCard.name, enableCellEdit: true},
        {field: 'bank', displayName: objFieldInfo.BankCard.bank, enableCellEdit: true},
        {field: 'images', displayName: objFieldInfo.BankCard.images, width: 170, enableCellEdit: false, cellTemplate: readonlyImageTemplateHost},
        {field: 'status', displayName: objFieldInfo.BankCard.status, enableCellEdit: false, cellTemplate: '<span ng-bind="grid.appScope.objEnumInfo.BankCard.status[MODEL_COL_FIELD]"></span>'},
        {field: 'createdAt', displayName: objFieldInfo.BankCard.createdAt, enableCellEdit: true},
        {field: 'lastUpdateTime', displayName: objFieldInfo.BankCard.lastUpdateTime, enableCellEdit: true},
        {field: 'comment', displayName: objFieldInfo.BankCard.comment, enableCellEdit: true},
        {field: 'refHostId', displayName: objFieldInfo.BankCard.refHostId, enableCellEdit: true},
    ];

    $scope.popChildBankCard = function (obj) {
        if (obj) {
            $scope.currentObj = obj;

            fillGridWithChildBankCard()

            createDialogService("/assets/html/child_pop_templates/host_2_bank_card.html", {
                id: 'child_bank_card',
                title: '查看',
                scope: $scope,
                footerTemplate: '<div></div>'
            });
        } else {
            showAlert('错误: ', '数据不存在', 'danger');
        }
    };

    $scope.pageInfo4childBankCard = {}

    $scope.$watch('paginationConf4ChildBankCard.itemsPerPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithChildBankCard();
        }
    }, false);

    $scope.$watch('paginationConf4ChildBankCard.currentPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithChildBankCard();
        }
    }, false);

    $scope.paginationConf4ChildBankCard = {
        currentPage: 1, //首页
        itemsPerPage: 10, //每页显示数量
        pagesLength: 5,  //显示多少个页数格子
        perPageOptions: [1, 2, 5, 10, 20, 50, 100],//选择每页显示数量
        rememberPerPage: 'itemsPerPage4childBankCard'
    };

    function fillGridWithChildBankCard() {
        $scope.childBankCard4grid = []
        $http.get('/base/BankCard/all?page='
        + $scope.paginationConf4ChildBankCard.currentPage
        + '&size=' + $scope.paginationConf4ChildBankCard.itemsPerPage
        + '&fieldOn=host.id&fieldValue=' + $scope.currentObj.id)
            .success(function (data, status, headers, config) {
                if (data.flag) {
                    $scope.childBankCard4grid = data.data;
                    $scope.pageInfo4childBankCard = data.page;
                    $scope.paginationConf4ChildBankCard.totalItems = data.page.total;
                }
            });
    }
    ////////// child ContractRecord popup show //////////
    
    $scope.gridChildContractRecord = {
        data: 'childContractRecord4grid',
        rowHeight: rowLowHeight,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false
    };
    
    $scope.gridChildContractRecord.columnDefs = [        
        {field: 'id', displayName: 'Id', width: '40', enableCellEdit: false},
        {field: 'name', displayName: objFieldInfo.ContractRecord.name, enableCellEdit: true},
        {field: 'status', displayName: objFieldInfo.ContractRecord.status, enableCellEdit: false, cellTemplate: '<span ng-bind="grid.appScope.objEnumInfo.ContractRecord.status[MODEL_COL_FIELD]"></span>'},
        {field: 'contractTime', displayName: objFieldInfo.ContractRecord.contractTime, enableCellEdit: true},
        {field: 'createdAt', displayName: objFieldInfo.ContractRecord.createdAt, enableCellEdit: true},
        {field: 'lastUpdateTime', displayName: objFieldInfo.ContractRecord.lastUpdateTime, enableCellEdit: true},
        {field: 'comment', displayName: objFieldInfo.ContractRecord.comment, enableCellEdit: true},
        {field: 'refHostId', displayName: objFieldInfo.ContractRecord.refHostId, enableCellEdit: true},
        {field: 'refProductId', displayName: objFieldInfo.ContractRecord.refProductId, enableCellEdit: true},
    ];

    $scope.popChildContractRecord = function (obj) {
        if (obj) {
            $scope.currentObj = obj;

            fillGridWithChildContractRecord()

            createDialogService("/assets/html/child_pop_templates/host_2_contract_record.html", {
                id: 'child_contract_record',
                title: '查看',
                scope: $scope,
                footerTemplate: '<div></div>'
            });
        } else {
            showAlert('错误: ', '数据不存在', 'danger');
        }
    };

    $scope.pageInfo4childContractRecord = {}

    $scope.$watch('paginationConf4ChildContractRecord.itemsPerPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithChildContractRecord();
        }
    }, false);

    $scope.$watch('paginationConf4ChildContractRecord.currentPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithChildContractRecord();
        }
    }, false);

    $scope.paginationConf4ChildContractRecord = {
        currentPage: 1, //首页
        itemsPerPage: 10, //每页显示数量
        pagesLength: 5,  //显示多少个页数格子
        perPageOptions: [1, 2, 5, 10, 20, 50, 100],//选择每页显示数量
        rememberPerPage: 'itemsPerPage4childContractRecord'
    };

    function fillGridWithChildContractRecord() {
        $scope.childContractRecord4grid = []
        $http.get('/base/ContractRecord/all?page='
        + $scope.paginationConf4ChildContractRecord.currentPage
        + '&size=' + $scope.paginationConf4ChildContractRecord.itemsPerPage
        + '&fieldOn=host.id&fieldValue=' + $scope.currentObj.id)
            .success(function (data, status, headers, config) {
                if (data.flag) {
                    $scope.childContractRecord4grid = data.data;
                    $scope.pageInfo4childContractRecord = data.page;
                    $scope.paginationConf4ChildContractRecord.totalItems = data.page.total;
                }
            });
    }
    ////////// child CreditRecord popup show //////////
    
    $scope.gridChildCreditRecord = {
        data: 'childCreditRecord4grid',
        rowHeight: rowLowHeight,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false
    };
    
    $scope.gridChildCreditRecord.columnDefs = [        
        {field: 'id', displayName: 'Id', width: '40', enableCellEdit: false},
        {field: 'name', displayName: objFieldInfo.CreditRecord.name, enableCellEdit: true},
        {field: 'creditRaise', displayName: objFieldInfo.CreditRecord.creditRaise, enableCellEdit: true},
        {field: 'status', displayName: objFieldInfo.CreditRecord.status, enableCellEdit: false, cellTemplate: '<span ng-bind="grid.appScope.objEnumInfo.CreditRecord.status[MODEL_COL_FIELD]"></span>'},
        {field: 'createdAt', displayName: objFieldInfo.CreditRecord.createdAt, enableCellEdit: true},
        {field: 'lastUpdateTime', displayName: objFieldInfo.CreditRecord.lastUpdateTime, enableCellEdit: true},
        {field: 'comment', displayName: objFieldInfo.CreditRecord.comment, enableCellEdit: true},
        {field: 'refHostId', displayName: objFieldInfo.CreditRecord.refHostId, enableCellEdit: true},
    ];

    $scope.popChildCreditRecord = function (obj) {
        if (obj) {
            $scope.currentObj = obj;

            fillGridWithChildCreditRecord()

            createDialogService("/assets/html/child_pop_templates/host_2_credit_record.html", {
                id: 'child_credit_record',
                title: '查看',
                scope: $scope,
                footerTemplate: '<div></div>'
            });
        } else {
            showAlert('错误: ', '数据不存在', 'danger');
        }
    };

    $scope.pageInfo4childCreditRecord = {}

    $scope.$watch('paginationConf4ChildCreditRecord.itemsPerPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithChildCreditRecord();
        }
    }, false);

    $scope.$watch('paginationConf4ChildCreditRecord.currentPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithChildCreditRecord();
        }
    }, false);

    $scope.paginationConf4ChildCreditRecord = {
        currentPage: 1, //首页
        itemsPerPage: 10, //每页显示数量
        pagesLength: 5,  //显示多少个页数格子
        perPageOptions: [1, 2, 5, 10, 20, 50, 100],//选择每页显示数量
        rememberPerPage: 'itemsPerPage4childCreditRecord'
    };

    function fillGridWithChildCreditRecord() {
        $scope.childCreditRecord4grid = []
        $http.get('/base/CreditRecord/all?page='
        + $scope.paginationConf4ChildCreditRecord.currentPage
        + '&size=' + $scope.paginationConf4ChildCreditRecord.itemsPerPage
        + '&fieldOn=host.id&fieldValue=' + $scope.currentObj.id)
            .success(function (data, status, headers, config) {
                if (data.flag) {
                    $scope.childCreditRecord4grid = data.data;
                    $scope.pageInfo4childCreditRecord = data.page;
                    $scope.paginationConf4ChildCreditRecord.totalItems = data.page.total;
                }
            });
    }
    ////////// child FundBackRecord popup show //////////
    
    $scope.gridChildFundBackRecord = {
        data: 'childFundBackRecord4grid',
        rowHeight: rowLowHeight,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false
    };
    
    $scope.gridChildFundBackRecord.columnDefs = [        
        {field: 'id', displayName: 'Id', width: '40', enableCellEdit: false},
        {field: 'name', displayName: objFieldInfo.FundBackRecord.name, enableCellEdit: true},
        {field: 'amount', displayName: objFieldInfo.FundBackRecord.amount, enableCellEdit: true},
        {field: 'status', displayName: objFieldInfo.FundBackRecord.status, enableCellEdit: false, cellTemplate: '<span ng-bind="grid.appScope.objEnumInfo.FundBackRecord.status[MODEL_COL_FIELD]"></span>'},
        {field: 'createdAt', displayName: objFieldInfo.FundBackRecord.createdAt, enableCellEdit: true},
        {field: 'lastUpdateTime', displayName: objFieldInfo.FundBackRecord.lastUpdateTime, enableCellEdit: true},
        {field: 'comment', displayName: objFieldInfo.FundBackRecord.comment, enableCellEdit: true},
        {field: 'refHostId', displayName: objFieldInfo.FundBackRecord.refHostId, enableCellEdit: true},
        {field: 'refProductId', displayName: objFieldInfo.FundBackRecord.refProductId, enableCellEdit: true},
    ];

    $scope.popChildFundBackRecord = function (obj) {
        if (obj) {
            $scope.currentObj = obj;

            fillGridWithChildFundBackRecord()

            createDialogService("/assets/html/child_pop_templates/host_2_fund_back_record.html", {
                id: 'child_fund_back_record',
                title: '查看',
                scope: $scope,
                footerTemplate: '<div></div>'
            });
        } else {
            showAlert('错误: ', '数据不存在', 'danger');
        }
    };

    $scope.pageInfo4childFundBackRecord = {}

    $scope.$watch('paginationConf4ChildFundBackRecord.itemsPerPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithChildFundBackRecord();
        }
    }, false);

    $scope.$watch('paginationConf4ChildFundBackRecord.currentPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithChildFundBackRecord();
        }
    }, false);

    $scope.paginationConf4ChildFundBackRecord = {
        currentPage: 1, //首页
        itemsPerPage: 10, //每页显示数量
        pagesLength: 5,  //显示多少个页数格子
        perPageOptions: [1, 2, 5, 10, 20, 50, 100],//选择每页显示数量
        rememberPerPage: 'itemsPerPage4childFundBackRecord'
    };

    function fillGridWithChildFundBackRecord() {
        $scope.childFundBackRecord4grid = []
        $http.get('/base/FundBackRecord/all?page='
        + $scope.paginationConf4ChildFundBackRecord.currentPage
        + '&size=' + $scope.paginationConf4ChildFundBackRecord.itemsPerPage
        + '&fieldOn=host.id&fieldValue=' + $scope.currentObj.id)
            .success(function (data, status, headers, config) {
                if (data.flag) {
                    $scope.childFundBackRecord4grid = data.data;
                    $scope.pageInfo4childFundBackRecord = data.page;
                    $scope.paginationConf4ChildFundBackRecord.totalItems = data.page.total;
                }
            });
    }
    ////////// child House popup show //////////
    
    $scope.gridChildHouse = {
        data: 'childHouse4grid',
        rowHeight: rowLowHeight,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false
    };
    
    $scope.gridChildHouse.columnDefs = [        
        {field: 'id', displayName: 'Id', width: '40', enableCellEdit: false},
        {field: 'name', displayName: objFieldInfo.House.name, enableCellEdit: true},
        {field: 'classify', displayName: objFieldInfo.House.classify, enableCellEdit: true},
        {field: 'province', displayName: objFieldInfo.House.province, enableCellEdit: true},
        {field: 'city', displayName: objFieldInfo.House.city, enableCellEdit: true},
        {field: 'zone', displayName: objFieldInfo.House.zone, enableCellEdit: true},
        {field: 'address', displayName: objFieldInfo.House.address, enableCellEdit: true},
        {field: 'age', displayName: objFieldInfo.House.age, enableCellEdit: true},
        {field: 'size', displayName: objFieldInfo.House.size, enableCellEdit: true},
        {field: 'structure', displayName: objFieldInfo.House.structure, enableCellEdit: true},
        {field: 'rent', displayName: objFieldInfo.House.rent, enableCellEdit: true},
        {field: 'credit', displayName: objFieldInfo.House.credit, enableCellEdit: true},
        {field: 'visible', displayName: objFieldInfo.House.visible, width: 120, enableCellEdit: false, cellTemplate: readonlyCheckboxTemplateHost},
        {field: 'status', displayName: objFieldInfo.House.status, enableCellEdit: false, cellTemplate: '<span ng-bind="grid.appScope.objEnumInfo.House.status[MODEL_COL_FIELD]"></span>'},
        {field: 'images', displayName: objFieldInfo.House.images, width: 170, enableCellEdit: false, cellTemplate: readonlyImageTemplateHost},
        {field: 'createdAt', displayName: objFieldInfo.House.createdAt, enableCellEdit: true},
        {field: 'lastUpdateTime', displayName: objFieldInfo.House.lastUpdateTime, enableCellEdit: true},
        {field: 'description', displayName: objFieldInfo.House.description, width: '100', enableCellEdit: true, cellTemplate: '<div ng-bind-html="COL_FIELD | safehtml"></div>'},
        {field: 'comment', displayName: objFieldInfo.House.comment, enableCellEdit: true},
        {field: 'refHostId', displayName: objFieldInfo.House.refHostId, enableCellEdit: true},
        {field: 'refPartnerId', displayName: objFieldInfo.House.refPartnerId, enableCellEdit: true},
    ];

    $scope.popChildHouse = function (obj) {
        if (obj) {
            $scope.currentObj = obj;

            fillGridWithChildHouse()

            createDialogService("/assets/html/child_pop_templates/host_2_house.html", {
                id: 'child_house',
                title: '查看',
                scope: $scope,
                footerTemplate: '<div></div>'
            });
        } else {
            showAlert('错误: ', '数据不存在', 'danger');
        }
    };

    $scope.pageInfo4childHouse = {}

    $scope.$watch('paginationConf4ChildHouse.itemsPerPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithChildHouse();
        }
    }, false);

    $scope.$watch('paginationConf4ChildHouse.currentPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithChildHouse();
        }
    }, false);

    $scope.paginationConf4ChildHouse = {
        currentPage: 1, //首页
        itemsPerPage: 10, //每页显示数量
        pagesLength: 5,  //显示多少个页数格子
        perPageOptions: [1, 2, 5, 10, 20, 50, 100],//选择每页显示数量
        rememberPerPage: 'itemsPerPage4childHouse'
    };

    function fillGridWithChildHouse() {
        $scope.childHouse4grid = []
        $http.get('/base/House/all?page='
        + $scope.paginationConf4ChildHouse.currentPage
        + '&size=' + $scope.paginationConf4ChildHouse.itemsPerPage
        + '&fieldOn=host.id&fieldValue=' + $scope.currentObj.id)
            .success(function (data, status, headers, config) {
                if (data.flag) {
                    $scope.childHouse4grid = data.data;
                    $scope.pageInfo4childHouse = data.page;
                    $scope.paginationConf4ChildHouse.totalItems = data.page.total;
                }
            });
    }
    ////////// child ProductRecord popup show //////////
    
    $scope.gridChildProductRecord = {
        data: 'childProductRecord4grid',
        rowHeight: rowLowHeight,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false
    };
    
    $scope.gridChildProductRecord.columnDefs = [        
        {field: 'id', displayName: 'Id', width: '40', enableCellEdit: false},
        {field: 'name', displayName: objFieldInfo.ProductRecord.name, enableCellEdit: true},
        {field: 'inDate', displayName: objFieldInfo.ProductRecord.inDate, enableCellEdit: true},
        {field: 'outDate', displayName: objFieldInfo.ProductRecord.outDate, enableCellEdit: true},
        {field: 'fundBackDate', displayName: objFieldInfo.ProductRecord.fundBackDate, enableCellEdit: true},
        {field: 'amount', displayName: objFieldInfo.ProductRecord.amount, enableCellEdit: true},
        {field: 'status', displayName: objFieldInfo.ProductRecord.status, enableCellEdit: false, cellTemplate: '<span ng-bind="grid.appScope.objEnumInfo.ProductRecord.status[MODEL_COL_FIELD]"></span>'},
        {field: 'createdAt', displayName: objFieldInfo.ProductRecord.createdAt, enableCellEdit: true},
        {field: 'lastUpdateTime', displayName: objFieldInfo.ProductRecord.lastUpdateTime, enableCellEdit: true},
        {field: 'comment', displayName: objFieldInfo.ProductRecord.comment, enableCellEdit: true},
        {field: 'refHostId', displayName: objFieldInfo.ProductRecord.refHostId, enableCellEdit: true},
        {field: 'refProductId', displayName: objFieldInfo.ProductRecord.refProductId, enableCellEdit: true},
    ];

    $scope.popChildProductRecord = function (obj) {
        if (obj) {
            $scope.currentObj = obj;

            fillGridWithChildProductRecord()

            createDialogService("/assets/html/child_pop_templates/host_2_product_record.html", {
                id: 'child_product_record',
                title: '查看',
                scope: $scope,
                footerTemplate: '<div></div>'
            });
        } else {
            showAlert('错误: ', '数据不存在', 'danger');
        }
    };

    $scope.pageInfo4childProductRecord = {}

    $scope.$watch('paginationConf4ChildProductRecord.itemsPerPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithChildProductRecord();
        }
    }, false);

    $scope.$watch('paginationConf4ChildProductRecord.currentPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithChildProductRecord();
        }
    }, false);

    $scope.paginationConf4ChildProductRecord = {
        currentPage: 1, //首页
        itemsPerPage: 10, //每页显示数量
        pagesLength: 5,  //显示多少个页数格子
        perPageOptions: [1, 2, 5, 10, 20, 50, 100],//选择每页显示数量
        rememberPerPage: 'itemsPerPage4childProductRecord'
    };

    function fillGridWithChildProductRecord() {
        $scope.childProductRecord4grid = []
        $http.get('/base/ProductRecord/all?page='
        + $scope.paginationConf4ChildProductRecord.currentPage
        + '&size=' + $scope.paginationConf4ChildProductRecord.itemsPerPage
        + '&fieldOn=host.id&fieldValue=' + $scope.currentObj.id)
            .success(function (data, status, headers, config) {
                if (data.flag) {
                    $scope.childProductRecord4grid = data.data;
                    $scope.pageInfo4childProductRecord = data.page;
                    $scope.paginationConf4ChildProductRecord.totalItems = data.page.total;
                }
            });
    }
    ////////// child RentRecord popup show //////////
    
    $scope.gridChildRentRecord = {
        data: 'childRentRecord4grid',
        rowHeight: rowLowHeight,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false
    };
    
    $scope.gridChildRentRecord.columnDefs = [        
        {field: 'id', displayName: 'Id', width: '40', enableCellEdit: false},
        {field: 'name', displayName: objFieldInfo.RentRecord.name, enableCellEdit: true},
        {field: 'rent', displayName: objFieldInfo.RentRecord.rent, enableCellEdit: true},
        {field: 'createdAt', displayName: objFieldInfo.RentRecord.createdAt, enableCellEdit: true},
        {field: 'lastUpdateTime', displayName: objFieldInfo.RentRecord.lastUpdateTime, enableCellEdit: true},
        {field: 'status', displayName: objFieldInfo.RentRecord.status, enableCellEdit: false, cellTemplate: '<span ng-bind="grid.appScope.objEnumInfo.RentRecord.status[MODEL_COL_FIELD]"></span>'},
        {field: 'payDate', displayName: objFieldInfo.RentRecord.payDate, enableCellEdit: true},
        {field: 'comment', displayName: objFieldInfo.RentRecord.comment, enableCellEdit: true},
        {field: 'refHostId', displayName: objFieldInfo.RentRecord.refHostId, enableCellEdit: true},
        {field: 'refGuestId', displayName: objFieldInfo.RentRecord.refGuestId, enableCellEdit: true},
    ];

    $scope.popChildRentRecord = function (obj) {
        if (obj) {
            $scope.currentObj = obj;

            fillGridWithChildRentRecord()

            createDialogService("/assets/html/child_pop_templates/host_2_rent_record.html", {
                id: 'child_rent_record',
                title: '查看',
                scope: $scope,
                footerTemplate: '<div></div>'
            });
        } else {
            showAlert('错误: ', '数据不存在', 'danger');
        }
    };

    $scope.pageInfo4childRentRecord = {}

    $scope.$watch('paginationConf4ChildRentRecord.itemsPerPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithChildRentRecord();
        }
    }, false);

    $scope.$watch('paginationConf4ChildRentRecord.currentPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithChildRentRecord();
        }
    }, false);

    $scope.paginationConf4ChildRentRecord = {
        currentPage: 1, //首页
        itemsPerPage: 10, //每页显示数量
        pagesLength: 5,  //显示多少个页数格子
        perPageOptions: [1, 2, 5, 10, 20, 50, 100],//选择每页显示数量
        rememberPerPage: 'itemsPerPage4childRentRecord'
    };

    function fillGridWithChildRentRecord() {
        $scope.childRentRecord4grid = []
        $http.get('/base/RentRecord/all?page='
        + $scope.paginationConf4ChildRentRecord.currentPage
        + '&size=' + $scope.paginationConf4ChildRentRecord.itemsPerPage
        + '&fieldOn=host.id&fieldValue=' + $scope.currentObj.id)
            .success(function (data, status, headers, config) {
                if (data.flag) {
                    $scope.childRentRecord4grid = data.data;
                    $scope.pageInfo4childRentRecord = data.page;
                    $scope.paginationConf4ChildRentRecord.totalItems = data.page.total;
                }
            });
    }
    
    ////////// friend Guest popup show //////////
    
    $scope.gridFriendGuest = {
        data: 'friendGuest4grid',
        rowHeight: rowLowHeight,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false
    };
    
    $scope.gridFriendGuest.columnDefs = [        
        {field: 'id', displayName: 'Id', width: '40', enableCellEdit: false},
        {field: 'name', displayName: objFieldInfo.Guest.name, enableCellEdit: true},
        {field: 'loginName', displayName: objFieldInfo.Guest.loginName, enableCellEdit: true},
        {field: 'wxId', displayName: objFieldInfo.Guest.wxId, enableCellEdit: true},
        {field: 'sexEnum', displayName: objFieldInfo.Guest.sexEnum, enableCellEdit: false, cellTemplate: '<span ng-bind="grid.appScope.objEnumInfo.Guest.sexEnum[MODEL_COL_FIELD]"></span>'},
        {field: 'phone', displayName: objFieldInfo.Guest.phone, enableCellEdit: true},
        {field: 'cardNumber', displayName: objFieldInfo.Guest.cardNumber, enableCellEdit: true},
        {field: 'email', displayName: objFieldInfo.Guest.email, enableCellEdit: true},
        {field: 'address', displayName: objFieldInfo.Guest.address, enableCellEdit: true},
        {field: 'birth', displayName: objFieldInfo.Guest.birth, enableCellEdit: true},
        {field: 'password', displayName: objFieldInfo.Guest.password, enableCellEdit: true},
        {field: 'createdAt', displayName: objFieldInfo.Guest.createdAt, enableCellEdit: true},
        {field: 'status', displayName: objFieldInfo.Guest.status, enableCellEdit: false, cellTemplate: '<span ng-bind="grid.appScope.objEnumInfo.Guest.status[MODEL_COL_FIELD]"></span>'},
        {field: 'userRoleEnum', displayName: objFieldInfo.Guest.userRoleEnum, enableCellEdit: false, cellTemplate: '<span ng-bind="grid.appScope.objEnumInfo.Guest.userRoleEnum[MODEL_COL_FIELD]"></span>'},
        {field: 'images', displayName: objFieldInfo.Guest.images, width: 170, enableCellEdit: false, cellTemplate: readonlyImageTemplateHost},
        {field: 'houseName', displayName: objFieldInfo.Guest.houseName, enableCellEdit: true},
        {field: 'building', displayName: objFieldInfo.Guest.building, enableCellEdit: true},
        {field: 'unit', displayName: objFieldInfo.Guest.unit, enableCellEdit: true},
        {field: 'room', displayName: objFieldInfo.Guest.room, enableCellEdit: true},
        {field: 'amount', displayName: objFieldInfo.Guest.amount, enableCellEdit: true},
        {field: 'totalAmount', displayName: objFieldInfo.Guest.totalAmount, enableCellEdit: true},
        {field: 'contractLength', displayName: objFieldInfo.Guest.contractLength, enableCellEdit: true},
        {field: 'contractStartDate', displayName: objFieldInfo.Guest.contractStartDate, enableCellEdit: true},
        {field: 'contractEndDate', displayName: objFieldInfo.Guest.contractEndDate, enableCellEdit: true},
        {field: 'lastUpdateTime', displayName: objFieldInfo.Guest.lastUpdateTime, enableCellEdit: true},
        {field: 'comment', displayName: objFieldInfo.Guest.comment, width: '100', enableCellEdit: true, cellTemplate: '<div ng-bind-html="COL_FIELD | safehtml"></div>'},
    ];

    $scope.popFriendGuest = function (obj) {
        if (obj) {
            $scope.currentObj = obj;

            fillGridWithFriendGuest()

            createDialogService("/assets/html/child_pop_templates/host_2_guest.html", {
                id: 'friend_guest',
                title: '查看',
                scope: $scope,
                footerTemplate: '<div></div>'
            });
        } else {
            showAlert('错误: ', '数据不存在', 'danger');
        }
    };

    $scope.pageInfo4friendGuest = {}

    $scope.$watch('paginationConf4FriendGuest.itemsPerPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithFriendGuest();
        }
    }, false);

    $scope.$watch('paginationConf4FriendGuest.currentPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithFriendGuest();
        }
    }, false);

    $scope.paginationConf4FriendGuest = {
        currentPage: 1, //首页
        itemsPerPage: 10, //每页显示数量
        pagesLength: 5,  //显示多少个页数格子
        perPageOptions: [1, 2, 5, 10, 20, 50, 100],//选择每页显示数量
        rememberPerPage: 'itemsPerPage4friendGuest'
    };

    function fillGridWithFriendGuest() {
        $scope.friendGuest4grid = []
        $http.get('/base/Guest/all?page='
        + $scope.paginationConf4FriendGuest.currentPage
        + '&size=' + $scope.paginationConf4FriendGuest.itemsPerPage
        + '&fieldOn=hosts.id&fieldValue=' + $scope.currentObj.id)
            .success(function (data, status, headers, config) {
                if (data.flag) {
                    $scope.friendGuest4grid = data.data;
                    $scope.pageInfo4friendGuest = data.page;
                    $scope.paginationConf4FriendGuest.totalItems = data.page.total;
                }
            });
    }
    
    ////////// web socket msg //////////
    var wsUri = ''
    $scope.websocketInit = function (isOn, host) {
        if (isOn) {
            wsUri = "ws://" + host + "/chat/connect";
            window.addEventListener("load", init, false);
        }
    }

    function init() {
        websocket = new WebSocket(wsUri);
        websocket.onopen = function (evt) {
            onOpen(evt)
        };
        websocket.onclose = function (evt) {
            onClose(evt)
        };
        websocket.onmessage = function (evt) {
            onMessage(evt)
        };
        websocket.onerror = function (evt) {
            onError(evt)
        };
    }

    function onOpen(evt) {
        $scope.chatMsg = '即时通讯连接成功！'
    }

    function onClose(evt) {
        $scope.chatMsg = '即时通讯关闭！'
    }

    function onMessage(evt) {
        $scope.chatMsg = "更新: " + evt.data + " / " + $scope.list.length + " - " + getNowFormatDate()
        refreshData(false)

        //if (evt.data == 'new') {
        //    $scope.chatMsg = "新增数据" + "(" + $scope.list.length + ")"
        //    refreshData(false)
        //} else {
        //    if (evt.data.indexOf("delete:") != -1) {
        //        var deleteId = evt.data.split(':')[1]
        //        for (x in $scope.list) {
        //            if ($scope.list[x].id.toString() == deleteId) {
        //                $scope.list.splice(x, 1)
        //                $scope.chatMsg = "删除: " + deleteId + "(" + $scope.list.length + ")"
        //                return
        //            }
        //        }
        //    } else {
        //        $scope.chatMsg = "更新: " + evt.data + "(" + $scope.list.length + ")"
        //        refreshData(false)
        //        //for (x in $scope.list) {
        //        //    if ($scope.list[x].id.toString() == evt.data) {
        //        //        $http.get('/base/Game/' + evt.data).success(function (data, status, headers, config) {
        //        //            if (data.flag) {
        //        //                $scope.list[x] = data.data
        //        //                $scope.chatMsg = "更新: " + evt.data + "(" + $scope.list.length + ")"
        //        //                return
        //        //            }
        //        //        });
        //        //    }
        //        //}
        //    }
        //}
    }

    function onError(evt) {
        $scope.chatMsg = '服务器报错: ' + evt.data
    }
}]);
