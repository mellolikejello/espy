angular.module('espy.services', ['ngResource'])

 .factory('Database', function ($resource) {
		 return $resource('http://ionic-directory.herokuapp.com/employees/:employeeId/:data');
 })

// TODO: replace all app.* This data needs to be sent to this service
.factory('BeaconService', function() {
	// Question - this was outside of your app to begin with. Would it be better to store it oustide of this service?
	var BEACONS = {};
	// Timer that displays list of beacons.
	var updateTimer = null;
	// Custom timer to get users location
	var locationTimer = null;	

	return {
		init: function($window) {
			console.log('initializing beacons');

			if(typeof EstimoteBeacons != 'undefined') {
				// Question - does this need to be added to window for evothings, or should we just reference it within this service?
				// This may need to be done in the main app.js
				// Specify a shortcut for the location manager holding the iBeacon functions.
				$window.estimote = EstimoteBeacons;
				this.startScan();
			} else {
				console.log('estimote plugin not detected');
			}

			return;
		},

		startScan: function() {
			function onBeaconsRanged(beaconInfo)
				{
					//console.log('onBeaconsRanged: ' + JSON.stringify(beaconInfo))
					for (var i in beaconInfo.beacons)
					{
						// Insert beacon into table of found beacons.
						var beacon = beaconInfo.beacons[i];
						beacon.timeStamp = Date.now();
						var key = beacon.major + ":" + beacon.minor;
						BEACONS[key] = beacon;
					}
				}
			function onError(errorMessage)
			{
				console.log('Ranging beacons did fail: ' + errorMessage);
			}

			// Request permission from user to access location info.
			// This is needed on iOS 8.
			estimote.requestAlwaysAuthorization();

			// Start ranging beacons.
			estimote.startRangingBeaconsInRegion(
				{}, // Empty region matches all beacons
						// with the Estimote factory set UUID.
				onBeaconsRanged,
				onError);

		},

		getLocation: function()
		{
			var timeNow = Date.now();

			var nearestBeacon;
			var secondNearestBeacon;
			var thirdNearestBeacon;

			// Update beacon list.
			$.each(BEACONS, function(key, beacon)
			{
				// Only show beacons that are updated during the last 20 seconds.
				if (beacon.timeStamp + 20000 > timeNow)
				{
					// Hardcode x and y values for testing
					if(key == "12350:52257")
					{
						//Window Beacon
						// TODO - figure out where getDistance should live. This service and grab data from map service? Vice versa? A separate service or something?
						beacon.x = app.main.getDistance(43.084678, app.main.orginLong, 43.084678, -77.679919, 'M');
						beacon.y = app.main.getDistance(app.main.originLat, -77.679919, 43.084678, -77.679919, 'M');

						console.log("Window beacon");
						console.log(beacon.x);
						console.log(beacon.y);
					}
					if(key == "56181:59165")
					{
						//Wall Beacon
						beacon.x = app.main.getDistance(43.084589, app.main.orginLong, 43.084589, -77.679931, 'M');
						beacon.y = app.main.getDistance(app.main.originLat, -77.679931, 43.084589, -77.679931, 'M');

						console.log("Wall beacon");
						console.log(beacon.x);
						console.log(beacon.y);
					}
					if(key == "41988:60931")
					{
						//Railing beacon
						beacon.x = app.main.getDistance(43.084642, app.main.orginLong, 43.084642, -77.680023, 'M');
						beacon.y = app.main.getDistance(app.main.originLat, -77.680023, 43.084642, -77.680023, 'M');

						console.log("Railing beacon");
						console.log(beacon.x);
						console.log(beacon.y);
					}

					// Set distance, color, and id
					beacon.id = key;
					//beacon.distance = app.utils.getDistance(beacon);
					if(beacon.color == undefined)
					{
						beacon.color = app.utils.getColor(beacon);
					}

					//Set the closest and second closest beacons
					if(nearestBeacon == undefined)
					{
						nearestBeacon = beacon;
					}
					else if(beacon.distance < nearestBeacon.distance)
					{
						thirdNearestBeacon = secondNearestBeacon;
						secondNearestBeacon = nearestBeacon;
						nearestBeacon = beacon;
					}
					else if(secondNearestBeacon == undefined)
					{
						secondNearestBeacon = beacon;
					}
					else if(beacon.distance < secondNearestBeacon.distance)
					{
						thirdNearestBeacon = secondNearestBeacon;
						secondNearestBeacon = beacon;
					}
					else if(thirdNearestBeacon == undefined)
					{
						thirdNearestBeacon = beacon;
					}
					else if(beacon.distance < thirdNearestBeacon.distance)
					{
						thirdNearestBeacon = beacon;
					}
				}
			});

			// Check that 3 beacons are found
			if(nearestBeacon == undefined || secondNearestBeacon == undefined || thirdNearestBeacon == undefined){
				console.log("not all beacons defined");
			}
			else{
				return(this.calculateLocation(nearestBeacon, secondNearestBeacon, thirdNearestBeacon));
			}
		},
		sqr: function(a) {
			return Math.pow(a, 2);
		},
		calculateLocation: function(a, b, c){

			var xa = a.x;
			var ya = a.y;
			var xb = b.x;
			var yb = b.y;
			var xc = c.x;
			var yc = c.y;
			var ra = a.distance * 3;
			var rb = b.distance * 3;
			var rc = c.distance * 3;

			var j, k, x, y;

			k = (this.sqr(xa) + this.sqr(ya) - this.sqr(xb) - this.sqr(yb) - this.sqr(ra) + this.sqr(rb)) / (2 * (ya - yb)) - (this.sqr(xa) + this.sqr(ya) - this.sqr(xc) - this.sqr(yc) - this.sqr(ra) + this.sqr(rc)) / (2 * (ya - yc));
			j = (xc - xa) / (ya - yc) - (xb - xa) / (ya - yb);
			x = k / j;
			y = ((xb - xa) / (ya - yb)) * x + (this.sqr(xa) + this.sqr(ya) - this.sqr(xb) - this.sqr(yb) - this.sqr(ra) + this.sqr(rb)) / (2 * (ya - yb));

			var pos = {};
			pos.x = x;
			pos.y = y;

			return pos;
	}
	}
})

.factory('MapService', function() {
	// TODO: decide which variables are needed for MapService
	// and which should be specific to each function
  var WIDHT = undefined;
  var HEIGHT = undefined;

  var dt = 1/60.0;
  var canvas = undefined;
  var ctx = undefined;

  var canvasWidth = undefined;
  var canvasHeight = undefined;

  var drawLib = undefined;
  var user = undefined;
  var userCollider = undefined;

  var MapImg = undefined;
  var golFirst = undefined;

  var userLong = undefined;
  var useLat = undefined;
  var userX = undefined;
  var userY = undefined;
  var userColRad = undefined;

  var exhibits = [];
  var exColliders = [];
	var exLong = [];
	var exLat = [];
	var exName = [];
	var exRad = [];

	var beacons = [];
	var beacLon = [];
	var beacLat = [];
	var beacID = [];
	var beacFloor = [];

  var panSides =  undefined;
  var panTopBot =  undefined;

  var angle = undefined;
  var orginLong = undefined;
  var originLat = undefined;

  var zoomtick = undefined;

  var zoomLevel = undefined;
  var floor = undefined;
  var building = undefined;

  var panspeed = undefined;

  var zoomH = undefined;
  var zoomW = undefined;

	return {
		init: function() {
			console.log('init maps');
			// NOTE: dynamic CSS changes and updates should be made in directives.js
			// touch event responses might also work best in the directives file

			// set up necessary variables

			// initiliaze exhibits and colliders

			// init user location

			return;
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
		exhibitors: ['Rachael Stroebel', 'Kat Pillman'],
		rating: 4,
		img: 'img/logo.png',
        description: 'This page will display lots of information.'
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
        },

        // n - number of top exhibits to return
        // TODO: complete
        getTopRated: function(n) {
            return null;
        },

        // n - number of top exhibits to return
        // TODO: complete
        getMostPopular: function(n) {
            return null;
        },

				getCategoryList: function(category) {
					var categoryList = [];
					for(var exbIndex in exhibits) {
						for(var catIndex in exhibits[exbIndex].categories){
							if(exhibits[exbIndex].categories[catIndex] == category) {
								 categoryList.push(exhibits[exbIndex]);
							}
						}
					}
					console.log('exhibits in category: ' + categoryList.length);
					return categoryList;
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
