var app = angular.module('VerifyPartnerApp', []);

app.controller('VerifyPartnerController', [
    '$scope',
    '$http',
    '$log',
    function ($scope, $http, $log) {

        $scope.selectCatalog = '选择运营商'
        // $scope.selectArea = '京津冀'
        // $scope.selectPartner = ''
        // $scope.partners = []
        // refreshData()
        //
        // function refreshData(){
        //     var url = '/base/Partner/all?page=1&size=100&status=0'
        //     $http.get(url).success(function (data, status, headers, config) {
        //         if (data.flag) {
        //             $scope.partners = data.data;
        //         }
        //         else {
        //             $scope.partners = [];
        //         }
        //     });
        // }

        //提交绑定
        $scope.doBind = function (uid) {
            if (!$scope.selectCatalog) {
                alert("请选择类型");
                return
            }
            // if (!$scope.selectArea) {
            //     alert("请选择地区");
            //     return
            // }
            // if (!$scope.selectPartner) {
            //     alert("请选择运营商");
            //     return
            // }

            var postItem = {
                uid: uid,
                // area: $scope.selectArea,
                // partnerId: $scope.selectPartner,
            };
            $http({
                method: 'POST',
                url: '/verify/partner',
                data: postItem
            }).success(function (data, status, headers, config) {
                if (data.flag) {
                    location.href = '/p/product/fix/sjsh/buy'
                } else {
                    alert(data.message + ",请稍后重试");
                }
            });
        };
    }]);