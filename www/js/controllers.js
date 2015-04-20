angular.module('espy.controllers', [])

.controller('SignInCtrl', function($scope, $state) {
	$scope.signIn = function() {
		console.log('Sign-In');
		$state.go('tab.home');
	  };
})

.controller('HomeCtrl', function($scope, Exhibits, Categories) {
    $scope.categories = Categories.all();
    $scope.saveRatingToServer = function(rating) {
      /* TODO - add server call, update rating */
      console.log('Rating selected - ' + rating);
    };

//	if exhibit list hasn't been retrieved from db
	if(! Exhibits.isSynced()) {
		var dataPromise = Exhibits.all();
		// this is only run after $http completes
		dataPromise.then(function(result) {
		   $scope.exhibits = result;
		});
	} else {
		$scope.exhibits = Exhibits.all();
	}
})

// TODO: remove unneeded params
.controller('SearchCtrl', function($scope, $stateParams, $location, $state, Categories, Exhibits) {
	var category = $stateParams.category;
	$scope.categories = Categories.all();
//	$location.search('category', null);
//	// TODO: remove query string!!
//	if(category != null) {
////		$state.go('tab.category', {name: category});
//		delete $location.$$search.category;
//		$location.$$compose();
//		$state.go('tab.category', {name: category});
//	}
})

.controller('CategoryCtrl', function($scope, $stateParams, Exhibits) {
	// get current category
	$scope.category = $stateParams.category;
	$scope.exhibits = Exhibits.getCategoryList($stateParams.category);
	//TODO: Database.query();
//	$scope.employees = Employees.query();
})

.controller('MapCtrl', function($scope, MapService) {
	// init maps?
})

.controller('QueueCtrl', function($scope) {})

.controller('ExhibitDetailCtrl', function($scope, $stateParams, Exhibits) {
  $scope.exhibit = Exhibits.get($stateParams.exhibitId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
