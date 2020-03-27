var app = angular.module('PartnerHouseApp', []);

app.controller('PartnerHouseController', [
    '$scope',
    '$http',
    '$log',
    function ($scope, $http, $log) {
        $scope.pid = 0
        $scope.kw = ''
        $scope.list = []

        $scope.onInit = function (pid) {
            $scope.pid = pid
            refreshData()
        }

        $scope.search = function () {
            refreshData()
        }

        function refreshData() {
            var url = '/base/House/all?page=1&size=100&fieldOn=partner.id&fieldValue=' + $scope.pid

            if ($scope.kw)
                url += '&searchOn=host.name&kw=' + $scope.kw

            $http.get(url).success(function (data, status, headers, config) {
                if (data.flag) {
                    $scope.list = data.data;
                } else {
                    $scope.list = [];
                }
            });
        }
    }]);