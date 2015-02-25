

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
		
		app.drawLib.circle(ctx, this.x, this.y, this.radius, this.color,1);
		
	};
	
	return Exhibit;
}();

app.ExhibitCollider = function()
{
	
	function ExhibitCollider(radius, x, y, name)
	{
	
		this.radius = radius;
		this.x = x; 
		this.y = y;
		this.color = "#00BFFF";
		this.name  = name;
		}
	
	var ec = ExhibitCollider.prototype;
	
	
	ec.update = function()
	{
		
	};
	
	ec.draw = function(ctx)
	{
		
		app.drawLib.circle(ctx, this.x, this.y, this.radius, this.color, 0.3);
		
	};
	
	return ExhibitCollider;
}();