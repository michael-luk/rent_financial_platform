var app = angular.module('HouseBackendApp', ['tm.pagination', 'ui.grid', 'ui.grid.resizeColumns', 'ui.grid.selection', 'ui.grid.edit', 'angularFileUpload', 'fundoo.services', 'simditor', 'ui.grid.autoFitColumns']);

var uploadImageTemplateHouse = '<div> <input type="file" name="files[]" accept="image/gif,image/jpeg,image/jpg,image/png" ng-file-select="grid.appScope.uploadImage($files, \'MODEL_COL_FIELD\', row.entity)"/> <div ng-repeat="imageName in MODEL_COL_FIELD.split(\',\')"> <div ng-show="imageName"> <a class="fancybox" target="_blank" data-fancybox-group="gallery" fancybox ng-href="/showImage/{{imageName}}"><img ng-src="/showimg/thumb/{{imageName}}" style="width:50px;height:50px;float:left"></a><input type="button" ng-click="grid.appScope.deleteImage(row.entity, \'MODEL_COL_FIELD\', imageName)" value="删除" style="float:left" /></div></div></div>';
var checkboxTemplateHouse = '<div><input type="checkbox" ng-model="MODEL_COL_FIELD" ng-click="grid.appScope.updateEntity(col, row)" /></div>';
var childButtonTemplateHouseRentContract = '<div align="center" style="height:26px;line-height:24px"><a href="#" data-toggle="tooltip" title="弹窗显示"><button class="btn btn-xs btn-success" ng-click="grid.appScope.popChildRentContract(row.entity)"><i class="icon-list-alt icon-white"></i></button></a> <a href="#" data-toggle="tooltip" title="跳转"><button class="btn btn-xs btn-primary" ng-click="grid.appScope.goToChildPageRentContract(row.entity.id)"><i class="icon-share icon-white"></i></button></a></div>';
var childButtonTemplateHouseRouter = '<div align="center" style="height:26px;line-height:24px"><a href="#" data-toggle="tooltip" title="弹窗显示"><button class="btn btn-xs btn-success" ng-click="grid.appScope.popChildRouter(row.entity)"><i class="icon-list-alt icon-white"></i></button></a> <a href="#" data-toggle="tooltip" title="跳转"><button class="btn btn-xs btn-primary" ng-click="grid.appScope.goToChildPageRouter(row.entity.id)"><i class="icon-share icon-white"></i></button></a></div>';
var readonlyImageTemplateHouse = '<div><div ng-repeat="imageName in MODEL_COL_FIELD.split(\',\')"><div ng-show="imageName"><a class="fancybox" target="_blank" data-fancybox-group="gallery" fancybox ng-href="/showImage/{{imageName}}"><img ng-src="/showimg/thumb/{{imageName}}" style="width:50px;height:50px;float:left"></a></div></div></div>';
var readonlyCheckboxTemplateHouse = '<div><input type="checkbox" ng-model="MODEL_COL_FIELD" disabled="disabled" /></div>';

app.filter('safehtml', function ($sce) {
    return function (htmlString) {
        return $sce.trustAsHtml(htmlString);
    }
});


app.controller('HouseBackendController', ['$scope', '$http', '$upload', 'createDialog', '$log', function ($scope, $http, $upload, createDialogService, $log) {
	$scope.isHouse = true;
    
    if(GetQueryString('relate') && GetQueryString('relateValue')) {
        $scope.relate = GetQueryString('relate')
        $scope.relateValue = GetQueryString('relateValue')
    }
    
    var rowLowHeight = 26
    var rowHighHeight = 100 
    
    $scope.objFieldInfo = objFieldInfo
    $scope.objEnumInfo = objEnumInfo   
    
    $scope.status = [{"id": -100, "name": "全部"}]
    dropdownTemplateHouseStatus = '<div>' +
        '<select ng-model="MODEL_COL_FIELD" ' +
        'ng-change="grid.appScope.updateEntity(col, row)" style="padding: 2px;">'
    for (var i = 0; i < Object.keys(objEnumInfo.House.status).length; i++) {
        $scope.status.push({"id": i, "name": objEnumInfo.House.status[i]})
        dropdownTemplateHouseStatus += '<option ng-selected="MODEL_COL_FIELD==' + i
            + '" value=' + i + '>' + objEnumInfo.House.status[i] + '</option>'
    }
    dropdownTemplateHouseStatus += '</select></div>'

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
        {field: 'name', displayName: objFieldInfo.House.name, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'classify', displayName: objFieldInfo.House.classify, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'province', displayName: objFieldInfo.House.province, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'city', displayName: objFieldInfo.House.city, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'zone', displayName: objFieldInfo.House.zone, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'address', displayName: objFieldInfo.House.address, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'age', displayName: objFieldInfo.House.age, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'size', displayName: objFieldInfo.House.size, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'structure', displayName: objFieldInfo.House.structure, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'rent', displayName: objFieldInfo.House.rent, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'credit', displayName: objFieldInfo.House.credit, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'visible', displayName: objFieldInfo.House.visible, headerTooltip: '点击表头可进行排序, 通过直接勾选操作来更新数据', enableCellEdit: false, cellTemplate: checkboxTemplateHouse},
        {field: 'status', displayName: objFieldInfo.House.status, width: 120, headerTooltip: '点击表头可进行排序, 通过直接下拉选取操作来更新数据', enableCellEdit: false, cellTemplate: dropdownTemplateHouseStatus},
        {field: 'images', displayName: objFieldInfo.House.images, width: 170, enableCellEdit: false, cellTemplate: uploadImageTemplateHouse},
        {field: 'createdAt', displayName: objFieldInfo.House.createdAt, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'lastUpdateTime', displayName: objFieldInfo.House.lastUpdateTime, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'description', displayName: objFieldInfo.House.description, width: '100', headerTooltip: '点击表头可进行排序', enableCellEdit: true, cellTemplate: '<div ng-bind-html="COL_FIELD | safehtml"></div>'},
        {field: 'comment', displayName: objFieldInfo.House.comment, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'refHostId', displayName: objFieldInfo.House.refHostId, headerTooltip: '点击表头可进行排序', enableCellEdit: false, cellTemplate: '<a href="/admin/host?relate=id&relateValue={{COL_FIELD}}"><span ng-bind="COL_FIELD"></span></a>'},
        {field: 'refPartnerId', displayName: objFieldInfo.House.refPartnerId, headerTooltip: '点击表头可进行排序', enableCellEdit: false, cellTemplate: '<a href="/admin/partner?relate=id&relateValue={{COL_FIELD}}"><span ng-bind="COL_FIELD"></span></a>'},
        {field: 'childRentContract', displayName: objFieldInfo.House.rentContracts, width: '80', headerTooltip: '弹窗/跳转显示', enableCellEdit: false, cellTemplate: childButtonTemplateHouseRentContract},
        {field: 'childRouter', displayName: objFieldInfo.House.routers, width: '80', headerTooltip: '弹窗/跳转显示', enableCellEdit: false, cellTemplate: childButtonTemplateHouseRouter},

        {field: 'host', displayName: objFieldInfo.House.host, headerTooltip: '点击表头可进行排序', enableCellEdit: false, cellTemplate: '<a href="/admin/host?relate=id&relateValue={{COL_FIELD.id}}"><span ng-bind="COL_FIELD.name"></span></a>'},
        {field: 'partner', displayName: objFieldInfo.House.partner, headerTooltip: '点击表头可进行排序', enableCellEdit: false, cellTemplate: '<a href="/admin/partner?relate=id&relateValue={{COL_FIELD.id}}"><span ng-bind="COL_FIELD.name"></span></a>'},
    ];
    
    $scope.goToChildPageRentContract = function(pid) { location = '/admin/rentcontract?relate=house.id&relateValue=' + pid }
    $scope.goToChildPageRouter = function(pid) { location = '/admin/router?relate=house.id&relateValue=' + pid }
    
    $scope.selectedParentHostId = 0
    $scope.parentHosts = []
    $scope.parentHosts4grid = []
    $scope.pageInfo4ParentHost = {}
    $scope.searchFieldNameHost = searchFieldNameHost
    $scope.searchFieldNameHostComment = searchFieldNameHostComment
    

    $scope.$watch('selectedParentHostId', function(newValue, oldValue, scope){
        if(newValue != oldValue) {
            if($scope.parentHosts.length > 0) {
                if ($scope.selectedParentHostId) {
                    if ($scope.paginationConf.currentPage != 1) {
                        $scope.paginationConf.currentPage = 1
                    }
                } else {
                    if ($scope.paginationConf.currentPage != 1) {
                        $scope.paginationConf.currentPage = 1
                    }
                    $scope.selectedParentHostId = 0
                }
                refreshData(true)
            }
        }
    }, false);

    $scope.$watch('paginationConf4ParentHost.itemsPerPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithParentHosts();
        }
    }, false);

    $scope.$watch('paginationConf4ParentHost.currentPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithParentHosts();
        }
    }, false);

    $scope.paginationConf4ParentHost = {
        currentPage: 1, //首页
        itemsPerPage: 10, //每页显示数量
        pagesLength: 5,  //显示多少个页数格子
        perPageOptions: [1, 2, 5, 10, 20, 50, 100],//选择每页显示数量
        rememberPerPage: 'itemsPerPage4ParentHost'
    };
    
    $http.get('/base/Host/all').success(function (data, status, headers, config) {
    	if (data.flag) {
            $scope.parentHosts = [{"id": 0, "name": "全部"}]
    		$scope.parentHosts = $scope.parentHosts.concat(data.data);
            if ((GetQueryString('relate') == 'host.id' || GetQueryString('relate') == 'refHostId') 
                && GetQueryString('relateValue')) 
                $scope.selectedParentHostId = parseInt(GetQueryString('relateValue'))
    	}
    });
    
    function fillGridWithParentHosts() {
        url = '/base/Host/all?page=' 
                    + $scope.paginationConf4ParentHost.currentPage 
                    + '&size=' + $scope.paginationConf4ParentHost.itemsPerPage
                    
        if ($scope.currentObj.queryKeyword4Host)
            url += '&searchOn=' + $scope.searchFieldNameHost + '&kw=' + $scope.currentObj.queryKeyword4Host
            
        $http.get(url)
            .success(function (data, status, headers, config) {
            if (data.flag) {
                $scope.parentHosts4grid = data.data;
                $scope.pageInfo4ParentHost = data.page;
                $scope.paginationConf4ParentHost.totalItems = data.page.total;
                
                for (x in $scope.parentHosts4grid) {
                    if ($scope.parentHosts4grid[x].id === $scope.currentObj.refHostId) {
                        $scope.parentHosts4grid[x].refParentHost = true
                        break
                    }
                    else {
                        $scope.parentHosts4grid[x].refParentHost = false
                    }
                }
            }
            else {
                $scope.parentHosts4grid = [];
                //showAlert('错误: ', data.message, 'danger')
            }
        });
    }
    
    $scope.myParentHostSelections = [];
    $scope.gridParentHosts = {
        data: 'parentHosts4grid',
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function (rows) {
                $scope.myParentHostSelections = gridApi.selection.getSelectedRows();
            });
        },
        isRowSelectable: function(row){
            if(row.entity.refParentHost == true){
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
        if($scope.paginationConf4ParentHost.currentPage != 1){
            $scope.paginationConf4ParentHost.currentPage = 1
        }
        else{
            fillGridWithParentHosts()
        }
    }
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
    $scope.getRefObjName = function (obj, pascalFieldName) {
        if (!obj['ref' + pascalFieldName + 'Id']) return
        $http.get('/base/' + pascalFieldName + '/' + obj['ref' + pascalFieldName + 'Id']).success(function (data, status, headers, config) {
            if (data.flag) obj[pascalFieldName.toLowerCase()] = data.data
        });
    }

    function refreshData(showMsg){
        var url = '/base/House/all?page=' 
                    + $scope.paginationConf.currentPage 
                    + '&size=' + $scope.paginationConf.itemsPerPage
                    + '&startTime=' + $scope.startTime + '&endTime=' + $scope.endTime
                    + '&status=' + $scope.selectedStatus
                    
        
        var fieldOnParam = '';
        var fieldValueParam = '';
        
        if ($scope.selectedParentHostId != 0) {
            fieldOnParam += 'refHostId';
            fieldValueParam += $scope.selectedParentHostId;
        }
        if ($scope.selectedParentPartnerId != 0) {
            fieldOnParam += 'refPartnerId';
            fieldValueParam += $scope.selectedParentPartnerId;
        }
        url += '&fieldOn=' + fieldOnParam + '&fieldValue=' + fieldValueParam
        
        
        if ($scope.queryKeyword)
            url += '&searchOn=' + searchFieldName + '&kw=' + $scope.queryKeyword

        $http.get(url).success(function (data, status, headers, config) {
            if (data.flag) {
                for (x in data.data) {
                    if (!data.data[x].host) $scope.getRefObjName(data.data[x], 'Host')
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
        if ($scope.myParentHostSelections.length > 0) content.refHostId = $scope.myParentHostSelections[0].id
        if ($scope.myParentPartnerSelections.length > 0) content.refPartnerId = $scope.myParentPartnerSelections[0].id
        
        var isNew = !content.id
        var url = '/house'
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
                        var deleteUrl = '/base/House/' + content.id
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
        $scope.myParentHostSelections = [];
        $scope.myParentPartnerSelections = [];
        $scope.$modalClose();
        refreshData(false)
    };
    
    $scope.addContent = function(){
        $scope.currentObj = {};
        
        fillGridWithParentHosts();
        fillGridWithParentPartners();
        
        createDialogService("/assets/html/edit_templates/house.html",{
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
        
            fillGridWithParentHosts();
            fillGridWithParentPartners();

            createDialogService("/assets/html/edit_templates/house.html",{
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
                location.href = '/report/house?startTime='
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

    ////////// child RentContract popup show //////////
    
    $scope.gridChildRentContract = {
        data: 'childRentContract4grid',
        rowHeight: rowLowHeight,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false
    };
    
    $scope.gridChildRentContract.columnDefs = [        
        {field: 'id', displayName: 'Id', width: '40', enableCellEdit: false},
        {field: 'name', displayName: objFieldInfo.RentContract.name, enableCellEdit: true},
        {field: 'rent', displayName: objFieldInfo.RentContract.rent, enableCellEdit: true},
        {field: 'images', displayName: objFieldInfo.RentContract.images, width: 170, enableCellEdit: false, cellTemplate: readonlyImageTemplateHouse},
        {field: 'status', displayName: objFieldInfo.RentContract.status, enableCellEdit: false, cellTemplate: '<span ng-bind="grid.appScope.objEnumInfo.RentContract.status[MODEL_COL_FIELD]"></span>'},
        {field: 'rentPayTime', displayName: objFieldInfo.RentContract.rentPayTime, enableCellEdit: true},
        {field: 'createdAt', displayName: objFieldInfo.RentContract.createdAt, enableCellEdit: true},
        {field: 'contractEndTime', displayName: objFieldInfo.RentContract.contractEndTime, enableCellEdit: true},
        {field: 'lastUpdateTime', displayName: objFieldInfo.RentContract.lastUpdateTime, enableCellEdit: true},
        {field: 'comment', displayName: objFieldInfo.RentContract.comment, enableCellEdit: true},
        {field: 'refHouseId', displayName: objFieldInfo.RentContract.refHouseId, enableCellEdit: true},
    ];

    $scope.popChildRentContract = function (obj) {
        if (obj) {
            $scope.currentObj = obj;

            fillGridWithChildRentContract()

            createDialogService("/assets/html/child_pop_templates/house_2_rent_contract.html", {
                id: 'child_rent_contract',
                title: '查看',
                scope: $scope,
                footerTemplate: '<div></div>'
            });
        } else {
            showAlert('错误: ', '数据不存在', 'danger');
        }
    };

    $scope.pageInfo4childRentContract = {}

    $scope.$watch('paginationConf4ChildRentContract.itemsPerPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithChildRentContract();
        }
    }, false);

    $scope.$watch('paginationConf4ChildRentContract.currentPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithChildRentContract();
        }
    }, false);

    $scope.paginationConf4ChildRentContract = {
        currentPage: 1, //首页
        itemsPerPage: 10, //每页显示数量
        pagesLength: 5,  //显示多少个页数格子
        perPageOptions: [1, 2, 5, 10, 20, 50, 100],//选择每页显示数量
        rememberPerPage: 'itemsPerPage4childRentContract'
    };

    function fillGridWithChildRentContract() {
        $scope.childRentContract4grid = []
        $http.get('/base/RentContract/all?page='
        + $scope.paginationConf4ChildRentContract.currentPage
        + '&size=' + $scope.paginationConf4ChildRentContract.itemsPerPage
        + '&fieldOn=house.id&fieldValue=' + $scope.currentObj.id)
            .success(function (data, status, headers, config) {
                if (data.flag) {
                    $scope.childRentContract4grid = data.data;
                    $scope.pageInfo4childRentContract = data.page;
                    $scope.paginationConf4ChildRentContract.totalItems = data.page.total;
                }
            });
    }
    ////////// child Router popup show //////////
    
    $scope.gridChildRouter = {
        data: 'childRouter4grid',
        rowHeight: rowLowHeight,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false
    };
    
    $scope.gridChildRouter.columnDefs = [        
        {field: 'id', displayName: 'Id', width: '40', enableCellEdit: false},
        {field: 'name', displayName: objFieldInfo.Router.name, enableCellEdit: true},
        {field: 'appId', displayName: objFieldInfo.Router.appId, enableCellEdit: true},
        {field: 'secret', displayName: objFieldInfo.Router.secret, enableCellEdit: true},
        {field: 'bindPhone', displayName: objFieldInfo.Router.bindPhone, enableCellEdit: true},
        {field: 'status', displayName: objFieldInfo.Router.status, enableCellEdit: false, cellTemplate: '<span ng-bind="grid.appScope.objEnumInfo.Router.status[MODEL_COL_FIELD]"></span>'},
        {field: 'createdAt', displayName: objFieldInfo.Router.createdAt, enableCellEdit: true},
        {field: 'lastUpdateTime', displayName: objFieldInfo.Router.lastUpdateTime, enableCellEdit: true},
        {field: 'comment', displayName: objFieldInfo.Router.comment, enableCellEdit: true},
        {field: 'refHouseId', displayName: objFieldInfo.Router.refHouseId, enableCellEdit: true},
    ];

    $scope.popChildRouter = function (obj) {
        if (obj) {
            $scope.currentObj = obj;

            fillGridWithChildRouter()

            createDialogService("/assets/html/child_pop_templates/house_2_router.html", {
                id: 'child_router',
                title: '查看',
                scope: $scope,
                footerTemplate: '<div></div>'
            });
        } else {
            showAlert('错误: ', '数据不存在', 'danger');
        }
    };

    $scope.pageInfo4childRouter = {}

    $scope.$watch('paginationConf4ChildRouter.itemsPerPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithChildRouter();
        }
    }, false);

    $scope.$watch('paginationConf4ChildRouter.currentPage', function(newValue, oldValue, scope){
        if (newValue != oldValue) {
            fillGridWithChildRouter();
        }
    }, false);

    $scope.paginationConf4ChildRouter = {
        currentPage: 1, //首页
        itemsPerPage: 10, //每页显示数量
        pagesLength: 5,  //显示多少个页数格子
        perPageOptions: [1, 2, 5, 10, 20, 50, 100],//选择每页显示数量
        rememberPerPage: 'itemsPerPage4childRouter'
    };

    function fillGridWithChildRouter() {
        $scope.childRouter4grid = []
        $http.get('/base/Router/all?page='
        + $scope.paginationConf4ChildRouter.currentPage
        + '&size=' + $scope.paginationConf4ChildRouter.itemsPerPage
        + '&fieldOn=house.id&fieldValue=' + $scope.currentObj.id)
            .success(function (data, status, headers, config) {
                if (data.flag) {
                    $scope.childRouter4grid = data.data;
                    $scope.pageInfo4childRouter = data.page;
                    $scope.paginationConf4ChildRouter.totalItems = data.page.total;
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
