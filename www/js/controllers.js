angular.module('espy.controllers', [])

.controller('HomeCtrl', function($scope, Exhibits, Categories) {
	$scope.exhibits = Exhibits.all();
    $scope.categories = Categories.all();
    $scope.saveRatingToServer = function(rating) {
      /* TODO - add server call, update rating */
      console.log('Rating selected - ' + rating);
    };
})

.controller('SearchCtrl', function($scope, Categories) {
    $scope.categories = Categories.all();
})

.controller('MapCtrl', function($scope) {})

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
