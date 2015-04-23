angular.module('espy.controllers', [])

.controller('SignInCtrl', function($scope, $state, Categories) {
	$scope.categories = Categories.all();
	$scope.signIn = function() {
		console.log('Sign-In');
		$state.go('tab.home');
	};
	$scope.selectBox = function() {
		angular.element.addClass('select-box-selected');
	};
})

.controller('HomeCtrl', function($scope, $state, Exhibits, Categories,setStorage,getStorage,UtilService) {
    $scope.categories = Categories.all();
    $scope.saveRatingToServer = function(rating) {
      /* TODO - add server call, update rating */
      console.log('Rating selected - ' + rating);
    };
	$scope.viewExhibit = function(id) {
		$state.go('tab.home-exhibit', {exhibitId: id});
	};

	$scope.search = function(element, searchTerm) {
		$state.go('tab.home-search', {term: searchTerm});
	}
	console.log(UtilService.addRec());
//	if exhibit list hasn't been retrieved from db
	if(! Exhibits.isSynced()) {
		var dataPromise = Exhibits.all();
		// this is only run after $http completes
		dataPromise.then(function(result) {
		   
		   setStorage.exhibits(result);
		});

	} 
		$scope.exhibits = getStorage.exhibits();
		$scope.$on('$ionicView.enter', function () { 
		   var reco = UtilService.addRec();
		   $scope.exhibits = reco;
	});
	
})

.controller('SearchCtrl', function($scope, $stateParams, $state, Categories, Exhibits) {
	var category = $stateParams.category;
	$scope.categories = Categories.all();
	$scope.search = function(element, searchTerm) {
		$state.go('tab.search-results', {term: searchTerm});
	}
})

.controller('HomeCategoryCtrl', function($scope, $state, $stateParams, Exhibits) {
	// get current category
	$scope.title = $stateParams.category;
	$scope.exhibits = Exhibits.getCategoryList($stateParams.category);
	$scope.viewExhibit = function(id) {
		$state.go('tab.home-exhibit', {exhibitId: id});
	};
})

.controller('HomeSearchCtrl', function($scope, $state, $stateParams, Exhibits) {
	$scope.title = $stateParams.term;
	$scope.exhibits = Exhibits.search($stateParams.term);
	$scope.viewExhibit = function(id) {
		$state.go('tab.home-exhibit', {exhibitId: id});
	};
})

.controller('CategoryCtrl', function($scope, $state, $stateParams, Exhibits) {
	// get current category
	console.log('category control');
	$scope.title = $stateParams.category;
	$scope.exhibits = Exhibits.getCategoryList($stateParams.category);
	$scope.viewExhibit = function(id) {
		$state.go('tab.exhibit-detail', {exhibitId: id});
	};
})

.controller('SearchResultCtrl', function($scope, $state, $stateParams, Exhibits) {
	$scope.title = $stateParams.term;
	$scope.exhibits = Exhibits.search($stateParams.term);
	$scope.viewExhibit = function(id) {
		$state.go('tab.exhibit-detail', {exhibitId: id});
	};
})

.controller('MapCtrl', function($scope, MapService) {
	// init maps?
})

.controller('QueueCtrl', function($scope, $state,$localstorage,getStorage,$window,$timeout) {
	
	//TODO set this to a global array?? that updates everytime a queue is added
	$scope.viewExhibit = function(id) {
		$state.go('tab.queue-exhibit', {exhibitId: id});
	};
	//call this to add the queued array to the local storage
		// do this everytime a queue is added

   $scope.$on('$ionicView.enter', function () { 
    var queue = getStorage.queue();
	$scope.exhibits = queue;
	});
	

})


.controller('ExhibitDetailCtrl', function($scope, $stateParams, Exhibits, $window) {
  $scope.exhibit = Exhibits.get($stateParams.exhibitId);
	$scope.zoneColor = Exhibits.getZoneColor($stateParams.exhibitId);
//	debugger;
//	$document.querySelector(".bar-positive");
})

.controller('QueueDetailCtrl', function($scope, $stateParams, Exhibits, $window) {
  $scope.exhibit = Exhibits.get($stateParams.exhibitId);
	$scope.zoneColor = Exhibits.getZoneColor($stateParams.exhibitId);
//	debugger;
//	$document.querySelector(".bar-positive");
})

.controller('AccountCtrl', function($scope, $state) {
	// make this a db call
	var name = "bob";
	var role = "College Student";
	var interests = ['Science', 'Art', 'Dance'];
	$scope.nickname = name;
	$scope.userRole = role;
	$scope.interests = interests;
  $scope.viewStatement = function() {
		$state.go('tab.privacy');
	}
})

.controller('PrivacyCtrl', function($scope) { });
