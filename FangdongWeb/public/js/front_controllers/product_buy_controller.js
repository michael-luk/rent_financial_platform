var app = angular.module('ProductBuyApp', []);

app.controller('ProductBuyController', function ($scope, $http) {

    $scope.loanMoney = 0

    $scope.doBuy = function (hostId, hostCredit, itemId, itemMinInvestAmount, itemMaxInvestAmount) {
        if (hostCredit <= 0) {
            alert('抱歉, 您额度不足')
            return
        }
        if (hostCredit <= $scope.loanMoney) {
            alert('抱歉, 您输入的额度超出了您的当前信用额度')
            return
        }
        if ($scope.loanMoney < itemMinInvestAmount) {
            alert('抱歉, 您输入的额度低于本产品的最低贷款额度')
            return
        }
        if ($scope.loanMoney > itemMaxInvestAmount) {
            alert('抱歉, 您输入的额度超过了本产品的最高贷款额度')
            return
        }

        location.href = '/product/buy/submit?hid=' + hostId + '&pid=' + itemId + '&amount=' + $scope.loanMoney
        //var content = {}
        //content.amount = $scope.loanMoney
        //content.refHostId = hostId
        //content.refProductId = itemId
        //
        //$http({
        //    method: 'POST',
        //    url: '/product/buy/submit',
        //    data: content
        //})
    };
});