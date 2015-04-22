"use strict";

var app = app || {};

app.keydown = [];

app.main = {
	//variables
	WIDTH: undefined,
	HEIGHT:undefined,

	canvas:undefined,
	ctx:undefined,
	
	user:undefined,
	userLat:undefined,
	userLong:undefined,
	
	exhibits:undefined,

	originLong:-77.685955,
	originLat: 43.087979,

	panspeed:10,

	triLat:undefined,

	fhOlat:43.085403,
	fhOlong: -77.672272,

	FHN: this.fhOlat,
	FHS:43.084853,
	FHE: -77.671043,
	FHW: this.fhOlong,

	maxuserCircW:undefined,

	fhx:undefined,
	fhy:undefined,

	fhWidth:undefined,
	fhHeight:undefined,

	FHcol:undefined,



	building:undefined,
	zoomLevel:undefined,
 	matrix:[],
 	mat2:[],
 	fhMode:undefined,
	zoomtick:undefined,
 	FieldHouse:undefined,
	fhMult:undefined,
	zoomTick:undefined,
	center:undefined,
	currentInfo: [],
	snapButton:undefined,
	topText:undefined,

	xOffset: 30,
	yOffset: -15,
	exImgs:[],
	userAnimate:undefined,
	textCol : {
   		white:"#fff",
   		light:"#DBE1E8",
   		mid: "#9ea7b3",
   		dark: "#5e6d81",
   },
   colors:{
   		teal: "#3db4c8",
   		gold: "#FFD464",
   		alert: "#DE5B5B",
   },
	wholeMapLocations: [],

	backBut:undefined,
	qCirc:undefined,
	currentCollider:[],
	clock:undefined,
	buffer:undefined,
	times:[1800,3600,5400,7200,9000,10800,18000,28800,36000],
	tapTimer:undefined,
	taps:[],
	userisInZone:undefined,
	qUp:undefined,
	qAup:undefined,
	zoomedOut:undefined,
	panTopAllowed:undefined,
	panBotAllowed:undefined,
	panLeftAllowed:undefined,
	panRightAllowed:undefined,

	queued:undefined,
	
	zoneColliders:undefined,
	canv: undefined,
	alertTimer:undefined,
	tut1:undefined,
	tut2:undefined,
	tut3:undefined,
	exColliders:[],
	mapBtn:undefined,
	pushXYtimer:undefined,
	mapMult: .45,
	

//nw 43.086354,-77.681498

    
	// methods
	init : function() {

		var t = this;
		this.canvas = document.querySelector('canvas');
		this.ctx = this.canvas.getContext('2d');
		
		this.initExZones();
		this.userAnimate = 60;
		this.zoomLevel = 0;
		this.zoomTick = 0;
		this.maxuserCircW = 60;
		this.topText = "Imagine RIT";
		this.qCirc = 60;
		this.clock = 0;
		this.buffer = 180;
		this.tapTimer = 30;
		this.taps =  [{ x:0, y:0, }, {x:100, y:100,}];
		this.userisInZone = false;
		this.qUp = false;
		this.qAup = false;
		this.zoomedOut = false;
		this.panTopAllowed = true;
		this.panRightAllowed = true;
		this.panLeftAllowed = true;
		this.panBotAllowed = true;
		this.queued = ['Delete before Ionic']
		this.matrix = [1,0,0,1,0,0];
		this.alertTimer = 0;
		this.fhx = this.getDistance(t.fhOlat,t.originLong,t.fhOlat,t.fhOlong,'M');
		this.fhy = this.getDistance(t.originLat,t.fhOlong,t.fhOlat,t.fhOlong,'M') ;
		this.triLat = app.trilateration;
		this.initLocalStorage();
		this.initBtns();
		
		this.tut1 = window.localStorage.getItem("tut1");
		this.tut2 = window.localStorage.getItem("tut2");
		this.tut3 = window.localStorage.getItem("tut3");
		t.pushXYtimer = 10800;
		console.log(t.fhx,t.fhy);

		for(var k = 0; k < this.exhibits.length; k++){
			var ex = this.exhibits[k];
			this.exImgs.push(new Image());
			var newX = ex.x/this.fhMult;
			var	newY = ex.y/this.fhMult;
				newX = newX + this.fhx - this.xOffset/2;
				newY = newY + this.fhy + this.yOffset;
			var	newR = ex.r/this.fhMult;
			this.wholeMapLocations.push({x:newX, y:newY, r:newR, name:ex.name, tags:ex.tags});
		}   
		this.loadImages();
		this.initObj();
		this.initMap();	
		for(var i = 0; i < this.exhibits.length; i++){
			var ex = this.exhibits[i];
			var nx = ex.x - (this.fhx);
			var ny = ex.y - (this.fhy);
				nx = nx * this.fhMult;
				ny = ny * this.fhMult;
			this.exColliders.push({name:ex.name,x:nx,y:ny,r:ex.r,tags:ex.tags, zone:ex.zone});
		}
	
		this.canv = {
			x: 0,
			y:0,
			w:this.WIDTH,
			h:this.HEIGHT,
		}
		this.snap(this.FHcol);
		this.update();
		this.mat2 = this.matrix;


	},
	initBtns: function(){
		var iw = Math.floor( window.innerWidth);
   		var ih = Math.floor( window.innerHeight);
   		var w = iw * .95;
   		var h = ih * .30;
   		var x = iw * .025;
   		var xSpace = x * 3;
   		var y = ih/2 +h/2 - h/4 - x*6;
   		var img = this.mapSmall;
   		var imgS = w * .2;
   		var bw = iw * .1;
   		var bh = iw * .1;
   		x = x + (this.matrix[4] *-1) + w - bw - bw/4;
   		y = y + (this.matrix[5] *-1) + bh/2;
   		this.mapBtn = {
   			x:x,
   			y:y,
   			w:bw,
   			h:bh,
   		};

	},
	initLocalStorage: function(){
		if(localStorage.getItem("tut1") === null){
			localStorage.setItem("tut1","true");

		}
		if(localStorage.getItem("tut2") === null){
			localStorage.setItem("tut2","true");
			
		}
		if(localStorage.getItem("tut3") === null){
			localStorage.setItem("tut3","true");
			
		}
		

	},
	initMap: function (){
		this.matrix = [1,0,0,1,0,0];
		this.fhMode = false;
		this.fhWidth = this.getDistance(this.fhOlat,this.FHW,this.fhOlat,this.FHE) ;
		this.fhHeight = this.getDistance(this.FHN,this.fhOlong,this.FHS,this.fhOlong);
		this.zoomtick = 30;
		var southLat = 43.080425;
    	var northLat =  this.originLat;
    	var eastLong = -77.667844;
    	var westLong = this.originLong;
    	this.WIDTH = this.getDistance(this.originLat, westLong, this.originLat, eastLong,'M') *(this.mapMult);
		this.HEIGHT = this.getDistance(northLat, this.originLong,southLat, this.originLong,'M')*(this.mapMult) ;
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.fhMult = 5;
		this.updateUserLocation();
	},
	initObj: function(){
		this.FHcol = {
			x: this.fhx  + this.xOffset ,
			y: this.fhy + this.yOffset ,
			w: this.fhWidth ,
			h: this.fhHeight ,

		};
		this.snapButton = {
			x: Math.floor(window.innerWidth - ( Math.floor(window.innerHeight *.07))),
			y: 0 ,
			h: Math.floor(window.innerHeight *.07),
			w: Math.floor(window.innerHeight *.07),
			
		};
		this.backBut = {
			x: 0,
			y: 0 ,
			h: Math.floor(window.innerHeight *.07),
			w: Math.floor(window.innerHeight *.07),
			
		};
		this.center = {
			x:this.WIDTH/2,
			y: this.HEIGHT/2,
		};
		this.FieldHouse = {
			w:306,
			h:193,
			x: this.FHcol.x + this.FHcol.w/2,
			y: this.FHcol.y + this.FHcol.h/2,
		};
		this.user = {
			x: -100,
			y:-100,
			r: 10,
		};
		
	},
	initExZones: function (){
		
		this.exhibits = [
		{
			name:'testing 123',
			x:3779,
			y:1007,
			r: 75,
			tags:['science','computers'],
			zone:'Field House',

		},
		{
			name:'This is a Test',
			x:3753,
			y:981,
			r:75,
			tags:['gaming'],
			zone:'Field House',
		},


		
		];
		
	
			  
		this.zoneColliders= [
		{
			name:'Green Zone',
			x: 1173 *(this.mapMult),
			y: 1045 *(this.mapMult),
			r: 380 *(this.mapMult) ,
			col:'#4BE530',
		},
		{
			name:'Tech Quarter',
			x: 1812 *(this.mapMult),
			y: 952 *(this.mapMult),
			r: 385 *(this.mapMult),
			col:'#3AC7E8',
		},

		{
			name:'Computer Zone',
			x: 1584 *(this.mapMult),
			y: 1311 *(this.mapMult),
			r: 250 *(this.mapMult),
			col:'#07C2AF',
		},
		{
			name:'Innovation Center',
			x: 1650 *(this.mapMult) ,
			y: 1657*(this.mapMult) ,
			r: 150 *(this.mapMult),
			col:'#354AA5',
		},
		{
			name:'Global Village',
			x: 1458*(this.mapMult),
			y: 1811 *(this.mapMult) ,
			r: 340 *(this.mapMult),
			col:'#EC6A80'
		},
		{
			name:'Engineering Park',
			x: 2018 *(this.mapMult),
			y: 1259  *(this.mapMult),
			r: 290 *(this.mapMult),
			col:'#F27935',

		},
		{
			name:'Science Center',
			x: 2122 *(this.mapMult),
			y: 1641 *(this.mapMult),
			r: 385 *(this.mapMult),
			col:'#F7EF4A',
			
		},

		{
			name:'Buisness District',
			x: 2370*(this.mapMult),
			y: 1821 *(this.mapMult),
			r: 180 *(this.mapMult),
			col:'#3DB549',
			
		},
		{
			name:'Information Station',
			x: 2630*(this.mapMult),
			y: 1455 *(this.mapMult),
			r: 180 *(this.mapMult),
			col:'#ED9A37',
			
		},
		{
			name:'Think Tank',
			x:2451*(this.mapMult),
			y:1288 *(this.mapMult),
			r: 200 *(this.mapMult),
			col:'#D11E1E',
			
		},

		{
			name:'Artistic Alley',
			x: 2469*(this.mapMult),
			y: 956 *(this.mapMult),
			r: 315 *(this.mapMult),
			col:'#A053BC',
			
		},
		{
			name:'RIT Central',
			x: 3088*(this.mapMult),
			y: 1231 *(this.mapMult),
			r: 450 *(this.mapMult),
			col:'#F4C031',
			
		},
		{
			name:'Field House',
			x: 3860*(this.mapMult),
			y: 1129 *(this.mapMult),
			r: 530 *(this.mapMult),
			col:'#3C91E5',
			
		},

		];
	},

	
    draw: function(){
    	this.clearCanvas();

	    if(this.fhMode == false)	{

	    	var fh = this.FHcol;
	    	var user = this.user;
	   		//this.clearCanvas();
			this.drawImage(this.mapSmall,0,0,this.WIDTH,this.HEIGHT);
			//draw the user 
			//console.log(this.currentInfo[0]);
			
	   		this.drawCircle(user.x,user.y,this.userAnimate,this.colors.teal,.5);
	   		this.drawCircle(user.x,user.y,user.r,'blue',1);
	   		if(this.currentInfo.length >=1){
   					this.drawZoneInfo(this.currentInfo[0]);
   					
   				}
   				/*for(var p = 0; p < this.zoneColliders.length; p++){
   					var zc = this.zoneColliders[p];
   					this.drawCircle(zc.x,zc.y,zc.r,zc.col,.5);
   				}*/

	   	}
   		if(this.fhMode == true){
   			this.drawFeildHouse();
   			for(var k = 0; k < this.exhibits.length; k++){
   				var ex = this.exColliders[k];
   				this.drawEx(ex,k);

   			}
   			if(this.currentInfo.length >=1){
   					this.drawInfo(this.currentInfo[0],k);
   				}
   				//draw user
   			this.drawCircle(this.user.x,this.user.y,this.userAnimate,this.colors.teal,.5);
	   		this.drawCircle(this.user.x,this.user.y,20,'blue',1);
   		}
   		if(this.zoomedOut == false){
   			var si = this.snapButton;
	   		this.drawSnap(si.x,si.y,si.w,si.h,this.colors.teal);
   		}
   		if(this.alertTimer > 0 ){
   			this.drawTut("You are not at the festival");

   		}
   		this.handleTutorial();
   	},
   	update: function(){
   		var t = this;
   		requestAnimationFrame(this.update.bind(this));
		t.queued = JSON.parse(window.localStorage['queue']);
		//console.log(t.queued);
		t.alertTimer -- ;
		t.zoomTick --;
		t.tapTimer --;
		if(t.pushXYtimer > 0){
			t.pushXYtimer --;
		}
		t.isPanAllowed();
		t.initBtns();
		if(t.fhMode == true){
			if(t.qCirc >= 35){
				t.qUp = false;
				t.qCirc = 34;
			}
			if(t.qCirc <= 15){
				t.qCirc = 16;
				t.qUp = true;
			}
			if(t.qUp == true){
				t.qCirc += .2;
			}
			if(t.qUp == false){
				t.qCirc -= .2;
			}
		}
		
			if(t.userAnimate >= t.maxuserCircW){
				t.uAup = false;
				t.userAnimate = t.maxuserCircW - 1;
			}
			if(t.userAnimate <= 20){
				t.userAnimate = 21;
				t.uAup = true;
			}
			if(t.uAup == true){
				t.userAnimate += .4;
			}
			if(t.uAup == false){
				t.userAnimate -= .4;
			}
		
		
		
		t.updateUserLocation();
		if(t.fhMode == true){
			t.topText = 'Field House';
			t.maxuserCircW = 50;


		}
		else{
			t.topText = 'Imagine RIT';
			t.maxuserCircW = 45;
		}
		if(t.zoomedOut == true){
			t.user.r = 25;
		}
		else{
			t.user.r = 10;
		}

		t.snapButton = {
			x: Math.floor(window.innerWidth - ( Math.floor(window.innerHeight *.07))) + t.matrix[4]*(-1),
			y: 0 + t.matrix[5] * (-1) ,
			h: Math.floor(window.innerHeight *.07),
			w: Math.floor(window.innerHeight *.07),
		
		};
		
		t.backBut = {
			x: 0 + t.matrix[4]*(-1),
			y: 0 + t.matrix[5] * (-1) ,
			h: Math.floor(window.innerHeight *.07),
			w: Math.floor(window.innerHeight *.07),
		
		};
		t.tut1 = window.localStorage.getItem("tut1");
		t.tut2 = window.localStorage.getItem("tut2");
		t.tut3 = window.localStorage.getItem("tut3");

		t.handleCollisons();
		t.updateUserLocation();
		t.pan();
		t.draw();

   	},
   	handleTutorial: function(){
   		var t = this;

   		if(t.tut1 == "true"){
   			t.drawTut("Double tap a zone to select it.");
   		}
   		if(t.tut2 == "true" && t.tut1 == "false"){
   			t.drawTut("Tap on the card to view the zones exhibits.");
   		}
   		if(t.fhMode == true && t.tut3 == "true" ){
   			t.drawTut("Tap an icon to select that exhibit.");
   			
   		}
   	},

   	//FH Handlers
	handlefhMode: function(){
	   	if(this.fhMode == true){
	   		this.WIDTH = this.FieldHouse.w * this.fhMult;
	   		this.HEIGHT = this.FieldHouse.h * this.fhMult;
	   		this.initFH();
	   	}
	  
	   	this.canvas.height = window.innerHeight;
	   	this.canvas.width = window.innerWidth;
	},
	initFH: function(){
		var t = this;
   		this.ctx.setTransform(1,0,0,1,0,0);
   		this.matrix = [1,0,0,1,0,0];
   		t.user.x = (t.user.x - t.fhx) * (t.fhMult);
		t.user.y = (t.user.y - t.fhy) * (t.fhMult);
		this.fhx = this.getDistance(t.fhOlat,t.originLong,t.fhOlat,t.fhOlong,'M') ;
		this.fhy = this.getDistance(t.originLat,t.fhOlong,t.fhOlat,t.fhOlong,'M') ;
		this.fhWidth = this.getDistance(this.fhOlat,this.FHW,this.fhOlat,this.FHE) ;
		this.fhHeight = this.getDistance(this.FHN,this.fhOlong,this.FHS,this.fhOlong);
		
	}, 

	//updateers
	updateCurrentInfoEx: function(x,y,w,h,name,t){
   		this.currentInfo.shift();
   		this.currentInfo.push(
   		{
			x: x,
   			y: y,
   			w: w,
   			h: h,
   			name: name,
   			tag: t,
   		}
   			);
    },
    updateCIZone: function(x,y,w,h,n,col,rad){
   		this.currentInfo.shift();
   		
   		this.currentInfo.push(
   		{
			x: x,
   			y: y,
   			w: w,
   			h: h,
   			name: n,
   			col: col,
   			r: rad,
   		}
   			);
    },
    pushNewUserXY: function(){
    	var xy = [user.x,user.y];
    	if(this.pushXYtimer <= 0){

    		//PUSH NEW XY
    		this.pushXYtimer = 10800;
    	}

    },

    //utils 
   	snap: function(sub){
			//clearCanvas();
			if(this.isPointinRect(sub.x,sub.y,this.canv)){
				this.ctx.setTransform(1, 0, 0, 1, 0, this.snapButton.h *-1);
				this.matrix = [1,0,0,1,0,this.snapButton.h*-1];
				var subject = sub;
				var xtrans = subject.x - (window.innerWidth/2);
				var ytrans = subject.y - (window.innerHeight/2.5);
				xtrans = xtrans * -1;
				ytrans = ytrans * -1;
				this.translate(this.ctx, xtrans, ytrans);
				this.zoomLevel = 0;

			}
			else{
				this.alertTimer = 60;
				
			}

	},
	checkCol:function(a,b){
		var circle1 = {r: a.r, x: a.x, y: a.y};
		var circle2 = {r: b.r, x: b.x, y: b.y};
		var dx = (circle1.x  ) - (circle2.x  );
		var dy = (circle1.y ) - (circle2.y );
		var distance = Math.sqrt(dx * dx + dy * dy);
		if (distance < circle1.r + circle2.r) {return true;}
		else{ return false;}
	},
	handleCollisons: function(){
		var t = this;
		for (var i = 0; i < t.exhibits.length; i++){
			var ex = t.exhibits[i];
			if(t.fhMode == true){
				if(t.isPointinCircle(t.user.x,t.user.y,ex)){
					var distance = t.isPointinCircle(user.x,user.y,ex);
					t.currentCollider.push({name: ex.name, dist:distance});
					t.currentCollider.sort(function(a,b) { return parseFloat(a.dist) - parseFloat(b.dist) } );
					t.clock ++;
					t.buffer = 300;
					for(var u = 0; u < t.times.length; u++){
						var seconds = t.times[u] / 60;

						if(t.clock == t.times[u]){
							
							/// INSERT USER IS AT LOCATION INTO DB
						}
					}
				}
				else{ t.currentCollider = []; 
					if(t.buffer <= 0){
						t.clock = 0;
						t.buffer = 180;
					}
				}
			}
			if(t.fhMode == false){
				var mapex = t.wholeMapLocations[i];
				if(t.isPointinCircle(t.user.x,t.user.y,mapex)){
					var distance = t.isPointinCircle(user.x,user.y,mapex);
					t.currentCollider.push({name: ex.name, dist:distance});
					t.currentCollider.sort(function(a,b) { return parseFloat(a.dist) - parseFloat(b.dist) } );
					t.clock ++;
					t.buffer = 300;
					for(var u = 0; u < t.times.length; u++){
						var seconds = t.times[u] / 60;

						if(t.clock == t.times[u]){
							console.log(seconds);
							/// INSERT USER IS AT LOCATION INTO DB
						}
					}
				}
				else{ t.currentCollider = []; 
					if(t.buffer <= 0){
						t.clock = 0;
						t.buffer = 180;
					}
				}
			}
		}
	},
	getDistanceXY: function( point1, point2 ){
	  var xs = 0;
	  var ys = 0;
	 
	  xs = point2.x - point1.x;
	  xs = xs * xs;
	 
	  ys = point2.y - point1.y;
	  ys = ys * ys;
	 
	  return Math.sqrt( xs + ys );
	},
	getDistance: function(lat1, lon1, lat2, lon2, unit){
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var radlon1 = Math.PI * lon1/180;
		var radlon2 = Math.PI * lon2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		dist = dist * 5280;
		dist = Math.floor(dist);
		if (unit=="K") { dist = dist * 1.609344 };
		if (unit=="N") { dist = dist * 0.8684 };
		return dist;
    },
    isPointinRect: function(pointX,pointY,rect){
    	return  (rect.x <= pointX) && (rect.x + rect.w >= pointX) &&
                (rect.y <= pointY) && (rect.y + rect.h >= pointY);
    },
    isPointinCircle: function(x, y, c) {
	    var dx = x - c.x;
		var dy = y - c.y;
		var distsq = dx * dx + dy * dy;
		var rsq = c.r * c.r;
		var dist = Math.floor(distsq);
			
		if (distsq < rsq) {
		  return dist;
		  
		}
		else{
			return false;
		}
		
	},
	getLocation:function () {
		
		if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position){
		this.userLat =  position.coords.latitude;
		this.userLong =  position.coords.longitude;
		});
		} else {
		console.log("didnt work");
		}
	},
	updateUserLocation:function (){
	//set collison radius for user

	var t = this;
	t.getLocation();
	if(t.userLat != null && t.userLong != null){
	t.user.x = t.getDistance(t.userLat,t.originLong,t.userLat,t.userLong);
	t.user.y = t.getDistance(t.originLat,t.userLong,t.userLat,t.userLong);

	t.user.x = t.user.x * t.mapMult;
	t.user.y = t.user.y * t.mapMult;
}
	//set these variables to the geolcation lon/lat
	
	//convert user lon/lat to X/Y
	if(app.trilateration.enoughbeacons == true){
		var userPosition = app.trilateration.getLocation();
		this.userX = userPosition.x;
		this.userY = userPosition.y;
	}
		
	},
	checkUserInFH: function(){
		var u = this.user;
		var fh = this.FHcol;
		if(this.isPointinRect(u.x,u.y,fh.x,fh.y,fh.w,fh.h)){
			this.fhMode = true;
		}
	},
	zoomCanvas: function(z){
		var t = this;
		var m = t.matrix;
		
		if(t.zoomTick <= 0 && t.fhMode == true){

			if(z =='IN' && t.fhMult < 12){
				t.clearCanvas();
				t.matrix = t.mat2;
				t.zoomedOut = false;
				}
			if(z == 'OUT' ){
				t.clearCanvas();
				t.ctx.setTransform(.35,0,0,.35,-window.innerWidth * .15,window.innerHeight * .25);
				t.matrix = [.35,0,0,.35,-window.innerWidth * .15,window.innerHeight * .25];
				t.zoomedOut = true;			
			}
		}	
		if(t.zoomTick <= 0 && t.fhMode == false){

			if(z =='IN' && t.fhMult < 12 &&t.zoomedOut == true ){
				
				t.clearCanvas();
				t.ctx.setTransform(1,0,0,1,t.mat2[4],t.mat2[5]);
				t.matrix = t.mat2;
				t.zoomedOut = false;
			}
			if(z == 'OUT' ){
				t.clearCanvas();
					
				t.ctx.setTransform(.25,0,0,.25,-window.innerWidth * .15,window.innerHeight * .25);
				m = [.25,0,0,.25,0,0];
				t.zoomedOut = true;			
			}
		}	
	},
	isPanAllowed: function(){
		var t = this;
		
		if(t.zoomedOut == false){
			var m = t.matrix;
			//console.log(t.matrix[5]);
			if(t.matrix[4] >= 0){
				t.panRightAllowed = false;
				t.matrix[4]= 0;
				
			}
			else{t.panRightAllowed = true;}

			if(t.matrix[4] <= -(t.WIDTH - window.innerWidth)){
				t.panLeftAllowed = false;
				t.matrix[4] = -(t.WIDTH - window.innerWidth);
			}
			else{t.panLeftAllowed = true;}

			if(t.matrix[5]>= 0 + t.snapButton.h ){
				t.panBotAllowed = true;
				t.matrix[5]  =  0 + t.snapButton.h ;

			}
			else{//panBotAllowed = false;
			}
			
			if(t.matrix[5]  <= -(t.HEIGHT - window.innerHeight + t.snapButton.h *1.75)){
				t.panTopAllowed = true;
				t.matrix[5]  = -(t.HEIGHT - window.innerHeight + t.snapButton.h * 1.75);
				
			}
			else{//panTopAllowed = false;
			}
				
			t.ctx.setTransform(1,0,0,1,t.matrix[4] ,t.matrix[5] );
		}
	},
	pan: function(dir){
		var t = this;
		var m = t.matrix;

		if(t.zoomedOut == false){
			if(dir == "RIGHT" && t.panRightAllowed == true){
				t.translate(t.ctx,t.panspeed,0);
			}
			//left
			if(dir == "LEFT" && t.panLeftAllowed == true){
				t.translate(t.ctx,t.panspeed* (-1),0);
			}
			//up
			if(dir =="UP" && t.panTopAllowed == true){
				t.translate(t.ctx,0,t.panspeed*(-1));
			}
			//down
			if(dir == "DOWN" && t.panBotAllowed == true){
				t.translate(t.ctx,0,t.panspeed);
			}
			t.mat2 = t.matrix;
		
		}
	},
	translate: function(c,x,y){
		this.matrix[4] += this.matrix[0] * x + this.matrix[2] * y;
		this.matrix[5] += this.matrix[1] * x + this.matrix[3] * y;
		c.translate(x,y);
	},
	


	//events
	
	//DRAW FUNCTIONS

	loadImages:function(){

		this.mapImage = new Image();
		this.mapImage.src = "img/map2.png";
		this.mapSmall = new Image();
		this.mapSmall.src = "img/map2.png";
		
		this.fhImage = new Image();
		this.fhImage.src = "img/FH.png";
		this.snapImage = new Image();
		this.snapImage.src = "img/Icons/snap.png";
		this.backImage = new Image();
		this.backImage.src = "img/Icons/back.png";

		this.queueImage = new Image();
		this.queueImage.src = "img/Icons/add_queue.png";

		this.mapIcon = new Image();
		this.mapIcon.src = "img/Icons/map.png";

		this.ciImage = new Image();
		this.exImage = new Image();
	},
	drawTut: function (message){

		var x = this.matrix[4]*-1;
		var y = this.snapButton.h + this.matrix[5]*-1;
		var w = window.innerWidth;
		var h = this.snapButton.h * 2 *.75;

		this.drawRect(x,y,w,h,this.colors.alert);
		this.drawText(message,x + w/2, y + h/2 + w*.03 , w *.07, this.textCol.light,w *.90);
	},
	drawSnap: function(x,y,w,h,col){
   		var m4 = this.matrix[4]*(-1);
   		var m5 = this.matrix[5]*(-1);
	   		x = x ;
	   		y = y ;
	   		var backBut = this.backBut;
			this.drawRect(m4,m5,window.innerWidth,h,col);
			if(this.fhMode ==true){
				this.drawImage(this.backImage,backBut.x ,backBut.y + backBut.w*.15,backBut.w * .7,backBut.h *.7);
			}
   			this.drawImage(this.snapImage,x,y + h*.1,w * .8,h *.8);
   			var ts = h *.50;
   			this.drawText(this.topText,m4 + window.innerWidth/2,m5+ h/1.5,ts,'white',window.innerWidth);
    },
    drawFeildHouse: function(){
   		this.clearCanvas();
		this.drawImage(this.fhImage,0,0,this.WIDTH,this.HEIGHT);
	},
	drawEx: function(ex,i){
   		var w = 60;
   		var h = 60;
   		var x = ex.x - w/2;
   		var y = ex.y - h/2;
   		if(ex.zone == 'Field House'){
	   		if(this.queued.indexOf(ex.name) > -1){
	   			this.drawCircle(ex.x,ex.y,this.qCirc,this.colors.gold,1);
	   		}
	   		this.exImgs[i].src = 'img/Icons/' + ex.tags[0] + '.png';
	   		//this.drawCircle(ex.x,ex.y,ex.r,"red",.2);
	   		this.drawImage(this.exImgs[i],x,y,w,h);
   		}
    },
    drawShadowrect : function( x, y, w, h, col)
	{
		this.ctx.save();
		w = w -10;
		x = x+5;
		this.ctx.globalAlpha=.3;
		this.ctx.shadowOffsetX = 0;
		this.ctx.shadowOffsetY = 5;
		this.ctx.shadowBlur = 20;
		this.ctx.shadowColor = this.textCol.dark;
		this.ctx.fillStyle = col;
		this.ctx.fillRect(x,y,w,h);
		this.ctx.restore();
	},
    drawInfo: function(ex,cEx,i){
    	
   		var iw = Math.floor( window.innerWidth);
   		var ih = Math.floor( window.innerHeight);
   		var w = iw * .95;
   		var h = ih * .30;
   		var x = iw * .025;
   		var xSpace = x * 3;
   		var y = ih/2 +h/2 - h/4 - x*6;
   		
   		var imgS = w * .2;
   		x = x + (this.matrix[4] *-1);
   		y = y + (this.matrix[5] *-1);
   		
   		this.ciImage.src = 'img/Icons/' + ex.tag + '.png';
   		this.drawShadowrect(x,y,w,h,this.textCol.dark);
   		this.drawRect(x,y,w,h,"#FFF");
   		this.drawRect(x,y,w,xSpace/2,'#3C91E5');
   		
   		this.drawImage(this.ciImage,x + w/2 - imgS/2, y + xSpace,imgS,imgS);
   		var maxtextWidth = w * .8;
   		var textsize = h *.10;
   		this.drawText(ex.name, x + w/2 , y + h - xSpace, textsize,this.textCol.mid,maxtextWidth);
		this.updateCurrentInfoEx(x,y,w,h,ex.name,ex.tag);
	},
	drawZoneInfo: function(zone){
   		var iw = Math.floor( window.innerWidth);
   		var ih = Math.floor( window.innerHeight);
   		var w = iw * .95;
   		var h = ih * .30;
   		var x = iw * .025;
   		var xSpace = x * 3;
   		var y = ih/2 +h/2 - h/4 - x*6;
   		var img = this.mapSmall;
   		var imgS = w * .2;
   		x = x + (this.matrix[4] *-1);
   		y = y + (this.matrix[5] *-1);
   		
   		this.drawShadowrect(x,y,w,h,this.textCol.dark);
   		this.drawRect(x,y,w,h,'#FFF');
   		this.drawRect(x,y,w,xSpace/2,zone.col);   		//drawImage(img,x + w/2 - imgS/2, y + xSpace/2,imgS,imgS);
   		var maxtextWidth = w * .8;
   		var textsize = h *.2;
   		var dist = this.getDistanceXY(this.user,zone);
   			dist = dist/5280;
   			dist = dist.toFixed(2);
   		this.drawText(zone.name, x + w/2 , y + xSpace * 3, textsize,this.textCol.dark,maxtextWidth);
   		if(this.userisInZone == true){
   			
   			this.drawText("You are here",x + w/2 , y + h - textsize, textsize/2,this.textCol.mid,maxtextWidth);
   		}
   		else{
   			if(this.isPointinRect(this.user.x,this.user.y,this.canv)){
			this.drawText("~ " + dist +" miles away",x + w/2 ,y + h - textsize, textsize/2,this.textCol.mid,maxtextWidth);
			}
		}
		if(zone.name == 'Field House'){
			var mb = this.mapBtn;
			this.drawImage(this.mapIcon,mb.x,mb.y,mb.w,mb.h);
		}
		var zr = zone.r;
		
		this.updateCIZone(x,y,w,h,zone.name,zone.col,zr);
    },
    drawText: function(string, x, y, size, col,maxWidth){
		this.ctx.save();
		this.ctx.font =  size + 'px Lato';
		this.ctx.fillStyle = col;
		this.ctx.textAlign = 'center';
		this.ctx.fillText(string, x, y,maxWidth);
		this.ctx.restore();
	},
	drawCircle: function(centerX, centerY, radius,col,alph){

		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.globalAlpha=alph;
      	this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      	this.ctx.fillStyle = col;
      	this.ctx.fill();
      	this.ctx.restore();
	},
	drawRect: function( x, y, w, h, col,alph){
		this.ctx.save();
		this.ctx.globalAlpha=alph;
		this.ctx.fillStyle = col;
		this.ctx.fillRect(x,y,w,h);
		this.ctx.restore();
	},
	drawImage: function(image, x, y,w,h){
		
		this.ctx.save();
		this.ctx.drawImage(image, x, y, w, h);
		this.ctx.restore();
	},
 	clearCanvas: function(){
		this.ctx.clearRect(0,0, this.WIDTH, this.HEIGHT);
	},
		
};



  var el = document.getElementsByTagName("canvas")[0];
  var mc = new Hammer(el);
  mc.get('pan').set({direction: Hammer.DIRECTION_ALL});
  mc.get('pinch').set({enable: true});


  mc.on("panleft panright panup pandown pinchin pinchout", function(ev){
  	 switch(ev.type){
	  	 case "panleft":
	  		app.main.pan("LEFT");
	  		 break; 
	  	 case "panright":
	  		app.main.pan("RIGHT");
	  	 	break;
	  	 case "panup":
	  		app.main.pan("UP");
	  	 	break;
	  	 case "pandown":
	  	 	app.main.pan("DOWN");
	  		 break;
	  	 case "pinchin":
	  	 	app.main.zoomCanvas("OUT");
	  	 	break;
	  	 case "pinchout":
	  	 	app.main.zoomCanvas("IN");
	  	 	break;
	  }
});
function getTapPos(event){
		
	 	 var t = app.main;
	 	 
	 	 var doubleTap = false;
		 var x; 
  		 var y; 
		 event.preventDefault();//prevent window zoom
  		 this.userisInZone = false;
  		
 		 var touches = event.changedTouches;
         x = touches[0].pageX; //get touch x relative to window
         y = touches[0].pageY; //get touch y relative to window
         var m = t.matrix;
         
         var newX = x * t.matrix[0] + y * t.matrix[2] + (t.matrix[4] *-1);//convert x based on screen pan
 		 var newY = x * t.matrix[1] + y * t.matrix[3] + (t.matrix[5] *-1);//convert y based on screen pan
        
         x = Math.floor(newX);//set x to newX
         y = Math.floor(newY);//set y to newY
        
        
         if(t.isPointinRect(x,y,t.snapButton)){
         	t.snap(t.user);
         }
		if(t.currentInfo.length >= 1){//check if info is on screen
         	var ci = t.currentInfo[0];
         	
         	if(t.isPointinRect(x,y,ci)){//if it is check if new tap is inside it
	         	if(ci.name == 'Field House'){
	         			
	         		if(t.isPointinRect(x,y,t.mapBtn)){
	         			t.fhMode = true;
	         			t.handlefhMode();
	         			t.currentInfo =[];
         			}

	         	}
	         	t.tut2 = "false";
	         	window.localStorage.setItem("tut2","false");
	         	var ci = t.currentInfo[0];
	         	if(t.fhMode == true){
	         		//Go to page for indivual exhibit
	         	}
	         	if(t.fhMode == false){
	         		
	         		//Go to page for Zone exhibits
	         	}
	         	
			}
         	else{//if not empty current info
         		t.currentInfo = [];
         	}
         }
         else{//most likley completely unneccisarry
         	t.currentInfo = [];
         }
         t.taps.shift();//shift out fist element in taps array so there are only ever 2
         t.taps.push({x:x,y:y});// push new tap x/y to taps array
         var touchedCircles = [];//touched Circles array to tell if any building colliders were touched
         var tapsDist = t.getDistanceXY(t.taps[0],t.taps[1]);//get the distance between taps
         if(tapsDist < 50 && t.tapTimer >= 0){//check for Double Tap
         	doubleTap = true;//if it is within the distance and withing the time then doubletap = true
         }
		if(t.fhMode == true){//check if map is in feildhouse mode
         	if(t.isPointinRect(x,y,t.backBut)){//
         		t.fhMode = false;//if do back out of fh mode
         		t.initMap();
         		
         		t.snap(t.zoneColliders[12]); // CHANGE TO XY OF FH CIRCLE COLLIDER
         	}
         	var exCircles = [];//array of touched circles for exhibits
         	for(var k = 0; k < t.exhibits.length; k++){
         		var ex = t.exColliders[k];
         		if(t.isPointinCircle(x,y,ex) && ex.zone == 'Field House'){ // check if point is within circle
         			var d = t.isPointinCircle(x,y,ex); // get the distance 
         			exCircles.push({name:ex.name, dist:d , x:ex.x,y:ex.y, tag:ex.tags[0]});//if there is a collision push to exCircles with name,dist etc.
         		}
         		else{}
         	}
         	exCircles.sort(function(a,b) { return parseFloat(a.dist) - parseFloat(b.dist) } );//sort exCircels from lowedt dist to higest
         	if(exCircles.length >= 1){//check if there were any selected circles
         		t.snap(exCircles[0]);//snap to the closest one
         		t.currentInfo.push(exCircles[0]);//push to currentInfo array to display Ifo
         		t.tut3 = "false";
         		window.localStorage.setItem("tut3","false");         	}
		}

         else{ // if the map is not in Feild house mode
	        for(var i = 0; i < t.zoneColliders.length; i++){
	         	var zc = t.zoneColliders[i];
	         	if(t.isPointinCircle(x,y,zc) && t.zoomedOut == false){ // if map is not zoomed out check for a slected zone
	         		var distance = t.isPointinCircle(x,y,zc);
	         		 //get distances
	         		touchedCircles.push({ name:zc.name,dist: distance, col:zc.col, x: zc.x, y:zc.y + window.innerHeight*.05, r:zc.r});//push name and distance of zone
	         		}
	         	}
	    }

		touchedCircles.sort(function(a,b) { return parseFloat(a.dist) - parseFloat(b.dist) } );//sort touchedCircls by dist (low-high)
		
			if(touchedCircles.length >= 1 && doubleTap == true){//if there was a doubletap on a touched circle

					t.currentInfo.push(touchedCircles[0]);
					t.snap(touchedCircles[0]);
					t.tut1 = "false";
					window.localStorage.setItem("tut1","false");
					if(t.checkCol(t.user,touchedCircles[0])){
						t.userisInZone = true;
					}
				}
			t.tapTimer = 30 ;//reset tap timer
	}
window.onload = function() {

//startup();

window.addEventListener("touchstart",getTapPos, false);

		
		

	app.main.init();
}
