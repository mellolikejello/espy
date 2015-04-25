var app = app || {};

app.BEACONS = {};
app.OurBEACONS = [];
app.User = {};
app.trilateration = {

    // Timer that displays list of beacons.
    updateTimer: null,
    // Custom timer to get users location
    locationTimer: null,
    enoughbeacons: undefined,

    startScan: function () {
        function onBeaconsRanged(beaconInfo) {
            //console.log('onBeaconsRanged: ' + JSON.stringify(beaconInfo))
            for (var i in beaconInfo.beacons) {
                var beacon = beaconInfo.beacons[i];
                for (var j in app.OurBEACONS) {
                    //Loops through beacons found in scan and beacons pulled from our database, only adds to useable beacon array if beaconId is found in both
                    var ourBeacon = app.OurBEACONS[j];
                    if (ourBeacon.id == beacon.major + ":" + beacon.minor) {
                        // Insert beacon into table of found beacons.
                        beacon.timeStamp = Date.now();
                        app.BEACONS[ourBeacon.id] = ourBeacon;
                    }
                }
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

    initialize: function () {
        console.log("app.js init");
        if (window.localStorage.getItem('beacons') === null)
        {
            $.ajax({
                type: "GET",
                url: "https://imagine-rit-espy.herokuapp.com/api/estimotes",
                success: function (data) {
                    app.OurBEACONS = data;
                    window.localStorage.setItem('beacons', JSON.stringify(data));
                    console.log(JSON.stringify(data));
                    document.addEventListener('deviceready', this.onDeviceReady, false);
                }
            });
        }
        else {
            app.OurBEACONS = JSON.parse(window.localStorage.getItem('beacons'));
            console.log(JSON.stringify(data));
            document.addEventListener('deviceready', this.onDeviceReady, false);
        }
    },

    onDeviceReady: function () {
        // Specify a shortcut for the location manager holding the iBeacon functions.
        window.estimote = EstimoteBeacons;
        // Start tracking beacons!
        setInterval(app.trilateration.startScan, 250);
        setInterval(app.trilateration.getLocation, 500);
        window.localStorage.atExhibit = "false";
        console.log("here2");
    },

    getLocation: function () {
        timeNow = Date.now();

        var nearestBeacon;
        var secondNearestBeacon;
        var thirdNearestBeacon;

        // Update beacon list.
        $.each(app.BEACONS, function (key, beacon) {
            // Only show beacons that are updated during the last 20 seconds.
            if (beacon.timeStamp + 20000 > timeNow) {
                if (key == "REPLACE"/* PUT EXHIBIT BEACON KEY HERE */) {
                    if (beacon.distance < 1.5 && window.localStorage.atExhibit == "false") {
                        // User just arived at booth
                        window.localStorage.atExhibit = "true";
                        $.ajax({
                            type: "POST",
                            url: "https://imagine-rit-espy.herokuapp.com/api/userAtExhibit",
                            data: { "id": app.User.userId }
                        });

                    }
                    if (beacon.distance > 1.5 && window.localStorage.atExhibit == "true") {
                        // user just left booth
                        window.localStorage.atExhibit = "false";
                        $.ajax({
                            type: "DELETE",
                            url: "https://imagine-rit-espy.herokuapp.com/api/userAtExhibit/" + app.User.userId
                        });
                    }
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
            enoughbeacons = false;
        }
        else {
            var pos = app.trilateration.calculateLocation(nearestBeacon, secondNearestBeacon, thirdNearestBeacon);
            app.User.x = pos.x;
            app.User.y = pos.y;

            window.localStorage.setItem('user', JSON.stringify(app.User));
            enoughbeacons = true;
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
        var ra = a.distance * 5;
        var rb = b.distance * 5;
        var rc = c.distance * 5;

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
};
