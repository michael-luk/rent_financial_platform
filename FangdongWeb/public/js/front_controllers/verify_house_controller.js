var app = angular.module('VerifyHouseApp', ['angularFileUpload']);

app.controller('VerifyHouseController', [
    '$scope',
    '$upload',
    '$http',
    '$log',
    function ($scope, $upload, $http, $log) {
        $scope.province = ''
        $scope.city = ''
        $scope.area = ''
        $scope.address = ''
        $scope.zone = ''
        $scope.size = ''
        $scope.age = ''
        $scope.structure = ''
        $scope.comment = ''

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
        $scope.doBind = function (uid) {
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
            if (!$scope.comment) {
                alert("请选择运营管理方");
                return
            }

            var imageCount = 0
            var imageStr = ''
            for (var i = 0; i < 2; i++) {
                if ($("#img" + i).attr("src") && $("#img" + i).attr("src").indexOf('/thumb/') > 0) {
                    imageCount++
                    imageStr += $("#img" + i).attr("src").replace('/showimg/thumb/', '') + ','
                }
            }

            if (imageCount < 2) {
                alert("必须上传两张产权证明照片");
                return
            }

            var postItem = {
                uid: uid,
                province: $scope.province,
                city: $scope.city,
                area: $scope.area,
                address: $scope.address,
                zone: $scope.zone,
                size: $scope.size,
                age: $scope.age,
                structure: $scope.structure,
                comment: $scope.comment,
                images: imageStr
            };
            $http({
                method: 'POST',
                url: '/verify/house',
                data: postItem
            }).success(function (data, status, headers, config) {
                if (data.flag) {
                    location.href = '/p/verify/contract/' + data.data.id
                } else {
                    alert(data.message + ",请稍后重试");
                }
            });
        };
    }]);