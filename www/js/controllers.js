angular.module('espy.controllers', [])

.controller('SignInCtrl', function($scope, $state, Categories, User) {
	var pref = [];
	var group = [];
	var nums=[];
	var username;

	if(User.isLoggedIn()) {
		$state.go('tab.home');
	}

	$scope.params = {};

	$scope.categories = Categories.all();
	$scope.signIn = function() {
		$state.go('tab.home');
		username = $scope.params.myParameter;
		// 							 username, role, interests
		User.init(username, group[0], pref);

//		setStorage.user(user);

	};
	$scope.check = false;
	$scope.selectBox = function() {
    $scope.check = $scope.check === false ? true: false;
	};

	$scope.addPref= function(cat){
		if(pref.indexOf(cat) >-1){
			pref.splice(pref.indexOf(cat),1);
		}
		else{
		pref.push(cat);
		}
		//$scope.selectBox();
	}
	$scope.wact = function(w){
		if(pref.indexOf(w) >-1 ){
			return true;
		}
		else{return false};
	}
	$scope.act = function(i){
		if(i -1 == nums[0]){
			return true;
		}
		else{return false};
		console.log(i);
	}
	$scope.addGroup= function(g,k){
		//var pref = [];
		k = k-1;
		console.log(k);
		group.shift();
		group.push(g);
		nums.shift();
		nums.push(k);
		console.log(group);
	}

})

.controller('HomeCtrl', function($scope, $state, $document, Exhibits, Categories,setStorage,getStorage,UtilService) {
    $scope.categories = Categories.all();
    $scope.saveRatingToServer = function(rating) {
      /* TODO - add server call, update rating */
//      console.log('Rating selected - ' + rating);
    };
	$scope.viewExhibit = function(id) {
		$state.go('tab.home-exhibit', {exhibitId: id});
	};

	$scope.search = function(element, searchTerm) {
		$state.go('tab.home-search', {term: searchTerm});
	}

//	if exhibit list hasn't been retrieved from db
	if(! Exhibits.isSynced()) {
		var dataPromise = Exhibits.all();
		// this is only run after $http completes
		dataPromise.then(function(result) {
		   setStorage.exhibits(result);
		   console.log(result);
		   setStorage.exhibits(UtilService.addRec());
		   console.log(UtilService.addRec());
		});
	} 
	//console.log(UtilService.setDistances());
		//setStorage.exhibits(UtilService.setDistances());
		//$scope.exhibits = getStorage.exhibits();
	$scope.$on('$ionicView.enter', function () { 
		   var reco = UtilService.addRec();
		   $scope.exhibits = reco;
		   

	});

	var header = $document[0].querySelector("ion-header-bar");
	header.style['background-color'] = '#3DB4C8';
	header.style['border-color'] = '#3DB4C8';
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

.controller('CategoryCtrl', function($scope, $state, $stateParams, Exhibits, $document) {
	// get current category
	$scope.title = $stateParams.category;
	$scope.exhibits = Exhibits.getCategoryList($stateParams.category);
	$scope.viewExhibit = function(id) {
		$state.go('tab.exhibit-detail', {exhibitId: id});
	};
	var header = $document[0].querySelector("ion-header-bar");
	header.style['background-color'] = '#3DB4C8';
	header.style['border-color'] = '#3DB4C8';
})

.controller('SearchResultCtrl', function($scope, $state, $stateParams, Exhibits) {
	$scope.title = $stateParams.term;
	$scope.exhibits = Exhibits.search($stateParams.term);
	$scope.viewExhibit = function(id) {
		$state.go('tab.exhibit-detail', {exhibitId: id});
	};
})

.controller('MapCtrl', function($scope) {})

.controller('QueueCtrl', function($scope, $state,$stateParams,$localstorage,getStorage,$window,$document,Exhibits) {
	
	//TODO set this to a global array?? that updates everytime a queue is added
	$scope.viewExhibit = function(id) {
		$state.go('tab.queue-exhibit', {exhibitId: id});
	};
	//call this to add the queued array to the local storage
		// do this everytime a queue is added
	

   $scope.$on('$ionicView.enter', function () {
	    var queue = getStorage.queue();
		$scope.exhibits = queue;
		var header = $document[0].querySelector("ion-header-bar");
		header.style['background-color'] = '#3DB4C8';
		header.style['border-color'] = '#3DB4C8';

	});
	
	
})


.controller('ExhibitDetailCtrl', function($scope, $stateParams, Exhibits, $window, $document,getStorage,setStorage ){
  $scope.exhibit = Exhibits.get($stateParams.exhibitId);
  var zoneColor = Exhibits.getZoneColor($stateParams.exhibitId);
	$scope.zoneColor = zoneColor;
	var header = $document[0].querySelector("ion-header-bar");
	header.style['background-color'] = zoneColor;
	header.style['border-color'] = zoneColor;
	$scope.share = function() {
		var info = $document[0].querySelector(".info-box");
		if(info.style["display"] == "block") {
			info.style["display"] = "none";
		} else {
			info.style["display"] = "block";
		}
	}
	var user = getStorage.user();
	var pref = user.interests;
	
	
	$scope.addPref= function(cat){
		//var pref = [];
		if(pref.indexOf(cat) >-1){
			pref.splice(pref.indexOf(cat),1);
			
		}
		else{
		pref.push(cat);
		}
		var updatedUser={
			  name: user.name,
			  role: user.role,
			  interests: pref,
			  location: user.location,
			  visited: user.visited,
			  queue: [],
			  id: user.id,
			  r: user.r,
			  x:user.x,
			  y:user.y
			}
		setStorage.user(updatedUser);
		//$scope.selectBox();
		
	}
	$scope.wact = function(w){
		if(pref.indexOf(w) >-1 ){
			return true;
		}
		else{return false};
	}
	
})

.controller('QueueDetailCtrl', function($scope, $stateParams, Exhibits, $window,$document,getStorage,setStorage) {
  $scope.exhibit = Exhibits.get($stateParams.exhibitId);
	var zoneColor = Exhibits.getZoneColor($stateParams.exhibitId);
	$scope.zoneColor = zoneColor;
	var header = $document[0].querySelector("ion-header-bar");
	header.style['background-color'] = zoneColor;
	header.style['border-color'] = zoneColor;
	$scope.share = function() {
		var info = $document[0].querySelector(".info-box");
		if(info.style["display"] == "block") {
			info.style["display"] = "none";
		} else {
			info.style["display"] = "block";
		}
	}
	var user = getStorage.user();
	var pref = user.interests;
	
	
	$scope.addPref= function(cat){
		//var pref = [];
		if(pref.indexOf(cat) >-1){
			pref.splice(pref.indexOf(cat),1);
			
		}
		else{
		pref.push(cat);
		}
		var updatedUser={
			  name: user.name,
			  role: user.role,
			  interests: pref,
			  location: user.location,
			  visited: user.visited,
			  queue: [],
			  id: user.id,
			  r: user.r,
			  x:user.x,
			  y:user.y
			}
		setStorage.user(updatedUser);
		//$scope.selectBox();
		
	}
	$scope.wact = function(w){
		if(pref.indexOf(w) >-1 ){
			return true;
		}
		else{return false};
	}
})

.controller('AccountCtrl', function($scope, $state, User) {
	$scope.nickname = User.getName();
	$scope.userRole = User.getRole();
	$scope.interests = User.getInterests();
  $scope.viewStatement = function() {
		$state.go('tab.privacy');
	}
})

.controller('PrivacyCtrl', function($scope) { });
