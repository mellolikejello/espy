
"use strict";



var app = app || {};


app.main = {
	
	WIDHT:undefined,
    HEIGHT:undefined,
	
	dt:1/60.0,
	canvas:undefined,
    ctx:undefined,

	canvasWidth:undefined,
    canvasHeight:undefined,

	drawLib:undefined,
	user:undefined,
	exhibits:[],
	exLong:[],
	exLat:[],
	exName:[],
	
	
	orginLong:undefined,
	originLat:undefined,

//nw 43.086354,-77.681498
//se 	

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

    this.exLong =[-77.679945,-77.676694, -77.671845];
    this.exLat = [43.083855,43.084232, 43.085096];
    this.exName = ["gol","QM", "FH"];

   // console.log('width: '+ this.getDistance(43.083130, -77.681498, 43.083130, -77.681498,'M')   );
    //console.log('Height: ' + this.getDistance(43.088647, -77.675077,43.080071, -77.675077,'M')  );

    this.WIDTH = this.getDistance(43.083130, -77.681498,43.083130,  -77.670863,'M')  ;
    this.HEIGHT = this.getDistance(43.086354, -77.675766,43.081586, -77.675766,'M')  ;

    this.canvas.width = this.WIDTH ;
    this.canvas.height = this.HEIGHT ;
    this.ctx = this.canvas.getContext('2d');

    console.log(this.canvas.width);
    console.log(this.canvas.height);


    this.orginLong = -77.681498;
    this.originLat = 43.086354;
    
   for(var i = 0; i < this.exName.length; i++)
		{
			var radius = 10;
			
			var Lat = this.exLat[i];
			var Long = this.exLong[i];
			
			var x = this.getDistance(Lat,this.orginLong,Lat,Long,'M') ;
			var y = this.getDistance(this.originLat,Long,Lat,Long,'M') ;
			var name = this.exName[i];
		
			//this.exhibits[i].push(new app.Exhibit(radius, x, y, name));
			this.createExhibits(radius,x,y,name);
		}
    
    this.drawLib= app.drawLib;
	this.user = app.user;
    
    this.update();
	},

	createExhibits: function (radius, x, y, name) {
        this.exhibits.push(new app.Exhibit(radius, x, y, name));
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

    if (unit=="K") { dist = dist * 1.609344 };

    if (unit=="N") { dist = dist * 0.8684 };

    return dist;


  },
		
	draw: function()
	{
    //ctx,centerX, centerY, radius,col
    //ctx, x, y, w, h, col
    //43.084492, -77.679932

   
	
	//set these variables to the geolcation lon/lat
	var userLong = -77.679932;
	var userLat = 43.084492;
	
	var userx = this.getDistance(userLat,this.orginLong,userLat,userLong,'M') ;
	var usery = this.getDistance(this.originLat,userLong,userLat,userLong,'M') ;
	
	this.user.draw(this.ctx, userx, usery);
	
	for(var i = 0; i < this.exhibits.length; i++)
		{
			this.exhibits[i].draw(this.ctx);
		}
    //console.log(x,y);
		
	},
	
	
	update: function()
	{
		requestAnimationFrame(this.update.bind(this));

		console.log(this.exhibits.length);
		
		this.draw();
	},
	
	
	
    
    
};

	
window.onload = function() {

	app.main.init();
}