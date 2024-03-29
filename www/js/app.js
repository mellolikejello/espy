// Espy App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('espy', ['ionic', 'ngCordova', 'espy.controllers', 'espy.services', 'espy.directives'])

.run(function($cordovaSplashscreen) {
    setTimeout(function() {
        $cordovaSplashscreen.hide()
    }, 5000);
})

.run(function($ionicPlatform, $state, UtilService, User, $window) {
    $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
    }

		// Redirect console.log to Evothings Workbench.
		if (window.hyper && window.hyper.log) {
			console.log = hyper.log;
		}

		//TODO: remove for final copy
		// debugging
		$window.appLogout = function() {
			var user = $window.localStorage['user'];
			console.log('logging out: ' + user);
			$window.localStorage['user'] = null;
			$window.localStorage['queue'] = null;
			$state.go('signin');
		};

		// TODODODO: remove for final presentation
		// figure out why signin isn't working on mobile
//		$window.appLogout();

//		if(User.isLoggedIn()) {
////		go to the home screen instead of login
//			$state.go('tab.home');
//		}
		$state.go('signin');

		setInterval(UtilService.updatePreferences, 3000);
		})
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
	.state('signin', {
      url: "/signin",
		cache: false,
      templateUrl: "templates/signin.html",
      controller: 'SignInCtrl'
    })

    // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.home', {
    url: '/home',
    views: {
        'tab-home': {
            templateUrl: 'templates/tab-home.html',
            controller: 'HomeCtrl'
      }
    }
    })

	.state('tab.home-exhibit', {
      url: '/home/:exhibitId',
      views: {
        'tab-home': {
          templateUrl: 'templates/exhibit-detail.html',
          controller: 'ExhibitDetailCtrl'
        }
      }
    })

	.state('tab.home-category', {
	  url: '/home/category/:category',
	  views: {
		'tab-home': {
		  templateUrl: 'templates/search-detail.html',
		  controller: 'HomeCategoryCtrl'
		}
	  }
	})

	.state('tab.home-search', {
	  url: '/home/search/:term',
	  views: {
		'tab-home': {
		  templateUrl: 'templates/search-detail.html',
		  controller: 'HomeSearchCtrl'
		}
	  }
	})

  .state('tab.search', {
    url: '/search',
    views: {
      'tab-search': {
        templateUrl: 'templates/tab-search.html',
        controller: 'SearchCtrl'
      }
    }
  })

	.state('tab.category', {
    url: '/search/:category',
    views: {
      'tab-search': {
        templateUrl: 'templates/search-detail.html',
        controller: 'CategoryCtrl'
      }
    }
  })

	.state('tab.search-results', {
    url: '/search/results/:term',
    views: {
      'tab-search': {
        templateUrl: 'templates/search-detail.html',
        controller: 'SearchResultCtrl'
      }
    }
  })

  .state('tab.map', {
    url: '/map',
    views: {
      'tab-map': {
        templateUrl: 'templates/tab-map.html',
        controller: 'MapCtrl'
      }
    }
  })

  .state('tab.queue', {
    url: '/queue',
    views: {
      'tab-queue': {
        templateUrl: 'templates/tab-queue.html',
        controller: 'QueueCtrl'
      }
    }
  })

  .state('tab.queue-exhibit', {
      url: '/queue/:exhibitId',
      views: {
        'tab-queue': {
          templateUrl: 'templates/exhibit-detail.html',
          controller: 'ExhibitDetailCtrl'
        }
      }
    })

    .state('tab.exhibit-detail', {
      url: '/search/exhibits/:exhibitId',
      views: {
        'tab-search': {
          templateUrl: 'templates/exhibit-detail.html',
          controller: 'ExhibitDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
	cache: false,
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

	.state('tab.privacy', {
    url: '/account/privacy',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-privacy.html',
        controller: 'PrivacyCtrl'
      }
    }
  })

  .state('tab.editPrefs', {
    url: '/account/editPrefs',
	cache: false,
    views: {
      'tab-account': {
        templateUrl: 'templates/edit-preferences.html',
        controller: 'PrefsCtrl'
      }
    }
  });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/signin');

	$ionicConfigProvider.backButton.previousTitleText(false).text('');
	$ionicConfigProvider.tabs.position("bottom");
});
