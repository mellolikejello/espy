angular.module('espy.services', ['ngResource'])

.factory('UtilService', function (getStorage,setStorage,Categories,GetDistance, User) {
    // TODO: decide which variables are needed for MapService
    // and which should be specific to each function

    return {
        // Called from app.js every 3 minutes
        // Updates a users preferences based on the exhibits they have been to
        updatePreferences: function () {   // NEED CALL TO GET ALL USERS VISITED EXHIBITS
            var exhibits = (getStorage.exhibits() == null) ? [] : getStorage.exhibits();
            var visitedExhibits = User.getVisitedExhibits();
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
                        if (userPreferences.indexOf(exhibits[i].tags[k]) > -1) {
                            //console.log("already Exist:" + exhibits[i].tags[k]);
                        }
                        else {
                            userPreferences.push(exhibits[i].tags[k]);

                        }
                    }
                }
                 
            }
            //console.log(n);
            return;
        },

        // Called from HomeController - Gets 10 recommendations
        addRec: function () {
			User.getLocation();
            var exhibits = (getStorage.exhibits() == null) ? [] : getStorage.exhibits();
            var userPreferences = User.getInterests();
            var user = User.getLocation();
            var queued = User.getQueue();

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

	   queue: function(exhibit) {
           	console.log('adding exhibit: ' + exhibit);
		   if(exhibit == null) {
			   $localstorage.setObject('queue', []);
			   return;
		   }
//		   var curEx = Exhibits.get(exhibitId);
		   var curEx  = JSON.parse(exhibit);
            var queue = [];
                queue = $localstorage.getObject('queue');

			if(this.objIsinArray(curEx,queue)){
				console.log('exist');
			}
			else {
				queue.push(curEx);
				console.log('doesnt exist');
				$localstorage.setObject('queue',queue);
			}
        },

        objIsinArray: function (obj,list) {
		  for (var i = 0; i < list.length; i++) {
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

.factory('User', function ($http, $localstorage, Exhibits) {
	var name;
	var role;
	var id;
	var interests = [];
	var location = [ {x:0, y:0} ];
	// stores as a list of exhibit ids
	var visited = [];
	// stored as a list of exhibit ids
	var queue = [];
	var r = 10;
	var x = 0;
	var y = 0;

	function addToDB() {
		var userObj = {
			name: name,
			role: role,
			interests: interests
		};

		$http.post("https://imagine-rit-espy.herokuapp.com/api/users",
							userObj).
//			once the user has been added, store the generated id
//				and store to local storage
			then(function(result) {
				id = result.data.id;
				this.store();
			});
	}

	return {
		store: function() {
			var queueObj = this.getQueue();
			var visitedObj = this.getVisitedExhibits();

			var userObj = {
				id: id,
				name: name,
				role: role,
				interests: interests,
				location: location,
				visited: visitedObj,
				r: r,
				x: x,
				y: y
			};

			$localstorage.setObject('user', userObj);
			$localstorage.setObject('queue', visitedObj);
		},

		init: function (username, newRole, newInterests) {
			name = username;
			role = newRole;
			interests = newInterests;

			addToDB();
		},

		// if user is logged in, sychronize this service with local storage
		isLoggedIn: function() {
			var user = $localstorage.getObject('user');
			var savedQueue = $localstorage.getObject('queue');
			console.log(user);
			if(user == null) {
				return false;
			}

			name = user.name;
			role = user.role;
			id = user.id;
			interests = user.interests;
			location = user.location;
			visited = user.visited;
			queue = user.queue;
			r = user.r;
			x = user.x;
			y = user.y;
			queue = savedQueue;
			return true;
		},

		addToQueue: function(exbId) {
			queue.push(exbId);
			this.store();
		},

		toggleInterest: function(interest) {
			if(interests.indexOf(interest) > -1) {
				interests.splice(interests.indexOf(interest), 1);
			} else {
				interests.push(interest);
			}

			this.store();
		},

//		remove exhibit id from queue
		removeFromQueue: function(exbId) {
			for(var i in queue) {
				if(queue[i] == exbId) {
					queue.splice(i, 1);
					this.store();
					return true;
				}
			}
			return false;
		},

		// getters
		getName: function() {
			return name;
		},
		getRole: function() {
			return role;
		},
		getInterests: function() {
			return interests;
		},

		// returns a list of exhibit objects
		getQueue: function() {
			var exbQueue = [];
			for(var i in queue) {
				var exb = Exhibits.get(queue[i]);
				exbQueue.push(exb);
			}
			return exbQueue;
		},

		// returns a list of exhibit objects
		getVisitedExhibits: function() {
			var visitedList = [];
			for(var i in visited) {
				var exb = Exhibits.get(visited[i]);
				visitedList.push(exb);
			}
			return visitedList;
		},

		// returns location object
		// for example: { x: 0, y: 0}
		// also sychronizes locations with localstorage
		getLocation: function() {
			var lsUser = $localstorage.getObject('user');
			location = lsUser.location;
			return location[0];
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

.factory('Exhibits', function ($http, getStorage, setStorage) {
    var exhibits = (getStorage.exhibits() == null) ? [] : getStorage.exhibits();
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
												// set local storage to data pulled via API
												setStorage.exhibits(exhibits);
                        return exhibits;
                    });
            } else {
                exhibits = (getStorage.exhibits() == null) ? [] : getStorage.exhibits();
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
            exhibits = (getStorage.exhibits() == null) ? [] : getStorage.exhibits();
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

			return categoryList;
		}
	};
});
