angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, Exhibits) {
	$scope.exhibits = Exhibits.all();
})

.controller('SearchCtrl', function($scope) {})

.controller('MapCtrl', function($scope) {})

.controller('QueueCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
