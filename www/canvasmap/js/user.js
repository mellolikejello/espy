"use strict";
var app = app || {};

app.user= {
	
    radius:2.5 ,
	color: "blue",

	image: undefined,


	
	
	draw: function(ctx,x,y){
		
			app.drawLib.circle(ctx, x, y, this.radius, this.color);
			
			
	
	
	},

};