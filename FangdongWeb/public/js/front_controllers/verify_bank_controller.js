var app = angular.module('VerifyBankApp', []);

app.controller('VerifyBankController', [
    '$scope',
    '$http',
    '$log',
    function ($scope, $http, $log) {
        $scope.bankName = ''
        $scope.bankCard = ''

        //提交绑定
        $scope.doBind = function (uid, backPage) {
            if (!$scope.bankName) {
                alert("必须输入银行名称");
                return
            }
            if (!$scope.bankCard) {
                alert("必须输入银行卡号");
                return
            }
            if ($scope.bankCard.length < 16) {
                alert("银行卡号至少16位");
                return
            }

            var postItem = {
                uid: uid,
                bankName: $scope.bankName,
                bankCard: $scope.bankCard
            };
            $http({
                method: 'POST',
                url: '/verify/bank',
                data: postItem
            }).success(function (data, status, headers, config) {
                if (data.flag) {
                    if (backPage)
                        location.href = backPage
                    else
                        location.href = '/p/verify/house'
                } else {
                    alert(data.message + ",请稍后重试");
                }
            });
        };
    }]);