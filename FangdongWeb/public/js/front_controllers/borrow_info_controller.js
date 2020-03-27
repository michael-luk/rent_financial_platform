var app = angular.module('BorrowInfoApp', []);

app.controller('BorrowInfoController', [
    '$scope',
    function ($scope) {
        $scope.rentMoney = ''
        $scope.times = ''
        $scope.interest = 0.8
        $scope.credit = ''

        $scope.onCal = function () {
            $scope.credit = $scope.rentMoney * $scope.times * $scope.interest
        }
    }]);