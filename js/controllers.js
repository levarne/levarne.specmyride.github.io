/**
 * Created by user on 15/06/16.
 */

angular.module('specmyride.controller', [])

    .controller('bodyCtrl', function($scope, $ionicSideMenuDelegate, $window, $ionicHistory){

        $scope.aboutAlert = function(){
            alert("Developed By: Levarne Sobotker");
        }

        /*
            exit app
        */
        $scope.exitApp = function(){
            ionic.Platform.exitApp();
        }

        //change theme
        var selectedTheme = window.localStorage.SpecMyRideTheme;
        if(selectedTheme){
            $scope.appTheme = selectedTheme;
        }else{
            $scope.appTheme = 'themeRetro';
        }

        //else add theme to storage
        $scope.changeTheme = function(theme){
            window.localStorage.SpecMyRideTheme = theme;
            $window.location = '';
        }

        //global mini-loader
        $scope.miniLoaderShow = function(){
            $scope.miniLoader = 'miniLoader';
        }

        $scope.miniLoaderHide = function(){
            $scope.miniLoader = 'miniLoaderOff';
        }

        $scope.toggleLeftMenu = function(){
            $ionicSideMenuDelegate.toggleLeft();
        }

        $scope.toggleTitle = function(title){
            if(title){
                $scope.PageTitle = title.toUpperCase();
            }else{
                $scope.PageTitle = "CATEGORIES";
            }
        }

        $scope.myGoBack = function(){
            var backViewObj, titleStr

            $ionicHistory.goBack();

            backViewObj = $ionicHistory.backView();

            //remove the title name from tab.
            titleStr = backViewObj.url;
            titleStr = titleStr.substring(titleStr.lastIndexOf("/") + 1, titleStr.length);

            $scope.toggleTitle(titleStr);
        }

        $scope.catView = [
            'grid',
            'list'
        ]

        var selectedView = $window.localStorage.appView;

        if(selectedView){
            $scope.appView = selectedView;
            //change button icon to its corresponting layout
            switch(selectedView){
                case 'grid':
                    $scope.viewClass = 'ion-android-list';
                    //ion-ios-drag
                    //ion-ios-list-outline
                    //ion-android-list
                    break;
                case 'list':
                    $scope.viewClass = 'ion-grid';
            }
        }else{
            $scope.appView = 'grid';
            $scope.viewClass = 'ion-grid';
        }

        $scope.viewChange = function(){
            if($window.localStorage.appView == 'list'){
                $window.localStorage.appView = 'grid';
            }else{
                $window.localStorage.appView = 'list';
            }

            $window.location = '';
        }
    })

    //categories page, my main page
    .controller('categoriesCtrl', function($scope, CategoryData){
        $scope.toggleTitle();
        var data = CategoryData.getAllMakes();

        $scope.vehicleMakeData = data;
    })

    .controller('vehicleModelCtrl', function($scope, $stateParams, $ionicPopup,CategoryData, $location) {
        $scope.globalMakeName = $stateParams.makeName;
        $scope.toggleTitle($scope.globalMakeName);

        $scope.panes = [
            {active:false, disabled:true},
            {active:false, disabled:true},
            {active:false, disabled:true},
            {active:false, disabled:true}
        ];

         //remove this when writing your sqli database
        $scope.makeIDModel = $stateParams.makeId;

        $scope.categroyModelData = CategoryData.getAllModels($stateParams.makeId);

        //CategoryData.getAllModels($stateParams.makeId).then(function(value){
        //   $scope.categroyModelData = value;
        // });

        $scope.selectModel = function(MakeNiceName, model_niceName){
            $scope.miniLoaderShow();
            //$scope.modelFullDetails = CategoryData.getAllModelFull(MakeNiceName,model_niceName);

            var myData = CategoryData.getAllModelFull(MakeNiceName,model_niceName);

            myData.then(function(result) {
                $scope.miniLoaderHide();

                $scope.modelFullDetails = result['data']['models'];
            });

            $scope.modelYear = {text: "text"};
            $scope.modelStyleID = {text: "text"};
            $ionicPopup.show({
                //title: "Select You'r Model Specifics",
                cssClass: 'settingsPopup',
                templateUrl: 'templates/model.year.trimLevel.html',
                scope: $scope,
                buttons: [
                    {
                        text: 'Ok',
                        type: 'button-balanced',
                        onTap: function(e){
                            var makeName = $scope.globalMakeName;
                            var modelStyleID = $scope.modelStyleID.text;

                            $location.path('/tab/categories-model-showcase/' + makeName + '/' + modelStyleID);
                        }
                    },
                    {
                        text: 'Cancel',
                        type: 'button-assertive'
                    }]
            });
        }
    })


//main showcase page
    .controller('ModelShowcaseCtrl', function($scope, $stateParams, CategoryData) {
        $scope.toggleTitle($stateParams.makeName);
        $scope.modelShowcasePhotos = [];
        var resultSet = CategoryData.getModelFullStyleDetails($stateParams.styleId);

        resultSet.then(function (result) {

            $scope.modelShowCase = result;

            var Arraydata = [result['make']['niceName'],
                result['model']['niceName'],
                result['year']['year']];

            CategoryData.setModelParamdata(Arraydata);

            var filter = ["fq", "rq"]

            var photos = CategoryData.getModelPhotos($stateParams.styleId);

            photos.then(function (result) {
                var resultLength = result.length
                for (var i = 0; i < resultLength; i++) {
                    for (var j = 0; j < result[i].photoSrcs.length; j++) {
                        if (result[i].photoSrcs[j].indexOf("600.jpg") > -1) {
                            $scope.modelShowcasePhotos[i] = "http://media.ed.edmunds-media.com" + result[i].photoSrcs[j];
                        }
                    }
                }
                $scope.slideCounter = 0;
            })

        });
    })

    .controller('ModelArticleCtrl', function($scope, $sanitize, CategoryData) {
        $scope.$on('$ionicView.enter', function() {

            tempParamdata = CategoryData.getModelParamdata();

            if(tempParamdata.length > 0) {
                var articleDataset = CategoryData.getModelArticle(tempParamdata[0], tempParamdata[1], tempParamdata[2]);

                articleDataset.then(function (result) {

                   //console.log('Article ', result.data);

                    $scope.articleData = result.data;
                });
            }
        })
    })

    .controller('ModelReviewCtrl', function($scope, CategoryData) {
        $scope.$on('$ionicView.enter', function() {
            tempParamdata = CategoryData.getModelParamdata();

            if(tempParamdata.length > 0){
                var artcileDataSet = CategoryData.getModelReview(tempParamdata[0], tempParamdata[1], tempParamdata[2]);

                artcileDataSet.then(function (result) {

                    //console.log('Review ', result.data);

                    $scope.reviewData = result.data.editorial;

                });
            }
        })
    })

    .controller('disableTabs', function(testTab){
        //console.log('disable tabs');
        if(testTab == true){
            $scope.project = true;
        }else {
            $scope.project = false;
        }
    })

    .directive('specDropdown', ['$animate', function($document){
         return {
                    link: function(scope, element, attr){
                            element.on('click', function(){
                                    if(element.attr('class').indexOf('clicked') >= 0){
                                        element.removeClass('clicked');
                                    }else{
                                        element.addClass('clicked');
                                    }
                            });
                    }
                }
    }])

    .filter("sanitize", ['$sce', function($sce) {
        return function(htmlCode){
            return angular.element('<div>'+htmlCode+'</div>').text();
        }
    }]);

