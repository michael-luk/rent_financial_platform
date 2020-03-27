var app = angular.module('ProductSignApp', []);

app.controller('ProductSignController', [
    '$scope',
    '$http',
    '$log',
    function ($scope, $http, $log) {
        $scope.clickable = true
        //提交绑定
        $scope.doBind = function (uid, pid, money) {
            if (!$scope.clickable) return
            $scope.clickable = false
            var postItem = {
                uid: uid,
                pid: pid,
                money: money
            };
            $http({
                method: 'POST',
                url: '/product/sign',
                data: postItem
            }).success(function (data, status, headers, config) {
                if (data.flag) {
                    location.href = '/p/verify/submit'
                } else {
                    alert(data.message + ",请稍后重试");
                }
                $scope.clickable = true
            });
        };
    }]);