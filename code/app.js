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
  on: function(type, call) {
    if (!(type in this.events)) this.events[type] = [call];
    else (this.events[type].indexOf( call ) != -1 ) ?  console.log( "Function exists") : this.events[type].push( call);
  },
  off: function( type, call ) {  this.events[type].splice( this.events[type].indexOf( call), 1); },
  dispatch: function(type, data) {
    for (var i = 0; i < this.events[type].length; i++){
      this.events[type][i]( data );
    } 
  }
  ,
  events: {},
  
  // Events
  READY: "READY",
  HOME: "HOME",
  OPTIONEN: "OPTIONEN",
  FAVORITES: "FAVORITES",
  FAVORITE: "FAVORITE",
  SYMPTOME: "SYMPTOME",
  
  // MODEL
  model:new Model()
  ,
  // VIEWS
  views:function() 
  {
    Konto.init();
    Optionen.init();
    Home.init();
    Favorites.init();    
    Symptome.init();
    Favorite.init();

  },
  // BINDING 
  bind:function() 
  {
    DOM(window).on("ready", function(data) {

      DOM("app").show();
      
      App.dispatch( App.READY );
    });
  },
  // ENVIROMENT
  initialize: function( domain ) 
  {
    
    if(!App.live) console.log( "- DOMAIN "+domain);
    if(!App.live && !DOM) console.log( "- MODULE DOM required");
    
    this.device = DOM().device();
    
    if( document.domain == this.domain || window.device) 
    {
      this.domain = domain;
      document.domain = "epha.ch";
      this.live = true;
    }
    else 
    {
      this.domain = document.domain = document.domain;
      this.live = false;  
    }
    
    if(!App.live && !new Node) console.log( "- MODULE Node required");
    this.node = ( this.live ) ? new Node( "https://node.epha.ch" ) : new Node( "http://"+this.domain+":8080" );
    this.konto = ( this.live ) ? "http://konto.epha.ch" : "http://"+this.domain+":8888/konto"; 
    
    this.model.setData("lexikon", Entities.Symptome, ["id","kategorie"] );
    this.model.setData("lexikon", Entities.Bewertung, ["id","kategorie"] );
    this.model.setData("lexikon", Entities.Tagebuch, ["id","kategorie"]);
    this.model.setData("lexikon", Entities.Device, ["id","kategorie"]) ;
    this.model.setData("lexikon", Entities.Tipps, ["id","kategorie"]) ;
    
    this.views();
    this.bind();
    
    console.log("setting data");
    // DEV
    App.model.setData("favorites",
    [
       {id : "10025482"},
       {id : "10047700", "edit":true},
       {id : "10013963", "edit":true},
       {id : "privat"}  
    ]);
    
    // DEV
    App.model.setData("acts",
    [
      { id:"10025482", x:"1380725392804", y:"80" },
      { id:"10013963", x:"1380725392804", y:"20" },
      { id:"privat", x:"1380725392804", y:"Ein schlechter Tag" }
    ], ["id","x"]);
  }
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
      
      if( App.device == "desktop" && false) 
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
      Optionen.content.hide();
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
    this.content.hide();
  }
  ,update:function()
  {
    
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
      Home.content.hide();
      Home.container.swipe("right");
    });
    this.gotoFavorites.on("touch", function() {      
      App.dispatch( App.FAVORITES ); 
      Home.content.hide();
      Home.container.swipe("left"); 
    });
    
    App.on( App.HOME, function() 
    {     
      Home.container.swipe("middle").on("stage", function() { Home.update(); });
    });
    
    App.on( App.READY, function() 
    {       
        Home.update();
    });
  }
  ,
  //INIT
  init:function() 
  {
    this.test();
    this.bind();  
    
    this.container.show();
    this.content.hide();
    
    this.chart.init();
    this.form.init();
  }
  ,
  // FUNCTIONS
  update:function()
  {
    this.content.show();
    this.chart.update();
    this.form.update();
  }
  ,
  chart: {
    scroller:DOM("homeScrollerId"),
    board:DOM("svgZeit")
    ,
    xInMs: 1000000,
  	stepInMs: 86400000,
  	minInMs: 0,
  	maxInMs: 0
    ,
  	yInValue:0.5,
  	stepInValue:20,
  	minInValue:0,
  	maxInValue:100
    ,
  	top:40,
  	right:0,
  	left:0,
  	bottom:30
    ,
    x: function( ms ) { return this.left + ( ms - this.minInMs ) / this.xInMs; }
    ,
    y: function( value ) {	return this.top + ( value - this.minInValue ) / this.yInValue; }
    ,
    init:function() {
      
      this.minInMs = util.zeit("midnight") - 5 * this.stepInMs;
      this.maxInMs = this.minInMs + ( 30 * this.stepInMs );
      this.realInMs = util.zeit();
      
      this.board.attrib( "width", this.x( this.maxInMs ) + this.right );
      this.board.attrib( "height", this.y( this.maxInValue ) + this.bottom ); 
      
      // xMin, xMax, xStep, yMin, yMax, yStep, minInMs, xInMs
      this.board.timeGrid( 
          this.x( this.minInMs ), this.x( this.maxInMs ), this.stepInMs / this.xInMs,
          this.y( this.minInValue ), this.y( this.maxInValue ), this.stepInValue / this.yInValue,
          this.minInMs, this.xInMs 
          );
      //xMin, xMax, xStep, y
      this.board.timeLegend( 
          this.x( this.minInMs ), this.x( this.maxInMs ), 
          this.stepInMs / this.xInMs, this.y( 100 ),
          this.minInMs, this.xInMs );

      // Ganz nach Links
      this.board.on("load", function( data ) {      
        Home.chart.scroller.scrollTo("scrollLeft", Home.chart.board.attrib("width") - Home.chart.scroller.width(), 2000);
      });
    }
    ,
    update:function( data ) {
      
      // SMALL SCREEN HAS OVERLAY IN TIMELINE
//      if (window.matchMedia("(orientation:landscape) and (max-device-width:768px)").matches) 
//      {   
//        dispatchCommand(Commands.CHART_OVERLAY, {
//          type: "row", title: type.title, zeiit: "am " + util.zeit("dd.mm.yyyy hh:mm", event.x),
//          farbwert: type.farbwert, value: value
//        });
//      }
    }
    ,
  }
  ,
  form: {

    fieldset:DOM("homeFieldsetAuswahl")
    ,
    start:function()
    {
      /* DEFAULT */
      this.fieldset.find("ul").off("touch");
      this.fieldset.legend( "Start" );
      this.fieldset.find("ul").addRow( 
      {
        title:"Symptom erfassen",
        caretLeft:false,
        caretRight:true,
        value:"",
        farbe:"",
        //detail:"Berühren Sie die Datenpunkte in der Timeline für detaillierte Informationen." 
       }).on("touch", function(data) 
      {    
        Home.content.hide();
        Home.container.swipe("left");
        App.dispatch(App.SYMPTOME);
      });
    }
    ,
    init:function()
    {  
      this.start();
    }
    ,
    update:function( event ) 
    {
      return;
      event = event || {};
      
      /* FIGUR SELECTED */
      var id = event.id || "";
      var zeit = "am " + util.zeit("dd.mm.yyyy hh:mm", event.x);
      // string or json
      var value = (typeof event.y == "string") ? JSON.parse(event.y) : event.y;
      // kategorie, unit, farbwert
      var type = app.model.getType(event.id);
      // einteilung
      var definition = "<b>Definition</b>"+ app.model.getGrad(event.id, event.y).info;
        
  		if (type.kategorie == "Notizen")
  		{
  		  var params = {
            zeit:zeit,
            value:"&nbsp", 
            color:type.farbwert, 
            detail:value.replace(/\n\r?/g, "<br/>")
  		  }; 		  
  		  if( id == "privat") { params.event = event; }
  		  
  		  this.fieldset.legend( type.kategorie);
  		  this.fieldset.fillRow( params ); 
  		}
  		else if( type.kategorie == "Bewertung" || type.kategorie == "Symptom")
    	{
  		  this.fieldset.legend( type.kategorie);
  		  this.fieldset.fillRow( 
  		  { 
  		    legend:type.kategorie, zeit:zeit, event:event, value:value + " " + type.unit, detail:definition 
  		  });
    	}
  		else if(type.kategorie == "Device")
  		{    			
  		  this.fieldset.legend( type.kategorie);
  			if(id == "stepcounter")
  			{
  			  this.fieldset.fillRow( { zeit:zeit, value:value["step"] + " " +type.unit, detail:
  			    "<b>Definition</b> Messung mittels Device" +
            "<br>Entfernung: " + value["km"] + "km" +
            "<br>Kalorien: " + value["kcal"] + "kcal" +
            "<br>Ex: " + value["ex"] +
            "<br>Zeitraum: " + value["sportTime"] + "min"
  			  });
  			}
  			else if (id == "bp")
  			{	
  			  this.fieldset.fillRow( { zeit:zeit, value:value["systolic"] + " " +type.unit, detail:
            "<b>Definition</b> Messung mittels Device" +
            "<br>Sys: " + value["systolic"] + "mmHg" +
            "<br>Dia: " + value["diastolic"] + "mmHg" +
            "<br>Pulse " + value["pulse"] + " Pulse"
          });
  			}
  			else
  			{
  			  this.fieldset.fillRow( { zeit:zeit, value:value[id] + " " +type.unit, detail:
            "<b>Definition</b> Messung mittels Device"
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
  gotoSymptome:DOM("favoritesEditButton"),
  content:DOM("favoritesContentId"),
  form:DOM("favFormId"),
  
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
      Favorites.content.hide();
      App.dispatch( App.HOME );
      Favorites.container.swipe("right");
    });     
    
    this.gotoSymptome.on("touch", function() {      
      // DELETE ROWS
    });     
    
    App.on( App.FAVORITES, function( data ) {
      
      // Symptom selected
      //if( data ) App.model.addFavorite("Symptome", data.id );
      
      Favorites.container.swipe("middle").on("stage", function() {
        Favorites.content.show();
      })
    });
    
    App.on( App.READY, function () {
      Favorites.update(); 
    });
  },
  
  //INIT
  init:function() 
  {
    this.test();
    this.bind();  
    
    this.container.show();
    this.content.hide();
  }
  ,
  update:function()
  {
    console.log("updating favorites");
    var lexiFav = App.model.getData("lexikon").has("id", App.model.getData("favorites") ); 

    // EACH FAVORIT GETS FIELDSET
    for (var kategorie in lexiFav.unique("kategorie") )
    {           
      var legend = Favorites.form.add("fieldset").add("legend").text( kategorie );    
      var rows = legend.addNext("ul").addClass("listeNext");
      var entities = lexiFav.has( "kategorie", [ { "kategorie":kategorie} ] );
     
      for (var i = 0; i < entities.length; i++)
      {        
          var params = {};
          params.title = entities[i].title;
          params.farbe = entities[i].farbwert;
          params.value = "&nbsp;";
          params.caretRight = true;
          params.data = entities[i];
                
          var acts = App.model.getData("acts").has("id", [{ id: entities[i].id }] );
          
          if( acts.length > 0 ) 
          {
            var last = acts.pop();
            
            if( /^\d+$/.test(last.y))
            params.value = last.y + " " + entities[i].unit;
               
            params.zeit = "Zuletzt: "+util.zeit("dd.mm.yyyy hh:mm", Math.floor( last.x ) ); 
          }
        
          rows.addRow( params ).on("touch", function(data) 
          { 
            Favorites.content.hide();
            
            var item = JSON.parse( data.element.getAttribute("data") );
            item.back = App.FAVORITES;
            
            App.dispatch( App.FAVORITE, item );
            Favorites.container.swipe("left");     
          }
          , { watch:"LI" } );
      }
    }
  }
};

var Symptome = {
// VIEW
    
  //DOMELEMENTS
  container:DOM("symptomeId"),
  gotoHome:DOM("symptomeBackButton"),
  content:DOM("symptomeContentId"),
  fieldset:DOM("symFieldsetId"),
  
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
    this.gotoHome.on("touch", function() {      

      Symptome.content.hide();
      Symptome.container.swipe("right");
      App.dispatch( App.HOME );     
    });     
    
    App.on( App.SYMPTOME, function() {   
      Symptome.container.swipe("middle").on("stage", function() {
        Symptome.update();
      })
    });
  },
  
  //INIT
  init:function() 
  {
    this.test();
    this.bind();  
    this.container.show();
    this.content.hide();
  }
  ,
  update:function() {
    
    Symptome.content.show();
    
    var liste = this.fieldset.find("ul").on("touch", function( data )
    {    
      Symptome.content.hide();
      Symptome.container.swipe("left");
      
      var item = JSON.parse( data.element.getAttribute("data") );
      item.back = App.SYMPTOME;
      
      App.dispatch( App.FAVORITE,  item );
    }
    , {watch:"LI"});
    
    var symptome = App.model.searchData( "lexikon", "Symptom" );
    
    symptome.sortABC("title");
    
    liste.removeChilds();
    
    for( var i = 0; i < symptome.length; i++)
    {
      liste.addRow({ title:symptome[i].title, value:"&nbsp;", farbe:symptome[i].farbwert, caretRight:true, data:symptome[i]})
    }
  }
};

var Favorite = {
 // VIEW
    
   //DOMELEMENTS
   container:DOM("favoriteId"),
   goBack:DOM("favoriteBackId"),
   gotoSymptome:DOM("favoriteEditId"),
   content:DOM("favoriteContentId"),
   
   BACK:App.HOME,
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
    this.goBack.on("touch", function() {      
       App.dispatch( Favorite.BACK );
       Favorite.container.swipe("right");
     });    
     this.gotoSymptome.on("touch", function() {
       App.dispatch( App.SYMPTOME );
       Favorite.container.swipe("left");
     });
     App.on( App.FAVORITE, function(data) {

       Favorite.BACK = data.back || App.HOME;
       
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
     this.content.hide();
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
  container: DOM("optionenId"),
  gotoHome: DOM("optionenBackButton"),
  content: DOM("optionenContentId"),

  verbundenContainer: DOM("optionenVerbundenId"),
  verbindenContainer: DOM("optionenVerbindenId"),
  syncContainer: DOM("optionenSyncId"),
  
  verbundenStatus: DOM("optionenVerbundenStatus"),
  verbindenStatus: DOM("optionenVerbindenStatus"),
  syncStatus: DOM("optionenSyncStatus"),
  
  optionenSyncInfo: DOM("optionenSyncInfo"),

  verbindenBtn: DOM("optionenVerbindenBtn"),
  
  test: function(){
  // TEST
    if (!App.live) console.log( "- VIEW Optionen");
    if (!App.live && !App.HOME) console.log( "Missing: App.HOME");
  },
  
  bind: function(){
  // BINDING
    this.gotoHome.on("touch", function(){
      App.dispatch(App.HOME);
      Optionen.container.swipe("left");
    });
    App.on(App.OPTIONEN, function(){
      Optionen.container.swipe("middle").on("stage", function(){
      Optionen.content.show();
    });
/*      console.log(this.verbindenButton); 
    this.verbindenButton.on("touch", function(){
      App.dispatch(Optionen.SCAN);
    });*/
  });
  },
  
  checkState: function(data){
  //
    //if (App.model.getProtagonist().id > 0){
    if (true){
      var uptodate = localStorage.getItem("device_upToDate");
      
      //if (data.status) this.verbundenStatus.text(data.status);
      
      //if (uptodate){
      if (false){
        this.syncStatus.text("Zuletzt");
        this.optionenSyncInfo.text(util.zeit("dd.MM.yyyy hh:mm", parseInt(uptodate)));
      } else {
        this.syncStatus.text("Initialisierung");
      }
      this.verbundenContainer.show();
      this.syncContainer.show();
      //this.verbindenContainer.hide();
    } else {
      this.verbundenContainer.hide();
      this.syncContainer.hide();
      //this.verbindenContainer.show();
    }
  },
  
  init: function(){
  //INIT
    this.test();
    this.bind();
    this.checkState();
    this.container.show();
  }
  
};

