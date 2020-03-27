var app = angular.module('PartnerBackendApp', ['tm.pagination', 'ui.grid', 'ui.grid.resizeColumns', 'ui.grid.selection', 'ui.grid.edit', 'angularFileUpload', 'fundoo.services', 'simditor', 'ui.grid.autoFitColumns']);

var uploadImageTemplatePartner = '<div> <input type="file" name="files[]" accept="image/gif,image/jpeg,image/jpg,image/png" ng-file-select="grid.appScope.uploadImage($files, \'MODEL_COL_FIELD\', row.entity)"/> <div ng-repeat="imageName in MODEL_COL_FIELD.split(\',\')"> <div ng-show="imageName"> <a class="fancybox" target="_blank" data-fancybox-group="gallery" fancybox ng-href="/showImage/{{imageName}}"><img ng-src="/showimg/thumb/{{imageName}}" style="width:50px;height:50px;float:left"></a><input type="button" ng-click="grid.appScope.deleteImage(row.entity, \'MODEL_COL_FIELD\', imageName)" value="删除" style="float:left" /></div></div></div>';
var checkboxTemplatePartner = '<div><input type="checkbox" ng-model="MODEL_COL_FIELD" ng-click="grid.appScope.updateEntity(col, row)" /></div>';
var childButtonTemplatePartnerHost = '<div align="center" style="height:26px;line-height:24px"><a href="#" data-toggle="tooltip" title="弹窗显示"><button class="btn btn-xs btn-success" ng-click="grid.appScope.popChildHost(row.entity)"><i class="icon-list-alt icon-white"></i></button></a> <a href="#" data-toggle="tooltip" title="跳转"><button class="btn btn-xs btn-primary" ng-click="grid.appScope.goToChildPageHost(row.entity.id)"><i class="icon-share icon-white"></i></button></a></div>';
var childButtonTemplatePartnerHouse = '<div align="center" style="height:26px;line-height:24px"><a href="#" data-toggle="tooltip" title="弹窗显示"><button class="btn btn-xs btn-success" ng-click="grid.appScope.popChildHouse(row.entity)"><i class="icon-list-alt icon-white"></i></button></a> <a href="#" data-toggle="tooltip" title="跳转"><button class="btn btn-xs btn-primary" ng-click="grid.appScope.goToChildPageHouse(row.entity.id)"><i class="icon-share icon-white"></i></button></a></div>';
var readonlyImageTemplatePartner = '<div><div ng-repeat="imageName in MODEL_COL_FIELD.split(\',\')"><div ng-show="imageName"><a class="fancybox" target="_blank" data-fancybox-group="gallery" fancybox ng-href="/showImage/{{imageName}}"><img ng-src="/showimg/thumb/{{imageName}}" style="width:50px;height:50px;float:left"></a></div></div></div>';
var readonlyCheckboxTemplatePartner = '<div><input type="checkbox" ng-model="MODEL_COL_FIELD" disabled="disabled" /></div>';

app.filter('safehtml', function ($sce) {
    return function (htmlString) {
        return $sce.trustAsHtml(htmlString);
    }
});


app.controller('PartnerBackendController', ['$scope', '$http', '$upload', 'createDialog', '$log', function ($scope, $http, $upload, createDialogService, $log) {
	$scope.isPartner = true;
    
    if(GetQueryString('relate') && GetQueryString('relateValue')) {
        $scope.relate = GetQueryString('relate')
        $scope.relateValue = GetQueryString('relateValue')
    }
    
    var rowLowHeight = 26
    var rowHighHeight = 100 
    
    $scope.objFieldInfo = objFieldInfo
    $scope.objEnumInfo = objEnumInfo   
    
    $scope.status = [{"id": -100, "name": "全部"}]
    dropdownTemplatePartnerStatus = '<div>' +
        '<select ng-model="MODEL_COL_FIELD" ' +
        'ng-change="grid.appScope.updateEntity(col, row)" style="padding: 2px;">'
    for (var i = 0; i < Object.keys(objEnumInfo.Partner.status).length; i++) {
        $scope.status.push({"id": i, "name": objEnumInfo.Partner.status[i]})
        dropdownTemplatePartnerStatus += '<option ng-selected="MODEL_COL_FIELD==' + i
            + '" value=' + i + '>' + objEnumInfo.Partner.status[i] + '</option>'
    }
    dropdownTemplatePartnerStatus += '</select></div>'

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
    
    $scope.levelEnum = []
    dropdownTemplatePartnerLevelEnum = '<div>' +
        '<select ng-model="MODEL_COL_FIELD" ' +
        'ng-change="grid.appScope.updateEntity(col, row)" style="padding: 2px;">'
    for (var i = 0; i < Object.keys(objEnumInfo.Partner.levelEnum).length; i++) {
        $scope.levelEnum.push({"id": i, "name": objEnumInfo.Partner.levelEnum[i]})
        dropdownTemplatePartnerLevelEnum += '<option ng-selected="MODEL_COL_FIELD==' + i
            + '" value=' + i + '>' + objEnumInfo.Partner.levelEnum[i] + '</option>'
    }
    dropdownTemplatePartnerLevelEnum += '</select></div>'
    
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
        {field: 'name', displayName: objFieldInfo.Partner.name, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'area', displayName: objFieldInfo.Partner.area, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'phone', displayName: objFieldInfo.Partner.phone, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'address', displayName: objFieldInfo.Partner.address, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'password', displayName: objFieldInfo.Partner.password, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'createdAt', displayName: objFieldInfo.Partner.createdAt, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'lastUpdateTime', displayName: objFieldInfo.Partner.lastUpdateTime, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'images', displayName: objFieldInfo.Partner.images, width: 170, enableCellEdit: false, cellTemplate: uploadImageTemplatePartner},
        {field: 'status', displayName: objFieldInfo.Partner.status, width: 120, headerTooltip: '点击表头可进行排序, 通过直接下拉选取操作来更新数据', enableCellEdit: false, cellTemplate: dropdownTemplatePartnerStatus},
        {field: 'credit', displayName: objFieldInfo.Partner.credit, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'levelEnum', displayName: objFieldInfo.Partner.levelEnum, width: 120, headerTooltip: '点击表头可进行排序, 通过直接下拉选取操作来更新数据', enableCellEdit: false, cellTemplate: dropdownTemplatePartnerLevelEnum},
        {field: 'comment', displayName: objFieldInfo.Partner.comment, width: '100', headerTooltip: '点击表头可进行排序', enableCellEdit: true, cellTemplate: '<div ng-bind-html="COL_FIELD | safehtml"></div>'},
        {field: 'childHost', displayName: objFieldInfo.Partner.hosts, width: '80', headerTooltip: '弹窗/跳转显示', enableCellEdit: false, cellTemplate: childButtonTemplatePartnerHost},
        {field: 'childHouse', displayName: objFieldInfo.Partner.houses, width: '80', headerTooltip: '弹窗/跳转显示', enableCellEdit: false, cellTemplate: childButtonTemplatePartnerHouse},

    ];
    
    $scope.goToChildPageHost = function(pid) { location = '/admin/host?relate=partner.id&relateValue=' + pid }
    $scope.goToChildPageHouse = function(pid) { location = '/admin/house?relate=partner.id&relateValue=' + pid }
    
    
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

    function refreshData(showMsg){
        var url = '/base/Partner/all?page=' 
                    + $scope.paginationConf.currentPage 
                    + '&size=' + $scope.paginationConf.itemsPerPage
                    + '&startTime=' + $scope.startTime + '&endTime=' + $scope.endTime
                    + '&status=' + $scope.selectedStatus
                    
        
        
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
        
        var isNew = !content.id
        var url = '/partner'
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
                        var deleteUrl = '/base/Partner/' + content.id
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
        
        
        createDialogService("/assets/html/edit_templates/partner.html",{
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
        

            createDialogService("/assets/html/edit_templates/partner.html",{
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
                location.href = '/report/partner?startTime='
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

    ////////// child Host popup show //////////
    
    $scope.gridChildHost = {
        data: 'childHost4grid',
        rowHeight: rowLowHeight,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false
    };
    
    $scope.gridChildHost.columnDefs = [        
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
        {field: 'headImages', displayName: objFieldInfo.Host.headImages, width: 170, enableCellEdit: false, cellTemplate: readonlyImageTemplatePartner},
        {field: 'images', displayName: objFieldInfo.Host.images, width: 170, enableCellEdit: false, cellTemplate: readonlyImageTemplatePartner},
        {field: 'lastLoginIp', displayName: objFieldInfo.Host.lastLoginIp, enableCellEdit: true},
        {field: 'lastLoginTime', displayName: objFieldInfo.Host.lastLoginTime, enableCellEdit: true},
        {field: 'lastLoginIpArea', displayName: objFieldInfo.Host.lastLoginIpArea, enableCellEdit: true},
        {field: 'status', displayName: objFieldInfo.Host.status, enableCellEdit: false, cellTemplate: '<span ng-bind="grid.appScope.objEnumInfo.Host.status[MODEL_COL_FIELD]"></span>'},
        {field: 'credit', displayName: objFieldInfo.Host.credit, enableCellEdit: true},
        {field: 'userRoleEnum', displayName: objFieldInfo.Host.userRoleEnum, enableCellEdit: false, cellTemplate: '<span ng-bind="grid.appScope.objEnumInfo.Host.userRoleEnum[MODEL_COL_FIELD]"></span>'},
        {field: 'comment', displayName: objFieldInfo.Host.comment, width: '100', enableCellEdit: true, cellTemplate: '<div ng-bind-html="COL_FIELD | safehtml"></div>'},
        {field: 'refPartnerId', displayName: objFieldInfo.Host.refPartnerId, enableCellEdit: true},
    ];

    $scope.popChildHost = function (obj) {
        if (obj) {
            $scope.currentObj = obj;

            fillGridWithChildHost()

            createDialogService("/assets/html/child_pop_templates/partner_2_host.html", {
                id: 'child_host',
                title: '查看',
                scope: $scope,
                footerTemplate: '<div></div>'
            });
        } else {
            showAlert('错误: ', '数据不存在', 'danger');
        }
    };

    $scope.pageInfo4childHost = {}

    $scope.$watch('paginationConf4ChildHost.itemsPerPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithChildHost();
        }
    }, false);

    $scope.$watch('paginationConf4ChildHost.currentPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithChildHost();
        }
    }, false);

    $scope.paginationConf4ChildHost = {
        currentPage: 1, //首页
        itemsPerPage: 10, //每页显示数量
        pagesLength: 5,  //显示多少个页数格子
        perPageOptions: [1, 2, 5, 10, 20, 50, 100],//选择每页显示数量
        rememberPerPage: 'itemsPerPage4childHost'
    };

    function fillGridWithChildHost() {
        $scope.childHost4grid = []
        $http.get('/base/Host/all?page='
        + $scope.paginationConf4ChildHost.currentPage
        + '&size=' + $scope.paginationConf4ChildHost.itemsPerPage
        + '&fieldOn=partner.id&fieldValue=' + $scope.currentObj.id)
            .success(function (data, status, headers, config) {
                if (data.flag) {
                    $scope.childHost4grid = data.data;
                    $scope.pageInfo4childHost = data.page;
                    $scope.paginationConf4ChildHost.totalItems = data.page.total;
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
        {field: 'visible', displayName: objFieldInfo.House.visible, width: 120, enableCellEdit: false, cellTemplate: readonlyCheckboxTemplatePartner},
        {field: 'status', displayName: objFieldInfo.House.status, enableCellEdit: false, cellTemplate: '<span ng-bind="grid.appScope.objEnumInfo.House.status[MODEL_COL_FIELD]"></span>'},
        {field: 'images', displayName: objFieldInfo.House.images, width: 170, enableCellEdit: false, cellTemplate: readonlyImageTemplatePartner},
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

            createDialogService("/assets/html/child_pop_templates/partner_2_house.html", {
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
        + '&fieldOn=partner.id&fieldValue=' + $scope.currentObj.id)
            .success(function (data, status, headers, config) {
                if (data.flag) {
                    $scope.childHouse4grid = data.data;
                    $scope.pageInfo4childHouse = data.page;
                    $scope.paginationConf4ChildHouse.totalItems = data.page.total;
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
