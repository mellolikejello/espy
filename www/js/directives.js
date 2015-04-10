angular.module('espy.directives', [])

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

.directive('categorySelector', function(Exhibits) {
	return {
		restrict: 'A',

		link: function(scope, element, attrs) {
			var category = element.textContent;
			scope.categoryClick = function(e, category) {
				debugger;
				// add list to scope
				Exhibits.getCategoryList(category);
			};
    	element.bind('click', scope.categoryClick);
		}
	}
})

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