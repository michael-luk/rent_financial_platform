var app = angular.module('PartnerLoginApp', []);

app.controller('PartnerLoginController', [
    '$scope',
    '$http',
    '$log',
    function ($scope, $http, $log) {
        $scope.username = ''
        $scope.psw = ''

        //提交绑定
        $scope.login = function () {
            if (!$scope.username) {
                alert("必须输入用户名");
                return
            }
            if (!$scope.psw) {
                alert("必须输入密码");
                return
            }

            var postItem = {
                username: $scope.username,
                psw: $scope.psw,
            };
            $http({
                method: 'POST',
                url: '/partner/login',
                data: postItem
            }).success(function (data, status, headers, config) {
                if (data.flag) {
                    location.href = '/p/partner/main'
                } else {
                    alert(data.message);
                }
            });
        };
    }]);