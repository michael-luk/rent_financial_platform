var app = angular.module('MyHouseContractApp', []);

app.controller('MyHouseContractController', [
    '$scope',
    '$http',
    '$log',
    function ($scope, $http, $log) {
        $scope.uid = 0
        $scope.list = []

        $scope.onInit = function (uid) {
            $scope.uid = uid
        }

        refreshData()

        function refreshData(){
            var url = '/base/User/all?page='
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
            });
        }
    }]);