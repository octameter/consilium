function Model() {
	
	this.msProTag = Number(24 * 60 * 60 * 1000);
}


Model.prototype.atomuhr = {

		addStunden : 0, 

		zeit : function() 
		{		
			var now = new Date();
			
			now.setTime( (this.addStunden * 60 * 60 * 1000) + now.getTime() );
			// Testing
			return now.getTime();
			// LIVE
			// return new Date().getTime();
		}
};
/**
 * punkt x:LocalTimeInMs, y [0 - 100], id: type.id
 */
Model.prototype.data = {

		punkte : [],
		
		type : 
		[			 
			{ id: 1, title: "Subjektives Befinden", kategorie: "Allgemeinsymptome", farbwert:"rgba(55,225,55,0.6)" },
			
			{ id: 2, title: "Müdigkeit", kategorie: "Allgemeinsymptome", farbwert :"rgba(155,55,55,0.6)" },
			{ id: 3, title: "Atemnot", kategorie: "Atemwege", farbwert:"rgba(55,55,55,0.6)" },
			
			{ id: 4, title: "Schluckstörung", kategorie: "Hals, Nase, Ohren", farbwert:"rgba(55,155,55,0.6)" },
			{ id: 5, title: "Durchfall", kategorie: "Magen- und Darmsystem", farbwert:"rgba(55,255,55,0.6)" },
			
			{ id: 6, title: "Ödeme an Armen und Beine", kategorie: "Ödeme", farbwert:"rgba(55,55,155,0.6)" },
			{ id: 7, title: "Trockene Augen", kategorie: "Augen", farbwert:"rgba(55,55,255,0.6)" },
			
			{ id: 8, title: "Hautausschlag", kategorie: "Haut und Haare", farbwert:"rgba(155,155,55,0.6)" },
			{ id: 9, title: "Bluthochdruck", kategorie: "Herz- und Kreislaufsystem", farbwert:"rgba(155,155,155,0.6)" },
			{ id: 10, title: "Erkältung", kategorie: "Infekt", farbwert:"rgba(155,155,255,0.6)" },
			
			{ id: 11, title: "Harndrang", kategorie: "Niere und Harnblase", farbwert:"rgba(55,155,155,0.6)" },
			{ id: 12, title: "Unruhe", kategorie: "Psyche", farbwert:"rgba(155,55,155,0.6)" },
			{ id: 13, title: "Bauchschmerzen", kategorie: "Schmerzen", farbwert:"rgba(155,155,55,0.6)" },
			
			{ id: 14, title: "Nasenbluten", kategorie: "Blutungen", farbwert:"rgba(155,200,155,0.6)" }			                        
		]
};

Model.prototype.addPunkt = function( punkt )
{	
	this.data.punkte.push( punkt );
	
	console.log( "Add Punkt", punkt.x, punkt.y);
};

Model.prototype.getMinX = function()
{	
	// Default 14 Tage zurück
	var minX = this.atomuhr.zeit() - ( 14 * 24 * 60 * 60 * 1000 );

	var size = this.data.punkte.length;
	
	while(size--)
	{
		minX = Math.min( this.data.punkte[size].x, minX);
	}
	
	minX = Math.floor( minX / this.msProTag) * this.msProTag;
	
	return minX;	
};

Model.prototype.getTypeFarbwert = function( id )
{
	var farbwert = null;
	
	for( var i = 0; i < this.data.type.length; i++)
	{
		if(this.data.type[i].id == id)
		{
			farbwert = this.data.type[i].farbwert;
		}
	}
	
	return farbwert;
};
