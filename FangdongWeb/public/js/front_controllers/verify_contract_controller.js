var app = angular.module('VerifyContractApp', ['angularFileUpload']);

app.controller('VerifyContractController', [
    '$scope',
    '$upload',
    '$http',
    '$log',
    function ($scope, $upload, $http, $log) {
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
        $scope.doBind = function (uid) {
            if ($scope.rentMoney == 0) {
                alert("请输入正确的租金");
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
                alert("必须上传两张租赁合同照片");
                return
            }

            var postItem = {
                uid: uid,
                rentMoney: parseInt($scope.rentMoney),
                images: imageStr
            };
            $http({
                method: 'POST',
                url: '/verify/contract',
                data: postItem
            }).success(function (data, status, headers, config) {
                if (data.flag) {
                    location.href = '/p/verifying'
                } else {
                    alert(data.message + ",请稍后重试");
                }
            });
        };
    }]);