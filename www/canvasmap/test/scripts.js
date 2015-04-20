var exhibits = new Array();
var userPrefrences = new Array();
var rec = new Array();
var queued = new Array();
queued = [];//Get Queued Array
rec = []; //Fill Recomendations
 // Get Exhibits (DB CALL);
userPrefrences = ['CPU','DES','SCI'];

visitedExhibits = [];

var user = {
	x: 50,
	y: 50,
	radius: 10,
};

function logStuff(){
	addVisitedEx();
	addPref();

	for(var i = 0; i < userPrefrences.length; i++){
		console.log("Pref: " + userPrefrences[i]);
	}
	console.log("User.x: " + user.x , "User.y: " + user.y);
	for(var j = 0; j < rec.length; j ++){
		var r = rec[j];
		console.log("Rec: " + r.name);
	}
	for(var k = 0; k < visitedExhibits.length; k++){
		console.log('Visted:'+visitedExhibits[k].name);
	}
}

function getDistance( point1, point2 )
{
  var xs = 0;
  var ys = 0;
 
  xs = point2.x - point1.x;
  xs = xs * xs;
 
  ys = point2.y - point1.y;
  ys = ys * ys;
 
  return Math.sqrt( xs + ys );
}

//Recomendations
function addRec(){
for(var i = 0; i < exhibits.length; i++){
	var n = 0;
	
		for(var g = 0; g < exhibits[i].tags.length; g++){
		    for(var j = 0; j < userPrefrences.length; j++){
			
			   //add another loop to get tages array
			   if(exhibits[i].tags[g] == userPrefrences[j]){
				  n +=50;
			     }
			}
		}  
		var dist = getDistance(exhibits[i], user);
		n -= dist;

		for(var k = 0; k < queued.length; k++){
			if(exhibits[i] == queued[k]){
				n = 0;
			}
		}
		if(checkCol(user,exhibits[i])){
			n= 0;
			//console.log(exhibits[i].name + 'Collision');
		}
		
		//console.log(exhibits[i].name+":",n);
		if(n > 10 && rec.length < 10){
			//console.log("yay");
					rec.push(exhibits[i]);			
			}
	}
}
 function checkCol(a,b){
		var circle1 = {radius: a.radius, x: a.x, y: a.y};
		var circle2 = {radius: b.radius, x: b.x, y: b.y};
		var dx = (circle1.x  ) - (circle2.x  );
		var dy = (circle1.y ) - (circle2.y );
		var distance = Math.sqrt(dx * dx + dy * dy);

		//console.log(b.radius, b.x, b.y);
		if (distance < circle1.radius + circle2.radius) {return true;}
		else{ return false;}
}
function addVisitedEx(){
	for(var i = 0; i < exhibits.length; i ++){
		if(checkCol(user, exhibits[i])){
			visitedExhibits.push(exhibits[i]);
		}
	}
}

function addPref(){

var requiredVisits = 2;
for(var i = 0; i < exhibits.length; i++){
	
   if(checkCol(user,exhibits[i])){ //changr this to triggerd Timed event for museum exhibit
	  
	  	for(var k = 0; k < exhibits[i].tags.length; k ++){
			var curTag = exhibits[i].tags[k];
			n = 0;
			//console.log(curTag);
			for(var j = 0; j < visitedExhibits.length; j++){
				var vEX = visitedExhibits[j];
				for(var w = 0; w < vEX.tags.length; w++){
					var Vtag = vEX.tags[w];
					
					//console.log(Vtag);
					if(curTag == Vtag){
						n ++;
						//console.log(curTag + ": n = " + n);
						
					}

		  		}
		 	}
		
		if(n > requiredVisits){
				//console.log("MeetsRec: " +curTag);
				if(userPrefrences.indexOf(exhibits[i].tags[k]) > -1){
					//console.log("already Exist:" + exhibits[i].tags[k]);
				}
				else{
					userPrefrences.push(exhibits[i].tags[k]);
					 
				}
			}
				
			
		}
	}
   }
 
 //console.log(n);
}

exhibits = [
{
	x:50,
	y:50,
	tags:['MATH','SCI','ART'],
	name:"Mathfest",
	radius: 50,
},
{
	x:50,
	y:50,
	tags:['CPU','ENG','ART'],
	name:"computerfest",
	radius: 50,
},
{
	x:50,
	y:50,
	tags:['CPU','SCI', 'NM' ,'ART'],
	name:"ComputerScience",
	radius: 50,

},
{
	x:50,
	y:50,
	tags:['CPU','ART', 'DES' , 'NM'],
	name:"ESPY",
	radius: 50,
},
{
	x:50,
	y:50,
	tags:['MATH','ART'],
	name:"math as art",
	radius: 50,
},
{
	x:50,
	y:50,
	tags:['LA','ART'],
	name:"Lib Arts",
	radius: 50,
},
{
	x:50,
	y:50,
	tags:['SCI','ENG'],
	name:"Building stuff",
	radius: 50,
},
];