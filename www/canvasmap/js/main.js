
"use strict";



var app = app || {};

app.keydown = [];

app.main = {
	//variables
	WIDHT:undefined,
    HEIGHT:undefined,
	
	dt:1/60.0,
	canvas:undefined,
    ctx:undefined,

	canvasWidth:undefined,
    canvasHeight:undefined,

	drawLib:undefined,
	user:undefined,
	userCollider:undefined,

	MapImg:undefined,

	userLong:undefined,
	useLat:undefined,
	userX:undefined,
	userY:undefined,
	userColRad:undefined,

	exhibits:[],
	exColliders:[],
	exLong:[],
	exLat:[],
	exName:[],
	exRad:[],
	
	
	angle:undefined,
	orginLong:undefined,
	originLat:undefined,


//nw 43.086354,-77.681498
//se 	43.081586,-77.670863

//Width Points
//43.083168, -77.685272
//43.083168 ,-77.665784

//Height Points
//43.088647, -77.675077
//43.080071, -77.675077
    
// west 43.083130, -77.681498
// east  43.083130,  -77.670863
// north 43.086354, -77.675766
// south 43.081586, -77.675766
    
	// methods
	init : function() {

	var c = document.createElement("canvas");
    document.body.appendChild(c);
	this.canvas = document.querySelector('canvas');
	
	//set up array values
    this.exLong =[-77.679945,-77.676694, -77.671845];
    this.exLat = [43.083855,43.084232, 43.085096];
    this.exName = ["GOL","QM", "GFH"];
	this.exRad = [40,20,30];
   
   //set up static values
    this.angle = 0;
	this.orginLong = -77.681498;
    this.originLat = 43.086354;
	//set image src's
    this.Mapimage = new Image();
	this.Mapimage.src = "img/map.png";
   
	//set canvas width and height
	this.WIDTH = this.getDistance(43.083130, -77.681498,43.083130,  -77.670863,'M')  ;
    this.HEIGHT = this.getDistance(43.086354, -77.675766,43.081586, -77.675766,'M')  ;
	this.canvas.width = this.WIDTH ;
    this.canvas.height = this.HEIGHT ;
    
	//set up this.ctx
	this.ctx = this.canvas.getContext('2d');
	//initiate exhibits array
    for(var i = 0; i < this.exName.length; i++){
			var radius = 10;
			var Lat = this.exLat[i];
			var Long = this.exLong[i];
			var x = this.getDistance(Lat,this.orginLong,Lat,Long,'M') ;
			var y = this.getDistance(this.originLat,Long,Lat,Long,'M') ;
			var name = this.exName[i];
			this.createExhibits(radius,x,y,name);
		}
	 //initiate exhibit colliders array
	 for(var i = 0; i < this.exhibits.length; i++){
			var radius = this.exRad[i];
			var Lat = this.exLat[i];
			var Long = this.exLong[i];
			var x = this.getDistance(Lat,this.orginLong,Lat,Long,'M') ;
			var y = this.getDistance(this.originLat,Long,Lat,Long,'M') ;
			var name = this.exName[i];
			this.createExhibitsColliders(radius,x,y,name);
		}
    
	//set up classes to be called this.class instead of app.class (not really necessary I just prefer it)
    this.drawLib= app.drawLib;
	this.user = app.user;
	this.userCollider = app.userCollider;
	
	//initalize users location (must be called in update when keyboard controls are no longer needed for testing)
	this.updateUserLocation();
    //call the update function update
    this.update();
	},
	//create new exhibit
	createExhibits: function (radius, x, y, name) {
        this.exhibits.push(new app.Exhibit(radius, x, y, name));
    },
	//create new exhibit collider
	createExhibitsColliders: function (radius, x, y, name) {
        this.exColliders.push(new app.ExhibitCollider(radius, x, y, name));
    },
	
	//get the distance in feet from two lat/lon points
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

		if (unit=="K") { dist = dist * 1.609344 };

		if (unit=="N") { dist = dist * 0.8684 };

		return dist;
    },
	//draw on the canvas
	draw: function()
	{
		//Draw Background Image
		this.drawLib.drawImage(this.ctx, this.Mapimage , 0, 0, this.WIDTH, this.HEIGHT);

		//Draw User
		this.userCollider.draw(this.ctx,this.userColRad, this.userX, this.userY);
	    this.user.draw(this.ctx,  this.userX, this.userY);
		
		//Draw Exhibits
	    for(var i = 0; i < this.exhibits.length; i++)
		{
			this.exColliders[i].draw(this.ctx);
			this.exhibits[i].draw(this.ctx);
			
		}
    
		
	},
	//rotate the entire canvas
	rotate: function(){

		
		//rotate right : right arrow
		if(app.keydown[39]){
			this.angle = 1;
			this.angle = (this.angle + .05) % 360;	
			this.drawLib.clear(this.ctx,0, 0, this.canvas.width, this.canvas.height);
			this.ctx.translate(this.WIDTH/2, this.HEIGHT/2);
			this.ctx.rotate(this.angle*Math.PI/180);
			this.ctx.translate(this.WIDTH/2 * -1 , this.HEIGHT/2 * -1);
		}

		//rotate left : left arrow
		if(app.keydown[37]){
			this.angle = -1;
			this.angle = (this.angle - .05) % 360;	
			this.drawLib.clear(this.ctx,0, 0, this.canvas.width, this.canvas.height);
			this.ctx.translate(this.WIDTH/2, this.HEIGHT/2);
			this.ctx.rotate(this.angle*Math.PI/180);
			this.ctx.translate(this.WIDTH/2 * -1 , this.HEIGHT/2 * -1);
		}
		
		//restet rotation : enter
		if(app.keydown[13]){
			this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		}
	
	},
	
	//check collisons between the user's circle collider and a circle a
	checkCol: function (a){
		var circle1 = {radius: a.radius, x: a.x, y: a.y};
		var circle2 = {radius: this.userColRad, x: this.userX, y: this.userY};
		var dx = (circle1.x  ) - (circle2.x  );
		var dy = (circle1.y ) - (circle2.y );
		var distance = Math.sqrt(dx * dx + dy * dy);
		if (distance < circle1.radius + circle2.radius) {return true;}
		else{ return false;}
	},
	//initiate collisions to be called in update
	Collisions: function (){
		for(var i = 0; i < this.exColliders.length; i++)
		{
			if(this.checkCol(this.exColliders[i]) ){
				//Colision has been deteced here! do something
				console.log(this.exColliders[i].name);
			}
		}
	}, 
	updateUserLocation: function (){
	//set collison radius for user
	this.userColRad = 5;
	//set these variables to the geolcation lon/lat
	this.userLong = -77.679932;
	this.userLat = 43.084492;
	//convert user lon/lat to X/Y
	this.userX = this.getDistance(this.userLat,this.orginLong,this.userLat,this.userLong,'M') ;
	this.userY = this.getDistance(this.originLat,this.userLong,this.userLat,this.userLong,'M') ;
		
	},
	
	update: function(){
		requestAnimationFrame(this.update.bind(this));
		
		//this.updateUserLocation();
		
		//this.rotate();
	
		this.Collisions();
		this.moveUser();
		this.draw();
	},
	
	moveUser: function(){
		var speed = .1;
		//right
		if(app.keydown[39]){
			this.userX += speed;
		}
		//left
		if(app.keydown[37]){
			this.userX -= speed;
		}
		//up
		if(app.keydown[38]){
			this.userY -= speed;
		}
		//down
		if(app.keydown[40]){
			this.userY += speed;
			
		}
    }
    
};

	
window.onload = function() {

	window.addEventListener("keydown", function(e){
		//console.log("keydown " + e.keyCode);
		app.keydown[e.keyCode] = true;
	});
	
	window.addEventListener("keyup", function(e){
		//console.log("keyup");
		app.keydown[e.keyCode] = false;
	});

	app.main.init();
}