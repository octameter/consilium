/**
 * Created by Marco Egbring on March 2013
 * Copyright 2013 EPha.ch. All rights reserved.
 */

function Model() {}

Model.prototype._data = 
{
		// Acts
		acts: [],
		// ARZT OR PATIENT
		protagonist:null,
		// PATIENT
		antagonist: null
};


Model.prototype.getActs = function()
{
	return this._data.acts;
};

Model.prototype.updateActWithId = function( act, id )
{
	for( var i = 0; i < this._data.acts.length; i++)
	{
		if(this._data.acts[i].zeit == act.zeit && this._data.acts[i].entitiesId == act.entitiesId) this._data.acts[i].id = id;
	}
};

Model.prototype.getActForPunkt = function( punkt )
{
	for( var i = 0; i < this._data.acts.length; i++)
	{
		if(this._data.acts[i].entitiesId == punkt.id && this._data.acts[i].wert == punkt.y && this._data.acts[i].zeit == punkt.x) return this._data.acts[i];
	}
	
	return null;
};

Model.prototype.setProtagonist = function ( actor )
{
	// DEFAULT
	if( !actor )
	{
		// APP AND NOT SYNCED
		this._data.protagonist = 
		{
				id:0,
				role:"PATIENT",
				favoritesObject: 
				{
					Bewertung:	[ { entitiesId : "10025482"} ],
					Symptome:  	[ /*{"id":"10047700","edit":true}*/ ],
					Tagebuch:	[ { entitiesId: "privat"} ]					
				},
				customerObject:
				{
					intro:"INTRO"
				}
		};
	}
	else this._data.protagonist = actor;
    
    return this._data.protagonist;
};

Model.prototype.getProtagonist = function() { return this._data.protagonist; };

Model.prototype.isArzt = function()
{
	return (this.getProtagonist().role == "ARZT");
};
Model.prototype.isPatient = function()
{
	return (this.getProtagonist().role == "PATIENT");
};

Model.prototype.setIntro = function( type )
{	
	this._data.protagonist.customerObject = this._data.protagonist.customerObject || {};	
		
	this._data.protagonist.customerObject["intro"] = type;
};
Model.prototype.getIntro = function()
{
	if( !this._data.protagonist || !this._data.protagonist.customerObject || !this._data.protagonist.customerObject["intro"] ) return null;
	
	return this._data.protagonist.customerObject["intro"];
};

Model.prototype.setAntagonist = function ( actor )
{
	this._data.antagonist = actor;
};
Model.prototype.getAntagonist = function ()
{
	return ( this.isPatient() ) ? this._data.protagonist : this._data.antagonist;
};
Model.prototype.hasAntagonist = function( actor )
{
	return !!this._data.antagonist;
};

/**
 * GETTER AND SETTER SYNC LOCALSTORAGE
 * @param type
 * @param id
 */
Model.prototype.getFavorites = function( type )
{
	return ( type ) ? this._data.protagonist.favoritesObject[ type ] : this._data.protagonist.favoritesObject;
};

Model.prototype.addFavorite = function( type, id )
{
	this._data.protagonist.favoritesObject[type].unshift( { entitiesId: String( id ), edit: true } );
};

Model.prototype.removeFavorite = function( type, item )
{
	var idx = -1;
    
	this._data.protagonist.favoritesObject[type].forEach( function(element, index)
	{
		if(element.id == item.id ) idx = index;
	});
	
    if( idx > -1)
	this._data.protagonist.favoritesObject[type].splice(idx,1);
    
	localStorage.setItem( "device_actor", JSON.stringify( this._data.protagonist));	
};



Model.prototype.addActs = function( acts )
{
	if( acts )
	this._data["acts"] = this._data["acts"].concat( acts );
};

// LEGACY

// ADD MOST RECENT DATA POINT
Model.prototype.addPunkt = function( punkt )
{	
	if(!punkt) return;
		
	var element = {};
	element.entitiesId = punkt.id;
	element.zeit = punkt.x;
	element.wert = punkt.y;
	element.upToDate = null;
	
	if( punkt.tipps ) element.tipps = punkt.tipps.slice(0);

	this._data["acts"].unshift( element );
};

Model.prototype.removePunkt = function( punkt )
{
	for( var i = 0; i < this._data["acts"].length; i++)
	{
		// If Punkt with y,x,id
		if( this._data["acts"][i].entitiesId === punkt.id && this._data["acts"][i].zeit == punkt.x) this._data["acts"].splice(i,1);				

		// If Act with entitiesId, zeit, wert
		if( punkt.entitiesId && this._data["acts"][i].id === punkt.id ) this._data["acts"].splice(i,1);				
	}	
};




/**
 * UTILITY
 * @param type
 * @returns {Boolean}
 */

Model.prototype.hasFavoriteEdit = function( type )
{
    var found = false;
    
    this._data.protagonist.favoritesObject[type].forEach( function(element, index)
	{
		if(element.edit) found = true;
	});
    
    return found;
};

Model.prototype.getMinX = function()
{	
	// Default 14 Tage zurück
	var minX = new Date().getTime() - ( 14 * 24 * 60 * 60 * 1000 );

	var size = this._data.acts.length;
	
	while(size--)
	{
		minX = Math.min( this._data.acts[size].zeit, minX);
	}
	
	return zeit( "dawn", minX );	
};

/**
 * Selected ID Ascending and newest Time descending
 * @param id
 */
Model.prototype.sortPunkteByTime = function(id)
{
	var punkte = this._data.acts;
	
	var ids = this.getUniquePunkte(id);
	
	// Sort by Id and Time
	punkte.sort( function( a, b )
	{
		// ID Ascending
		if(ids.indexOf(b.entitiesId) !== ids.indexOf(a.entitiesId))
		{
			return ids.indexOf(a.entitiesId) - ids.indexOf(b.entitiesId);
		}
		// ID Descending
		if(ids.indexOf(b.entitiesId) === ids.indexOf(a.entitiesId))
		{
			return ( b.zeit - a.zeit );				
		}
	});
};

/**
 * SORT ALL SYMPTOMS NOT IN FAVORITES
 * @returns ARRAY
 */
Model.prototype.getSymptome = function()
{    
	var favorites = this.getFavorites().Symptome.map( function( entity ) { entity.id = entity.entitiesId; return entity; } );
	
	var symptome = this.dict["Symptome"].notIn( "id", this.getFavorites().Symptome );
	    
    symptome.sortABC( "title" );
    
    console.log( this.getFavorites().Symptome );

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
	var punkte = this._data.acts.slice(0);
	// First the selected element 
	var ids = [];

	if( id )
	punkte.push( String( id ) );
	
	// than descending by time
	punkte.sort123("zeit"); 
	
	// Unique ids
	punkte.forEach( function(element, index)
	{		
		if( ids.indexOf( element.entitiesId ) === -1 && element.entitiesId !== id)
		{
			ids.push( element.entitiesId );
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
	var dictionary = [].concat(this.dict["Symptome"], this.dict["Bewertung"], this.dict["Tagebuch"], this.dict["Tipps"], this.dict["Device"]);
	
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
    	
	if( !grad ) return null;
	
    for( var i = 0; i < grad.length; i++)
	{
		if( grad[i].min <= value && grad[i].max >= value) return grad[i];
	}
    
    return grad[0];
};


/**
* RETURNS MOST RECENT DATA POINT FOR KEY (TYPE)
*/
Model.prototype.getPunkt = function( id )
{		
	var acts = this.getActs();
	
	return acts.getObjectInArray("entitiesId", id);
};


/**
* DATA  {Type, Value, Key (x)}
* RETURNS TIPS ACCORDING TO Y RANGE
**/
Model.prototype.getEmpfehlungen = function( data )
{	
	var _tipps = [];

	var obj = this.getGrad(data.type, data.value);

	if(!obj || !obj.tipps) return _tipps;
	
	var rows = obj.tipps.split(",");	
 
	for( var i = 0; i < rows.length; i++)
	{
		// Trim in Case of Whitespace
		_tipps.push( this.getType( rows[i].trim() ));
	}
	
    return _tipps;
};

Model.prototype.getStateFavEdit = function() { return this._state.favoritesEdit; };
Model.prototype.setStateFavEdit = function( value ) { this._state.favoritesEdit = value; };
Model.prototype.getStateFavitEdit = function() { return this._state.favitEdit; };
Model.prototype.setStateFavitEdit = function( value ) { this._state.favitEdit = value; };
Model.prototype.getStateSymptom = function() { return this._state.currentItem;};
Model.prototype.setStateSymptom = function( value ) { this._state.currentItem = value;};
Model.prototype.getStateTemp = function() { return this._state.tempItem;};
Model.prototype.setStateTemp = function( value ) { this._state.tempItem = value;};

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

Model.prototype.getStateTipp = function() { return this._state.tipItem;};
Model.prototype.setStateTipp = function( value ) { this._state.tipItem = value; };

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
 * TODO customize entitiesID
 * data { property : "liked" || "disliked" || "clicked" }
 */
Model.prototype.trackPunktTipp = function( property )
{
	var tippId = this.getStateTipp().id;
		
	for( var i = 0; i < this._data.punkte.length; i++)
	{
		var punkt = this._data.punkte[i];
	
		if( punkt.id == this.getStateSymptom().id && punkt.x == this.getStateSymptom().x)
		{
			if( ! punkt.tipps ) this._data.punkte[i].tipps = [];

			var tipp = this._data.punkte[i].tipps.getId( tippId );
			
			if(tipp)
			{
				var value = tipp[property] || 0;
				this._data.punkte[i].tipps.changeItem(tippId, property, value + 1);
			}
			else
			{
				var trackTipp = {};
				
				trackTipp[ "id" ] = tippId; 				
				trackTipp[ property ] = 1; 
				
				this._data.punkte[i].tipps.push( trackTipp );					
			}
			
			localStorage.setItem( "device_acts", JSON.stringify( this._data["punkte"] ));
		}
	}
};
// TODO
Model.prototype.trackPunktLikedOrNotExists = function()
{
	var tippId = this.getStateTipp().id;
	
	if( this._data.acts.length == 0 ) return true;
	
	for( var i = 0; i < this._data.acts.length; i++)
	{
		var punkt = this._data.acts[i];
				
		if( punkt.id == this.getStateSymptom().id && punkt.x == this.getStateSymptom().x)
		{
			if( ! punkt.tipps ) this._data.punkte[i].tipps = [];

			var tipp = this._data.punkte[i].tipps.getId( tippId );
			
			if(tipp)
			return (tipp.liked || tipp.disliked);
		}
	}
	return false;
};

Model.prototype.dict = new Entities();



