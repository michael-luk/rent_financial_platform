var app = angular.module('PartnerHouseAddApp', ['angularFileUpload']);

app.controller('PartnerHouseAddController', [
    '$scope',
    '$upload',
    '$http',
    '$log',
    function ($scope, $upload, $http, $log) {
        $scope.phone = ''
        $scope.hostName = ''
        $scope.province = ''
        $scope.city = ''
        $scope.area = ''
        $scope.address = ''
        $scope.zone = ''
        $scope.size = ''
        $scope.age = ''
        $scope.structure = ''
        $scope.rentMoney = ''

        $scope.uploadImage = function ($files, no) {// imageField example: imagesList
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];

                $scope.upload = $upload.upload({
                    url: '/upload/image',
                    file: file
                })
                    .progress(
                    function (evt) {
                        $log.log('upload image percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                    })
                    .success(function (data, status, headers, config) {
                        if (data.flag) {
                            $("#img" + no).attr("src", '/showimg/thumb/' + data.data);
                            $("#img" + no).show();
                        } else {
                            alert('错误: ' + data.message, 'danger')
                        }
                    });
            }
        };

        //提交绑定
        $scope.doBind = function (partnerId) {
            if (!$scope.phone) {
                alert("请输入房东手机号");
                return
            }
            if (!$scope.hostName) {
                alert("请输入房东姓名");
                return
            }
            if (!$scope.province) {
                alert("请选择省份");
                return
            }
            if (!$scope.city) {
                alert("请选择城市");
                return
            }
            if (!$scope.address) {
                alert("请输入房源地址");
                return
            }
            if (!$scope.zone) {
                alert("请输入小区/门牌");
                return
            }
            if (!$scope.size) {
                alert("请输入房源面积");
                return
            }
            if (!$scope.age) {
                alert("请选择楼龄");
                return
            }
            if (!$scope.structure) {
                alert("请选择房型");
                return
            }
            if (!$scope.rentMoney) {
                alert("请输入租金");
                return
            }

            var imageCount = 0
            var imageStr = ''
            for (var i = 0; i < 4; i++) {
                if ($("#img" + i).attr("src") && $("#img" + i).attr("src").indexOf('/thumb/') > 0) {
                    imageCount++
                    imageStr += $("#img" + i).attr("src").replace('/showimg/thumb/', '') + ','
                }
            }

            if (imageCount < 4) {
                alert("必须上传两张房产证照片和两张租赁合同照片");
                return
            }

            var postItem = {
                partnerId: partnerId,
                phone: $scope.phone,
                hostName: $scope.hostName,
                province: $scope.province,
                city: $scope.city,
                area: $scope.area,
                address: $scope.address,
                zone: $scope.zone,
                size: $scope.size,
                age: $scope.age,
                structure: $scope.structure,
                rentMoney: parseInt($scope.rentMoney),
                images: imageStr
            };
            $http({
                method: 'POST',
                url: '/partner/house/add',
                data: postItem
            }).success(function (data, status, headers, config) {
                if (data.flag) {
                    alert("房源提交成功!")
                    location.href = '/p/partner/main'
                } else {
                    alert(data.message);
                }
            });
        };
    }]);