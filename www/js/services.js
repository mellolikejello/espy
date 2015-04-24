angular.module('espy.services', ['ngResource'])

// TODO: replace all app.* This data needs to be sent to this service
.factory('BeaconService', function () {
    // Question - this was outside of your app to begin with. Would it be better to store it oustide of this service?
    var BEACONS = {};
    // Timer that displays list of beacons.
    var updateTimer = null;
    // Custom timer to get users location
    var locationTimer = null;

    return {
        init: function ($window) {
            console.log('initializing beacons');

            if (typeof EstimoteBeacons != 'undefined') {
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

        startScan: function () {
            function onBeaconsRanged(beaconInfo) {
                //console.log('onBeaconsRanged: ' + JSON.stringify(beaconInfo))
                for (var i in beaconInfo.beacons) {
                    // Insert beacon into table of found beacons.
                    var beacon = beaconInfo.beacons[i];
                    beacon.timeStamp = Date.now();
                    var key = beacon.major + ":" + beacon.minor;
                    BEACONS[key] = beacon;
                }
            }
            function onError(errorMessage) {
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

        getLocation: function () {
            var timeNow = Date.now();

            var nearestBeacon;
            var secondNearestBeacon;
            var thirdNearestBeacon;

            // Update beacon list.
            $.each(BEACONS, function (key, beacon) {
                // Only show beacons that are updated during the last 20 seconds.
                if (beacon.timeStamp + 20000 > timeNow) {
                    // Hardcode x and y values for testing
                    if (key == "12350:52257") {
                        //Window Beacon
                        // TODO - figure out where getDistance should live. This service and grab data from map service? Vice versa? A separate service or something?
                        beacon.x = app.main.getDistance(43.084678, app.main.orginLong, 43.084678, -77.679919, 'M');
                        beacon.y = app.main.getDistance(app.main.originLat, -77.679919, 43.084678, -77.679919, 'M');

                        console.log("Window beacon");
                        console.log(beacon.x);
                        console.log(beacon.y);
                    }
                    if (key == "56181:59165") {
                        //Wall Beacon
                        beacon.x = app.main.getDistance(43.084589, app.main.orginLong, 43.084589, -77.679931, 'M');
                        beacon.y = app.main.getDistance(app.main.originLat, -77.679931, 43.084589, -77.679931, 'M');

                        console.log("Wall beacon");
                        console.log(beacon.x);
                        console.log(beacon.y);
                    }
                    if (key == "41988:60931") {
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
                    if (beacon.color == undefined) {
                        beacon.color = app.utils.getColor(beacon);
                    }

                    //Set the closest and second closest beacons
                    if (nearestBeacon == undefined) {
                        nearestBeacon = beacon;
                    }
                    else if (beacon.distance < nearestBeacon.distance) {
                        thirdNearestBeacon = secondNearestBeacon;
                        secondNearestBeacon = nearestBeacon;
                        nearestBeacon = beacon;
                    }
                    else if (secondNearestBeacon == undefined) {
                        secondNearestBeacon = beacon;
                    }
                    else if (beacon.distance < secondNearestBeacon.distance) {
                        thirdNearestBeacon = secondNearestBeacon;
                        secondNearestBeacon = beacon;
                    }
                    else if (thirdNearestBeacon == undefined) {
                        thirdNearestBeacon = beacon;
                    }
                    else if (beacon.distance < thirdNearestBeacon.distance) {
                        thirdNearestBeacon = beacon;
                    }
                }
            });

            // Check that 3 beacons are found
            if (nearestBeacon == undefined || secondNearestBeacon == undefined || thirdNearestBeacon == undefined) {
                console.log("not all beacons defined");
            }
            else {
                return (this.calculateLocation(nearestBeacon, secondNearestBeacon, thirdNearestBeacon));
            }
        },
        sqr: function (a) {
            return Math.pow(a, 2);
        },
        calculateLocation: function (a, b, c) {

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
.factory('UtilService', function (getStorage,setStorage,Categories,GetDistance) {
    // TODO: decide which variables are needed for MapService
    // and which should be specific to each function

    return {
        // Called from app.js every 3 minutes
        // Updates a users preferences based on the exhibits they have been to
        updatePreferences: function () {   // NEED CALL TO GET ALL USERS VISITED EXHIBITS
            var exhibits = getStorage.exhibits();
            var visitedExhibits = []; // TODO: Get users visited exhibits
            var userPreferences = [];
            var tags = Categories.all();
            var requiredVisits = 2;
            for (var i = 0; i < exhibits.length; i++) {
                for (var k = 0; k < exhibits[i].tags.length; k++) {
                    var curTag = exhibits[i].tags[k];
                    n = 0;
                    //console.log(curTag);
                    for (var j = 0; j < visitedExhibits.length; j++) {
                        var vEX = visitedExhibits[j];
                        for (var w = 0; w < vEX.tags.length; w++) {
                            var Vtag = vEX.tags[w];

                            //console.log(Vtag);
                            if (curTag == Vtag) {
                                n++;
                                //console.log(curTag + ": n = " + n);

                            }

                        }
                    }

                    if (n > requiredVisits) {   // TODO: NEED TO UPDATE THE USER PREFERENCES, PROBABLY IN LOCAL STORAGE
                        //console.log("MeetsRec: " +curTag);
                        if (userPrefrences.indexOf(exhibits[i].tags[k]) > -1) {
                            //console.log("already Exist:" + exhibits[i].tags[k]);
                        }
                        else {
                            userPrefrences.push(exhibits[i].tags[k]);

                        }
                    }
                }
                 
            }
            //console.log(n);
            return;
        },

        // Called from HomeController - Gets 10 recommendations
        addRec: function () {
            var exhibits = getStorage.exhibits();
            var userPreferences = []; // TODO: Get user preferences
            var user = {x:100,y:100}; //TODO: Get current user
            var queued = getStorage.queue(); //TODO: Get queued ?
            var rec = []; // our response array
            var recHolder = [];
            for(var i = 0; i < exhibits.length; i++){
                var n = 0;
	
                for(var g = 0; g < exhibits[i].tags.length; g++){
                    for(var j = 0; j < userPreferences.length; j++){
			
                        //add another loop to get tages array
                        if(exhibits[i].tags[g] == userPreferences[j]){
                            n +=50;
                        }
                    }
                }  
                var dist = GetDistance.get(exhibits[i], user);
                n -= Math.floor(dist);
                var updatedDist = dist/5280;
                    updatedDist = updatedDist.toFixed(2);

                for(var k = 0; k < queued.length; k++){
                    if(exhibits[i] == queued[k]){
                        n = -1000;
                    }
                }
                //console.log(exhibits[i].name+":",n);
                var ex = exhibits[i];
              
                    //console.log("yay");
                    recHolder.push({name:ex.name,
                                    x:ex.x,
                                    y:ex.y,
                                    zone:ex.zone,
                                    location:ex.location,
                                    description:ex.description,
                                    tags:ex.tags,
                                    radius:ex.radius,
                                    events:ex.events,
                                    ratings:ex.ratings,
                                    exhibitors:ex.exhibitors,
                                    code:ex.code,
                                    distance:updatedDist,
                                    img:ex.img,
                                    num:n });			
                
                //return rec;
                // console.log(recHolder);

            }
            setStorage.exhibits(recHolder);
            recHolder.sort(function(a,b) { return parseFloat(b.num) - parseFloat(a.num) } );
            for(var t = 0; t < recHolder.length; t++){
                var ex = recHolder[t];
                if(rec.length < 10){
                    rec.push({      name:ex.name,
                                    x:ex.x,
                                    y:ex.y,
                                    zone:ex.zone,
                                    location:ex.location,
                                    description:ex.description,
                                    tags:ex.tags,
                                    radius:ex.radius,
                                    events:ex.events,
                                    ratings:ex.ratings,
                                    exhibitors:ex.exhibitors,
                                    code:ex.code,
                                    img:ex.img,
                                    distance:ex.distance
                                    });       
                }
            }
           // console.log(recHolder);
           // console.log(rec);
           
            return rec;
            
        },

     

}
})

.factory('GetDistance', function () {
    // TODO: decide which variables are needed for MapService
    // and which should be specific to each function

    return {
        get: function (point1,point2) {
            //console.log('getDist');
           
              var xs = 0;
              var ys = 0;
             
              xs = point2.x - point1.x;
              xs = xs * xs;
             
              ys = point2.y - point1.y;
              ys = ys * ys;
             
              return Math.sqrt( xs + ys );
            },

            
       
    }
})

.factory('MapService', function () {
    // TODO: decide which variables are needed for MapService
    // and which should be specific to each function

    return {
        init: function () {
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
.factory('$localstorage', ['$window', function ($window) {
    return {
        set: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
    }
}])

.factory('getStorage', function($localstorage) {
    

    return {
        user: function() {
            
            var user = $localstorage.getObject('user');
            if(user === null){
                console.log('user is null');
            }
            else{
                //var user = JSON.parse(user);
                return user;
            }   
        },
        queue: function(){
            var queued = $localstorage.getObject('queue');
           // console.log(queued);
            var newQ = [];
            if(queued === null){
                console.log('queued is null');
            }
            else{
                for(var i = 0; i < queued.length; i++){
                        var q = queued[i];
                        //console.log(JSON.parse(queued[i]));
                        newQ.push(q);
                    }
                
                return newQ;
             }
        },
        exhibits: function(){
            var exhibits = $localstorage.getObject('exhibits');
            var newEx = [];
            
                for(var k = 0; k < exhibits.length; k++){
                        var ex = exhibits[k];
                        
                        newEx.push(ex);
                    }
            return newEx;
        }
            

    }
})

.factory('setStorage', function($localstorage) {
    

    return {
        user: function(u) {
            $localstorage.setObject('user',u);
          
        },
        
            //console.log(cur);
           queue: function(cur){
          
            var curEx  = JSON.parse(cur);
            var queue = $localstorage.getObject('queue');
               
            
                console.log(curEx);
                console.log(queue);
                if(this.objIsinArray(curEx,queue)){
                    console.log('exist');
                }
                else{
                    queue.push(curEx);
                    console.log('dont exist');
                    $localstorage.setObject('queue',queue);
                }
               
                
             
        },
        objIsinArray: function (obj,list){
                var i;
                for (i = 0; i < list.length; i++) {
                    if (list[i].code === obj.code) {
                        return true;
                    }
                }

                return false;
            },
       
        
        exhibits: function(ex){
           if(ex != null){
                $localstorage.setObject('exhibits',ex);
               // console.log($localstorage.getObject('exhibits'))
            }
        }
            

    }
})

.factory('Categories', function () {
    var categories = ['Art', 'Business', 'Communication', 'Community',
		'Dance', 'Design', 'Energy', 'Engineering', 'Environment', 'Gaming',
		'Global', 'Health', 'Music', 'Senior Projects', 'Science', 'Software',
		'Student Organizations', 'Sustainability', 'Technology', 'Photography',
		'Math', 'Sports', 'Multidisciplinary', 'STEM', 'Entrepreneurship'];

    return {
        all: function () {
            return categories;
        }
    }
})

.factory('Exhibits', function ($http,getStorage) {
    var exhibits = getStorage.exhibits();
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

    //	helper function - check if input contains searchString
    //			input: string to check
    function contains(input, searchString) {
        if (input.toLowerCase().indexOf(searchString) >= 0) {
            return true;
        } else {
            return false;
        }
    }

    return {
        all: function () {
            if (!synced) {
                return $http.get("https://imagine-rit-espy.herokuapp.com/api/exhibits")
                    .then(function (result) {
                        synced = true;
                        exhibits = result.data;
                        console.log('exhibits loaded: ' + exhibits.length);
                        return exhibits;
                    });
            } else {
                exhibits = getStorage.exhibits();
                return exhibits;
            }
        },

        //		returns a list of exhibits that contain given search term
        //		properties searched: name, description, exhibitors
        search: function (term) {
            term = term.toLowerCase();
            var results = [];
            for (var i in exhibits) {
                //				check name and description
                if (contains(exhibits[i].name, term) || contains(exhibits[i].description, term)) {
                    results.push(exhibits[i]);
                }
                //				check all exhibitors
                for (var j in exhibits[i].exhibitors) {
                    if (contains(exhibits[i].exhibitors[j], term)) {
                        results.push(exhibits[i]);
                    }
                }
            }
            return results;
        },

        isSynced: function () {
            return synced;
        },

        get: function (exhibitId) {
            exhibits = getStorage.exhibits();
            for (var i in exhibits) {

                if (exhibits[i].code === exhibitId) {
                     //console.log(exhibits[i].distance);
                    return exhibits[i];

                }
            }
            return null;
        },

        // n - number of top exhibits to return
        // TODO: complete
        getTopRated: function (n) {
            return null;
        },

        // n - number of top exhibits to return
        // TODO: complete
        getMostPopular: function (n) {
            return null;
        },

		getZoneColor: function(exhibitId) {
			var exhibit = this.get(exhibitId);
			var zone = exhibit.zone;
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

			return color;
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
