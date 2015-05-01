angular.module('espy.directives', [])

.directive('colorNavBar', function() {
	return {
		restrict: 'A',
		templateURL: '/templates/search-bar.html',
		link: function(scope, element, attrs) {
			console.log(scope.zoneColor);
			console.log(scope.categories);
		}
	}
})

.directive('searchBar', function() {
    return {
        restrict: 'A',
        templateUrl: '/templates/search-bar.html',
				link: function(scope, element, attrs) {
					element.bind("keydown keypress", function(event) {
						if(event.which === 13) {
							scope.$apply(function() {
								scope.$eval(scope.search, scope.query);
							})
							event.preventDefault();
						}
				});
    	}
		}
})

.directive('categoryTile', function() {
	return {
		restrict: 'A',
		templateUrl: '/templates/category-tile.html',
		link: function(scope, element, attrs) {
			var category = scope.category;
			var iconClass = 'icon-tags-';
			switch(category) {
				case 'Art':
					iconClass = iconClass.concat('art');
					break;
				case 'Business':
					iconClass = iconClass.concat('business');
					break;
				case 'Communication':
					iconClass = iconClass.concat('communication');
					break;
				case 'Community':
					iconClass = iconClass.concat('community');
					break;
				case 'Dance':
					iconClass = iconClass.concat('dance');
					break;
				case 'Design':
					iconClass = iconClass.concat('design');
					break;
				case 'Energy':
					iconClass = iconClass.concat('energy');
					break;
				case 'Engineering':
					iconClass = iconClass.concat('engineering');
					break;
				case 'Entrepreneurship':
					iconClass = iconClass.concat('entrepreneurship');
					break;
				case 'Environment':
					iconClass = iconClass.concat('environment');
					break;
				case 'Food':
					iconClass = iconClass.concat('food');
					break;
				case 'Gaming':
					iconClass = iconClass.concat('gaming');
					break;
				case 'Global':
					iconClass = iconClass.concat('global');
					break;
				case 'Health':
					iconClass = iconClass.concat('health');
					break;
				case 'Math':
					iconClass = iconClass.concat('math');
					break;
				case 'Multidisciplinary':
					iconClass = iconClass.concat('multidisciplinary');
					break;
				case 'Music':
					iconClass = iconClass.concat('music');
					break;
				case 'Photography':
					iconClass = iconClass.concat('photography');
					break;
				case 'Science':
					iconClass = iconClass.concat('science');
					break;
				case 'Senior Projects':
					iconClass = iconClass.concat('seniorprojects');
					break;
				case 'STEM':
					iconClass = iconClass.concat('stem');
					break;
				case 'Student Organizations':
					iconClass = iconClass.concat('studentorganizations');
					break;
				case 'Student Organization':
					iconClass = iconClass.concat('studentorganizations');
					break;
				case 'Sustainability':
					iconClass = iconClass.concat('sustainability');
					break;
				case 'Technology':
					iconClass = iconClass.concat('technology');
					break;
				case 'Software':
					iconClass = iconClass.concat('software');
					break;
				case 'Sports':
					iconClass = iconClass.concat('sports');
					break;
			}
			var iconElement = element[0].querySelector('i');
			iconElement.className += ' ' + iconClass;
		}
	}
})

.directive('categoryBox', function() {
	return {
		restrict: 'A',
		templateUrl: '/templates/category-box.html',
		link: function(scope, element, attrs) {
			var category = scope.category;
			var iconClass = 'icon-tags-';
			switch(category) {
				case 'Art':
					iconClass = iconClass.concat('art');
					break;
				case 'Business':
					iconClass = iconClass.concat('business');
					break;
				case 'Communication':
					iconClass = iconClass.concat('communication');
					break;
				case 'Community':
					iconClass = iconClass.concat('community');
					break;
				case 'Dance':
					iconClass = iconClass.concat('dance');
					break;
				case 'Design':
					iconClass = iconClass.concat('design');
					break;
				case 'Energy':
					iconClass = iconClass.concat('energy');
					break;
				case 'Engineering':
					iconClass = iconClass.concat('engineering');
					break;
				case 'Entrepreneurship':
					iconClass = iconClass.concat('entrepreneurship');
					break;
				case 'Environment':
					iconClass = iconClass.concat('environment');
					break;
				case 'Food':
					iconClass = iconClass.concat('food');
					break;
				case 'Gaming':
					iconClass = iconClass.concat('gaming');
					break;
				case 'Global':
					iconClass = iconClass.concat('global');
					break;
				case 'Health':
					iconClass = iconClass.concat('health');
					break;
				case 'Math':
					iconClass = iconClass.concat('math');
					break;
				case 'Multidisciplinary':
					iconClass = iconClass.concat('multidisciplinary');
					break;
				case 'Music':
					iconClass = iconClass.concat('music');
					break;
				case 'Photography':
					iconClass = iconClass.concat('photography');
					break;
				case 'Science':
					iconClass = iconClass.concat('science');
					break;
				case 'Senior Projects':
					iconClass = iconClass.concat('seniorprojects');
					break;
				case 'STEM':
					iconClass = iconClass.concat('stem');
					break;
				case 'Student Organizations':
					iconClass = iconClass.concat('studentorganizations');
					break;
				case 'Student Organization':
					iconClass = iconClass.concat('studentorganizations');
					break;
				case 'Sustainability':
					iconClass = iconClass.concat('sustainability');
					break;
				case 'Technology':
					iconClass = iconClass.concat('technology');
					break;
				case 'Software':
					iconClass = iconClass.concat('software');
					break;
				case 'Sports':
					iconClass = iconClass.concat('sports');
					break;
			}
			var iconElement = element[0].querySelector('.icon-box');
			iconElement.className += ' ' + iconClass;
			scope.iconBox = iconClass;
		}
	}
})

.directive('boothBox', function() {
	return {
		restrict: 'A',
		templateUrl: '/templates/booth-box.html',
		link: function(scope, element, attrs) {
			var category = scope.exhibit.tags[0];
			var iconClass = 'icon-tags-';
			switch(category) {
				case 'Art':
					iconClass = iconClass.concat('art');
					break;
				case 'Business':
					iconClass = iconClass.concat('business');
					break;
				case 'Communication':
					iconClass = iconClass.concat('communication');
					break;
				case 'Community':
					iconClass = iconClass.concat('community');
					break;
				case 'Dance':
					iconClass = iconClass.concat('dance');
					break;
				case 'Design':
					iconClass = iconClass.concat('design');
					break;
				case 'Energy':
					iconClass = iconClass.concat('energy');
					break;
				case 'Engineering':
					iconClass = iconClass.concat('engineering');
					break;
				case 'Entrepreneurship':
					iconClass = iconClass.concat('entrepreneurship');
					break;
				case 'Environment':
					iconClass = iconClass.concat('environment');
					break;
				case 'Food':
					iconClass = iconClass.concat('food');
					break;
				case 'Gaming':
					iconClass = iconClass.concat('gaming');
					break;
				case 'Global':
					iconClass = iconClass.concat('global');
					break;
				case 'Health':
					iconClass = iconClass.concat('health');
					break;
				case 'Math':
					iconClass = iconClass.concat('math');
					break;
				case 'Multidisciplinary':
					iconClass = iconClass.concat('multidisciplinary');
					break;
				case 'Music':
					iconClass = iconClass.concat('music');
					break;
				case 'Photography':
					iconClass = iconClass.concat('photography');
					break;
				case 'Science':
					iconClass = iconClass.concat('science');
					break;
				case 'Senior Projects':
					iconClass = iconClass.concat('seniorprojects');
					break;
				case 'STEM':
					iconClass = iconClass.concat('stem');
					break;
				case 'Student Organizations':
					iconClass = iconClass.concat('studentorganizations');
					break;
				case 'Student Organization':
					iconClass = iconClass.concat('studentorganizations');
					break;
				case 'Sustainability':
					iconClass = iconClass.concat('sustainability');
					break;
				case 'Technology':
					iconClass = iconClass.concat('technology');
					break;
				case 'Software':
					iconClass = iconClass.concat('software');
					break;
				case 'Sports':
					iconClass = iconClass.concat('sports');
					break;
				default:
					iconClass = iconClass.concat('multidisciplinary');
					break;
			}
			var iconElement = element[0].querySelector('.booth-box');
			iconElement.className += ' ' + iconClass;
			scope.boothBox = iconClass;
		}
	}
})

.directive('detectGestures', function($ionicGesture) {
  return {
    restrict: 'A',

    link: function(scope, element, attrs) {
      var gestureType = attrs.gestureType;

      switch(gestureType) {
        case 'pinchin':
          $ionicGesture.on('pinchin', scope.reportEvent, element);
          break;
      }

    }
  }
})

.directive('categorySelector', ['$location', function(Exhibits) {
	return {
		restrict: 'A',

		link: function(scope, element, attrs) {
			scope.categoryClick = function(e, category) {
				//TODO: encode category for special characters in URL
				var category = e.target.getAttribute('value');
				location.assign('#/tab/search/' + category);
				// add list to scope
				//Exhibits.getCategoryList(category);
			};
    	element.bind('click', scope.categoryClick);
		}
	}
}])

.directive('mapViewSize', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			scope.viewWidth = element[0].clientWidth;
			scope.viewHeight = element[0].clientHeight;
		}
	}
})

.directive('exbTile', function() {
    return {
        restrict: 'A',
        templateUrl: '/templates/exhibit-tile.html'
    }
})

.directive('exbRating', function () {
    return {
      restrict: 'A',
      template: '<ul class="rating">' +
                  '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
                  '</li>' +
                '</ul>',
      scope: {
        ratingValue: '=',
        max: '=',
        readonly: '@',
        onRatingSelected: '&'
      },

      link: function (scope, elem, attrs) {

        var updateStars = function() {
          scope.stars = [];
          for (var  i = 0; i < scope.max; i++) {
            scope.stars.push({'ion-android-star': i < scope.ratingValue,
                              'ion-android-star-outline': i >= scope.ratingValue});
          }
        };

        scope.toggle = function(index) {
          if (scope.readonly && scope.readonly === 'true') {
            return;
          }
          scope.ratingValue = index + 1;
          scope.onRatingSelected({rating: index + 1});
        };

        scope.$watch('ratingValue', function(oldVal, newVal) {
          if (newVal) {
            updateStars();
          }
        });
      }
    }
})

.directive('exbList', function(){
    return {
        restrict: 'A',
        templateUrl: '/templates/exhibit-list.html'
    }
})

.directive('addQueue', function(User) {
    return {
        restrict: 'A',

        templateUrl: '/templates/queue-button.html',
			link: function(scope, element, attrs) {
					element.bind("click", function() {
						//console.log(attrs.ex.distance);
						console.log('adding to queue: ' + attrs.exhibitId);
						User.addToQueue(attrs.exhibitId);
			});
    	}
		}
})

.directive('removeQueue', function(getStorage,$localstorage,$timeout,$state) {
    return {
        restrict: 'A',

        templateUrl: '/templates/queueremove-button.html',
			link: function(scope, element, attrs) {
					element.bind("click", function() {

					    var currentQueue = (getStorage.queue() == null) ? [] : getStorage.queue();
						var toRemove = attrs.ex;
						console.log(toRemove);
						console.log(currentQueue);
						for(var i = 0; i < currentQueue.length; i++) {
							console.log(currentQueue[i].code);
							    if(currentQueue[i].code == toRemove) {
							        currentQueue.splice(i, 1);

							        break;
							    }
							}

						$localstorage.setObject('queue',currentQueue);
						//$state.go('tab.queue');
						console.log(currentQueue);
						 $timeout( function() {
						    //$window.location.reload(true)

							$state.go('tab.queue');

						   	}, 200);


			});
    	}
		}
})

.directive('queueList', function(){
    return {
        restrict: 'A',
        templateUrl: '/templates/queue-list.html'
    }
})
.directive('queueTile', function(){
    return {
        restrict: 'A',
        templateUrl: '/templates/queue-tile.html'
    }
})

.directive('colorZone', function(){
    return {
        restrict: 'A',
        templateUrl: '',
        link: function(scope, element, attrs) {


			var zone = attrs.ex;
			var color = "#9EA7B3";
			switch(zone) {
				case 'Green Place':
					color = "#4BE530";
					break;
				case 'Business District':
					color = "#3DB549";
					break;
				case 'Field House':
					color = "#3C91E5";
					break;
				case 'Computer Zone':
					color = "#07C2AF";
					break;
				case 'Tech Quarter':
					color = "#3AC7E8";
					break;
				case 'Innovation Center':
					color = "#354AA5";
					break;
				case 'Global Village':
					color = "#EC6A80";
					break;
				case 'Think Tank':
					color = "#D11E1E";
					break;
				case 'Engineering Park':
					color = "#F27935";
					break;
				case 'Info Section':
					color = "#ED9A37";
					break;
				case 'RIT Center':
					color = "#F4C031";
					break;
				case 'Science Center':
					color = "#F7EF4A";
					break;
				case 'Artistic Alley':
					color = "#A053BC";
					break;
			}
			//console.log(color);
			scope.zoneColor = color;

			return scope;
		}
    }
})
