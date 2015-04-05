angular.module('espy.services', [])

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

/* TODO: make this a db call*/
.factory('Categories', function() {
    var categories = ['Art', 'Science', 'Games'];

    return {
        all: function() {
            return categories;
        }
    }
})

/* TODO: make this a db call*/
.factory('Exhibits', function() {
	var exhibits = [{
		id: 0,
		name: 'The Application of Critical Thinking in Statistics',
        categories: ['Science', 'Art'],
		rating: 4,
		img: 'img/logo.png'
	}, {
		id: 1,
		name: 'Exhibit 2',
		rating: 3,
        categories: ['Games', 'Art'],
		img: 'img/logo.png'
    }, {
		id: 3,
		name: 'Zombies: Flash as a Medium',
		rating: 3,
        categories: ['Games', 'Science'],
		img: 'img/logo.png'
    }, {
		id: 4,
		name: 'The Application of Critical Thinking in Statistics',
		rating: 3,
		img: 'img/logo.png'
    }, {
		id: 5,
		name: 'Zombies: Flash as a Medium',
		rating: 3,
		img: 'img/logo.png'
    }, {
		id: 6,
		name: 'Zombies: Flash as a Medium',
		rating: 3,
		img: 'img/logo.png'
    }, {
		id: 7,
		name: 'The Application of Critical Thinking in Statistics',
		rating: 3,
		img: 'img/logo.png'
    }, {
		id: 8,
		name: 'Zombies: Flash as a Medium',
		rating: 3,
		img: 'img/logo.png'
	}];

	return {
		all: function() {
			return exhibits;
		},
        
        get: function(exhibitId) {
            for(var i in exhibits) {
                if (exhibits[i].id === parseInt(exhibitId)) {
                    return exhibits[i];
                }
            }
            return null;
        }
	};
})

/* TODO: remove, using as example for now */
.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlin',
    lastText: 'Did you get the ice cream?',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
