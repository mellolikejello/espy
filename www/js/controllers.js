angular.module('espy.controllers', [])

.controller('HomeCtrl', function($scope, Exhibits, Categories) {
	$scope.exhibits = Exhibits.all();
    $scope.categories = Categories.all();
    $scope.saveRatingToServer = function(rating) {
      /* TODO - add server call, update rating */
      console.log('Rating selected - ' + rating);
    };
})

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

/* TODO: remove, using as example for now */
.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

/* TODO: remove, using as example for now */
.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('ExhibitDetailCtrl', function($scope, $stateParams, Exhibits) {
  $scope.exhibit = Exhibits.get($stateParams.exhibitId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
