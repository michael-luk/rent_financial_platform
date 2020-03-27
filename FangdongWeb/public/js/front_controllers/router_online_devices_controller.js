var app = angular.module('RouterOnlineDevicesApp', []);
// app.config(['httpProvider', function (httpProvider) {
//     httpProvider.defaults.useXDomain = true;
//     deletehttpProvider.defaults.headers.common['X-Requested-With'];
// }
// ]);
app.controller('RouterOnlineDevicesController', [
    '$scope',
    '$http',
    '$log',
    function ($scope, $http, $log) {
        $scope.devices = []

        $scope.init = function (routerId) {
            $http({
                url: '/router/api/online/devices?routerId=' + routerId,
                method: 'GET'
            }).success(function (data, status, headers, config) {
                if (data.flag) {
                    $scope.devices = (JSON.parse(data.data)).trans_data;
                } else {
                    alert(data.message)
                }
            })
        }

        $scope.getImageSrc = function (deviceName, companyStr) {
            if (companyStr.indexOf('apple') > -1) return '/showimg/images/state4.png'
            if (companyStr.indexOf('intel') > -1) return '/showimg/images/state6.png'
            if (companyStr.indexOf('android') > -1) return '/showimg/images/state5.png'

            if (deviceName.toLowerCase().indexOf('vivo') > -1) return '/showimg/images/state5.png'
            if (deviceName.toLowerCase().indexOf('huawei') > -1) return '/showimg/images/state5.png'
            if (deviceName.toLowerCase().indexOf('xiaomi') > -1) return '/showimg/images/state5.png'
            if (deviceName.toLowerCase().indexOf('redmi') > -1) return '/showimg/images/state5.png'

            if (deviceName.toLowerCase().indexOf('pc') > -1) return '/showimg/images/state6.png'
            if (deviceName.toLowerCase().indexOf('desktop') > -1) return '/showimg/images/state6.png'
            if (deviceName.toLowerCase().indexOf('laptop') > -1) return '/showimg/images/state6.png'

            return '/showimg/images/state7.png'
        }

        $scope.getDeviceTimeDisplay = function (device) {
            if (device.offline_time.indexOf('1970') > -1) {
                return '接入: ' + device.online_time
            } else {
                return '离线: ' + device.offline_time
            }
        }
    }]);