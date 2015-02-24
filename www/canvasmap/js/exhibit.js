

"use strict"

var app = app || {};

app.Exhibit = function()
{
	
	function Exhibit(radius, x, y, name)
	{
	
		this.radius = radius;
		this.x = x; 
		this.y = y;
		this.color = "#ff0000";
		this.name  = name;
		
		
	}
	
	var p = Exhibit.prototype;
	
	p.constructor = function()
	{
		
	}
	
	p.update = function()
	{
		
	};
	
	p.draw = function(ctx)
	{
		
		app.drawLib.circle(ctx, this.x, this.y, this.radius, this.color);
		
	};
	
	
	
	
	
	return Exhibit;
}();