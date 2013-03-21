function Model() {}


Model.prototype.addFavorite = function( type, id )
{
	this.data["favorites"][type].unshift( { id: String( id ), edit: true } );
};

Model.prototype.hasFavoriteEdit = function( type )
{
    var found = false;
    
    this.data["favorites"][type].forEach( function(element, index)
	{
		if(element.edit) found = true;
	});
    
    return found;
};
Model.prototype.removeFavorite = function( type, item )
{
	var idx = -1;
    
	this.data["favorites"][type].forEach( function(element, index)
	{
		if(element.id == item.id ) idx = index;
	});
	
    if( idx > -1)
	this.data["favorites"][type].splice(idx,1);
};


Model.prototype.getMinX = function()
{	
	// Default 14 Tage zurück
	var minX = new Date().getTime() - ( 14 * 24 * 60 * 60 * 1000 );

	var size = this.data.punkte.length;
	
	while(size--)
	{
		minX = Math.min( this.data.punkte[size].x, minX);
	}
	
	return zeit( "dawn", minX );	
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
 * SORT ALL SYMPTOMS NOT IN FAVORITES
 * @returns ARRAY
 */
Model.prototype.getSymptome = function()
{    
	var symptome = this.dict["Symptome"].notIn( "id", this.data.favorites.Symptome );
    
    symptome.sortABC( "title" );

	return symptome;
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
	punkte.push( String( id ) );
	
	// than descending by time
	punkte.sort123("x"); 
	
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
/**
* RETURNS TYPE OBJECT FOR KEY
**/
Model.prototype.getType = function( id )
{
	var dictionary = [].concat(this.dict["Symptome"], this.dict["Bewertung"], this.dict["Tagebuch"], this.dict["Tipps"]);
	
	for( var i = 0; i < dictionary.length; i++)
	{
		if( dictionary[i].id === id ) return dictionary[i];
	}
};
/**
* RETURNS INFO (TYPE) ACCORDING TO Y RANGE
**/
Model.prototype.getGrad = function( id, value )
{
	var grad = this.getType(id).grad;
    
    for( var i = 0; i < grad.length; i++)
	{
		if( grad[i].min <= value && grad[i].max >= value) return grad[i];
	}
};
/**
* ADD MOST RECENT DATA POINT
**/
Model.prototype.addPunkt = function( punkt )
{	
	this.data.punkte.unshift( punkt );
};

/**
* RETURNS MOST RECENT DATA POINT FOR KEY (TYPE)
*/
Model.prototype.getPunkt = function( id )
{	
	for( var i = 0; i < this.data.punkte.length; i++)
	{
		if( this.data.punkte[i].id === id ) return this.data.punkte[i];				
	}	
};

Model.prototype.removePunkt = function( punkt )
{
	for( var i = 0; i < this.data.punkte.length; i++)
	{
		if( this.data.punkte[i].id === punkt.id && this.data.punkte[i].x == punkt.x) this.data.punkte.splice(i,1);				
	}	
};

/**
* DATA  {Type, Value, Key (x)}
* RETURNS TIPS ACCORDING TO Y RANGE
**/
Model.prototype.getEmpfehlungen = function( data )
{	
	var tippsIds = this.getGrad(data.type, data.value).tipps;
	
	var _tipps = [];

	if(!tippsIds) return _tipps;
	
	var rows = tippsIds.split(",");	
 
	for( var i = 0; i < rows.length; i++)
	{
		_tipps.push( this.getType( rows[i] ));
	}
	
    return _tipps;
};
/**GETTER AND SETTER 
 * STUPID IE
 * Model.prototype.__defineGetter__("favoritesEdit" function() { return this._state.favoritesEdit;  });
 * Model.prototype.__defineSetter__("favoritesEdit", function( value ) { this._state.favoritesEdit = value; });
 * Model.prototype.__defineGetter__("currentItem", function() { return this._state.currentItem;  });
 * Model.prototype.__defineSetter__("currentItem", function( value ) { this._state.currentItem = value; });
 * Model.prototype.__defineGetter__("introShow", function() { return this._state.introShow;  });
 * Model.prototype.__defineSetter__("introShow", function( value ) { this._state.introShow = value; });
 */
Model.prototype.getStateFavEdit = function() { return this._state.favoritesEdit; };
Model.prototype.setStateFavEdit = function( value ) { this._state.favoritesEdit = value; };
Model.prototype.getStateSymptom = function() { return this._state.currentItem;};
Model.prototype.setStateSymptom = function( value ) { this._state.currentItem = value;};
Model.prototype.getStateTipp = function() { return this._state.tipItem;};
Model.prototype.setStateTipp = function( value ) { this._state.tipItem = value; };
Model.prototype.getStateIntro = function() { return this._state.introShow;  };
Model.prototype.setStateIntro = function( value ) { this._state.introShow = value; };

/**
 * APP STATUS
 */ 
Model.prototype._state = 
{
    currentItem: null,
    tempItem: null,
    favoritesEdit: false,
    favitEdit:false,
    tipItem: null,
    introShow: false
};
/**
 * Punkt x:LocalTimeInMs, y [0 - 100], id: type.id
 */
Model.prototype.data = 
{
		punkte: 
		[
			 {"x":1359294904050,"y":40,"id":"10025482"},
			 {"x":1359330905202,"y":87,"id":"10025482"},
			 {"x":1359194904050,"y":40,"id":"10025482"},			 	

		 	 {"x":1359158900701,"y":84,"id":"10016256"},
		 	 {"x":1359176902602,"y":61,"id":"10016256"},
		 	 {"x":1359212904578,"y":78,"id":"10016256"},
		 	 {"x":1359258900701,"y":84,"id":"10016256"},
		 	 {"x":1359276902602,"y":61,"id":"10016256"},
		 	 {"x":1359312904578,"y":78,"id":"10016256"},
		 	 {"x":1359348906115,"y":59,"id":"10016256"},
		 	 {"x":1359366906675,"y":37,"id":"10013963"},
		 	 {"x":1359384907275,"y":69,"id":"10016256"},	 
		 	 {"x":1363265891430, "y": "90", "id": "10015090"},

		 	 {"x":1363265891430, "y": "adsf", "id": "privat"} 	 	
		],
	    favorites:
	    {
	    	Bewertung:
	     	[
	     	 	{id : "10025482"}
	     	],
	     	Symptome:
	     	[
	     	 	{ id: "10016256", edit:"true"},
	     	 	{ id: "10013963", edit:"true"}
	     	],
			Tagebuch:
			[
			 	{ id: "privat"}
			 ]
	    }
};

// TIPP DISPLAY COUNTER
// data { liked: true || false }
Model.prototype.setTipp = function( data )
{
	var tip = this.getStateTipp();
	
	( data.liked ) ? tip.likes++ : tip.dislikes++;
	this.dict["Tipps"].changeItem( tip.id, "likes", tip.likes);
	this.dict["Tipps"].changeItem( tip.id, "dislikes", tip.dislikes);
	
	this.trackPunktTipp( (data.liked) ? "liked" : "disliked" );
};
/**
 * data { property : "liked" || "disliked" || "clicked" }
 */
Model.prototype.trackPunktTipp = function( property )
{
	var tippId = this.getStateTipp().id;
	
	for( var i = 0; i < this.data.punkte.length; i++)
	{
		var punkt = this.data.punkte[i];
				
		if( punkt.id == this.getStateSymptom().id && punkt.x == this.getStateSymptom().x)
		{
			if( ! punkt.tipps ) this.data.punkte[i].tipps = [];

			var tipp = this.data.punkte[i].tipps.getId( tippId );
			
			if(tipp)
			{
				var value = tipp[property] || 0;
				this.data.punkte[i].tipps.changeItem(tippId, property, value + 1);
			}
			else
			{
				var trackTipp = {};
				
				trackTipp[ "id" ] = tippId; 				
				trackTipp[ property ] = 1; 
				
				this.data.punkte[i].tipps.push( trackTipp );					
			}
		}
	}
};

Model.prototype.trackPunktLiked = function()
{
	var tippId = this.getStateTipp().id;
	
	for( var i = 0; i < this.data.punkte.length; i++)
	{
		var punkt = this.data.punkte[i];
				
		if( punkt.id == this.getStateSymptom().id && punkt.x == this.getStateSymptom().x)
		{
			if( ! punkt.tipps ) this.data.punkte[i].tipps = [];

			var tipp = this.data.punkte[i].tipps.getId( tippId );
			
			if(tipp)
			return (tipp.liked || tipp.disliked);
		}
	}
	return false;
};



//Model.prototype.hasPunkteTipp = function()
//{
//	var tip = this.getStateTipp();
//	var item = this.getStateSymptom();
//	
//	return .tipps
//};

Model.prototype.dict =
{
		Intro:
		[
		 	{ id: "introDefault", title:"Liebe Patientin",
		 		bausteine: [
		 		             "Die App dient Ihnen als persönliches Logbuch für Ihr Wohlbefinden während der medizinischen Therapie.",
		 		             "Wir empfehlen die App tägliche zu nutzen. Rückwirkend kann für maximal drei Tage ihre Bewertung nachgetragen werden. Sollte die Eingabe länger unterbrochen werden, beginnt die Verbindungslinie neu.",
		 		             "Erweitern Sie Ihre Auswahlliste nach Bedarf durch Ergänzung weiterer Symptome."
		 		            ]		 						  
		 	}
		 ],
		Bewertung:
		[
			{ id: "10025482", title:"Subjektives Befinden", kategorie:"Lebensqualität", zero:100, farbwert:"rgba(154,205,50,0.9)",
				  grad:[ 	
					  	{ info:"Normale uneingeschränkte Aktivität wie vor der Erkrankung.", max:100, min:81},
					  	{ info:"Einschränkung bei körperlicher Anstrengung, aber mobil." ,max:80, min:61 },
					  	{ info:"Selbstversorgung möglich, aber nicht arbeitsfähig.", max:60, min:41},
						{ info:"Nur begrenzte Selbstversorgung möglich.", max:40, min:21},
						{ info:"Völlig pflegebedürftig, keinerlei Selbstversorgung möglich.", max:20, min:0}
					]			 
			}
		],
		Tagebuch :
		[
		 	{ id: "privat", title:"Private Memo", kategorie:"Notizen", zero:"", farbwert:"rgba(255,100,100,0.9)"},
		 	{ id: "diagnose", title:"Diagnose", kategorie:"Notizen", zero:"", farbwert:"rgba(255,100,100,0.9)"},
		 	{ id: "zyklus", title:"Zyklus", kategorie:"Notizen", zero:"", farbwert:"rgba(255,100,100,0.9)"}
		 ],
		Symptome : 
		[			 
			{ id: "10016256", title: "Müdigkeit", kategorie: "Allgemeinsymptome", zero:0, farbwert :"rgba(0,139,139,0.9)",
			  grad:[ 	
				  	{ info:"Sehr starke Müdigkeit, auch in Ruhe, Selbstversorgung (z.B. Ankleiden und Waschen) ist unmöglich.", max:100, min:81},
				  	{ info:"Starke Müdigkeit, auch in Ruhe, Selbstversorgung (z.B. Ankleiden und Waschen) stark eingeschränkt möglich, Arbeitsunfähigkeit." ,max:80, min:61 },
				  	{ info:"Mässige Müdigkeit, besteht auch bei Ruhe, deutliche Einschränkung im Alltag, Arbeitsfähigkeit stark eingeschränkt.", max:60, min:41},
					{ info:"Leichte Müdigkeit, bessert sich nach Ruhe, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21},
					{ info:"Sehr milde Müdigkeit, ohne Einschränkung im Alltag und bei der täglichen Arbeit.", max:20, min:0}
				]  
			},
		  { id: "10013963", title: "Atemnot", kategorie: "Atemwege", zero:0, farbwert:"rgba(40,210,230,0.9)",
			grad:[ 	
				  	{ info:"Sehr starke Atemnot, auch in Ruhe, Selbstversorgung (z.B. Ankleiden und Waschen) ist unmöglich.", max:100, min:81},
				  	{ info:"Starke Atemnot auch in Ruhe, Selbstversorgung (z.B. Ankleiden und Waschen) stark eingeschränkt möglich, Arbeitsunfähigkeit." ,max:80, min:61 },
				  	{ info:"Mässige Atemnot bei leichter Belastung mit deutlicher Einschränkung im Alltag und bei der Arbeit.", max:60, min:41},
					{ info:"Leichte Atemnot bei leichter Belastung aber ohne Einschränkung im Alltag und bei der Arbeit.", max:40, min:21},
					{ info:"Sehr leichte Atemnot bei normaler Belastung.", max:20, min:0}
				]  
			}, 
		  { id: "10013950", title: "Schluckstörung", kategorie: "Hals, Nase, Ohren", zero:0,  farbwert:"rgba(160,200,200,0.9)",
		    grad:[ 	
			  	{ info:"Sehr starke Schluckbeschwerden, normale Nahrungs- oder Flüssigkeitsaufnahme ist nicht mehr möglich.", max:100, min:81},
			  	{ info:"Starke Schluckbeschwerden, normale Nahrungs- und Flüssigkeitsaufnahme ist kaum mehr möglich." ,max:80, min:61 },
			  	{ info:"Mässige Schluckbeschwerden, erschwerte und eingeschränkte Nahrungsaufnahme (z.B. Verwendung weicher oder flüssiger  Nahrungsmittel).", max:60, min:41},
				{ info:"Milde aber deutliche Schluckbeschwer ohne relevante Einschränkung der Nahrungsaufnahme.", max:40, min:21},
				{ info:"Sehr milde Symptome, unveränderte Nahrungsaufnahme.", max:20, min:0}
			]  
		  }, 
		  { id: "10012727", title: "Durchfall", kategorie: "Magen- und Darmsystem", zero:0, farbwert:"rgba(0,206,209,0.9)",
			  grad:[ 	
				  	{ info:"Sehr starke Symptome, Selbstversorgung aufgrund Häufigkeit des Symptoms nicht mehr möglich.", max:100, min:81},
				  	{ info:"Starke Symptome, wässrige Stuhlgänge mehr als 7 Mal pro Tag, starke Einschränkung im Alltag und Arbeitsunfähigkeit." ,max:80, min:61 },
				  	{ info:"Mässige Symptome, wässrige Stuhlgänge 4-6 Mal pro Tag, leichte Einschränkung im Alltag.", max:60, min:41},
					{ info:"Leichte Symptome, wässriger Stuhlgang unter 4 Mal pro Tag.", max:40, min:21},
					{ info:"Sehr milde gelegentliche Symptome, keine Einschränkung im Alltag.", max:20, min:0}
				]  
			}, 
		   { id: "10050068", title: "Ödeme an Gliedmassen", kategorie: "Ödeme",zero:0, farbwert:"rgba(64,224,208,0.9)",
			  grad:[ 	
				  	{ info:"Sehr starke Schwellung, starke Bewegungseinschränkung, Selbstversorgung (z.B. Ankleiden und Waschen) ist unmöglich.", max:100, min:81},
				  	{ info:"Starke Schwellung mit Bewegungseinschränkung, starkes Spannungsgefühl und deutliche Veränderung der Körperkontur." ,max:80, min:61 },
				  	{ info:"Mässige sichtbare Schwellung, Auslöschung von Hautfalten, veränderte Körperkontur, leichte Einschränkung im Alltag.", max:60, min:41},
					{ info:"Leichte sichtbare Schwellung mit erhöhtem Spannungsgefühl, leichte Hautstrukturveränderung.", max:40, min:21},
					{ info:"Sehr leichte Schwellung, leichtes Spannungsgefühl aber keine Veränderung der Hautstruktur.", max:20, min:0}
				]  
			}, 
			{ id: "10013774", title: "Trockene Augen", kategorie: "Augen",zero:0,  farbwert:"rgba(175,238,238,0.9)",
			  grad:[ 	
				  	{ info:"Sehr starke Symptome, Selbstversorgung stark eingeschränkt durch Seheinschränkung.", max:100, min:81},
				  	{ info:"Starke Symptome, deutliche Einschränkung im Alltag (z.B. Lesen, Autofahren), Arbeitsfähigkeit ist stark eingeschränkt." ,max:80, min:61 },
				  	{ info:"Mässige Symptome, regelmässige Verwendung von Augentropfen notwendig, leichte Einschränkung im Alltag.", max:60, min:41},
					{ info:"Leichte Symptome, keine Einschränkung im Alltag, Augentropfen zur Befeuchtung sind ausreichend.", max:40, min:21},
					{ info:"Sehr milde Symptome, keine Einschränkung im Alltag.", max:20, min:0}
				]  
			}, 
		    { id: "10037868", title: "Hautausschlag", kategorie: "Haut und Haare",zero:0, farbwert:"rgba(70,130,180,0.9)",
			  grad:[ 	
				  	{ info:"Sehr starke Symptome (Juckreiz, Hautspannen, Rötung, Hautbrennen), lokal oder verteilt, Selbstversorgung unmöglich.", max:100, min:81},
				  	{ info:"Starke Symptome (Juckreiz, Hautspannen, Rötung, Hautbrennen), lokal oder verteilt, starke Einschränkung im Alltag und bei der Arbeit." ,max:80, min:61 },
				  	{ info:"Mässige Symptome, deutlicher Juckreiz, Hautspannen und Hautbrennen, lokal oder verteilt. Leichte Einschränkung im Alltag.", max:60, min:41},
					{ info:"Leichte Symptome, lokal eingeschränkt, leichte Rötung, leichter Juckreiz, Hautspannen oder Hautbrennen.", max:40, min:21},
					{ info:"Sehr milde Symptome, lokal eingeschränkt, keine Einschränkung im Alltag.", max:20, min:0}
				]  
			}, 
		    { id: "10020772", title: "Bluthochdruck", kategorie: "Herz- und Kreislaufsystem",zero:0,  farbwert:"rgba(95,158,160,0.9)",
			  grad:[ 	
				  	{ info:"Sehr schwerer Bluthochdruck über 190 mmHg (1. Wert).", max:100, min:81},
				  	{ info:"Schwerer Bluthochdruck mit Werten über 160 mmHg (1. Wert) oder über 100 mmHg (2. Wert)." ,max:80, min:61 },
				  	{ info:"Mässige Bluthochdruck mit 140-150 mmHg (1 Wert) oder 90-99 mmHg (2. Wert) oder plötzlicher Anstieg von mehr als 20 mmHg zum normalen Vorwert.", max:60, min:41},
					{ info:"Milder Bluthochdruck 130-139 mmHg (1. Wert) oder 80-89 mmHg.", max:40, min:21},
					{ info:"Sehr milde Symptome.", max:20, min:0}
				]  
			}, 
	
		    { id: "10059827", title: "Erkältung", kategorie: "Infekt",zero:0,  farbwert:"rgba(30,144,255,0.9)" ,
			  grad:[ 	
				  	{ info:"Sehr starke Symptome mit Einschränkung der Selbstversorgung (z.B. selbst Ankleiden und Waschen) ist unmöglich.", max:100, min:81},
				  	{ info:"Starke Symptome, Selbstversorgung (z.B. Ankleiden und Waschen) stark eingeschränkt möglich, Arbeitsunfähigkeit." ,max:80, min:61 },
				  	{ info:"Mässige Symptome, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41},
					{ info:"Leichte Symptome, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21},
					{ info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0}
				]  
			}, 
		    { id: "10046593", title: "Harndrang", kategorie: "Niere und Harnblase",zero:0, farbwert:"rgba(0,0,205,0.9)",
			  grad:[ 	
				  	{ info:"Sehr starke Symptome mit Einschränkung der Selbstversorgung (z.B. selbst Ankleiden und Waschen) ist unmöglich.", max:100, min:81},
				  	{ info:"Starke Symptome, hohe Toilettenfrequenz, Verlassen der Wohnung kaum möglich, Einschränkung des Alltags, Arbeitsunfähigkeit." ,max:80, min:61 },
				  	{ info:"Mässige Symptome, vermehrtes Wasserlassen, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41},
					{ info:"Leichte Symptome, häufigeres Wasserlassen, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21},
					{ info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0}
				]  
			}, 
		    { id: "10038743", title: "Unruhe", kategorie: "Psyche",zero:0,  farbwert:"rgba(65,105,225,0.9)",
			  grad:[ 	
				  	{ info:"Sehr starke Symptome, Selbstversorgung im Alltag ist unmöglich.", max:100, min:81},
				  	{ info:"Starke Symptome, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61 },
				  	{ info:"Mässige Symptome, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41},
					{ info:"Leichte Symptome, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21},
					{ info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0}
				]  
			}, 
		    { id: "10017999", title: "Bauchschmerzen", kategorie: "Schmerzen",zero:0,  farbwert:"rgba(135,206,235,0.9)",
			  grad:[ 	
				  	{ info:"Sehr starke nicht auszuhaltende Symptome, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81},
				  	{ info:"Stark anhaltende kaum auszuhaltende Schmerzen, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61 },
				  	{ info:"Mässige und anhaltende Symptome, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41},
					{ info:"Milde Symptome, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21},
					{ info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0}
				]  
			}, 
		    { id: "10047700", title: "Erbrechen", kategorie: "Magen- und Darmsystem",zero:0,  farbwert:"rgba(135,206,235,0.9)",
			  grad:[ 	
				  	{ info:"Sehr starkes und anhaltendes Erbrechen, Nahrungs- und Flüssigkeitsaufnahme unmöglich.", max:100, min:81},
				  	{ info:"Starkes Erbrechen über 6 Mal während 24 Stunden, Nahrungs- und Flüssigkeitsaufnahme stark eingeschränkt." ,max:80, min:61 },
				  	{ info:"Mässiges Erbrechen, 3-5 Mal während 24 Stunden, eingeschränkte Nahrungsaufnahme.", max:60, min:41},
					{ info:"Leichtes Erbrechen, bis maximal 2 Mal während 24h, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21},
					{ info:"Einmaliges Erbrechen, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0}
				]  
			}, 
		    { id: "10054524", title: "Hand-Fuss-Syndrom", kategorie: "Haut und Haare",zero:0,  farbwert:"rgba(135,206,235,0.9)",
				  grad:[ 	
					  	{ info:"Sehr schwere schmerzhafte Hautveränderung an Händen und Füssen, Selbstversorgung (z.B. Ankleiden und Waschen) ist unmöglich.", max:100, min:81},
					  	{ info:"Schwere schmerzhafte Hautveränderung an Händen und Füssen mit Hautschälung, Blasen, Blutungen, Schwellung und Schuppung." ,max:80, min:61 },
					  	{ info:"Mässige schmerzhafte Hautveränderungen mit Hautschälung, Blasenbildung und Schwellung.", max:60, min:41},
						{ info:"Leichte Hautveränderung an Händen oder Füssen mit Rötung, Schuppung und Schwellung, aber schmerzfrei.", max:40, min:21},
						{ info:"Sehr milde Hautveränderung, leichte Schuppung und Rötung an Händen oder Füssen, schmerzfrei.", max:20, min:0}
					]  
				},
			{ id: "10028813", title: "Übelkeit", kategorie: "Allgemeinsymptome",zero:0,  farbwert:"rgba(135,206,235,0.9)",
			  grad:[ 	
				  	{ info:"Sehr starke Symptome, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81},
				  	{ info:"Stark anhaltende Symptome, ungenügende Nahrungs- und Flüssigkeitsaufnahme, deutlicher Gewichtsverlust." ,max:80, min:61 },
				  	{ info:"Mässige und anhaltende Symptome, Einschränkung in Nahrungsaufnahme und beginnender Gewichtverlust.", max:60, min:41},
					{ info:"Leichte Symptome, Appetitverlust aber unveränderte Nahrungsaufnahme.", max:40, min:21},
					{ info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0}
				]  
			},		
			{ id: "10016558", title: "Fieber", kategorie: "Allgemeinsymptome",zero:0,  farbwert:"rgba(135,206,235,0.9)",
			  grad:[ 	
				  	{ info:"Schweres anhaltendes Fieber, über 40°C über 24 Stunden Dauer.", max:100, min:81},
				  	{ info:"Schweres Fieber über 40°C während 24Stunden." ,max:80, min:61 },
				  	{ info:"Fieber von 39-40°C.", max:60, min:41},
					{ info:"Fieber von 38-39°C.", max:40, min:21},
					{ info:"Leicht erhöhte Temperatur von 37-38°C.", max:20, min:0}
				]  
			},			
		    { id: "10047340", title: "Schwindel", kategorie: "Allgemeinsymptome", zero:0, farbwert:"rgba(135,206,235,0.9)",
			  grad:[ 	
				  	{ info:"Sehr starke nicht auszuhaltende Symptome, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81},
				  	{ info:"Stark anhaltende Symptome, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61 },
				  	{ info:"Mässige und anhaltende Symptome, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41},
					{ info:"Leichte Symptome, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21},
					{ info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0}
				]  
			},		
	
		    { id: "10033371", title: "Schmerzen allgemein", kategorie: "Schmerzen",zero:0,  farbwert:"rgba(135,206,235,0.9)",
			  grad:[ 	
				  	{ info:"Sehr starke nicht auszuhaltende Schmerzen, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81},
				  	{ info:"Stark anhaltende Schmerzen, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61 },
				  	{ info:"Mässige und anhaltende Schmerzen, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41},
					{ info:"Leichte Schmerzen, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21},
					{ info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit", max:20, min:0}
				]  
			},		
	
		    { id: "10011224", title: "Trockener Reizhusten", kategorie: "Atemwege",zero:0,  farbwert:"rgba(135,206,235,0.9)",
			  grad:[ 	
				  	{ info:"Sehr starker nicht auszuhaltender Reizhusten, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81},
				  	{ info:"Stark anhaltender Reizhusten, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61 },
				  	{ info:"Mässige und anhaltender Reizhusten, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41},
					{ info:"Leichter Reizhusten, keine Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21},
					{ info:"Sehr milde gelegentliche Symptome, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0}
				]  
			},		
	
		    { id: "10036790", title: "Husten mit Auswurf", kategorie: "Atemwege", zero:0,  farbwert:"rgba(135,206,235,0.9)",
			  grad:[ 	
				  	{ info:"Sehr starker nicht auszuhaltender Husten mit massiven Auswurf, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81},
				  	{ info:"Stark anhaltender Husten mit Auswurf, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61 },
				  	{ info:"Mässige und anhaltender Husten mit deutlichem Auswurf, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41},
					{ info:"Leichter Husten mit Auswurf, leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21},
					{ info:"Sehr milde gelegentliche Symptome, minimer Auswurf beim Husten, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0}
				]  
			},	
	
		   { id: "10015090", title: "Nasenbluten", kategorie: "Blutungen", zero:0,  farbwert:"rgba(70,130,180,0.9)",
			  grad:[ 	
				  	{ info:"Massiver Blutverlust durch Nasenbluten.", max:100, min:81, tipps:"info1,info2"},
				  	{ info:"Anhaltendes und nicht stillendes Nasenbluten." ,max:80, min:61 },
				  	{ info:"Länger anhaltendes und wiederholtes Nasenbluten.", max:60, min:41},
					{ info:"Kurzes wiederholtes Nasenbluten, leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21},
					{ info:"Kurzes und einmaliges Nasenbluten, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0}
				]  
			}
		],
		
		Tipps:
		[
			 { id: "info1", title:"Nelkenwasser", kategorie:"Selbsthilfe", likes:1, dislikes:0,
			 	bausteine: 
			 	[
	 	           { "Häufigkeit": "Mundspülung mit Nelkenwasser 2-3 mal pro Tag anwenden."},
	 	           { "Zubereitung": "Kochen Sie hierfür ein paar Gewürznelken in Wasser auf und lassen Sie das Wasser abkühlen."},
	 	           { "Grafik": "Akupunktur Punkt P6<br><img src='img/assets/akupunkturP6.png'>"}
			 	]	
			 },		 
			 { id: "info2", title:"Kontakt", kategorie:"Brustzentrum", likes:0, dislikes:0, 
				 bausteine: 
				 [
		             { "Info":"Melden Sie sich telefonisch im Brust-Zentrum/Onkozentrum bei anhaltenden Beschwerden."},
		             { "Tagsüber":"+41 43 344 3333"},
		             { "Nachts":" +41 44 209 2111"},
		             { "Am Wochenende":" +41 44 209 2111"}
				 ]	
			 }		 
		 ]
};


