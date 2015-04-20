angular.module('espy.services', ['ngResource'])

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

.factory('Categories', function() {
    var categories = ['Art', 'Business', 'Communication', 'Community',
		'Dance', 'Design', 'Energy', 'Engineering', 'Environment', 'Gaming',
		'Global', 'Health', 'Music', 'Senior Projects', 'Science', 'Software',
		'Student Organizations', 'Sustainability', 'Technology', 'Photography',
		'Math', 'Sports', 'Multidisciplinary', 'STEM', 'Entrepreneurship'];

	return {
        all: function() {
            return categories;
        }
    }
})

.factory('Exhibits', function($http) {
  var exhibits = [];
  var synced = false;
//  $http.get('https://imagine-rit-espy.herokuapp.com/api/exhibits').
//	success(function(data, status, headers, config) {
//		// this callback will be called asynchronously
//		// when the response is available
//		exhibits = data;
//		synced = true;
//		console.log('Exhibits found: ' + data.length);
//	}).
//	error(function(data, status, headers, config) {
//		// called asynchronously if an error occurs
//		// or server returns response with an error status.
//		console.log('error getting exhibit data');
//	});
//	var exhibits = [{
//		id: 0,
//		name: 'The Application of Critical Thinking in Statistics',
//    categories: ['Science', 'Art'],
//		exhibitors: ['Rachael Stroebel', 'Kat Pillman'],
//		rating: 4,
//		img: 'img/logo.png',
//        description: 'This page will display lots of information.'
//	}, {
//		id: 1,
//		name: 'Exhibit 2',
//		rating: 3,
//        categories: ['Games', 'Art'],
//		img: 'img/logo.png'
//    }, {
//		id: 3,
//		name: 'Zombies: Flash as a Medium',
//		rating: 3,
//        categories: ['Games', 'Science'],
//		img: 'img/logo.png'
//    }, {
//		id: 4,
//		name: 'The Application of Critical Thinking in Statistics',
//		rating: 3,
//		img: 'img/logo.png'
//    }, {
//		id: 5,
//		name: 'Zombies: Flash as a Medium',
//		rating: 3,
//		img: 'img/logo.png'
//    }, {
//		id: 6,
//		name: 'Zombies: Flash as a Medium',
//		rating: 3,
//		img: 'img/logo.png'
//    }, {
//		id: 7,
//		name: 'The Application of Critical Thinking in Statistics',
//		rating: 3,
//		img: 'img/logo.png'
//    }, {
//		id: 8,
//		name: 'Zombies: Flash as a Medium',
//		rating: 3,
//		img: 'img/logo.png'
//	}];

	return {
		all: function() {
		  if(!synced) {
			return $http.get("https://imagine-rit-espy.herokuapp.com/api/exhibits")
			  	.then(function(result){
			  		synced = true;
			  		exhibits = result.data;
			  		console.log('exhibits loaded: ' + exhibits.length);
			  		return exhibits;
		  		});
		  } else {
			return exhibits;
		  }
		},

	  	isSynced: function() {
		  return synced;
		},

        get: function(exhibitId) {
            for(var i in exhibits) {
                if (exhibits[i].code === exhibitId) {
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
				for(var catIndex in exhibits[exbIndex].tags){
					if(exhibits[exbIndex].tags[catIndex] == category) {
						 categoryList.push(exhibits[exbIndex]);
					}
				}
			}
			console.log('exhibits in category: ' + categoryList.length);
			return categoryList;
		}
	};
});
