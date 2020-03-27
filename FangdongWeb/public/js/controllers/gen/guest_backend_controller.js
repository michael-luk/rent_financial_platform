var app = angular.module('GuestBackendApp', ['tm.pagination', 'ui.grid', 'ui.grid.resizeColumns', 'ui.grid.selection', 'ui.grid.edit', 'angularFileUpload', 'fundoo.services', 'simditor', 'ui.grid.autoFitColumns']);

var uploadImageTemplateGuest = '<div> <input type="file" name="files[]" accept="image/gif,image/jpeg,image/jpg,image/png" ng-file-select="grid.appScope.uploadImage($files, \'MODEL_COL_FIELD\', row.entity)"/> <div ng-repeat="imageName in MODEL_COL_FIELD.split(\',\')"> <div ng-show="imageName"> <a class="fancybox" target="_blank" data-fancybox-group="gallery" fancybox ng-href="/showImage/{{imageName}}"><img ng-src="/showimg/thumb/{{imageName}}" style="width:50px;height:50px;float:left"></a><input type="button" ng-click="grid.appScope.deleteImage(row.entity, \'MODEL_COL_FIELD\', imageName)" value="删除" style="float:left" /></div></div></div>';
var checkboxTemplateGuest = '<div><input type="checkbox" ng-model="MODEL_COL_FIELD" ng-click="grid.appScope.updateEntity(col, row)" /></div>';
var childButtonTemplateGuestRentRecord = '<div align="center" style="height:26px;line-height:24px"><a href="#" data-toggle="tooltip" title="弹窗显示"><button class="btn btn-xs btn-success" ng-click="grid.appScope.popChildRentRecord(row.entity)"><i class="icon-list-alt icon-white"></i></button></a> <a href="#" data-toggle="tooltip" title="跳转"><button class="btn btn-xs btn-primary" ng-click="grid.appScope.goToChildPageRentRecord(row.entity.id)"><i class="icon-share icon-white"></i></button></a></div>';
//var friendButtonTemplateGuest = '<div align="center" style="height:26px;line-height:24px"><a href="#" data-toggle="tooltip" title="跳转"><button class="btn btn-xs btn-primary" ng-click="grid.appScope.goToFriendPage(row.entity.id)"><i class="icon-share icon-white"></i></button></a></div>';
var friendButtonTemplateGuestHost = '<div align="center" style="height:26px;line-height:24px"><a href="#" data-toggle="tooltip" title="弹窗显示"><button class="btn btn-xs btn-success" ng-click="grid.appScope.popFriendHost(row.entity)"><i class="icon-list-alt icon-white"></i></button></a> <a href="#" data-toggle="tooltip" title="跳转"><button class="btn btn-xs btn-primary" ng-click="grid.appScope.goToFriendPageHost(row.entity.id)"><i class="icon-share icon-white"></i></button></a></div>';
var readonlyImageTemplateGuest = '<div><div ng-repeat="imageName in MODEL_COL_FIELD.split(\',\')"><div ng-show="imageName"><a class="fancybox" target="_blank" data-fancybox-group="gallery" fancybox ng-href="/showImage/{{imageName}}"><img ng-src="/showimg/thumb/{{imageName}}" style="width:50px;height:50px;float:left"></a></div></div></div>';
var readonlyCheckboxTemplateGuest = '<div><input type="checkbox" ng-model="MODEL_COL_FIELD" disabled="disabled" /></div>';

app.filter('safehtml', function ($sce) {
    return function (htmlString) {
        return $sce.trustAsHtml(htmlString);
    }
});


app.controller('GuestBackendController', ['$scope', '$http', '$upload', 'createDialog', '$log', function ($scope, $http, $upload, createDialogService, $log) {
	$scope.isGuest = true;
    
    if(GetQueryString('relate') && GetQueryString('relateValue')) {
        $scope.relate = GetQueryString('relate')
        $scope.relateValue = GetQueryString('relateValue')
    }
    
    var rowLowHeight = 26
    var rowHighHeight = 100 
    
    $scope.objFieldInfo = objFieldInfo
    $scope.objEnumInfo = objEnumInfo   
    
    $scope.status = [{"id": -100, "name": "全部"}]
    dropdownTemplateGuestStatus = '<div>' +
        '<select ng-model="MODEL_COL_FIELD" ' +
        'ng-change="grid.appScope.updateEntity(col, row)" style="padding: 2px;">'
    for (var i = 0; i < Object.keys(objEnumInfo.Guest.status).length; i++) {
        $scope.status.push({"id": i, "name": objEnumInfo.Guest.status[i]})
        dropdownTemplateGuestStatus += '<option ng-selected="MODEL_COL_FIELD==' + i
            + '" value=' + i + '>' + objEnumInfo.Guest.status[i] + '</option>'
    }
    dropdownTemplateGuestStatus += '</select></div>'

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
    dropdownTemplateGuestSexEnum = '<div>' +
        '<select ng-model="MODEL_COL_FIELD" ' +
        'ng-change="grid.appScope.updateEntity(col, row)" style="padding: 2px;">'
    for (var i = 0; i < Object.keys(objEnumInfo.Guest.sexEnum).length; i++) {
        $scope.sexEnum.push({"id": i, "name": objEnumInfo.Guest.sexEnum[i]})
        dropdownTemplateGuestSexEnum += '<option ng-selected="MODEL_COL_FIELD==' + i
            + '" value=' + i + '>' + objEnumInfo.Guest.sexEnum[i] + '</option>'
    }
    dropdownTemplateGuestSexEnum += '</select></div>'
    
    $scope.userRoleEnum = []
    dropdownTemplateGuestUserRoleEnum = '<div>' +
        '<select ng-model="MODEL_COL_FIELD" ' +
        'ng-change="grid.appScope.updateEntity(col, row)" style="padding: 2px;">'
    for (var i = 0; i < Object.keys(objEnumInfo.Guest.userRoleEnum).length; i++) {
        $scope.userRoleEnum.push({"id": i, "name": objEnumInfo.Guest.userRoleEnum[i]})
        dropdownTemplateGuestUserRoleEnum += '<option ng-selected="MODEL_COL_FIELD==' + i
            + '" value=' + i + '>' + objEnumInfo.Guest.userRoleEnum[i] + '</option>'
    }
    dropdownTemplateGuestUserRoleEnum += '</select></div>'
    
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
        {field: 'name', displayName: objFieldInfo.Guest.name, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'loginName', displayName: objFieldInfo.Guest.loginName, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'wxId', displayName: objFieldInfo.Guest.wxId, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'sexEnum', displayName: objFieldInfo.Guest.sexEnum, width: 120, headerTooltip: '点击表头可进行排序, 通过直接下拉选取操作来更新数据', enableCellEdit: false, cellTemplate: dropdownTemplateGuestSexEnum},
        {field: 'phone', displayName: objFieldInfo.Guest.phone, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'cardNumber', displayName: objFieldInfo.Guest.cardNumber, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'email', displayName: objFieldInfo.Guest.email, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'address', displayName: objFieldInfo.Guest.address, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'birth', displayName: objFieldInfo.Guest.birth, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'password', displayName: objFieldInfo.Guest.password, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'createdAt', displayName: objFieldInfo.Guest.createdAt, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'status', displayName: objFieldInfo.Guest.status, width: 120, headerTooltip: '点击表头可进行排序, 通过直接下拉选取操作来更新数据', enableCellEdit: false, cellTemplate: dropdownTemplateGuestStatus},
        {field: 'userRoleEnum', displayName: objFieldInfo.Guest.userRoleEnum, width: 120, headerTooltip: '点击表头可进行排序, 通过直接下拉选取操作来更新数据', enableCellEdit: false, cellTemplate: dropdownTemplateGuestUserRoleEnum},
        {field: 'images', displayName: objFieldInfo.Guest.images, width: 170, enableCellEdit: false, cellTemplate: uploadImageTemplateGuest},
        {field: 'houseName', displayName: objFieldInfo.Guest.houseName, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'building', displayName: objFieldInfo.Guest.building, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'unit', displayName: objFieldInfo.Guest.unit, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'room', displayName: objFieldInfo.Guest.room, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'amount', displayName: objFieldInfo.Guest.amount, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'totalAmount', displayName: objFieldInfo.Guest.totalAmount, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'contractLength', displayName: objFieldInfo.Guest.contractLength, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'contractStartDate', displayName: objFieldInfo.Guest.contractStartDate, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'contractEndDate', displayName: objFieldInfo.Guest.contractEndDate, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'lastUpdateTime', displayName: objFieldInfo.Guest.lastUpdateTime, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'comment', displayName: objFieldInfo.Guest.comment, width: '100', headerTooltip: '点击表头可进行排序', enableCellEdit: true, cellTemplate: '<div ng-bind-html="COL_FIELD | safehtml"></div>'},
        {field: 'childRentRecord', displayName: objFieldInfo.Guest.rentRecords, width: '80', headerTooltip: '弹窗/跳转显示', enableCellEdit: false, cellTemplate: childButtonTemplateGuestRentRecord},
        {field: 'friendHost', displayName: objFieldInfo.Guest.hosts, width: '80', headerTooltip: '弹窗/跳转显示', enableCellEdit: false, cellTemplate: friendButtonTemplateGuestHost},

    ];
    
    $scope.goToChildPageRentRecord = function(pid) { location = '/admin/rentrecord?relate=guest.id&relateValue=' + pid }
    $scope.goToFriendPageHost = function(pid) { location = '/admin/host?relate=guests.id&relateValue=' + pid }
    
    $scope.friends4gridHost = []
    $scope.pageInfo4FriendHost = {}
    $scope.searchFieldNameHost = searchFieldNameHost
    $scope.searchFieldNameHostComment = searchFieldNameHostComment

    $scope.$watch('paginationConf4FriendHost.itemsPerPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithFriendsHost();
        }
    }, false);

    $scope.$watch('paginationConf4FriendHost.currentPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithFriendsHost();
        }
    }, false);

    $scope.paginationConf4FriendHost = {
        currentPage: 1, //首页
        itemsPerPage: 10, //每页显示数量
        pagesLength: 5,  //显示多少个页数格子
        perPageOptions: [1, 2, 5, 10, 20, 50, 100],//选择每页显示数量
        rememberPerPage: 'itemsPerPage4FriendHost'
    };
    
    function fillGridWithFriendsHost() {
        url = '/base/Host/all?page=' 
                    + $scope.paginationConf4FriendHost.currentPage 
                    + '&size=' + $scope.paginationConf4FriendHost.itemsPerPage
                    
        if ($scope.currentObj.queryKeyword4Host)
            url += '&searchOn=' + $scope.searchFieldNameHost + '&kw=' + $scope.currentObj.queryKeyword4Host
            
        $http.get(url)
            .success(function (data, status, headers, config) {
            if (data.flag) {
                $scope.pageInfo4FriendHost = data.page;
                $scope.paginationConf4FriendHost.totalItems = data.page.total;
                
                if ($scope.currentObj.id) {
                    var allFriends = data.data;
                    
                    //用于比较, 全取不分页
                    $http.get('/guest/' + $scope.currentObj.id + '/hosts?page=1&size=1000000')
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
                        $scope.friends4gridHost = allFriends;
                    })
                }
                else {
                    $scope.friends4gridHost = data.data;
                }
            }
            else {
                $scope.parentHosts4grid = [];
                //showAlert('错误: ', data.message, 'danger')
            }
        });
    }
    
    $scope.myFriendSelectionsHost = [];
    $scope.gridFriendsHost = {
        data: 'friends4gridHost',
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function (rows) {
                $scope.myFriendSelectionsHost = gridApi.selection.getSelectedRows();
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

    $scope.searchContent4Host = function(){
        if($scope.paginationConf4FriendHost.currentPage != 1){
            $scope.paginationConf4FriendHost.currentPage = 1
        }
        else{
            fillGridWithFriendsHost()
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

    function refreshData(showMsg){
        var url = '/base/Guest/all?page=' 
                    + $scope.paginationConf.currentPage 
                    + '&size=' + $scope.paginationConf.itemsPerPage
                    + '&startTime=' + $scope.startTime + '&endTime=' + $scope.endTime
                    + '&status=' + $scope.selectedStatus
                    
        
        if ($scope.relate) {
            url += '&fieldOn=' + $scope.relate + '&fieldValue=' + $scope.relateValue
        }
        
        if ($scope.queryKeyword)
            url += '&searchOn=' + searchFieldName + '&kw=' + $scope.queryKeyword

        $http.get(url).success(function (data, status, headers, config) {
            if (data.flag) {
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
        if ($scope.myFriendSelectionsHost.length > 0) content.hosts = $scope.myFriendSelectionsHost
        
        var isNew = !content.id
        var url = '/guest'
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
                        var deleteUrl = '/guest/' + content.id
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
        $scope.$modalClose();
        refreshData(false)
    };
    
    $scope.addContent = function(){
        $scope.currentObj = {};
        
        fillGridWithFriendsHost();
        
        createDialogService("/assets/html/edit_templates/guest.html",{
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
        
            fillGridWithFriendsHost();

            createDialogService("/assets/html/edit_templates/guest.html",{
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
                location.href = '/report/guest?startTime='
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

            createDialogService("/assets/html/child_pop_templates/guest_2_rent_record.html", {
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
        + '&fieldOn=guest.id&fieldValue=' + $scope.currentObj.id)
            .success(function (data, status, headers, config) {
                if (data.flag) {
                    $scope.childRentRecord4grid = data.data;
                    $scope.pageInfo4childRentRecord = data.page;
                    $scope.paginationConf4ChildRentRecord.totalItems = data.page.total;
                }
            });
    }
    
    ////////// friend Host popup show //////////
    
    $scope.gridFriendHost = {
        data: 'friendHost4grid',
        rowHeight: rowLowHeight,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false
    };
    
    $scope.gridFriendHost.columnDefs = [        
        {field: 'id', displayName: 'Id', width: '40', enableCellEdit: false},
        {field: 'name', displayName: objFieldInfo.Host.name, enableCellEdit: true},
        {field: 'loginName', displayName: objFieldInfo.Host.loginName, enableCellEdit: true},
        {field: 'wxId', displayName: objFieldInfo.Host.wxId, enableCellEdit: true},
        {field: 'sexEnum', displayName: objFieldInfo.Host.sexEnum, enableCellEdit: false, cellTemplate: '<span ng-bind="grid.appScope.objEnumInfo.Host.sexEnum[MODEL_COL_FIELD]"></span>'},
        {field: 'phone', displayName: objFieldInfo.Host.phone, enableCellEdit: true},
        {field: 'cardNumber', displayName: objFieldInfo.Host.cardNumber, enableCellEdit: true},
        {field: 'email', displayName: objFieldInfo.Host.email, enableCellEdit: true},
        {field: 'address', displayName: objFieldInfo.Host.address, enableCellEdit: true},
        {field: 'birth', displayName: objFieldInfo.Host.birth, enableCellEdit: true},
        {field: 'password', displayName: objFieldInfo.Host.password, enableCellEdit: true},
        {field: 'createdAt', displayName: objFieldInfo.Host.createdAt, enableCellEdit: true},
        {field: 'lastUpdateTime', displayName: objFieldInfo.Host.lastUpdateTime, enableCellEdit: true},
        {field: 'headImages', displayName: objFieldInfo.Host.headImages, width: 170, enableCellEdit: false, cellTemplate: readonlyImageTemplateGuest},
        {field: 'images', displayName: objFieldInfo.Host.images, width: 170, enableCellEdit: false, cellTemplate: readonlyImageTemplateGuest},
        {field: 'lastLoginIp', displayName: objFieldInfo.Host.lastLoginIp, enableCellEdit: true},
        {field: 'lastLoginTime', displayName: objFieldInfo.Host.lastLoginTime, enableCellEdit: true},
        {field: 'lastLoginIpArea', displayName: objFieldInfo.Host.lastLoginIpArea, enableCellEdit: true},
        {field: 'status', displayName: objFieldInfo.Host.status, enableCellEdit: false, cellTemplate: '<span ng-bind="grid.appScope.objEnumInfo.Host.status[MODEL_COL_FIELD]"></span>'},
        {field: 'credit', displayName: objFieldInfo.Host.credit, enableCellEdit: true},
        {field: 'userRoleEnum', displayName: objFieldInfo.Host.userRoleEnum, enableCellEdit: false, cellTemplate: '<span ng-bind="grid.appScope.objEnumInfo.Host.userRoleEnum[MODEL_COL_FIELD]"></span>'},
        {field: 'comment', displayName: objFieldInfo.Host.comment, width: '100', enableCellEdit: true, cellTemplate: '<div ng-bind-html="COL_FIELD | safehtml"></div>'},
        {field: 'refPartnerId', displayName: objFieldInfo.Host.refPartnerId, enableCellEdit: true},
    ];

    $scope.popFriendHost = function (obj) {
        if (obj) {
            $scope.currentObj = obj;

            fillGridWithFriendHost()

            createDialogService("/assets/html/child_pop_templates/guest_2_host.html", {
                id: 'friend_host',
                title: '查看',
                scope: $scope,
                footerTemplate: '<div></div>'
            });
        } else {
            showAlert('错误: ', '数据不存在', 'danger');
        }
    };

    $scope.pageInfo4friendHost = {}

    $scope.$watch('paginationConf4FriendHost.itemsPerPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithFriendHost();
        }
    }, false);

    $scope.$watch('paginationConf4FriendHost.currentPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithFriendHost();
        }
    }, false);

    $scope.paginationConf4FriendHost = {
        currentPage: 1, //首页
        itemsPerPage: 10, //每页显示数量
        pagesLength: 5,  //显示多少个页数格子
        perPageOptions: [1, 2, 5, 10, 20, 50, 100],//选择每页显示数量
        rememberPerPage: 'itemsPerPage4friendHost'
    };

    function fillGridWithFriendHost() {
        $scope.friendHost4grid = []
        $http.get('/base/Host/all?page='
        + $scope.paginationConf4FriendHost.currentPage
        + '&size=' + $scope.paginationConf4FriendHost.itemsPerPage
        + '&fieldOn=guests.id&fieldValue=' + $scope.currentObj.id)
            .success(function (data, status, headers, config) {
                if (data.flag) {
                    $scope.friendHost4grid = data.data;
                    $scope.pageInfo4friendHost = data.page;
                    $scope.paginationConf4FriendHost.totalItems = data.page.total;
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
