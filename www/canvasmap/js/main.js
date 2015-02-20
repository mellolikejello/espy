
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



  orginLong:undefined,
  originLat:undefined,

//nw 43.088647,-77.685272
//se 43.080071, -77.665784

//Width Points
	//43.083168, -77.685272
  //43.083168 ,-77.665784

//Height Points
  //43.088647, -77.675077
   //43.080071, -77.675077
    
    // methods
	init : function() {

		var c = document.createElement("canvas");
    document.body.appendChild(c);


    
    this.canvas = document.querySelector('canvas');

    console.log('width: '+ this.getDistance(43.083168, -77.685272,43.083168 ,-77.665784,'M') * 5280  );
    console.log('Height: ' + this.getDistance(43.088647, -77.675077,43.080071, -77.675077,'M') * 5280  );

    this.WIDTH = this.getDistance(43.083168, -77.685272,43.083168 ,-77.665784,'M') * 5280 ;
    this.HEIGHT = this.getDistance(43.088647, -77.675077,43.080071, -77.675077,'M') * 5280 ;

    this.canvas.width = this.WIDTH;
    this.canvas.height = this.HEIGHT;
    this.ctx = this.canvas.getContext('2d');

    console.log(this.canvas.width);
    console.log(this.canvas.height);


    this.orginLong = -77.685272;
    this.originLat = 43.088647;
    
   
    
    this.drawLib= app.drawLib;
    
    this.update();
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

    if (unit=="K") { dist = dist * 1.609344 };

    if (unit=="N") { dist = dist * 0.8684 };

    return dist;


  },
		
	draw: function()
	{
    //ctx,centerX, centerY, radius,col
    //ctx, x, y, w, h, col
//43.084492, -77.679932

    var radius = 50;
    var pLong = -77.679932;
    var pLat = 43.084492;

    var x = this.getDistance(pLat,this.orginLong,pLat,pLong,'M') * 5280;
    var y = this.getDistance(this.originLat,pLong,pLat,pLong,'M') * 5280;

    app.drawLib.circle(this.ctx,x,y,radius,'#ff0000');
		
    //console.log(x,y);
		
	},
	
	
	update: function()
	{
		requestAnimationFrame(this.update.bind(this));

		
		
		this.draw();
	},
	
	
	
    
    
};

	
window.onload = function() {

	app.main.init();
}