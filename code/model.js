/**
 * Created by Marco Egbring on March 2013
 * Copyright 2013 EPha.ch. All rights reserved.
 */

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
	if(!punkt) return;
	
	var data = {id:punkt.id, x:punkt.x, y:punkt.y };
	
	this.data.punkte.unshift( data );
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
Model.prototype.getStateFavitEdit = function() { return this._state.favitEdit; };
Model.prototype.setStateFavitEdit = function( value ) { this._state.favitEdit = value; };
Model.prototype.getStateSymptom = function() { return this._state.currentItem;};
Model.prototype.setStateSymptom = function( value ) { this._state.currentItem = value;};
Model.prototype.getStateTipp = function() { return this._state.tipItem;};
Model.prototype.setStateTipp = function( value ) { this._state.tipItem = value; };

/**
 * APP TEMP STATUS
 */ 
Model.prototype._state = 
{
    currentItem: null,
    tempItem: null,
    favoritesEdit: false,
    favitEdit:false,
    tipItem: null
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

		 	 {"x":1363265891430, "y": "adsf", "id": "privat"}, 	 	
		 	 {"x":1363376891430, "y": "chemo", "id": "zyklus"}, 	 	
		 	 {"x":1363486891430, "y": "tumor ABC", "id": "diagnose"} 	 	
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
	    },
	    customer:
	    {
	    	intro: 0,
	    	login:null,
	    	lastSync:null
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
 * TODO SCHREIBT TIPP NICHT REIN
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
// TODO
Model.prototype.trackPunktLikedOrNotExists = function()
{
	var tippId = this.getStateTipp().id;
	
	if( this.data.punkte.length == 0 ) return true;
	
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

Model.prototype.dict =
{
		Intro:
		[
		 	{ id: "introDefault", title:"Liebe NutzerIn",
		 		bausteine: [
		 		             "Die App dient Ihnen als persönliches Logbuch für Ihr Wohlbefinden während Ihrer Therapie. Wir empfehlen die App täglich zu nutzen. Bei Bedarf können Sie vergessene Eingaben nachtragen.",
		 		             "Ist der Abstand zwischen zwei Eintragungen grösser als drei Tage wird die Verbindungslinie zwischen zwei Datenpunkten unterbrochen und beginnt von neuem. In Ihrer Favoritenliste finden Sie die Eingaben für Wohlbefinden, Symptomen und Tagebucheintragungen.",
		 		             "Wir wünschen Ihnen viel Erfolg!"
		 		            ]		 						  
		 	},
		 	{ id: "gruppeb", title:"Liebe Teilnehmerin",
		 		bausteine: [
		 		            "Sie gehören in der Studie der Gruppe B an.",
		 		            "Teilnehmerinnen der Gruppe B nutzen die App, ohne den Arzt darüber zu informieren und ohne die App in der Arztvisite zu verwenden. Verhalten Sie sich ansonsten in Ihren Arztvisiten wie gewohnt, und informieren Sie den Arzt über Ihre Beschwerden und Wünsche.",
		 		            "Bei der Beantwortung des Fragebogens können Sie gerne die App verwenden. Bitte verwenden Sie auf dem Fragbogen nur Ihre persönliche Patientenidentifikationsnummer und nicht ihren persönlichen Namen. Falls Sie diese Nummer vergessen haben sollten, so können Sie die Information durch Berühren der „Sync“-Taste abrufen.",
		 		            "Wir danken für die Teilnahme an der Studie und wünschen Ihnen eine erfolgreiche Therapie."
		 		            ]		 						  
		 	},
		 	{ id: "gruppec", title:"Liebe Teilnehmerin",
		 		bausteine: [
		 		            "Sie gehören in der Studie der Gruppe C an.",
		 		            "Ist der Abstand zwischen zwei Eintragungen grösser als drei Tage wird die Verbindungslinie zwischen zwei Datenpunkten unterbrochen und beginnt von neuem. In Ihrer Favoritenliste finden Sie die Eingaben für Wohlbefinden, Symptomen und Tagebucheintragungen.",
		 		            "Teilnehmerinnen der Gruppe C nutzen die App und betrachten zusammen mit dem Arzt den Verlauf der Eingaben. Die App dient hier als Ergänzung und soll Ihnen als Gedächtnisstütze helfen. Verhalten Sie sich ansonsten in Ihren Arztvisiten wie gewohnt, und informieren Sie den Arzt über Ihre Beschwerden und Wünsche.",
		 		            "Bei der Beantwortung des Fragebogens können Sie gerne die App verwenden. Bitte verwenden Sie auf dem Fragbogen nur Ihre persönliche Patientenidentifikationsnummer und nicht ihren persönlichen Namen. Falls Sie diese Nummer vergessen haben sollten, so können Sie die Information durch Berühren der „Sync“-Taste abrufen.",
		 		            "Wir danken für die Teilnahme an der Studie und wünschen Ihnen eine erfolgreiche Therapie."
		 		            ]		 						  
		 	}
		 ],
		Bewertung:
		[
			{ id: "10025482", title:"Wohlbefinden", kategorie:"Lebensqualität", zero:100, farbwert:"rgba(154,205,50,0.9)",
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
		 	{ id: "privat", title:"Privates Memo", kategorie:"Notizen", zero:"", farbwert:"rgba(255,100,100,0.9)"},
		 	{ id: "diagnose", title:"Diagnose", kategorie:"Notizen", zero:"", farbwert:"rgba(255,204,0,0.9)"},
		 	{ id: "zyklus", title:"Zyklus", kategorie:"Notizen", zero:"", farbwert:"rgba(200,100,200,0.9)"}
		 ],
		Symptome : 
			 [                 
              { id: "10016256", title: "Müdigkeit", kategorie: "Allgemeinsymptome", zero:0, farbwert :"rgba(0,139,139,0.9)",
                grad:[    
                          { info:"Sehr starke Müdigkeit, auch in Ruhe, Selbstversorgung (z.B. Ankleiden und Waschen) ist unmöglich.", max:100, min:81, tipps:"iMeld1"},
                          { info:"Starke Müdigkeit, auch in Ruhe, Selbstversorgung (z.B. Ankleiden und Waschen) stark eingeschränkt möglich, Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld1"},
                          { info:"Mässige Müdigkeit, besteht auch bei Ruhe, deutliche Einschränkung im Alltag, Arbeitsfähigkeit stark eingeschränkt.", max:60, min:41, tipps:"iBeweg"},
                          { info:"Leichte Müdigkeit, bessert sich nach Ruhe, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iBeweg"},
                          { info:"Sehr milde Müdigkeit, ohne Einschränkung im Alltag und bei der täglichen Arbeit.", max:20, min:0, tipps:"iBeweg"}
                    ]  
              },
          { id: "10013963", title: "Atemnot", kategorie: "Atemwege", zero:0, farbwert:"rgba(40,210,230,0.9)",
              grad:[      
                          { info:"Sehr starke Atemnot, auch in Ruhe, Selbstversorgung (z.B. Ankleiden und Waschen) ist unmöglich.", max:100, min:81, tipps:"iMeld1"},
                          { info:"Starke Atemnot auch in Ruhe, Selbstversorgung (z.B. Ankleiden und Waschen) stark eingeschränkt möglich, Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld1"},
                          { info:"Mässige Atemnot bei leichter Belastung mit deutlicher Einschränkung im Alltag und bei der Arbeit.", max:60, min:41, tipps:"iMeld1"},
                          { info:"Leichte Atemnot bei leichter Belastung aber ohne Einschränkung im Alltag und bei der Arbeit.", max:40, min:21, tipps:"iMeld2"},
                          { info:"Sehr leichte Atemnot bei normaler Belastung.", max:20, min:0}
                    ]  
              }, 
          { id: "10013950", title: "Schluckstörung", kategorie: "Hals, Nase, Ohren", zero:0,  farbwert:"rgba(160,200,200,0.9)",
            grad:[ 
                    { info:"Sehr starke Schluckbeschwerden, normale Nahrungs- oder Flüssigkeitsaufnahme ist nicht mehr möglich.", max:100, min:81, tipps:"iMeld2"},
                    { info:"Starke Schluckbeschwerden, normale Nahrungs- und Flüssigkeitsaufnahme ist kaum mehr möglich." ,max:80, min:61, tipps:"iMeld2"},
                    { info:"Mässige Schluckbeschwerden, erschwerte und eingeschränkte Nahrungsaufnahme (z.B. Verwendung weicher oder flüssiger  Nahrungsmittel).", max:60, min:41, tipps:"iMeld2"},
                    { info:"Milde aber deutliche Schluckbeschwerden ohne relevante Einschränkung der Nahrungsaufnahme.", max:40, min:21, tipps:"iMeld1"},
                    { info:"Sehr milde Symptome, unveränderte Nahrungsaufnahme.", max:20, min:0}
              ]  
          }, 
          { id: "10012727", title: "Durchfall", kategorie: "Magen- und Darmsystem", zero:0, farbwert:"rgba(0,206,209,0.9)",
                grad:[    
                          { info:"Sehr starke Symptome, Selbstversorgung aufgrund Häufigkeit des Symptoms nicht mehr möglich.", max:100, min:81, tipps:"iMeld2"},
                          { info:"Starke Symptome, wässrige Stuhlgänge mehr als 7 Mal pro Tag, starke Einschränkung im Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                          { info:"Mässige Symptome, wässrige Stuhlgänge 4-6 Mal pro Tag, leichte Einschränkung im Alltag.", max:60, min:41, tipps:"iMeld1, iStuhlkonsis"},
                          { info:"Leichte Symptome, wässriger Stuhlgang unter 4 Mal pro Tag.", max:40, min:21, tipps:"iStuhlkonsis, iFlüssig, iReserve"},
                          { info:"Sehr milde gelegentliche Symptome, keine Einschränkung im Alltag.", max:20, min:0, tipps:"iStuhlkonsis, iFlüssig, iReserve"}
                    ]  
              }, 
           { id: "10050068", title: "Ödeme an Gliedmassen", kategorie: "Ödeme",zero:0, farbwert:"rgba(64,224,208,0.9)",
                grad:[    
                          { info:"Sehr starke Schwellung, starke Bewegungseinschränkung, Selbstversorgung (z.B. Ankleiden und Waschen) ist unmöglich.", max:100, min:81, tipps:"iMeld2"},
                          { info:"Starke Schwellung mit Bewegungseinschränkung, starkes Spannungsgefühl und deutliche Veränderung der Körperkontur." ,max:80, min:61, tipps:"iMeld2"},
                          { info:"Mässige sichtbare Schwellung, Auslöschung von Hautfalten, veränderte Körperkontur, leichte Einschränkung im Alltag.", max:60, min:41, tipps:"iBeweg,iMeld1"},
                          { info:"Leichte sichtbare Schwellung mit erhöhtem Spannungsgefühl, leichte Hautstrukturveränderung.", max:40, min:21, tipps:"iBeweg"},
                          { info:"Sehr leichte Schwellung, leichtes Spannungsgefühl aber keine Veränderung der Hautstruktur.", max:20, min:0, tipps:"iBeweg"}
                    ]  
              }, 
              { id: "10013774", title: "Trockene Augen", kategorie: "Augen",zero:0,  farbwert:"rgba(175,238,238,0.9)",
                grad:[    
                          { info:"Sehr starke Symptome, Selbstversorgung stark eingeschränkt durch Seheinschränkung.", max:100, min:81, tipps:"iMeld1"},
                          { info:"Starke Symptome, deutliche Einschränkung im Alltag (z.B. Lesen, Autofahren), Arbeitsfähigkeit ist stark eingeschränkt." ,max:80, min:61, tipps:"iMeld1"},
                          { info:"Mässige Symptome, regelmässige Verwendung von Augentropfen notwendig, leichte Einschränkung im Alltag.", max:60, min:41},
                          { info:"Leichte Symptome, keine Einschränkung im Alltag, Augentropfen zur Befeuchtung sind ausreichend.", max:40, min:21},
                          { info:"Sehr milde Symptome, keine Einschränkung im Alltag.", max:20, min:0}
                    ]  
              }, 
            { id: "10037868", title: "Hautausschlag", kategorie: "Haut und Haare",zero:0, farbwert:"rgba(70,130,180,0.9)",
                grad:[    
                          { info:"Sehr starke Symptome (Juckreiz, Hautspannen, Rötung, Hautbrennen), lokal oder verteilt, Selbstversorgung unmöglich.", max:100, min:81, tipps:"iMeld2"},
                          { info:"Starke Symptome (Juckreiz, Hautspannen, Rötung, Hautbrennen), lokal oder verteilt, starke Einschränkung im Alltag und bei der Arbeit." ,max:80, min:61, tipps:"iMeld2"},
                          { info:"Mässige Symptome, deutlicher Juckreiz, Hautspannen und Hautbrennen, lokal oder verteilt. Leichte Einschränkung im Alltag.", max:60, min:41, tipps:"iMeld2"},
                          { info:"Leichte Symptome, lokal eingeschränkt, leichte Rötung, leichter Juckreiz, Hautspannen oder Hautbrennen.", max:40, min:21, tipps:"iMeld2"},
                          { info:"Sehr milde Symptome, lokal eingeschränkt, keine Einschränkung im Alltag.", max:20, min:0}
                    ]  
              }, 
            { id: "10020772", title: "Bluthochdruck", kategorie: "Herz- und Kreislaufsystem",zero:0,  farbwert:"rgba(95,158,160,0.9)",
                grad:[    
                          { info:"Sehr schwerer Bluthochdruck über 190 mmHg (1. Wert).", max:100, min:81},
                          { info:"Schwerer Bluthochdruck mit Werten über 160 mmHg (1. Wert) oder über 100 mmHg (2. Wert)." ,max:80, min:61, tipps:"iMeld2"},
                          { info:"Mässige Bluthochdruck mit 140-150 mmHg (1 Wert) oder 90-99 mmHg (2. Wert) oder plötzlicher Anstieg von mehr als 20 mmHg zum normalen Vorwert.", max:60, min:41, tipps:"iMeld2"},
                          { info:"Milder Bluthochdruck 130-139 mmHg (1. Wert) oder 80-89 mmHg.", max:40, min:21},
                          { info:"Sehr milde Symptome.", max:20, min:0}
                    ]  
              }, 
  
            { id: "10016791", title: "Erkältungssymptome", kategorie: "Infekt",zero:0,  farbwert:"rgba(30,144,255,0.9)" ,
                grad:[    
                          { info:"Sehr starke Symptome mit Einschränkung der Selbstversorgung (z.B. selbst Ankleiden und Waschen) ist unmöglich.", max:100, min:81, tipps:"iMeld1"},
                          { info:"Starke Symptome, Selbstversorgung (z.B. Ankleiden und Waschen) stark eingeschränkt möglich, Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld1"},
                          { info:"Mässige Symptome, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld1"},
                          { info:"Leichte Symptome, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iMeld1"},
                          { info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0}
                    ]  
              }, 
            { id: "10046593", title: "Harndrang", kategorie: "Niere und Harnblase",zero:0, farbwert:"rgba(0,0,205,0.9)",
                grad:[    
                          { info:"Sehr starke Symptome mit Einschränkung der Selbstversorgung (z.B. selbst Ankleiden und Waschen) ist unmöglich.", max:100, min:81, tipps:"iMeld2"},
                          { info:"Starke Symptome, hohe Toilettenfrequenz, Verlassen der Wohnung kaum möglich, Einschränkung des Alltags, Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                          { info:"Mässige Symptome, vermehrtes Wasserlassen, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld2"},
                          { info:"Leichte Symptome, häufigeres Wasserlassen, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21},
                          { info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0}
                    ]  
              }, 
            { id: "10038743", title: "Unruhe", kategorie: "Psyche",zero:0,  farbwert:"rgba(65,105,225,0.9)",
                grad:[    
                          { info:"Sehr starke Symptome, Selbstversorgung im Alltag ist unmöglich.", max:100, min:81, tipps:"iMeld2"},
                          { info:"Starke Symptome, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                          { info:"Mässige Symptome, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld2"},
                          { info:"Leichte Symptome, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21},
                          { info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0}
                    ]  
              }, 
            { id: "10017999", title: "Bauchschmerzen", kategorie: "Schmerzen",zero:0,  farbwert:"rgba(135,206,235,0.9)",
                grad:[    
                          { info:"Sehr starke nicht auszuhaltende Symptome, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld2"},
                          { info:"Stark anhaltende kaum auszuhaltende Schmerzen, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                          { info:"Mässige und anhaltende Symptome, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld1, iReserve"},
                          { info:"Milde Symptome, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iReserve"},
                          { info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0}
                    ]  
              }, 
            { id: "10047700", title: "Erbrechen", kategorie: "Magen- und Darmsystem",zero:0,  farbwert:"rgba(135,206,235,0.9)",
                grad:[    
                          { info:"Sehr starkes und anhaltendes Erbrechen, Nahrungs- und Flüssigkeitsaufnahme unmöglich.", max:100, min:81, tipps:"iMeld2,iReserve"},
                          { info:"Starkes Erbrechen über 6 Mal während 24 Stunden, Nahrungs- und Flüssigkeitsaufnahme stark eingeschränkt." ,max:80, min:61, tipps:"iMeld2,iReserve"},
                          { info:"Mässiges Erbrechen, 3-5 Mal während 24 Stunden, eingeschränkte Nahrungsaufnahme.", max:60, min:41, tipps:"iMeld2,iReserve"},
                          { info:"Leichtes Erbrechen, bis maximal 2 Mal während 24h, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iIngwertee,iIngwerkapsel,iIngwerhonig,iFlüssig,iAkupressP6,iKleinesmahl,iReserve"},
                          { info:"Einmaliges Erbrechen, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0, tipps:"iIngwertee,iIngwerkapsel,iIngwerhonig,iFlüssig,iAkupressP6,iKleinesmahl,iReserve"}
                    ]  
              }, 
            { id: "10054524", title: "Hand-Fuss-Syndrom", kategorie: "Haut und Haare",zero:0,  farbwert:"rgba(135,206,235,0.9)",
                      grad:[    
                                { info:"Sehr schwere schmerzhafte Hautveränderung an Händen und Füssen, Selbstversorgung (z.B. Ankleiden und Waschen) ist unmöglich.", max:100, min:81, tipps:"iMeld2"},
                                { info:"Schwere schmerzhafte Hautveränderung an Händen und Füssen mit Hautschälung, Blasen, Blutungen, Schwellung und Schuppung." ,max:80, min:61, tipps:"iMeld2"},
                                { info:"Mässige schmerzhafte Hautveränderungen mit Hautschälung, Blasenbildung und Schwellung.", max:60, min:41, tipps:"iMeld2"},
                                { info:"Leichte Hautveränderung an Händen oder Füssen mit Rötung, Schuppung und Schwellung, aber schmerzfrei.", max:40, min:21, tipps:"iMeld2"},
                                { info:"Sehr milde Hautveränderung, leichte Schuppung und Rötung an Händen oder Füssen, schmerzfrei.", max:20, min:0}
                          ]  
                    },
              { id: "10028813", title: "Übelkeit", kategorie: "Allgemeinsymptome",zero:0,  farbwert:"rgba(135,206,235,0.9)",
                grad:[    
                          { info:"Sehr starke Symptome, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld2"},
                          { info:"Stark anhaltende Symptome, ungenügende Nahrungs- und Flüssigkeitsaufnahme, deutlicher Gewichtsverlust." ,max:80, min:61, tipps:"iMeld2,iReserve"},
                          { info:"Mässige und anhaltende Symptome, Einschränkung in Nahrungsaufnahme und beginnender Gewichtverlust.", max:60, min:41, tipps:"iMeld1,iReserve"},
                          { info:"Leichte Symptome, Appetitverlust aber unveränderte Nahrungsaufnahme.", max:40, min:21, tipps:"iIngwertee,iIngwerkapsel,iIngwerhonig,iAkupressP6,iKleinesmahl,iReserve"},
                          { info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0, tipps:"iIngwertee,iIngwerkapsel,iIngwerhonig,iAkupressP6,iKleinesmahl,iReserve"}
                    ]  
              },          
              { id: "10016558", title: "Fieber", kategorie: "Allgemeinsymptome",zero:0,  farbwert:"rgba(135,206,235,0.9)",
                grad:[    
                          { info:"Schweres anhaltendes Fieber, über 40°C über 24 Stunden Dauer.", max:100, min:81, tipps:"iMeld2"},
                          { info:"Schweres Fieber über 40°C während 24Stunden." ,max:80, min:61, tipps:"iMeld2"},
                          { info:"Fieber von 39-40°C.", max:60, min:41, tipps:"iMeld2"},
                          { info:"Fieber von 38-39°C.", max:40, min:21, tipps:"iMeld2"},
                          { info:"Leicht erhöhte Temperatur von 37-38°C.", max:20, min:0}
                    ]  
              },                
            { id: "10047340", title: "Schwindel", kategorie: "Allgemeinsymptome", zero:0, farbwert:"rgba(135,206,235,0.9)",
                grad:[    
                          { info:"Sehr starke nicht auszuhaltende Symptome, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld2"},
                          { info:"Stark anhaltende Symptome, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                          { info:"Mässige und anhaltende Symptome, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld1"},
                          { info:"Leichte Symptome, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21},
                          { info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0}
                    ]  
              },          
  
            { id: "10033371", title: "Schmerzen allgemein", kategorie: "Schmerzen",zero:0,  farbwert:"rgba(135,206,235,0.9)",
                grad:[    
                          { info:"Sehr starke nicht auszuhaltende Schmerzen, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld2"},
                          { info:"Stark anhaltende Schmerzen, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iReserve,iMeld2"},
                          { info:"Mässige und anhaltende Schmerzen, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iReserve,iMeld1"},
                          { info:"Leichte Schmerzen, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iReserve"},
                          { info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit", max:20, min:0}
                    ]  
              },          
  
            { id: "10011224", title: "Trockener Reizhusten", kategorie: "Atemwege",zero:0,  farbwert:"rgba(135,206,235,0.9)",
                grad:[    
                          { info:"Sehr starker nicht auszuhaltender Reizhusten, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld2"},
                          { info:"Stark anhaltender Reizhusten, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                          { info:"Mässige und anhaltender Reizhusten, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld1"},
                          { info:"Leichter Reizhusten, keine Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21},
                          { info:"Sehr milde gelegentliche Symptome, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0}
                    ]  
              },          
  
            { id: "10036790", title: "Husten mit Auswurf", kategorie: "Atemwege", zero:0,  farbwert:"rgba(135,206,235,0.9)",
                grad:[    
                          { info:"Sehr starker nicht auszuhaltender Husten mit massiven Auswurf, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld2"},
                          { info:"Stark anhaltender Husten mit Auswurf, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                          { info:"Mässige und anhaltender Husten mit deutlichem Auswurf, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld2"},
                          { info:"Leichter Husten mit Auswurf, leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iMeld1"},
                          { info:"Sehr milde gelegentliche Symptome, minimer Auswurf beim Husten, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0}
                    ]  
              },    
  
           { id: "10015090", title: "Nasenbluten", kategorie: "Blutungen", zero:0,  farbwert:"rgba(70,130,180,0.9)",
                grad:[    
                          { info:"Massiver Blutverlust durch Nasenbluten.", max:100, min:81, tipps:"iMeld1"},
                          { info:"Anhaltendes und nicht stillendes Nasenbluten." ,max:80, min:61, tipps:"iMeld1"},
                          { info:"Länger anhaltendes und wiederholtes Nasenbluten.", max:60, min:41, tipps:"iMeld1"},
                          { info:"Kurzes wiederholtes Nasenbluten, leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21},
                          { info:"Kurzes und einmaliges Nasenbluten, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0}
                    ]  
              },
           { id: "10002646", title: "Appetitverlust", kategorie: "Allgemeinsymptome",zero:0,  farbwert:"rgba(135,206,235,0.9)",
                grad:[    
                          { info:"Sehr starke Symptome, deutlicher Gewichtsverlust, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81},
                          { info:"Stark anhaltende Symptome, ungenügende Nahrungs- und Flüssigkeitsaufnahme, deutlicher Gewichtsverlust." ,max:80, min:61, tipps:"iMedi1"},
                          { info:"Mässige und anhaltende Symptome, Einschränkung in Nahrungsaufnahme und beginnender Gewichtverlust.", max:60, min:41, tipps:"iBerat"},
                          { info:"Leichte Symptome, Appetitverlust aber kaum veränderte Nahrungsaufnahme und ohne Gewichtsverlust.", max:40, min:21, tipps:"iBerat"},
                          { info:"Geringradiger Appetitverlust ohne Einschränkung in der Nahrungsaufnahme.", max:20, min:0}
                    ]  
              },  
           { id: "10005329", title: "Blutungen, allgemein", kategorie: "Blutungen",zero:0,  farbwert:"rgba(135,206,235,0.9)",
                grad:[    
                          { info:"Massiver Blutverlust durch nicht stillende Blutung.", max:100, min:81, tipps:"iMeld2"},
                          { info:"Anhaltende und nicht stillende Blutung." ,max:80, min:61, tipps:"iMeld2"},
                          { info:"Längere anhaltende und wiederholte Blutung.", max:60, min:41, tipps:"iMeld2"},
                          { info:"Kurze wiederholte Blutung, leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iMeld1"},
                          { info:"Kurze und einmalige Blutung, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0}
                    ]  
              },  
           { id: "10062225", title: "Brennen beim Wasserlassen", kategorie: "Nieren und Harnwege",zero:0,  farbwert:"rgba(135,206,235,0.9)",
                grad:[    
                          { info:"Sehr starke nicht auszuhaltende Schmerzen, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld2"},
                          { info:"Stark anhaltende Schmerzen, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                          { info:"Mässige und anhaltende Schmerzen, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld2"},
                          { info:"Leichte Schmerzen, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iMeld1"},
                          { info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit", max:20, min:0}
                    ]  
              },   
           { id: "10012378", title: "Depression", kategorie: "Psychische Beschwerden",zero:0,  farbwert:"rgba(135,206,235,0.9)",
                grad:[    
                          { info:"Sehr starke und nicht auszuhaltende Depression, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iBerat, iMeld1"},
                          { info:"Stark anhaltende Depression, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iBerat, iMeld1" },
                          { info:"Mässige und anhaltende Depression, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iBeweg, iBerat"},
                          { info:"Leichte Depression, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iBeweg, iBerat"},
                          { info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit", max:20, min:0, tipps:"iBeweg"}
                    ]  
              },  
            { id: "10013911", title: "Geschmacksstörung", kategorie: "Allgemeinsymptome",zero:0,  farbwert:"rgba(135,206,235,0.9)",
                grad:[    
                          { info:"Sehr starke Symptome, deutlicher Gewichtsverlust, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld1"},
                          { info:"Stark anhaltende Symptome, ungenügende Nahrungs- und Flüssigkeitsaufnahme, deutlicher Gewichtsverlust." ,max:80, min:61, tipps:"iHalten,iAnreich, iMe1d1"},
                          { info:"Mässige und anhaltende Geschmacksveränderung, Einschränkung in Nahrungsaufnahme und beginnender Gewichtverlust.", max:60, min:41, tipps:"iNelke,iEntdeck,iHalten,iAnreich"},
                          { info:"Leicht veränderte Geschmackwahrnehmung, aber kaum veränderte Nahrungsaufnahme und ohne Gewichtsverlust.", max:40, min:21, tipps:"iNelke,iEntdeck"},
                          { info:"Gering veränderte Geschmackwahrnehmung aber keine Veränderung der Nahrungsaufnahme", max:20, min:0, tipps:"iNelke,iEntdeck"}
                    ]  
              },  
                { id: "10047900", title: "Gewichtsverlust", kategorie: "Allgemeinsymptome",zero:0,  farbwert:"rgba(135,206,235,0.9)",
                grad:[    
                          { info:"Abnahme von mehr als 20% des Ausgangsgewichts, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld1"},
                          { info:"Abnahme von 15-20% und mehr des Ausgangsgewichts, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iAnreich,iHalten,iBerat,iMeld1"},
                          { info:"Abnahme von 10-15% des Ausgangsgewichts, deutliche Einschränkung im Alltag, eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iAnreich,iHalten,iBerat,iMeld1"},
                          { info:"Abnahme von 5-10% des Ausgangsgewichts, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iAnreich,iHalten,iBerat"},
                          { info:"Abnahme von weniger als 5% des Ausgangsgewichts.", max:20, min:0}
                    ]  
              },  
                { id: "10047896", title: "Gewichtszunahme", kategorie: "Allgemeinsymptome",zero:0,  farbwert:"rgba(135,206,235,0.9)",
                grad:[    
                          { info:"Gewichtszunahme von mehr als 20% des Ausgangsgewichts, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld2,iBerat"},
                          { info:"Gewichtszunahme von 15-20% und mehr des Ausgangsgewichts, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2,iBerat"},
                          { info:"Gewichtszunahme von 10-15% des Ausgangsgewichts, deutliche Einschränkung im Alltag, eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld2,iBerat"},
                          { info:"Gewichtszunahme von 5-10% des Ausgangskörpergewichts, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iMeld1,iBerat,iGewkontrolle"},
                          { info:"Gewichtszunahme von weniger als 5% des Ausgangsgewichts.", max:20, min:0}
                    ]  
              },  
                { id: "10001760", title: "Haarausfall", kategorie: "Haut und Haare",zero:0, farbwert:"rgba(70,130,180,0.9)",
                grad:[    
                          { info:"Haarausfall mehr als 50% als üblich, deutlich sichtbarer Haarverlust, Haarersatz notwendig, psychosoziale Belastung.", max:100, min:41, tipps:"iShampoo,iKopfmass,iKopfpflege,iHaarspezi,iKopfdecke,"},
                          { info:"Haarverlust unter 50% als üblich und nur sichtbar bei genauer Inspektion, Frisurveränderung evt. erforderlich aber Haarersatz nicht notwendig.", max:40, min:21, tipps:"iShampoo,iKopfmass,iHaarspezi"},
                          { info:"Verstärker Haarverlust als üblich, aber nicht erkennbar.", max:20, min:0, tipps:"iShampoo,iKopfmass"}
                    ]  
              }, 
                { id: "10020407", title: "Hitzewallungen", kategorie: "Allgemeinsymptome",zero:0, farbwert:"rgba(70,130,180,0.9)",
                grad:[    
                          { info:"Sehr starke Symptome, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld2"},
                          { info:"Starke Symptome, starke Einschränkung im Alltag und bei der Arbeit." ,max:80, min:61, tipps:"iMeld2"},
                          { info:"Mässige Symptome, deutliche Einschränkung im Alltag, eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iZwiebel,iGenuss,iCimici,iMeld1"},
                          { info:"Leichte Symptome, nur leichte kurzfristige Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iZwiebel,iGenuss,iCimici"},
                          { info:"Sehr milde kurze Symptome, keine Einschränkung im Alltag.", max:20, min:0, tipps:"iZwiebel,iGenuss"}
                    ]  
              }, 
               { id: "10028130", title: "Mundschleimhautveränderungen", kategorie: "Magen- und Darmsystem", zero:0,  farbwert:"rgba(160,200,200,0.9)",
            grad:[ 
                    { info:"Sehr starke Beschwerden, normale Nahrungs- oder Flüssigkeitsaufnahme ist nicht mehr möglich.", max:100, min:81, tipps:"iMeld2"},
                    { info:"Starke Beschwerden, normale Nahrungs- und Flüssigkeitsaufnahme ist kaum mehr möglich." ,max:80, min:61, tipps:"iMeld2"},
                    { info:"Mässige Beschwerden, erschwerte und eingeschränkte Nahrungsaufnahme (z.B. Verwendung weicher oder flüssiger  Nahrungsmittel).", max:60, min:41, tipps:"iMeld1,iSprüh,iSpeichel,iMundpfleg,iGenuss,iAnanas,iTeespül,iCalendula1,iCalendula2,iMalve,iPropolis,iTeebaum,iMyrrhe"},
                    { info:"Milde aber deutliche Beschwerden ohne relevante Einschränkung der Nahrungsaufnahme.", max:40, min:21, tipps:"iSprüh,iSpeichel,iMundpfleg,iGenuss,iAnanas,iTeespül,iCalendula1,iCalendula2,iMalve,iPropolis,iTeebaum,iMyrrhe,iMeld1"},
                    { info:"Sehr milde Symptome, unveränderte Nahrungsaufnahme.", max:20, min:0, tipps:"iSprüh,iSpeichel,iMundpfleg,iGenuss,iAnanas,iTeespül,iPovidon,iLippen"}
              ]  
          }, 
                { id: "10013781", title: "Mundtrockenheit", kategorie: "Magen- und Darmsystem", zero:0,  farbwert:"rgba(160,200,200,0.9)",
            grad:[ 
                    { info:"Sehr starke Beschwerden, normale Nahrungsaufnahme ist nicht mehr möglich.", max:100, min:81},
                    { info:"Starke Beschwerden, normale Nahrungsaufnahme ist kaum mehr möglich." ,max:80, min:61 },
                    { info:"Mässige Beschwerden, erschwerte und eingeschränkte Nahrungsaufnahme (z.B. Verwendung weicher oder flüssiger  Nahrungsmittel).", max:60, min:41},
                    { info:"Milde aber deutliche Beschwerden ohne relevante Einschränkung der Nahrungsaufnahme.", max:40, min:21},
                    { info:"Sehr milde Symptome, unveränderte Nahrungsaufnahme.", max:20, min:0, tipps:"iSprüh,iTeenein,iSpeichel,iMundpfleg,iGenuss,iAnanas,iTeespül"}
              ]  
          }, 
                { id: "10043882", title: "Ohrensausen", kategorie: "Hals, Nase, Ohren",zero:0, farbwert:"rgba(70,130,180,0.9)",
                grad:[    
                          { info:"Sehr starke Symptome, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld2"},
                          { info:"Starke Symptome, starke Einschränkung im Alltag und bei der Arbeit." ,max:80, min:61, tipps:"iMeld2"},
                          { info:"Mässige Symptome, deutliche Einschränkung im Alltag, eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld2"},
                          { info:"Leichte Symptome, nur leichte kurzfristige Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iMeld1"},
                          { info:"Sehr milde kurze Symptome, keine Einschränkung im Alltag.", max:20, min:0}
                    ]  
              }, 
                { id: "10007810", title: "Katheterbeschwerden", kategorie: "Therapiefolgen",zero:0, farbwert:"rgba(70,130,180,0.9)",
                grad:[    
                          { info:"Mässige Symptome, deutliche Rötung oder Schwellung oder Schmerzen.", max:100, min:41, tipps:"iMeld2"},
                          { info:"Leichte Symptome, nur leichte kurzfristige Rötung oder Schwellung.", max:40, min:21, tipps:"iMeld2"},
                          { info:"Sehr milde kurze Symptome, keine Einschränkung im Alltag.", max:20, min:0}
                    ]  
              }, 
                { id: "10022437", title: "Schlafstörung", kategorie: "Psychische Beschwerden",zero:0,  farbwert:"rgba(135,206,235,0.9)",
                grad:[    
                          { info:"Schwere Einschlafstörung, Durchschlafstörung oder zu frühes Aufwachen, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:100, min:61, tipps:"iMeld1" },
                          { info:"Mässige Einschlafstörung, Durchschlafstörung oder zu frühes Aufwachenund, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iBeweg,iMeld1"},
                          { info:"Leichte Einschlafstörung, Durchschlafstörung oder zu frühes Aufwachen, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iBeweg,iBerat"},
                          { info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit", max:20, min:0, tipps:"iBeweg"}
                    ]  
              },
                { id: "10008531", title: "Schüttelfrost", kategorie: "Allgemeinsymptome",zero:0,  farbwert:"rgba(135,206,235,0.9)",
                grad:[    
                          { info:"Schweres und anhaltenes Zittern des ganzen Körpers, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:100, min:61, tipps:"iMeld1"},
                          { info:"Mässiges Zittern des gesamten Körpers, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld1"},
                          { info:"Leichtes Gefühl von Unterkühlung, Zittern, Zähleklappern.", max:40, min:21, tipps:"iMeld1"},
                          { info:"Sehr milde Symptome, kaum Beschwerden", max:20, min:0}
                    ]  
              }, 
                { id: "10022117", title: "OP-Wunde, Schwellung", kategorie: "Therapiefolgen",zero:0, farbwert:"rgba(70,130,180,0.9)",
                grad:[    
                          { info:"Mässige Symptome, deutliche Rötung oder Schwellung oder Schmerzen.", max:100, min:41, tipps:"iMeld2"},
                          { info:"Leichte Symptome, nur leichte kurzfristige Rötung oder Schwellung.", max:40, min:21},
                          { info:"Sehr milde kurze Symptome, keine Einschränkung im Alltag.", max:20, min:0}
                    ]  
              }, 
                { id: "10040102", title: "Serom, Wundwasser", kategorie: "Therapiefolgen",zero:0, farbwert:"rgba(70,130,180,0.9)",
                grad:[    
                          { info:"Mässige Symptome, deutliche Rötung oder Schwellung oder Schmerzen.", max:100, min:41, tipps:"iMeld2"},
                          { info:"Leichte Symptome, nur leichte kurzfristige Rötung oder Schwellung.", max:40, min:21, tipps:"iMeld2"},
                          { info:"Sehr milde kurze Symptome, keine Einschränkung im Alltag.", max:20, min:0}
                    ]  
              }, 
                { id: "10008481", title: "Brustschmerz stechend", kategorie: "Allgemeinsymptome",zero:0, farbwert:"rgba(70,130,180,0.9)",
                grad:[    
                          { info:"Mässige anhaltende Schmerzen, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:100, min:41, tipps:"iMeld2"},
                          { info:"Leichte kurzfristige Schmerzen, Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iMeld2"},
                          { info:"Sehr milde kurze Schmerzen, keine Einschränkung im Alltag.", max:20, min:0}
                    ]  
              },
                { id: "10046904", title: "Vaginale Trockenheit", kategorie: "Haut und Haare",zero:0, farbwert:"rgba(70,130,180,0.9)",
                grad:[    
                          { info:"Schwere Trockenheit und Schmerzen beim Sexualakt und einschränkende Reizung, starke Einschränkung im Alltag und bei der Arbeit." ,max:100, min:61, tipps:"iVagina,iBerat,iMeld1"},
                          { info:"Mässige Trockenheit, mittelschwere Trockenheit mit Einschränkung der Sexualfunktion und störende Reizung, Rötung, Brennen.", max:60, min:41, tipps:"iVagina,iBerat"},
                          { info:"Leichte Trockenheit, keine Einschränkung der Sexualfunktion, leichte Rötung, leichter Juckreiz, Brennen.", max:40, min:21, tipps:"iVagina,iBerat"},
                          { info:"Sehr milde Symptome, keine Einschränkung im Alltag.", max:20, min:0, tipps:"iVagina"}
                    ]  
              }, 
                { id: "10010774", title: "Verstopfung", kategorie: "Magen- und Darmsystem", zero:0, farbwert:"rgba(0,206,209,0.9)",
                grad:[    
                          { info:"Sehr schwerer Stuhlverhalt  Symptome, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld2"},
                          { info:"Schwerer Stuhlverhalt, eigenständige Stuhlentleerung nicht mehr möglich, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2" },
                          { info:"Mässiger anhaltender Stuhlverhalt, mehr als 3 Tage trotz Abführmitteln, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld1"},
                          { info:"Leichter Stuhlverhalt, bis zu 3 Tage, leichte Einschränkung im Alltag.", max:40, min:21, tipps:"iFaserreich, iFlüssig"},
                          { info:"Sehr milde gelegentliche Symptome, keine Einschränkung im Alltag.", max:20, min:0, tipps:"iFaserreich, iFlüssig"}
                    ]  
              },                
                { id: "10025233", title: "Lymphödem", kategorie: "Ödeme",zero:0, farbwert:"rgba(64,224,208,0.9)",
                grad:[    
                          { info:"Sehr starke Schwellung, starke Bewegungseinschränkung, Selbstversorgung (z.B. Ankleiden und Waschen) ist unmöglich.", max:100, min:81, tipps:"iMeld2"},
                          { info:"Starke Schwellung mit Bewegungseinschränkung, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                          { info:"Mässige sichtbare Schwellung, markierte Verfärbung, ledrige Hauttextur, veränderte Körperkontur, im Alltag und bei der täglichen Arbeit.", max:60, min:41, tipps:"iMeld1"},
                          { info:"Leichte sichtbare Schwellung, mit schwacher Verfärbung, leichte Hautstrukturveränderung.", max:40, min:21, tipps:"iBeweg,iSport,iSchonen,iPunp,iKleidung,iSonne"},
                          { info:"Sehr leichte Schwellung, leichtes Spannungsgefühl aber keine Veränderung der Hautstruktur.", max:20, min:0, tipps:"iBeweg,iSport,iSchonen,iPunp,iKleidung,iSonne"}
                    ]  
              }, 
                { id: "10010250", title: "Konzentrationsstörung", kategorie: "Nervensystem",zero:0, farbwert:"rgba(64,224,208,0.9)",
                grad:[    
                          { info:"Sehr starke Konzentrations- und Aufmerksamkeitsstörung, Selbstversorgung (z.B. Ankleiden und Waschen) ist unmöglich.", max:100, min:81, tipps:"iMeld2"},
                          { info:"Schwere Konzentrations- und Aufmerksamkeitsstörung, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                          { info:"Mässige Konzentrationsstörung und verminderte Aufmerksamkeit, deutliche Einschränkung im Alltag, eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld1"},
                          { info:"Leichte Konzentrations- und Aufmerksamkeitsstörung,leichte Einschränkung im Alltag.", max:40, min:21, tipps:"iBeweg,iBerat"},
                          { info:"Sehr leichte Konzentrationsstörung, kurz anhaltend, keine Einschränkung im Alltag.", max:20, min:0, tipps:"iBeweg"}
                    ]  
              }, 
                { id: "10013573", title: "Benommenheit", kategorie: "Nervensystem",zero:0, farbwert:"rgba(64,224,208,0.9)",
                grad:[    
                          { info:"Sehr starke Benommenheit und Eintrübung, Selbstversorgung (z.B. Ankleiden und Waschen) ist unmöglich.", max:100, min:81, tipps:"iMeld2"},
                          { info:"Schwere Benommenheit, starke Eintrübung, eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                          { info:"Mässige Benommenheit, deutliche Einschränkung im Alltag, eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld2"},
                          { info:"Leichte Benommenheit,leichte Einschränkung im Alltag.", max:40, min:21, tipps:"iBeweg,iMeld1"},
                          { info:"Sehr leichte Benommenheit, kurz anhaltend, keine Einschränkung im Alltag.", max:20, min:0, tipps:"iBeweg"}
                    ]  
              }, 
                { id: "10019211", title: "Kopfschmerzen", kategorie: "Schmerzen",zero:0,  farbwert:"rgba(135,206,235,0.9)",
                grad:[    
                          { info:"Sehr starke nicht auszuhaltende Schmerzen, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld2"},
                          { info:"Stark anhaltende Schmerzen, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iReserve,iMeld2"},
                          { info:"Mässige und anhaltende Schmerzen, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iReserve,iMeld1"},
                          { info:"Leichte Schmerzen, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iReserve"},
                          { info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit", max:20, min:0}
                    ]  
              },
                { id: "10003239", title: "Gelenkschmerzen", kategorie: "Schmerzen",zero:0,  farbwert:"rgba(135,206,235,0.9)",
                grad:[    
                          { info:"Sehr starke nicht auszuhaltende Schmerzen, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld2"},
                          { info:"Stark anhaltende Schmerzen, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iReserve,iMeld2"},
                          { info:"Mässige und anhaltende Schmerzen, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iReserve,iMeld1"},
                          { info:"Leichte Schmerzen, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iReserve"},
                          { info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit", max:20, min:0}
                    ]  
              },  
                { id: "10062572", title: "Muskelschwäche", kategorie: "Nervensystem",zero:0, farbwert:"rgba(64,224,208,0.9)",
                grad:[    
                          { info:"Sehr starke Muskelschwäche, Selbstversorgung (z.B. Ankleiden und Waschen) ist unmöglich.", max:100, min:81, tipps:"iMeld2"},
                          { info:"Schwere Muskelschwäche, eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                          { info:"Mässige Muskelschwäche, Bewegung eingeschränkt, deutliche Einschränkung im Alltag, eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld2"},
                          { info:"Leichte Muskelschwäche,leichte Einschränkung im Alltag.", max:40, min:21, tipps:"iBeweg,iMeld1"},
                          { info:"Sehr leichte Schwäche, kurz anhaltend, keine Einschränkung im Alltag.", max:20, min:0, tipps:"iBeweg"}
                    ]  
              }, 
                 { id: "10005886", title: "Sehstörung", kategorie: "Augen",zero:0, farbwert:"rgba(64,224,208,0.9)",
                grad:[    
                          { info:"Sehr starke Sehstörung, Selbstversorgung (z.B. Ankleiden und Waschen) ist unmöglich.", max:100, min:81, tipps:"iMeld2"},
                          { info:"Schwere Sehstörung, eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                          { info:"Mässige Sehstörung, Mobilität eingeschränkt, deutliche Einschränkung im Alltag, eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld2"},
                          { info:"Leichte Sehstörung,leichte Einschränkung im Alltag.", max:40, min:21, tipps:"iBerat,iMeld1"},
                          { info:"Sehr leichte Sehstörung, kurz anhaltend, keine Einschränkung im Alltag.", max:20, min:0}
                    ]  
              }, 
                { id: "10062872", title: "Empfindungsstörung", kategorie: "Nervensystem",zero:0, farbwert:"rgba(64,224,208,0.9)",
                grad:[    
                          { info:"Sehr starke Empfindungsstörung, Selbstversorgung (z.B. Ankleiden und Waschen) ist unmöglich.", max:100, min:81, tipps:"iMeld2"},
                          { info:"Schwere Empfindungsstörung, eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                          { info:"Mässige Empfindungsstörung, deutliche Einschränkung im Alltag, eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld2"},
                          { info:"Leichte Empfindungsstörung,leichte Einschränkung im Alltag.", max:40, min:21, tipps:"iBeweg,iMeld1"},
                          { info:"Sehr leichte Störung, kurz anhaltend, keine Einschränkung im Alltag.", max:20, min:0, tipps:"iBeweg"}
                    ]  
              }, 
                { id: "10003591", title: "Gangstörung", kategorie: "Nervensystem",zero:0, farbwert:"rgba(64,224,208,0.9)",
                grad:[    
                          { info:"Sehr starke Gangstörung,Gehunfähigkeit, Selbstversorgung (z.B. Ankleiden und Waschen) ist unmöglich.", max:100, min:81, tipps:"iMeld2"},
                          { info:"Schwere Gangstörung, fast gehunfähig, eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                          { info:"Mässige Gangstörung, deutliche Einschränkung im Alltag, eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld2"},
                          { info:"Leichte Gangstörung,leichte Einschränkung im Alltag.", max:40, min:21, tipps:"iBeweg,iMeld1"},
                          { info:"Sehr leichte Störung, kurz anhaltend, keine Einschränkung im Alltag.", max:20, min:0, tipps:"iBeweg"}
                    ]  
              }, 
                 { id: "10047065", title: "Entzündung der Blutgefässe", kategorie: "Blutgefässe",zero:0, farbwert:"rgba(64,224,208,0.9)",
                grad:[    
                          { info:"Schwere Symptome mit starken Schmerzen." ,max:100, min:61, tipps:"iMeld2"},
                          { info:"Mässige Symptome, deutliche Rötung oder Schwellung oder Schmerzen.", max:60, min:41, tipps:"iMeld2"},
                          { info:"Leichte Symptome, nur kurzfristige Rötung oder Schwellung.", max:40, min:21, tipps:"iMeld1"},
                          { info:"Sehr milde Symptome, kurz anhaltend, keine Einschränkung im Alltag.", max:20, min:0}                        
                    ]  
              }, 
                { id: "10034016", title: "Nagelbettentzündung", kategorie: "Haut und Haare",zero:0,  farbwert:"rgba(135,206,235,0.9)",
                grad:[    
                            { info:"Sehr schwere schmerzhafte Nagelveränderung, Selbstversorgung (z.B. Ankleiden und Waschen) ist unmöglich.", max:100, min:81, tipps:"iMeld2"},
                            { info:"Schwere schmerzhafte Nagelveränderung, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                            { info:"Mässige schmerzhafte Nagelveränderungen, Rötung und Schwellung, deutliche Einschränkung im Alltag, eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld1"},
                            { info:"Leichte Beschwerden, Schwellung und Rötung, leichte Einschränkung im Alltag.", max:40, min:21, tipps:"iNagelpflege"},
                            { info:"Sehr milde Beschwerden, leichte Rötung, schmerzfrei.", max:20, min:0, tipps:"iNagelpflege"}
                    ]  
              }
        ],
		
		Tipps:
			 [
              { id: "iNelke", title:"Nelkenwasser", kategorie:"Selbsthilfe", likes:1, dislikes:0,
                   bausteine: 
                    [
                        { "Häufigkeit": "Mundspülung mit Nelkenwasser 2-3 mal pro Tag anwenden."},
                        { "Zubereitung": "Kochen Sie hierfür ein paar Gewürznelken in Wasser auf und lassen Sie das Wasser abkühlen."}
                   ]     
              },         
               { id: "iMeld1", title:"Kontakt", kategorie:"Brustzentrum", likes:0, dislikes:0,
                    bausteine: 
                     [
                        { "Info":"Melden Sie sich telefonisch im Brust-Zentrum/Onkozentrum bei anhaltenden Beschwerden."},
                        { "Tagsüber":"+41 43 344 3333"},
                        { "Nachts":" +41 44 209 2111"},
                        { "Am Wochenende":" +41 44 209 2111"}
                    ]    
              },
                { id: "iShampoo", title:"Mildes Shampoo", kategorie:"Selbsthilfe", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Empfehlung": "Waschen Sie die Haare und Kopfhaut mit einem milden Shampoo und lauwarmen Wasser."}
                   ]     
              },  
                { id: "iKopfpflege", title:"Kopfhautpflege", kategorie:"Selbsthilfe", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Empfehlung": "Fetthaltige Salben schützen vor dem Austrocknen."}
                   ]     
              },
                { id: "iSprüh", title:"Sprühflasche", kategorie:"Selbsthilfe", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Häufigkeit": "Schleimhäute mehrmals am Tag mit Sprühfläschchen besprühen."},
                        { "Zubereitung": "Füllen Sie das Sprühfläschchen mit Wasser, 2 Trpf. Zitronenöl, 2-4 Trpf. Öl (je nach Vorliebe) und ein wenig Salz."}
                   ]     
              },
                { id: "iMyrrhe", title:"Myrrhe-Ratanhia-Tinktur", kategorie:"Selbsthilfe", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Häufigkeit": "Bepinseln Sie die betroffene Schleimhaut mit unverdünnter Myrrhe-Ratanhia-Tinktur, bei Bedarf bis zu 4x/Tag."},
                        { "Erhältlich": "Die unverdünnte Myrrhe-Ratanhia-Tinktur erhalten Sie in einer Apotheke."}
                   ]     
              },
                { id: "iCalendula1", title:"Calendula-Lösung", kategorie:"Selbsthilfe", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Häufigkeit": "Gurgeln Sie die Calendula-Lösung nach Bedarf."},
                        { "Zubereitung": "Mischen Sie einen halben Teelöffel Calendula-Tinktur auf ein Glas Wasser."}
                   ]     
              },
                { id: "iTeebaum", title:"Teebaumöl", kategorie:"Selbsthilfe", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Häufigkeit": "Grugeln Sie die Teebaum-Lösung nach Bedarf.: 1 Tropfen Teebaumöl in einem Glas Wasser)."},
                        { "Zubereitung": "Mischen Sie 1 Tropfen Teebaumöl auf ein Glas Wasser."}
                   ]     
              },
                { id: "iPropolis", title:"Propolis-Tinktur", kategorie:"Selbsthilfe", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Häufigkeit": "Spülen Sie den Mund mit der Propolis-Lösung."},
                        { "Zubereitung": "Mischen Sie 8 Tropfen Propolis-Tinktur auf ein halbes Glas Wasser."}
                   ]     
              },
                { id: "iMalve", title:"Malventee", kategorie:"Selbsthilfe", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Häufigkeit": "Spülen Sie den Mund mit Malventee, aber nur wenn Sie nicht unter Mundtrockenheit leiden. Malve trocknet die Schleimhäute aus."},
                        { "Zubereitung": "Bereiten Sie einen Aufguss mit Malvenblüten und lassen sie den Tee erkalten."}
                   ]     
              },
                { id: "iBeweg", title:"Moderate Bewegung", kategorie:"Selbsthilfe", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Empfehlung": "Verbessern Sie die Körperdurchblutung und regen Sie den Kreislauf an durch regelmässige morderate sportliche Betätigung."}
           
                   ]     
              },  
                { id: "iIngwertee", title:"Ingwertee", kategorie:"Selbsthilfe", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Häufigkeit": "Trinken Sie gelegentlich und bei Bedarf einen Ingwertee."},
                        { "Zubereitung": "Bereiten Sie einen Aufguss mit frischgeschälter und in Scheiben geschnittener Ingwerwurzel oder verwenden Sie einfach Ingwer im Teebeutel."}
                   ]     
              },
                { id: "iIngwerkapsel", title:"Ingwerkapseln", kategorie:"Selbsthilfe", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Häufigkeit": "Nehmen Sie die Kapseln nach Angaben auf der Produkinformation ein."},
                        { "Erhältlich": "Die Kapseln mit unterschiedlichen Dosierungen erhalten Sie in Apotheken, lassen Sie sich beraten"}
                   ]     
              },
                { id: "iIngwerhonig", title:"Ingwerhonig", kategorie:"Selbsthilfe", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Häufigkeit": "Trinken Sie gelegentlich und bei Bedarf einen Aufguss mit Ingwerhonig."},
                        { "Zubereitung": "Zerkleinern Sie Ingwerwurzel in kleine Stückchen und vermengen Sie diese mit 1 Löffel Honig. Übergissen SIe die Mischung mit heissem Wasser."}
                   ]     
              },
                { id: "iAkupressP6", title:"Akupressurpunkt P6", kategorie:"Selbsthilfe", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Häufigkeit": "Drücken Sie den Akupressurpunkt P6 wiederholt und bei Bedarf oder verwenden Sie ein Akupressurband aus der Apotheke."},
                        { "Erklärung": "Der Akupressurpunkt befindet sich drei Querfinger hinter der grossen Linie des Handgelenks an der Innenseite des Unterarms."},
                        { "Grafik": "Akupressurpunkt P6<br><img src='img/assets/akupunkturP6.png'>"}
                   ]     
              },
                { id: "iZwiebel", title:"Kleidung im <i>Zwiebellook</i>", kategorie:"Selbsthilfe", likes:0, dislikes:0,
                   bausteine: 
                    [
                           { "Erklärung": "Tragen Sie Kleidung in mehreren Schichten, um bei Bedarf einen Teil ausziehen zu können."}
                   ]     
              },
                { id: "iVagina", title:"Vaginalpflege", kategorie:"Selbsthilfe", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Empfehlung": "Verwenden Sie beispielsweise: Multigyn Actigel, Hydro Santa, Gynofit, Calendula, aethrische Öle von Weleda (Lavendel, Rosen, Granatapfelöl), Vagisan, Geliofil, Colpotrophine"},
                        { "Erhältlich": "Die verschiedenen Produkte sind in Apotheken erhältlich, lassen Sie sich unbedingt beraten und sprechen Sie mit Ihrem Arzt"}
                   ]     
              },
                { id: "iCimici", title:"Cimicifuga-racemosa-Extrakte", kategorie:"Empfehlung", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Empfehlung": "Pflanzliche Medikamente nur in Absprache mit dem Arzt einnehmen. Lassen Sie sich beraten."},
                        { "Erhältlich": "Pflanzliche Medikamente oder auch Phytotherapeutika sind in Apotheken erhältlich."}
                   ]     
              },
               { id: "iBerat", title:"Ärztliche Beratung", kategorie:"Empfehlung", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Empfehlung": "Sprechen Sie mit Ihrem Arzt über Ihre Beschwerden, haben Sie keine Hemmungen."}
   
                   ]     
              },
                { id: "iEntdeck", title:"Neues Entdecken", kategorie:"Empfehlung", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Empfehlung": "Gehen Sie auf Entdeckungsreise, probieren Sie neue Nahrungsmittel aus, ernähren Sie sich abwechslungsreich und ausgewogen."}
                   ]     
              },          
               { id: "iStuhlkonsis", title:"Verbesserte Stuhlkonsistenz", kategorie:"Selbsthilfe", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Empfehlung": "Verwenden Sie beispielsweise: indischer Flohsamen, Optifibre, Muskatnuss in geringen Mengen, schwarzer Tee, Heidelbeeren, geriebener Apfel, pürierte Banane, Karottensuppe, vermeiden von Zuckeraustauschstoffen"},
                        { "Erhältlich": "Die verschiedenen Produkte sind in Apotheken erhältlich, lassen Sie sich unbedingt beraten und sprechen Sie mit Ihrem Arzt"}
                   ]     
              },
                { id: "iAnreich", title:"Angereicherte Nahrung", kategorie:"Selbsthilfe", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Empfehlung": "Reichern Sie Speisen mit Rahm oder Creme fraiche an, meiden Sie Magerprodukte, fügen Sie nach belieben Nüsse oder Proteinpulver zum Essen hinzu."}
                   ]     
              },
                { id: "iFaserreich", title:"Faserreiche Nahrung", kategorie:"Selbsthilfe", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Empfehlung": "Bevorzugen Sie Vollkornprodukte, Gemüse, Salat, Hülsenfrüchte, Weizenkleie, Leinsamen und Flohsamen. Trinken Sie dazu immer ausreichend Flüssigkeit"}
                   ]     
              },
                 { id: "iMeld2", title:"Im Brustzentrum melden", kategorie:"Brustzentrum", likes:0, dislikes:0,
                    bausteine: 
                     [
                        { "Info":"Melden Sie sich telefonisch im Brust-Zentrum/Onkozentrum."},
                        { "Tagsüber":"+41 43 344 3333"},
                        { "Nachts":" +41 44 209 2111"},
                        { "Am Wochenende":" +41 44 209 2111"}
                    ]    
              },
                 { id: "iCalendula2", title:"Calendula-Tinktur", kategorie:"Selbsthilfe", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Häufigkeit": "Bepinseln Sie die betroffene Schleimhaut mit unverdünnter Calendula-Tinktur, bei Bedarf bis zu 4x/Tag."},
                        { "Erhältlich": "Die unverdünnte Calendula-Tinktur erhalten Sie in einer Apotheke."}
                   ]     
              },
                 { id: "iSpeichel", title:"Speichelfluss", kategorie:"Empfehlung", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Empfehlung": "Erhalten Sie eine gute Speichelsekretion. Nutzen Sie hierzu zuckerfreie Kaugummis oder Bonbons, sowie zuckerfreie Getränke."},
                   ]     
              },
                 { id: "iMundpfleg", title:"Mundpflege", kategorie:"Empfehlung", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Empfehlung": "Verwenden Sie beispielsweise: alkoholfreies Mundwasser, Zahnseide, Lippenpflege ohne Gylcerin, weiche Zahnbürsten. Reingen Sie die Zähne nach jeder Mahlzeit. Führen Sie eine gründliche Prothesenreinigung oder verzichten Sie auf die Prothese."}
                   ]     
              },
                 { id: "iGenuss", title:"Vermeidbare Nahrungs- und Genussmittel", kategorie:"Empfehlung", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Empfehlung": "Vermeiden Sie Kaffee, Alkohol und Zigaretten, sowie saure und scharfe Speisen."}
                   ]     
              },
                 { id: "iKopfdecke", title:"Kopfbedeckung", kategorie:"Empfehlung", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Empfehlung": "Tragen Sie ein Kopftuch oder eine andere Kopfbedeckung, um nicht zu frieren."}
                   ]     
              },
                 { id: "iHaarspezi", title:"Haarspezialist", kategorie:"Empfehlung", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Empfehlung": "Fragen Sie bei der Pflege nach Adressen für Haarspezialisten."}
                   ]     
              },
                 { id: "iKopfmass", title:"Kopfmassage", kategorie:"Empfehlung", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Empfehlung": "Massieren Sie die Kopfhaut leicht, um die Durchblutung zu fördern."}
                   ]     
              },
                 { id: "iGewkontrolle", title:"Gewichtskontrolle", kategorie:"Empfehlung", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Empfehlung": "Versuchen Sie sich ausgewogen und ausreichend zu ernähren. Wenden Sie sich bei Bedarf an eine Ernährungsberatung."}
                   ]     
              },
                 { id: "iHalten", title:"Gewicht halten", kategorie:"Empfehlung", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Empfehlung": "Versuchen Sie sich ausgewogen und ausreichend zu ernähren. Wenden Sie sich bei Bedarf an eine Ernährungsberatung."}
                   ]     
              },
                 { id: "iFlüssig", title:"Flüssigkeitsaufnahme", kategorie:"Empfehlung", likes:0, dislikes:0,
                    bausteine: 
                    [
                        { "Empfehlung": "Trinken Sie 2-3 Liter Flüssigkeit verteilt über den Tag"}
                   ]     
              },
                 { id: "iKleinesmahl", title:"Kleine Mahlzeiten", kategorie:"Empfehlung", likes:0, dislikes:0,
                    bausteine: 
                    [
                        { "Empfehlung":"Essen Sie mehrere kleine Portionen verteilt über den Tag."}
                   ]     
              },
                 { id: "iReserve", title:"Reservemedikation", kategorie:"Brustzentrum", likes:0, dislikes:0,
                    bausteine: 
                     [
                        { "Info":"Nehmen Sie Ihre Reservemedikation grosszügig ein oder wenden Sie sich an das Brustzentrum/Onkozentrum."},
                        { "Tagsüber":"+41 43 344 3333"},
                        { "Nachts":" +41 44 209 2111"},
                        { "Am Wochenende":" +41 44 209 2111"}
                    ]    
              },
                { id: "iAnanas", title:"Ananas und Zitronenwasser", kategorie:"Prophylaxe", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Häufigkeit": "Trinken Sie je nach Bedarf Wasser mit ein paar Tropfen Ananas oder Zitrone."},
                        { "Zubereitung": "Ein paar Tropfen Zitronen- oder Ananassaft in ein Glas Wasser."}
                   ]     
              },
                  { id: "iPovidon", title:"Povidon-Lösung", kategorie:"Prophylaxe", likes:0, dislikes:0,
                   bausteine: 
                    [
                        { "Häufigkeit": "Spühlen Sie den Mund 2-3 Min mit einer Povidon-Lösung."},
                        { "Zubereitung": "Mischen Sie 2.5 Kaffeelöffel Povidon-Jod-Lösung (7.5%) auf ein halbes Glas Wasser. Die 7.5%-tige Povidonlösung erhalten Sie in der Apotheke."}
                   ]     
              },
                 { id: "iTeenein", title:"Vermeidbare Teesorten", kategorie:"Prophylaxe", likes:0, dislikes:0,
                   bausteine: 
                    [
                         { "Empfehlung": "Vermeiden Sie Malven- oder Salbeitee. Sie trocknen die Schleimhäute aus"}
                   ]     
              },
                 { id: "iTeespül", title:"Mundspülung mit Tee", kategorie:"Prophylaxe", likes:0, dislikes:0,
                   bausteine: 
                    [
                         { "Empfehlung": "Spülen Sie den Mund mit Kamille-, Pfefferminz- oder Fencheltee"}
                   ]     
              },
                 { id: "iSchonen", title:"Schonung der Operationsseite", kategorie:"Prophylaxe", likes:0, dislikes:0,
                   bausteine: 
                    [
                         { "Empfehlung": "Vermeiden Sie Blutdruckmessungen, Infusionen oder Injektionen auf der Armseite, wo die Lympknoten entfernt wurden."}
                   ]     
              },
                 { id: "iPump", title:"Pumpübungen", kategorie:"Prophylaxe", likes:0, dislikes:0,
                   bausteine: 
                    [
                         { "Empfehlung": "Führen Sie regelmässige Pumpübungen mit der Hand bei erhobenen Arm durch. Fragen Sie die Pflege nach Beispielen."}
                   ]     
              },
                 { id: "iNagelpflege", title:"Vorsichtige Nagelpflege", kategorie:"Prophylaxe", likes:0, dislikes:0,
                   bausteine: 
                    [
                         { "Empfehlung": "Vermeiden Sie Verletzungen bei der Nagelpflege."}
                   ]     
              },
                 { id: "iKleidung", title:"Bequeme Kleidung", kategorie:"Prophylaxe", likes:0, dislikes:0,
                   bausteine: 
                    [
                         { "Empfehlung": "Tragen Sie bequeme und nicht einschneidende Kleidung. Der Träger des BHs sollten weder an Schulter noch Brustkorb einschneiden und verwenden Sie nur leichte Brustprothesen."}
                   ]     
              },
                 { id: "iSonne", title:"Sonnenbrand vermeiden", kategorie:"Prophylaxe", likes:0, dislikes:0,
                   bausteine: 
                    [
                         { "Empfehlung": "Vermeiden Sie zu starke Sonnenbestrahlung und einen Sonnenbrand."}
                   ]     
              },
                 { id: "iSport", title:"Sport", kategorie:"Prophylaxe", likes:0, dislikes:0,
                   bausteine: 
                    [
                         { "Empfehlung": "Halten Sie ihre Muskeln und Gelenke in Bewegung, das unterstützt das Lymphsystem. Vermeiden Sie aber starke Belastungen."}
                   ]     
              },
                 { id: "iLippen", title:"Propolis-Lippenpflege", kategorie:"Empfehlung", likes:0, dislikes:0,
                   bausteine: 
                    [
                         { "Empfehlung": "Verwenden Sie keine Lippenpflege mit Gylcerin. Besser geeignet ist z.B. Propolis Lippenpflege aus der Apotheke."}
                   ]     
              }
         ]
};


