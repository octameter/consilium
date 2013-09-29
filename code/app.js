/**
  Copyright (C) 2013
              _                 _     
             | |               | |    
    ___ _ __ | |__   __ _   ___| |__  
   / _ \ '_ \| '_ \ / _` | / __| '_ \ 
  |  __/ |_) | | | | (_| || (__| | | |
   \___| .__/|_| |_|\__,_(_)___|_| |_|
       | |                            
       |_|        
  
  Permission is hereby granted, free of charge, to any person obtaining a copy of this 
  software and associated documentation files (the "Software"), to deal in the Software 
  without restriction, including without limitation the rights to use, copy, modify, merge, 
  publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons 
  to whom the Software is furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in all copies or 
  substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
  PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
  FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
  ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.          
 */
var App = {  
    
  // CONTROLLER
  on: function ( type, call) { ( type.indexOf( call ) != -1 ) ?  console.log( "Function already exists") : type.push( call); },
  off: function( type, call ) {  type.splice( type.indexOf( call), 1); },
  dispatch: function( type, data ) {  for( var i = 0; i < type.length; i++) { type[i]( data ); } }
  ,  
  // COMMANDS
  READY:[],
  HOME:[],
  OPTIONEN:[],
  FAVORITES:[],
  FAVORITE:[],
  SYMPTOME:[]
  ,
  // MODEL
  model:new Model()
  ,
  // VIEWS
  views:function() 
  {
    Konto.init();
    Home.init();
    Favorites.init();
    Favorite.init();
    Optionen.init();
  },
  // BINDING 
  bind:function() 
  {
    DOM(window).on("ready", function() {
      DOM("app").show();
      
      //App.dispatch( App.READY );
    });
  },
  // ENVIROMENT
  initialize: function( domain ) 
  {
    
    if(!App.live) console.log( "- DOMAIN "+domain);
    if(!App.live && !DOM) console.log( "- MODULE DOM required");
    
    this.device = DOM().device();
    
    if( document.domain == this.domain ) {
    //
      this.domain = domain;
      document.domain = "epha.ch";
      this.live = true;
    }
    else {
    //
      this.domain = document.domain = document.domain;
      this.live = false;  
    }
    
    if(!App.live && !new Node) console.log( "- MODULE Node required");
    this.node = ( this.live ) ? new Node( "https://node.epha.ch" ) : new Node( "http://"+this.domain+":8080" );
    this.konto = ( this.live ) ? "http://konto.epha.ch" : "http://"+this.domain+":8888/konto"; 
    
    this.views();
    this.bind();
  },
};

var Konto = {
//VIEW
    
    // DOMELEMENTS
    body:DOM("app")
    ,
    container: DOM( "xauth" )
    ,
    remote:null
    ,
    // TEST
    test:function() 
    {
      
    }
    ,
    // INIT
    init: function() 
    {    
      if(!App.live) console.log( "- VIEW Konto");
      if(!App.live && !App.konto) console.log( "Missing App.konto");
      
      DOM(window).on("msg", function( data) {
        Konto.response(data);
      });
      
      if( App.device == "desktop") 
      {
        this.body.style("top", "42px");
        this.container.show();        
        this.remote = this.container.konto( App.konto ).on( "load", function(data) {
        // FIRST QUERY
          
        }).get("contentWindow");        
      }
      else {
        this.body.style("top", "0px");
        this.container.hide();        
      }
    }
    ,
    // FUNCTION
    request: function( data ) 
    {
      if( data.request == "REDIRECT") Konto.remote.postMessage( { request:"REDIRECT", target:data.target }, "*"); 
    }
    ,
    response: function(data) 
    {
      if( data.request == "REDIRECT") location.replace(data.target);    
    }
};

var Home = {
// VIEW
    
  //DOMELEMENTS
  container:DOM("homeId"),
  gotoOptionen:DOM("addOptionen"),
  gotoFavorites:DOM("addEingabe"),
  content:DOM("homeContentId")
  ,
  // TEST
  test:function() 
  {
    if(!App.live) console.log( "- VIEW Home");
    if(!App.live && !App.OPTIONEN) console.log( "Missing: App.OPTIONEN");
    if(!App.live && !App.FAVORITES) console.log( "Missing: App.FAVORITES");  
  }
  ,
  // BINDING
  bind:function() 
  {    
    this.gotoOptionen.on("touch", function() {
      App.dispatch( App.OPTIONEN );
      Home.container.swipe("right");
    });
    this.gotoFavorites.on("touch", function() {      
      App.dispatch( App.FAVORITES );     
      Home.container.swipe("left"); 
    });
    
    App.on( App.HOME, function() {     
      Home.container.swipe("middle").on("stage", function(  ) {
        Home.update();
      })
    });
  }
  ,
  //INIT
  init:function() 
  {
    this.test();
    this.bind();  
    this.update();
  }
  ,
  // FUNCTIONS
  update:function()
  {
    this.chart.update();
    this.content.show();
  }
  ,
  chart: {
    board:DOM("svgZeit"),
    xInMs: 1000000,
	stepInMs: 86400000,
	minInMs: 0,
	maxInMs: 0
    ,
	yInValue:0.5,
	stepInValue:20,
	minInValue:0,
	maxInValue:40
    ,
	top:30,
	right:0,
	left:0,
	bottom:20
    ,
    x: function( ms ) { return this.left + ( ms - this.minInMs ) / this.xInMs; }
    ,
	y: function( value ) {	return this.top + ( value - this.minInValue ) / this.yInValue; }
    ,
    update:function( data ) {
      this.minInMs = util.zeit("midnight") - 5 * this.stepInMs;
      this.maxInMs = this.minInMs + ( 30 * this.stepInMs );
	  this.realInMs = util.zeit();
      this.board.attrib( "width", this.x( this.maxInMs ) + this.right );
      this.board.attrib( "height", this.y( this.maxInValue ) + this.bottom ); 
      this.coordinates();
    }
    ,
    coordinates:function() {
      var yStep = this.stepInValue / this.yInValue;
      var yMin = this.y( this.minInValue );
      var yMax = this.y( this.maxInValue );
	
      var xStep = this.stepInMs / this.xInMs;
      var xMin = this.x( this.minInMs );
      var xMax = this.x( this.maxInMs );
	
      for(var x = xMin; x <= xMax; x += xStep )
      {
          // Vertical Line
          this.board.drawLine( x, yMin - 5, x, yMax, "rgba(255,255,255,1)");
  
          // Horizontal Label
          this.board.drawLabel( x + xStep / 2, this.top, util.zeit( "dd.MM", this.minInMs + x * this.xInMs) );
      
          // Weekends
          if( util.zeit("weekend", this.minInMs + x * this.xInMs ) )
          {
              this.board.drawRectangel( x, yMin, xStep, yMax - yMin, "rgba(255,255,255,0.3)" );			
          }
      }	
      // Horizontal Line      
      for(var y = yMin; y <= yMax; y+= yStep) this.board.drawLine( xMin, y, xMax, y, "rgba(255,255,255,1)" );
    }
  }
  ,
  form: {
    
    legende:DOM("homeAuswahlLegend"),
    info:DOM("homeAuswahlInfo")
    ,
    update:function( event ) 
    {
      /* DEFAULT */
      legend.text("Legende"); 
      info.text("Berühren Sie die Datenpunkte in der Timeline für detaillierte Informationen.");

      /* FIGUR SELECTED */
      if (event.id)
      {		
		var type = app.model.getType(event.id);

		var value = event.y + "%";
		var detail = ""; 
		
		if (type.kategorie == "Notizen")
		{
			value = "&nbsp;";
			detail = event.y.replace(/\n\r?/g, "<br/>");
		}
		
		if (type.kategorie == "Bewertung")
		{
			value = event.y + " " + type.unit;
			detail = "<b>Definition</b> " + app.model.getGrad(event.id, event.y).info;
		}
		
		if (type.kategorie == "Device")
		{
			var json = (typeof event.y == "string") ? JSON.parse(event.y) : event.y;
			
			if (event.id == "stepcounter")
			{
				value = json["step"] + " " + type.unit;			
				detail = "<b>Definition</b> Messung mittels Device";
				detail += "<br>Entfernung: " + json["km"] + "km";
				detail += "<br>Kalorien: " + json["kcal"] + "kcal";
				detail += "<br>Ex: " + json["ex"];
				detail += "<br>Zeitraum: " + json["sportTime"] + "min";
			}
			else if (event.id == "bp")
			{			
				value = json["systolic"] + " " + type.unit;			
				detail = "<b>Definition</b> Messung mittels Device";
				detail += "<br>Sys: " + json["systolic"] + "mmHg";
				detail += "<br>Dia: " + json["diastolic"] + "mmHg";
				detail += "<br>Pulse " + json["pulse"] + " Pulse";
			}
			else
			{
				// event.y {weight:50}
				value = json[event.id] + type.unit;				
				detail = "<b>Definition</b> Messung mittels Device";
			}
		}
		
		if (type.kategorie == "Symptom")
		{
			value = event.y + " " + type.unit;
			detail = "<b>Definition</b> " + app.model.getGrad(event.id, event.y).info;
		}

		legend.text(type.kategorie); 				

		/* CURRENT ITEM */
		var exportData = JSON.stringify({x: event.x, y: event.y, id: event.id, command: Commands.FAVORITE_TO_HOME});
		
		/* ROW */
		var row = DOM(cmd.info).add("div", {id: "homeRowDiv", style: "cursor:pointer;padding:5px;", data: exportData});
		
		/* MAY PROCEED TO EDIT IF */
		var caret = (type.kategorie == "Symptom" || type.kategorie == "Bewertung" || event.id == "privat");
		if (caret)
		{	// GOTO EDIT
			row.on("tap", Commands.TAP_HANDLER, {watch: "id:homeRowDiv", command: Commands.HOME_EXIT});			
		}
		dispatchCommand(Commands.ROW, {
			type: "legende", area: row, title: type.title, zeit: "am " + util.zeit("dd.mm.yyyy hh:mm", event.x),
			farbwert: type.farbwert, value: value, caret: caret
		});			
		
		/* DETAIL */
		DOM(cmd.info).addChild("p", {"class": "row_detail"}, detail);	
		
		// SMALL SCREEN HAS OVERLAY IN TIMELINE
		if (window.matchMedia("(orientation:landscape) and (max-device-width:768px)").matches) 
		{		
			dispatchCommand(Commands.CHART_OVERLAY, {
				type: "row", title: type.title, zeit: "am " + util.zeit("dd.mm.yyyy hh:mm", event.x),
				farbwert: type.farbwert, value: value
			});
		}
      }
	}
  }
};

var Favorites = {
// VIEW
    
  //DOMELEMENTS
  container:DOM("favoritesId"),
  gotoHome:DOM("favoritesBackButton"),
  gotoFavorite:DOM("favoritesEditButton"),
  content:DOM("favoritesContentId"),
  
  // TEST
  test:function() 
  {
    if(!App.live) console.log( "- VIEW Favorites");
    if(!App.live && !App.FAVORITES) console.log( "Missing: App.FAVORITES");
  },
  
  // BINDING
  bind:function() 
  {       
    this.gotoHome.on("touch", function() {      
      App.dispatch( App.HOME );
      Favorites.container.swipe("right");
    });     
    this.gotoFavorite.on("touch", function() {
      App.dispatch( App.FAVORITE );
      Favorites.container.swipe("left");
    });
    App.on( App.FAVORITES, function() {   
      Favorites.container.swipe("middle").on("stage", function() {
        Favorites.content.show();
      })
    });
  },
  
  //INIT
  init:function() 
  {
    this.test();
    this.bind();  
    this.container.show();
  }
};

var Favorite = {
 // VIEW
    
   //DOMELEMENTS
   container:DOM("favoriteId"),
   gotoFavorites:DOM("favoriteBackId"),
   gotoSymptome:DOM("favoriteEditId"),
   content:DOM("favoriteContentId"),
   
   // TEST
   test:function() 
   {
     if(!App.live) console.log( "- VIEW Favorite");
     if(!App.live && !App.FAVORITES) console.log( "Missing: App.FAVORITES");
     if(!App.live && !App.FAVORITE) console.log( "Missing: App.FAVORITE");
     if(!App.live && !App.SYMPTOME) console.log( "Missing: App.SYMPTOME");
   },
   
   // BINDING
   bind:function() 
   {       
     this.gotoFavorites.on("touch", function() {      
       App.dispatch( App.FAVORITES );
       Favorite.container.swipe("right");
     });     
     this.gotoSymptome.on("touch", function() {
       App.dispatch( App.SYMPTOME );
       Favorite.container.swipe("left");
     });
     App.on( App.FAVORITE, function() {   
       Favorite.container.swipe("middle").on("stage", function() {
         Favorite.content.show();
       })
     });
   },
   
   //INIT
   init:function() 
   {
     this.test();
     this.bind();  
     this.container.show();
   }
 };

var Symptome = {
// VIEW
    
  //DOMELEMENTS
  container:DOM("symptomeId"),
  gotoFavorite:DOM("symptomeBackButton"),
  content:DOM("symptomeContentId"),
  
  // TEST
  test:function() 
  {
    if(!App.live) console.log( "- VIEW Symptome");
    if(!App.live && !App.FAVORITE) console.log( "Missing: App.FAVORITE");
    if(!App.live && !App.SYMPTOME) console.log( "Missing: App.SYMPTOME");
  },
  
  // BINDING
  bind:function() 
  {       
    this.gotoFavorite.on("touch", function() {      
      App.dispatch( App.FAVORITE );
      Symptome.container.swipe("right");
    });     
    App.on( App.SYMPTOME, function() {   
      Symptome.container.swipe("middle").on("stage", function() {
        Symptome.content.show();
      })
    });
  },
  
  //INIT
  init:function() 
  {
    this.test();
    this.bind();  
    this.container.show();
  }
};

var Tipps = {
 // VIEW
    
   //DOMELEMENTS
   container:DOM("tippId"),
   gotoFavorite:DOM("tippBackButton"),
   content:DOM("tippContentId"),
   
   // TEST
   test:function() 
   {
     if(!App.live) console.log( "- VIEW Tipps");
     if(!App.live && !App.FAVORITE) console.log( "Missing: App.FAVORITE");
     if(!App.live && !App.TIPPS) console.log( "Missing: App.TIPPS");
   },
   
   // BINDING
   bind:function() 
   {       
     this.gotoFavorite.on("touch", function() {      
       App.dispatch( App.FAVORITE );
       Tipps.container.swipe("right");
     });     
     App.on( App.TIPPS, function() {   
       Tipps.container.swipe("middle").on("stage", function() {
         Tipps.content.show();
       })
     });
   },
   
   //INIT
   init:function() 
   {
     this.test();
     this.bind();  
     this.container.show();
   }
 };

var Optionen = {
// VIEW
    
  //DOMELEMENTS
  container:DOM("optionenId"),
  gotoHome:DOM("optionenBackButton"),
  content:DOM("optionenContentId"),
  
  // TEST
  test:function() 
  {
    if(!App.live) console.log( "- VIEW Optionen");
    if(!App.live && !App.HOME) console.log( "Missing: App.HOME");
  },
  
  // BINDING
  bind:function() 
  {
    this.gotoHome.on("touch", function() {      
      App.dispatch( App.HOME );
      Optionen.container.swipe( "left" );
    });
    App.on( App.OPTIONEN, function() {   
      Optionen.container.swipe("middle").on("stage", function() {
      Optionen.content.show();
    })
  });
  },
  
  //INIT
  init:function() 
  {
    this.test();
    this.bind();  
    this.container.show();
  }
};
