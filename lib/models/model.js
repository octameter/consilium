function Model() {
	
	this.msProTag = Number(24 * 60 * 60 * 1000);
	
	this.intro =  "Diese App soll Ihnen als Logbuch für den Verlauf Ihrer Therapie dienen. Wir empfehlen, dass Sie jeden Tag einmal Ihr subjektives Wohlbefinden eintragen. Ihre Eintrag erscheint erst am nächsten Tag im Verlauf.<br/><br/>Sollten weitere Symptome auftreten, fügen Sie diese dem Verlauf hinzu.</br>";
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

Model.prototype.reset = function()
{
	this.atomuhr.addStunden = 0;
	
	this.data.punkte = [];
};

/**
 * punkt x:LocalTimeInMs, y [0 - 100], id: type.id
 */
Model.prototype.data = {

		punkte : 
		[
          	{"x":1359158900701,"y":84,"id":"10016256"},
          	{"x":1359176902602,"y":61,"id":"10016256"},
          	{"x":1359194904050,"y":40,"id":"10025482"},
          	{"x":1359212904578,"y":78,"id":"10016256"},
          	{"x":1359258900701,"y":84,"id":"10016256"},
          	{"x":1359276902602,"y":61,"id":"10016256"},
          	{"x":1359294904050,"y":40,"id":"10025482"},
          	{"x":1359312904578,"y":78,"id":"10016256"},
          	{"x":1359330905202,"y":87,"id":"10025482"},
          	{"x":1359348906115,"y":59,"id":"10016256"},
          	{"x":1359366906675,"y":37,"id":"10013963"},
          	{"x":1359384907275,"y":69,"id":"10016256"}
	    ],
		          
		types : 
		[			 
		 	// http://www.rapidtables.com/web/color/RGB_Color.htm
			{ id: "10025482", title: "Subjektives Befinden", kategorie: "Allgemeinsymptome", zero: 100, farbwert:"rgba(154,205,50,0.9)",
				info: "100% - Normale uneingeschränkte Aktivität wie vor der Erkrankung.<br>"+
					  " 80% - Einschränkung bei körperlicher Anstrengung, aber gehfähig; leichte körperliche Arbeit bzw. Arbeit im Sitzen (z.B. leichte Hausarbeit oder Büroarbeit) möglich.<br>"+
					  " 60% - Gehfähig, Selbstversorgung möglich, aber nicht arbeitsfähig; kann mehr als 50% der Wachzeit aufstehen.<br>"+
				      " 40% - Nur begrenzte Selbstversorgung möglich; 50% oder mehr der Wachzeit an Bett oder Stuhl gebunden.<br>"+
				      " 20% - Völlig pflegebedürftig, keinerlei Selbstversorgung möglich; völlig an Bett oder Stuhl gebunden.",
			},
			
			{ id: "10016256", title: "Müdigkeit", kategorie: "Allgemeinsymptome",  farbwert :"rgba(0,139,139,0.9)",
				info: "100% - Sehr starke Symptome<br>"+
				  " 80% - Starke Symptome<br>"+
				  " 60% - Mässige Symptome<br>"+
			      " 40% - Milde Symptome<br>"+
			      " 20% - Sehr milde Symptome"	
			},
			{ id: "10013963", title: "Atemnot", kategorie: "Atemwege",  farbwert:"rgba(40,210,230,0.9)",
				info: "100% - Sehr starke Symptome<br>"+
				  " 80% - Starke Symptome<br>"+
				  " 60% - Mässige Symptome<br>"+
			      " 40% - Milde Symptome<br>"+
			      " 20% - Sehr milde Symptome"			
			},
			
			{ id: "10013950", title: "Schluckstörung", kategorie: "Hals, Nase, Ohren", farbwert:"rgba(160,200,200,0.9)",
				info: "100% - Sehr starke Symptome<br>"+
				  " 80% - Starke Symptome<br>"+
				  " 60% - Mässige Symptome<br>"+
			      " 40% - Milde Symptome<br>"+
			      " 20% - Sehr milde Symptome"		
			},
			{ id: "10012727", title: "Durchfall", kategorie: "Magen- und Darmsystem", farbwert:"rgba(0,206,209,0.9)",
				info: "100% - Sehr starke Symptome<br>"+
				  " 80% - Starke Symptome<br>"+
				  " 60% - Mässige Symptome<br>"+
			      " 40% - Milde Symptome<br>"+
			      " 20% - Sehr milde Symptome"		
			},
			
			{ id: "6", title: "Ödeme an Armen und Beine", kategorie: "Ödeme", farbwert:"rgba(64,224,208,0.9)",
				info: "100% - Sehr starke Symptome<br>"+
				  " 80% - Starke Symptome<br>"+
				  " 60% - Mässige Symptome<br>"+
			      " 40% - Milde Symptome<br>"+
			      " 20% - Sehr milde Symptome"		
			},
			{ id: "10050068", title: "Trockene Augen", kategorie: "Augen", farbwert:"rgba(175,238,238,0.9)",
				info: "100% - Sehr starke Symptome<br>"+
				  " 80% - Starke Symptome<br>"+
				  " 60% - Mässige Symptome<br>"+
			      " 40% - Milde Symptome<br>"+
			      " 20% - Sehr milde Symptome"		
			},
			
			{ id: "10037868", title: "Hautausschlag", kategorie: "Haut und Haare", farbwert:"rgba(70,130,180,0.9)",
				info: "100% - Sehr starke Symptome<br>"+
				  " 80% - Starke Symptome<br>"+
				  " 60% - Mässige Symptome<br>"+
			      " 40% - Milde Symptome<br>"+
			      " 20% - Sehr milde Symptome"		
			},
			{ id: "10020772", title: "Bluthochdruck", kategorie: "Herz- und Kreislaufsystem", farbwert:"rgba(95,158,160,0.9)",
				info: "100% - Sehr starke Symptome<br>"+
				  " 80% - Starke Symptome<br>"+
				  " 60% - Mässige Symptome<br>"+
			      " 40% - Milde Symptome<br>"+
			      " 20% - Sehr milde Symptome"		
			},
			{ id: "10059827", title: "Erkältung", kategorie: "Infekt", farbwert:"rgba(30,144,255,0.9)" ,
				info: "100% - Sehr starke Symptome<br>"+
				  " 80% - Starke Symptome<br>"+
				  " 60% - Mässige Symptome<br>"+
			      " 40% - Milde Symptome<br>"+
			      " 20% - Sehr milde Symptome"		
			},
			
			{ id: "10046593", title: "Harndrang", kategorie: "Niere und Harnblase", farbwert:"rgba(0,0,205,0.9)",
				info: "100% - Sehr starke Symptome<br>"+
				  " 80% - Starke Symptome<br>"+
				  " 60% - Mässige Symptome<br>"+
			      " 40% - Milde Symptome<br>"+
			      " 20% - Sehr milde Symptome"		
			},
			{ id: "10038743", title: "Unruhe", kategorie: "Psyche", farbwert:"rgba(65,105,225,0.9)",
				info: "100% - Sehr starke Symptome<br>"+
				  " 80% - Starke Symptome<br>"+
				  " 60% - Mässige Symptome<br>"+
			      " 40% - Milde Symptome<br>"+
			      " 20% - Sehr milde Symptome"		
			},
			{ id: "10017999", title: "Bauchschmerzen", kategorie: "Schmerzen", farbwert:"rgba(135,206,235,0.9)",
				info: "100% - Sehr starke Symptome<br>"+
				  " 80% - Starke Symptome<br>"+
				  " 60% - Mässige Symptome<br>"+
			      " 40% - Milde Symptome<br>"+
			      " 20% - Sehr milde Symptome"		
			},
			
			{ id: "10015090", title: "Nasenbluten", kategorie: "Blutungen", farbwert:"rgba(70,130,180,0.9)",
				info: "100% - Sehr starke Symptome<br>"+
				  " 80% - Starke Symptome<br>"+
				  " 60% - Mässige Symptome<br>"+
			      " 40% - Milde Symptome<br>"+
			      " 20% - Sehr milde Symptome"		
			}			                        
		]
};

Model.prototype.addPunkt = function( punkt )
{	
	punkt.x = Number( punkt.x );
	
	this.data.punkte.unshift( punkt );
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

/**
 * Selected ID Ascending and newest Time descending
 * @param id
 */
Model.prototype.sortPunkteByTime = function(id)
{
	var punkte = this.data.punkte;
	
	var ids = this.getUniquePunkte(id);
	
	// Sort by Id and Time
	punkte.sort( function( a, b )
	{
		// ID Ascending
		if(ids.indexOf(b.id) !== ids.indexOf(a.id))
		{
			return ids.indexOf(a.id) - ids.indexOf(b.id);
		}
		// ID Descending
		if(ids.indexOf(b.id) === ids.indexOf(a.id))
		{
			return ( b.x - a.x );				
		}
	});
};

/**
 * 
 * @param id
 * @returns
 */
Model.prototype.getUniquePunkte = function(id)
{
	// Copy Array
	var punkte = this.data.punkte.slice(0);
	// First the selected element 
	var ids = [];
	ids.unshift( String( id ) );
	
	// than descending by time
	punkte.sort( function( a,b)
	{
		return ( b.x - a.x);
	});
	
	// Unique ids
	punkte.forEach( function(element, index)
	{		
		if( ids.indexOf( element.id ) === -1 && element.id !== id)
		{
			ids.push( element.id );
		}
	});	
	
	return ids;
};

Model.prototype.getTypesByPunkt = function( id )
{	
	var ids = this.getUniquePunkte(id);

	var that = this;
	var types = [];
	
	ids.forEach( function(element, index) 
	{
		types.push( that.getType( element ) );		
	});	
	
	types.reverse();
	
	return types;
};

Model.prototype.getType = function( id, value )
{
	id = String( id );

	for( var i = 0; i < this.data.types.length; i++)
	{
		if( this.data.types[i].id === id )
		{
			return (value) ?  this.data.types[i][value] : this.data.types[i];				
		}
	}
};

Model.prototype.getPunkt = function( id, value )
{	
	id = String( id );
	
	for( var i = 0; i < this.data.punkte.length; i++)
	{
		if( this.data.punkte[i].id === id )
		{
			return (value) ?  this.data.punkte[i][value] : this.data.punkte[i];				
		}
	}	
};

