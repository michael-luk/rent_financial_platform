var app = angular.module('MyHouseSubmitApp', ['angularFileUpload']);

app.controller('MyHouseSubmitController', [
    '$scope',
    '$http',
    '$upload',
    '$log',
    function ($scope, $http, $upload, $log) {
        $scope.name = ''
        $scope.address = ''
        $scope.comment = ''
        $scope.size = ''
        $scope.structure = ''
        $scope.age = 1

        //提交资料
        $scope.doSubmit = function (uid) {
            var imageCount = 0
            var imageStr = ''
            for (var i = 0; i < 3; i++) {
                if ($("#img" + i).attr("src")) {
                    imageCount ++
                    imageStr += $("#img" + i).attr("src").replace('/showimg/thumb/', '') + ','
                }
            }

            if (imageCount == 0){
                alert('请至少上传一张图片')
                return
            }

            var postItem = {
                refHostId: uid,
                name: $scope.name,
                address: $scope.address,
                comment: $scope.comment,
                size: $scope.size,
                structure: $scope.structure,
                age: $scope.age,
                images: imageStr
            };

            $http({
                method: 'POST',
                url: '/my/house/submit',
                data: postItem
            }).success(function (data, status, headers, config) {
                if (data.flag) {
                    location.href = '/p/my/house'
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