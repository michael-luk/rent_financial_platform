var app = angular.module('ProductBackendApp', ['tm.pagination', 'ui.grid', 'ui.grid.resizeColumns', 'ui.grid.selection', 'ui.grid.edit', 'angularFileUpload', 'fundoo.services', 'simditor', 'ui.grid.autoFitColumns']);

var uploadImageTemplateProduct = '<div> <input type="file" name="files[]" accept="image/gif,image/jpeg,image/jpg,image/png" ng-file-select="grid.appScope.uploadImage($files, \'MODEL_COL_FIELD\', row.entity)"/> <div ng-repeat="imageName in MODEL_COL_FIELD.split(\',\')"> <div ng-show="imageName"> <a class="fancybox" target="_blank" data-fancybox-group="gallery" fancybox ng-href="/showImage/{{imageName}}"><img ng-src="/showimg/thumb/{{imageName}}" style="width:50px;height:50px;float:left"></a><input type="button" ng-click="grid.appScope.deleteImage(row.entity, \'MODEL_COL_FIELD\', imageName)" value="删除" style="float:left" /></div></div></div>';
var checkboxTemplateProduct = '<div><input type="checkbox" ng-model="MODEL_COL_FIELD" ng-click="grid.appScope.updateEntity(col, row)" /></div>';
var childButtonTemplateProductContractRecord = '<div align="center" style="height:26px;line-height:24px"><a href="#" data-toggle="tooltip" title="弹窗显示"><button class="btn btn-xs btn-success" ng-click="grid.appScope.popChildContractRecord(row.entity)"><i class="icon-list-alt icon-white"></i></button></a> <a href="#" data-toggle="tooltip" title="跳转"><button class="btn btn-xs btn-primary" ng-click="grid.appScope.goToChildPageContractRecord(row.entity.id)"><i class="icon-share icon-white"></i></button></a></div>';
var childButtonTemplateProductFundBackRecord = '<div align="center" style="height:26px;line-height:24px"><a href="#" data-toggle="tooltip" title="弹窗显示"><button class="btn btn-xs btn-success" ng-click="grid.appScope.popChildFundBackRecord(row.entity)"><i class="icon-list-alt icon-white"></i></button></a> <a href="#" data-toggle="tooltip" title="跳转"><button class="btn btn-xs btn-primary" ng-click="grid.appScope.goToChildPageFundBackRecord(row.entity.id)"><i class="icon-share icon-white"></i></button></a></div>';
var childButtonTemplateProductProductRecord = '<div align="center" style="height:26px;line-height:24px"><a href="#" data-toggle="tooltip" title="弹窗显示"><button class="btn btn-xs btn-success" ng-click="grid.appScope.popChildProductRecord(row.entity)"><i class="icon-list-alt icon-white"></i></button></a> <a href="#" data-toggle="tooltip" title="跳转"><button class="btn btn-xs btn-primary" ng-click="grid.appScope.goToChildPageProductRecord(row.entity.id)"><i class="icon-share icon-white"></i></button></a></div>';
var readonlyImageTemplateProduct = '<div><div ng-repeat="imageName in MODEL_COL_FIELD.split(\',\')"><div ng-show="imageName"><a class="fancybox" target="_blank" data-fancybox-group="gallery" fancybox ng-href="/showImage/{{imageName}}"><img ng-src="/showimg/thumb/{{imageName}}" style="width:50px;height:50px;float:left"></a></div></div></div>';
var readonlyCheckboxTemplateProduct = '<div><input type="checkbox" ng-model="MODEL_COL_FIELD" disabled="disabled" /></div>';

app.filter('safehtml', function ($sce) {
    return function (htmlString) {
        return $sce.trustAsHtml(htmlString);
    }
});


app.controller('ProductBackendController', ['$scope', '$http', '$upload', 'createDialog', '$log', function ($scope, $http, $upload, createDialogService, $log) {
	$scope.isProduct = true;
    
    if(GetQueryString('relate') && GetQueryString('relateValue')) {
        $scope.relate = GetQueryString('relate')
        $scope.relateValue = GetQueryString('relateValue')
    }
    
    var rowLowHeight = 26
    var rowHighHeight = 100 
    
    $scope.objFieldInfo = objFieldInfo
    $scope.objEnumInfo = objEnumInfo   
    
    $scope.status = [{"id": -100, "name": "全部"}]
    dropdownTemplateProductStatus = '<div>' +
        '<select ng-model="MODEL_COL_FIELD" ' +
        'ng-change="grid.appScope.updateEntity(col, row)" style="padding: 2px;">'
    for (var i = 0; i < Object.keys(objEnumInfo.Product.status).length; i++) {
        $scope.status.push({"id": i, "name": objEnumInfo.Product.status[i]})
        dropdownTemplateProductStatus += '<option ng-selected="MODEL_COL_FIELD==' + i
            + '" value=' + i + '>' + objEnumInfo.Product.status[i] + '</option>'
    }
    dropdownTemplateProductStatus += '</select></div>'

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
        {field: 'name', displayName: objFieldInfo.Product.name, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'indexNum', displayName: objFieldInfo.Product.indexNum, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'promote', displayName: objFieldInfo.Product.promote, headerTooltip: '点击表头可进行排序, 通过直接勾选操作来更新数据', enableCellEdit: false, cellTemplate: checkboxTemplateProduct},
        {field: 'length', displayName: objFieldInfo.Product.length, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'requireCredit', displayName: objFieldInfo.Product.requireCredit, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'minInvestAmount', displayName: objFieldInfo.Product.minInvestAmount, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'maxInvestAmount', displayName: objFieldInfo.Product.maxInvestAmount, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'interest', displayName: objFieldInfo.Product.interest, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'visible', displayName: objFieldInfo.Product.visible, headerTooltip: '点击表头可进行排序, 通过直接勾选操作来更新数据', enableCellEdit: false, cellTemplate: checkboxTemplateProduct},
        {field: 'status', displayName: objFieldInfo.Product.status, width: 120, headerTooltip: '点击表头可进行排序, 通过直接下拉选取操作来更新数据', enableCellEdit: false, cellTemplate: dropdownTemplateProductStatus},
        {field: 'images', displayName: objFieldInfo.Product.images, width: 170, enableCellEdit: false, cellTemplate: uploadImageTemplateProduct},
        {field: 'smallImages', displayName: objFieldInfo.Product.smallImages, width: 170, enableCellEdit: false, cellTemplate: uploadImageTemplateProduct},
        {field: 'createdAt', displayName: objFieldInfo.Product.createdAt, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'lastUpdateTime', displayName: objFieldInfo.Product.lastUpdateTime, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'description', displayName: objFieldInfo.Product.description, width: '100', headerTooltip: '点击表头可进行排序', enableCellEdit: true, cellTemplate: '<div ng-bind-html="COL_FIELD | safehtml"></div>'},
        {field: 'description2', displayName: objFieldInfo.Product.description2, width: '100', headerTooltip: '点击表头可进行排序', enableCellEdit: true, cellTemplate: '<div ng-bind-html="COL_FIELD | safehtml"></div>'},
        {field: 'comment', displayName: objFieldInfo.Product.comment, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'contractTitle', displayName: objFieldInfo.Product.contractTitle, headerTooltip: '点击表头可进行排序', enableCellEdit: true},
        {field: 'contractContent', displayName: objFieldInfo.Product.contractContent, width: '100', headerTooltip: '点击表头可进行排序', enableCellEdit: true, cellTemplate: '<div ng-bind-html="COL_FIELD | safehtml"></div>'},
        {field: 'childContractRecord', displayName: objFieldInfo.Product.contractRecords, width: '80', headerTooltip: '弹窗/跳转显示', enableCellEdit: false, cellTemplate: childButtonTemplateProductContractRecord},
        {field: 'childFundBackRecord', displayName: objFieldInfo.Product.fundBackRecords, width: '80', headerTooltip: '弹窗/跳转显示', enableCellEdit: false, cellTemplate: childButtonTemplateProductFundBackRecord},
        {field: 'childProductRecord', displayName: objFieldInfo.Product.productRecords, width: '80', headerTooltip: '弹窗/跳转显示', enableCellEdit: false, cellTemplate: childButtonTemplateProductProductRecord},

    ];
    
    $scope.goToChildPageContractRecord = function(pid) { location = '/admin/contractrecord?relate=product.id&relateValue=' + pid }
    $scope.goToChildPageFundBackRecord = function(pid) { location = '/admin/fundbackrecord?relate=product.id&relateValue=' + pid }
    $scope.goToChildPageProductRecord = function(pid) { location = '/admin/productrecord?relate=product.id&relateValue=' + pid }
    
    
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
        var url = '/base/Product/all?page=' 
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
        var url = '/product'
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
                        var deleteUrl = '/base/Product/' + content.id
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
        
        
        createDialogService("/assets/html/edit_templates/product.html",{
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
        

            createDialogService("/assets/html/edit_templates/product.html",{
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
                location.href = '/report/product?startTime='
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

            createDialogService("/assets/html/child_pop_templates/product_2_contract_record.html", {
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
        + '&fieldOn=product.id&fieldValue=' + $scope.currentObj.id)
            .success(function (data, status, headers, config) {
                if (data.flag) {
                    $scope.childContractRecord4grid = data.data;
                    $scope.pageInfo4childContractRecord = data.page;
                    $scope.paginationConf4ChildContractRecord.totalItems = data.page.total;
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

            createDialogService("/assets/html/child_pop_templates/product_2_fund_back_record.html", {
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
        + '&fieldOn=product.id&fieldValue=' + $scope.currentObj.id)
            .success(function (data, status, headers, config) {
                if (data.flag) {
                    $scope.childFundBackRecord4grid = data.data;
                    $scope.pageInfo4childFundBackRecord = data.page;
                    $scope.paginationConf4ChildFundBackRecord.totalItems = data.page.total;
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

            createDialogService("/assets/html/child_pop_templates/product_2_product_record.html", {
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
        + '&fieldOn=product.id&fieldValue=' + $scope.currentObj.id)
            .success(function (data, status, headers, config) {
                if (data.flag) {
                    $scope.childProductRecord4grid = data.data;
                    $scope.pageInfo4childProductRecord = data.page;
                    $scope.paginationConf4ChildProductRecord.totalItems = data.page.total;
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
