var app = angular.module('MyInfoSubmitApp', ['angularFileUpload']);

app.controller('MyInfoSubmitController', [
    '$scope',
    '$http',
    '$upload',
    '$log',
    function ($scope, $http, $upload, $log) {
        $scope.name = ''
        $scope.sex = 1
        $scope.birthDay = ''
        $scope.address = ''

        //提交资料
        $scope.doSubmit = function (uid) {
            for (var i = 0; i < 3; i++) {
                if ($("#img" + i).attr("src")) {
                } else {
                    alert('必须上传所有要求的图片')
                    return
                }
            }

            var postItem = {
                uid: uid,
                name: $scope.name,
                sex: $scope.sex,
                birthDay: $scope.birthDay,
                address: $scope.address,
                images: $("#img0").attr("src").replace('/showimg/thumb/', '') + ',' + $("#img1").attr("src").replace('/showimg/thumb/', '') + ',' + $("#img2").attr("src").replace('/showimg/thumb/', '')
            };

            $http({
                method: 'POST',
                url: '/my/info/submit',
                data: postItem
            }).success(function (data, status, headers, config) {
                if (data.flag) {
                    location.href = '/p/my/info'
                } else {
                    alert(data.message)
                }
            });
        };

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
    }]);