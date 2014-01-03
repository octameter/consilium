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
  
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
  PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
  FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
  ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.          
 */

var App = {
  
  // ENVIROMENT
  initialize: function(domain)
  {  
    if (!DOM) console.log( "- MODULE DOM required");
    
    BROWSER = !window.cordova;
    DEVICE = !!window.cordova;

    console.log( "Running on " + (BROWSER ? "BROWSER" : "DEVICE" ));
    
    kontify(this);
    
    Model.init();
    Controller.init();
    
    Intro.init();
    Einstellung.init();
    Home.init();
    Favorites.init();
    Symptome.init();
    Eingabe.init();
    Tipps.init();

    DOM(document).on("ready", function(){
      App.setup();
    });
    
    App.relocateOn(function(url){
      if (url.search(/(akte|consilium)/) > -1) url += location.hash;
      location.replace(url);
    });
      
  }
  ,
  setup: function()
  {    
    // domain, node, origin, live
    App.enviroment(); 
    // tv || tablet || mobile || desktop
    App.screenSize = DOM().device(); 

    App.signOn(function(actor)
    {      
      // TESTING
      if( DOM().hash() == "device") actor = App.emulateDevice();
        
      // WELCOME EVERYONE
      Model.setActor( actor );
      
      if (location.hash != ""){

        // test for sequence of numbers after /id:
        var id = location.hash.match(/\/id:([0-9]*)/);
        
        // ARZT HAS PATIENT SELECTED IN AKTE
        if (!!id && !!id[1])
        {
          document.title = "ID "+ id[1];
          Model.setAntagonist( id[1] );
        }
      } else document.title = "Consilium";
      
      // UPDATE KONTO ACTOR FROM DB
      if( Model.hasActor() && BROWSER ) Model.readActor( function( data ) { Model.setActor( data.message ); } );
      
      // LOADS HISTORY AND DOES NOT NEED FRESH ACTOR
      Model.hasActor() ? Model.restoreActs( App.go ) :  App.go();
    });
  }
  ,
  go:function() 
  {
    Controller.dispatch( Controller.INTRO );
    Controller.dispatch( Controller.HOME ); 
  }
  ,
  // TESTING HELPER FUNCTION
  emulateDevice:function()
  {
    // FOR LOGGING FORCE LOCAL SERVER
    App.node = "http://localhost:8080";
    // OVERRIDE BROWSER STATUS    
    BROWSER = false;
    DEVICE = true;
    // TESTACTOR
    var actor = 
    {
      "actor_id": 6,
      "role_id": 15,
      "role_display": "Testing..",
      "role_type": "PATIENT",
      "scope_id": 10,
      "scope_display": "Studie Consilium",
      "scope_type": "GRUPPE_B",
      "update_date": 1385717076000,
      "favorites_array": [{ "id": "Symptom"}, {  "id": "10025482"},  {"id": "privat"},{"id": "10013573","edit": true},{
            "id": "10020772",  "edit": true}, {  "id": "10062225", "edit": true }
      ],
      "access_token": "bp2ou9FzC3YM"
    };
    // SET AS SCANNED
    Model.storage.set("device_actor", actor );
    // FAKE SIGNON(actor) 
    return actor;
  }
};
//TODO 
//memory actor wird App.actor 
//App.phonegap wird device
// push pull
// save, upload, load

var Controller = {
  
  INTRO:      "INTRO",
  HOME:       "HOME",
  EINSTELLUNG:"EINSTELLUNG",
  FAVORITES:  "FAVORITES",
  EINGABE:    "EINGABE",
  SYMPTOME:   "SYMPTOME",
  TIPPS:      "TIPPS",
  TIPP2EINGABE:"TIPP2EINGABE",
  
  init: function(domain)
  {
    eventify(this);
    
    this.bind();
  }
  ,
  bind: function(){}
};

var Model = {

  init: function()
  {
    storify(this);
    
    // DEFAULT START 
    this.memory.set("acts", [], ["id","kategorie"]);    

    this.kataloge();
  }
  ,
  kataloge:function()
  {
    Model.memory.set("lexikon", Symptom.data, Symptom._searchterms );
    Model.memory.set("lexikon", Bewertung.data, Bewertung._searchterms );
    Model.memory.set("lexikon", Tagebuch.data, Tagebuch._searchterms );
    Model.memory.set("lexikon", Tipp.data, Tipp._searchterms );
  }
  ,
  /**
   * ACTOR 
   * PATIENT 
   * ARZT { id: "diagnose"}, { id:"zyklus" }
   */
  setActor:function( actor ) 
  { 
    this.memory.set("actor", actor || 
    { 
      role_type:"NOT_REGISTER",
      favorites_array:[ {"id":"Symptom"}, { id: "10025482" }, { id: "privat"} ] 
    } );     
  },
  getActor:function() { return this.memory.get("actor"); },
  hasActor:function() { return !!this.memory.get("actor").access_token; },
  readActor:function( callback )
  {
    this.remote.read(App.node+"/api/actors/"+this.getActor().actor_id, function( data )
    {
      if( data.status == 200 ) console.log("Received Remote Actor");   
      if( callback ) callback(data);
    }
    , null, Model.getActor().access_token );
  },
  updateActor:function( callback )
  {
    this.remote.update(App.node+"/api/actors/"+this.getActor().actor_id, function( data )
    {
      if( data.status == 200 ) console.log("Updated Remote Actor");      
      if( callback ) callback( data );    
    }
    , Model.getActor(), Model.getActor().access_token );
  },
  saveActor:function()
  {
    if( this.hasActor() && BROWSER ) this.updateActor();
    if( this.hasActor() && DEVICE  ) this.storage.set("device_actor", this.getActor() );
  },
  getActorFavorites:function() { return this.getActor().favorites_array; },
  setActorFavorite:function( favorite )
  {
    console.log("SAVED FAVORITE", favorite.title );
    this.getActor().favorites_array.push( favorite ); this.saveActor();
    console.log( this.getActor().favorites_array );
  },
  removeActorFavorite:function( favorite )
  { 
    // Modify existing array don't create new one
    var index = Model.getActor().favorites_array.length;   
    while( index-- )
    { 
      if( this.getActor().favorites_array[ index ].id == favorite.id )
      {
        console.log("REMOVED FAVORITE", favorite.title, index );
        this.getActor().favorites_array.splice( index, 1 );   
      }
    }
    console.log( Model.getActor().favorites_array ); 
    
    this.saveActor();
  }
  ,
  /**
   * LEXIKON PREVENT MODIFYING
  */
  getLexikon:function() { return Model.memory.get("lexikon").clone(); },
  getLexikonFavorites:function()
  {       
    return Model.memory.get("lexikon").merge("id", this.getActorFavorites() ).has("id", this.getActorFavorites() ).clone();
  }
  ,
  /**
   * ACTS
   */
  restoreActs:function( callback )
  {
    if( this.hasActor() && BROWSER ) this.pullActs( callback );
    if( this.hasActor() && DEVICE ) 
    {
      var known = this.storage.get("device_acts");
      this.memory.set("acts", known || []); 
      if( callback ) callback(); 
    };
  }
  ,
  pullActs:function( callback )
  {    
    var known = this.memory.get("acts");
    var neue = [];    
    var query;
    
    if( DEVICE )
    query = ( this.storage.get("device_synced") ) ? { since : this.storage.get("device_synced") } : null;
    
    if( BROWSER )
    query = ( this.memory.get("antagonist") ) ? { anta_actor_id : this.memory.get("antagonist") } : null;
    
    this.remote.read(App.node + "/api/acts/", function(data)
    {      
      if( data.status == 200 )
      {
        var match = false;
        
        data.message.forEach( function( element ) 
        {
          for( var i = 0; i < known.length; i++ )
          {
            if( known[i].act_id == element.act_id ) { match = true;  known[i] = element; }
          }
          
          if( !match) neue.push( element );
        });
                             
        Model.memory.set("acts", neue, ["id","kategorie"] );
        
        if( callback ) callback( data );
      }      
    }, 
    query, this.getActor().access_token );   
  }
  ,
  getActs:function() { 
    return this.memory.get("acts").filter( function(element) { return !element.deleted; } ); 
  }
  ,
  setAct:function( act )
  {
    if ( this.getAntagonist() )
    act.anta_actor_id = this.getAntagonist();
    
    var acts = this.memory.set("acts", [ act ], ["id","kategorie"] );
    this.saveActs();
  }
  ,
  saveActs:function( callback ) 
  { 
    if( this.hasActor() && BROWSER ) this.pushActs( callback ); 
    if( this.hasActor() && DEVICE ) {
      this.storage.set("device_acts", this.memory.get("acts") );
      if( callback ) callback();
    }
  }
  ,
  pushActs:function( callback )
  {  
    var index = this.memory.get("acts").length;

    while( index-- )
    {
      var act = this.memory.get("acts").at( index );
      
      if( !act.act_id ) this.pushCreateAct( act ); 

      if( act.act_id && act.deleted ) this.pushDeleteAct( act ); 
    }
    // TODO QUEUE
    if( callback ) callback({status:200});
  }
  ,
  pushCreateAct:function( act )
  {  
    var acts = this.memory.get("acts");
    
    this.remote.create(App.node + "/api/acts/", function(data)
    {
      if( data.status == 200 ) acts.splice( acts.indexOf( act ), 1, data.message );
    }, 
    act, this.getActor().access_token );
  }
  ,
  pushDeleteAct:function( act )
  {
    var acts = this.memory.get("acts");
    
    this.remote.delete(App.node + "/api/acts/"+act.act_id, function(data)
    {
      if( data.status == 200 ) acts.splice( acts.indexOf( act ), 1 );
    }, 
    act, this.getActor().access_token );  
  }
  ,
  // IDENTIFY ACT AND DELETE OR MARK AS DELETED
  removeAct:function( act )
  {
    var acts = this.memory.get("acts");
    var index = acts.length;
    
    while( index-- )
    {
      if (acts[index].id == act.id && acts[index].x == act.x)
      {
        if( acts[index].act_id ) acts[index].deleted = true;        
        else acts.splice( index, 1 );
      }
    }
    this.saveActs();
  }  
  ,
  synced:function() {

    this.storage.set("device_acts", this.memory.get("acts") );
    this.storage.set("device_synced", new Date().getTime() ); 
  }
  ,
  dummy:function()
  {
    console.log("Setting DUMMY data");
    var x0 = new Date().getTime();
    var step = 86400000;
    Model.memory.remove("acts");
    Model.memory.set("acts", [
      { id: "10025482", x: x0 - 1.5*step, y: "80" },
      { id: "10013963", x: x0 - 1*step, y: "20" },
      { id: "10013963", x: x0 - 2*step, y: "50" },
      { id: "10013963", x: x0 - 3*step, y: "70" },
      { id: "10013963", x: x0 - 4*step, y: "10" },
      { id: "10013963", x: x0 - 5*step, y: "0" },
      { id: "zyklus", x: x0 - 6*step, y: "Aspirin cardio" },
      { id: "diagnose", x: x0 - 7*step, y: "Strukturierte Datenerfassung mit Austausch Arzt und Patient" },
      { id: "privat", x: x0 - 2.5*step, y: "Ein guter Tag" }
    ], ["id"]);
    Controller.dispatch( Controller.HOME );
  }
  ,
  // IF AVAILABLE ACTS ON HIS TABLE
  setAntagonist: function( antagonist )
  {
    this.memory.set("antagonist", antagonist ); 
  }
  ,
  getAntagonist: function() { return this.memory.get("antagonist"); }
  
};

/**
 * VIEW EINSTELLUNG
 */
var Einstellung = {

  //DOMELEMENTS
  container:      DOM("einstellungId"),
  gotoHome:       DOM("einstellungBackButton"),
  content:        DOM("einstellungContentId"),
  verbinden:      DOM("einstellungVerbundenId"),
  verbindenStatus:DOM("einstellungVerbundenId").find("strong"),
  verbindenInfo:  DOM("einstellungVerbundenId").find("span"),
  verbindenBtn:   DOM("einstellungVerbundenId").find("a"),
  sync:           DOM("einstellungSyncId"),
  syncStatus:     DOM("einstellungSyncId").find("strong"),
  syncInfo:       DOM("einstellungSyncId").find("span"),
  syncBtn:        DOM("einstellungSyncId").find("a"),
  
  init: function()
  {
    if (!App.live) console.log( "- VIEW Einstellung");
    this.bind();
    
    this.container.show();
    this.content.hide();
  }
  ,
  bind: function()
  {
    this.gotoHome.on("tangent", function(data)
    {
      if( data.type == "touchend" )
      {
        Controller.dispatch( Controller.HOME );
        Einstellung.content.hide();
        Einstellung.container.swipe("left");
      }
    });
    this.verbindenBtn.on("tangent", function(data)
    {
      if( data.type == "touchstart" ) Einstellung.verbindenBtn.addClass("selected");
      if( data.type == "touchend" )
      {
        Einstellung.verbinden();
      }
    });
    this.syncBtn.on("tangent", function(data)
    {
      if( data.type == "touchstart" ) Einstellung.syncBtn.addClass("selected");
      if( data.type == "touchend" )
      {
        Einstellung.synchronisieren();
      }
    });
    
    Controller.on(Controller.EINSTELLUNG, function()
    {  
      Einstellung.container.swipe("middle").on("stage", function()
      {
        Einstellung.container.off("stage"); 
        Einstellung.update();
      });
    });
  }
  ,
  update: function(error)
  {
    // DEFAULT
    this.verbindenStatus.text( "Kein Studienzentrum" );
    this.verbindenInfo.text( "zugeordnet" );
    this.verbindenBtn.hide();
    this.syncStatus.text( "Studiendaten" );
    this.syncInfo.text( "" );
    this.syncBtn.replaceClass(/(green|red)/,"blue").text("Sync");
    this.sync.hide();
    
    if( DEVICE && !Model.hasActor() )
    {
      this.verbindenStatus.text( "Mit Studienzentrum" );
      this.verbindenInfo.text("herstellen");
      this.verbindenBtn.show();
    }   
    if( Model.hasActor() && !error )
    {
      this.verbindenStatus.text( Model.getActor().scope_display );
      this.verbindenInfo.text("hergestellt");
      
      // TESTING 
      if( DEVICE ) this.sync.show();
    }    
    if( Model.hasActor() && error )
    {
      this.verbindenStatus.text( error.status );
      this.verbindenInfo.text( error.info );
      this.verbindenBtn.show();
    }
    this.content.show();
  } 
  ,
  verbinden:function()
  {
    var scanner = cordova.require("cordova/plugin/BarcodeScanner");

    // text, format, cancelled
    scanner.scan(
      function(result) 
      { 
        var credentials = result.text.split(":");
        
        if( result.format == "QR_CODE" && credentials.length == 2 && /(http|\/)/.test(result.text) == false)
        {
          var params = {
            "usr": credentials[0],
            "pwd": credentials[1]
          };

          Model.remote.read( App.node + "/authenticate", function( data )
          {
            if( data.status == 200)
            {
              Model.storage.remove("device_actor");
              
              var actors = data.message;
              
              for( var i = 0; i < actors.length ; i++)
              {
                if( actors[i].scope_display.indexOf( "Consilium" ) > -1 )
                {
                  Model.setActor( actors[i] );
                  Model.saveActor();
                }
              }
              Einstellung.update( Model.hasActor() ? null : { status:"Berechtigung", info:"nicht vorhanden" } );
            }
            else Einstellung.update( { status:"Authentifizierung", info:"fehlgeschlagen" } );
          }
          , params );                  
        }
        else Einstellung.update( { status:"QR-Code", info:"konnte nicht gelesen werden" } );
      }
      , 
      function(error) 
      { 
         Einstellung.update( { status:"Aufbau", info:"fehlgeschlagen" } );
      }
    ); 
  }
  ,
  /**
   * SYNCRO CASCADE
  */
  synchronisieren:function()
  {
    this.syncing( { status:"Verbindung", info:"aufbauen.." } );
    this.syncBtn.hide();
    
    this.readActor();
  }
  ,
  readActor:function()
  {
    this.syncing( { status:"Profil", info:"aktualisieren.." } );
    
    Model.readActor( function(data) 
    {    
      if( data.status == 200 ) 
      {  
        // REMOTE NEUER
        if( data.message.update_date > Model.storage.get("device_synced") )
        {         
          Model.setActor( data.message ); 
          console.log( " the winner is remote" );
          Einstellung.pullActs();
        }         
          
        // LOKAL NEUER  
        if( data.message.update_date <= Model.storage.get("device_synced") )
        {         
          Model.setActor( Model.storage.get("device_actor") );
          console.log( " the winner is lokal" );
          Model.updateActor( function( data )
          {  
            if( data.status == 200 ) Einstellung.pullActs();
            
            else Einstellung.abbruch( { status:"Profil", info:"nicht geladen" } );
          });
        }
      }
      else Einstellung.abbruch( { status:"Profil",info:"nicht aktualisiert"} );
    });
  }
  ,
  pullActs:function()
  {
    this.syncing("Eingaben","aktualisieren..");

    Model.pullActs( function( data )
    {
      if( data.status == 200 )
      {
        Einstellung.pushActs();
      }
      else Einstellung.abbruch( {status:"Eingaben", info:"nicht aktualisiert"} );
    });
  }
  ,
  pushActs:function()
  {
    this.syncing( { status:"Eingaben",info:"hochladen.."});
    
    Model.pushActs( function( data )
    {
      if( data.status == 200 )
      {
        Einstellung.synced( data );
      }
      else Einstellung.abbruch( {status:"Eingaben", info:"nicht geladen"} );
    });
  }
  ,
  synced:function( data )
  {
    this.syncing( { status:"Erfolgreich", info:"abgeschlossen"} );
    this.syncBtn.replaceClass(/(blue|red)/,"green").text("Sync").show();
    
    Model.synced();
  }
  ,
  abbruch:function( text )
  {
    this.syncing( text );
    this.syncBtn.replaceClass(/(blue|green)/,"red").text("Wiederholen").show();
  }
  ,
  syncing:function( text )
  {
    this.syncStatus.text(text.status );
    this.syncInfo.text(  text.info );
  }
};

/**
 * VIEW HOME
 */
var Home = {
// VIEW
    
  //DOMELEMENTS
  container:      DOM("homeId"),
  gotoOptionen:   DOM("addOptionen"),
  gotoFavorites:  DOM("homeFavoritenButton"),
  content:        DOM("homeContentId")
  ,
  init: function()
  {
    if (!App.live) console.log( "- VIEW Home");
    
    this.bind();  
    this.container.invisible();
    this.content.hide();
    
    // DESKTOP WITHOUT CONSILIUM
    if (BROWSER) DOM("titleId").hide();
    
    // BUILD GRID
    // TODO ONLY IF NO GET ACTS CALLED
    Home.chart.init();
    // BUILD AUSWAHL
    Home.form.init(); 
  }
  ,
  bind: function()
  {
    Controller.on(Controller.HOME, Home.update );
    
    this.gotoOptionen.on("tangent", function( data )
    {
      if( data.type == "touchend" )
      {
        Home.content.hide();
        Controller.dispatch( Controller.EINSTELLUNG );
        Home.container.swipe("right");
      }
    });
    
    this.gotoFavorites.on("tangent", function( data )
    { 
      if( data.type == "touchend" )
      {
        Home.content.hide();
        Controller.dispatch( Controller.FAVORITES ); 
        Home.container.swipe("left");
      }
    });   
  }
  ,
  update: function( data )
  {
    console.log("home update");
    
    Home.container.show();
    Home.content.invisible();
    
    if( Home.container.hasClass("middle") )
    { 
      // FIRST TIME CHART IS DISPLAYED  
      Home.content.show(); 
      Home.chart.update();
      Home.form.update();
      Home.container.addClass("complete");
    }
    else 
    {     
      // ANIMATE
      Home.container.removeClass("complete");
      Home.container.swipe("middle");
      // ANIMATED
      Home.container.on("stage", function()
      {
        Home.container.off("stage");
        Home.content.show();
        Home.chart.update();
        Home.form.update();
        Home.container.addClass("complete");
      });      
    }
  }
  ,
  chart: {
    scroller: DOM("homeScrollerId"),
    board:    DOM("svgZeit"),
    
    xInMs: 1000000,
  	stepInMs: 86400000,
  	minInMs: 0,
  	maxInMs: 0,
    
  	yInValue: 0.5,
  	stepInValue: 20,
  	minInValue: 0,
  	maxInValue: 100,

    top: 40,
  	right: 1, // 5,
  	left: 0, // 5,
  	bottom: 30,
    
    x: function(ms){
      return Math.floor( this.left + ( ms - this.minInMs ) / this.xInMs);
    },
    
    y: function(value){
      return Math.floor( this.top + ( value - this.minInValue ) / this.yInValue);
    },
    
    init: function(){        
      this.board.removeChilds();
      
      // All Entries 
      var range = Model.getActs().sort123("x").clone();
      // Minimum X for Grid
      var first= new Date(); 
      first.setDate(first.getDate() - 30);
      // Maximum X for Grid
      var last = new Date(); 
      last.setDate(last.getDate() + 2);
      
      // Maybe larger Grid needed
      if( range.length > 0 )  
      {
        var firstAct = Math.floor( range.shift().x );
        if( firstAct < first ) first = firstAct;
        
        // IF TWO AVAILABLE ELSE THE ONLY ONE
        var lastAct  = ( range.length > 1 ) ? Math.floor( range.pop().x ) : firstAct;
        if( lastAct > last ) last = lastAct;
      }

      this.minInMs = util.zeit("midnight", first ) - this.stepInMs;
      this.maxInMs = util.zeit("midnight", last ) + this.stepInMs;
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
          this.minInMs, this.xInMs 
      );
      
      this.board.on("tangent", function(data){
        if (data.type == "touchstart") Home.form.update( data.transfer );
      });
      
      //this.animate();
    }
    ,
    update: function()
    {  
      this.board.findAll(".movePoint").remove();
      this.board.findAll(".connectLine").remove();
      
      Model.getActs().forEach( function( ele )
      {
        // REDRAW IF ACT OUTSIDE RANGE
        if( ele.x <= Home.chart.minInMs || ele.x >= Home.chart.maxInMs) return Home.chart.init();
      });
      
      // GROUP SYMBOLS
      Model.getActs().unique("id").forEach(function(id)
      { 
        var howto = Model.getLexikon().byId( id );     
        var acts = Model.getActs().has("id", [ {id: id} ] ).sort321("x"); 

        var todo = acts.length;
        
        if (howto.kategorie == "Symptom" || howto.kategorie == "Bewertung"){  
          var prev = null;
          
          while (todo--){
            var act = acts.pop();

            this.board.drawSymptom( this.x( act.x ), this.y( 100 - act.y ), 17, howto.farbwert, act);
                      
            // Less than 3 days apart
            if (prev && Number(prev.x) > Number(act.x) - 3 * 86400000)
            this.board.drawConnect( this.x( act.x ), this.y( 100 - act.y ), this.x( prev.x), this.y(100- prev.y), 19, howto.farbwert );

            prev = Object.create( act );
          }
        }
        else if (howto.kategorie == "Notizen")
        {
           while( todo-- )
           {
             var notiz = acts.pop();
             // Above or below timegrid
             var y = -16;
             if( howto.id == "diagnose" ) y = 96;
             if( howto.id == "zyklus" ) y = 106;
             
             this.board.drawNotizen( this.x( notiz.x) , this.y( y ), 32, 16, howto.farbwert, notiz); 
           }
        }
      }.bind(this));
      
      this.animate();
    }   
    ,
    animate:function()
    {
      // AT APP START ALL LEFT (0)             
      var scrolledX = Home.chart.scroller.get("scrollLeft");      
      // AT START TAKE ONLY LAST 14 DAYS ELSE
      var fromX = this.x( this.maxInMs - ( 14 * this.stepInMs ) );
          fromX -= Home.container.width() - 160; 
      var toX = this.x(this.maxInMs - this.stepInMs);
          toX-= Home.container.width() - 160;      
      
      // ACTION
      if( scrolledX == 0  )
      Home.chart.scroller.scrollX(fromX, toX, 2000);
      
      console.log("Home.chart.scroller.scrollX", scrolledX, fromX, toX, 2000);
    }
  }
  ,
  form: {

    fieldset:   DOM("homeFieldsetAuswahl"),
    liste:      DOM("homeAuswahlListe"),
    gotoIntro:  DOM("homeBackToIntro"),

    init: function()
    {  
        this.gotoIntro.on("tangent", function( data )
        { 
          if( data.type == "touchstart" ) DOM( data.target ).addClass("selected");
          if( data.type == "touchend" )
          {
            Controller.dispatch( Controller.INTRO );
          }
        });
    }
    ,
    update: function(event){
      
      this.liste.off("tangent");
      this.liste.removeChilds();

      if (event)
      {
        var howto = Model.getLexikon().byId( event.id );
        
        // Augment event
        event.zero = howto.zero;
        event.unit = howto.unit;
        event.title = howto.title;
        event.kategorie = howto.kategorie;
        event.grad = howto.grad;
        
        var detail = "";
        var value = "&nbsp";
        
        if (/^\d+$/.test(event.y)) value = event.y + " " + event.unit;
        else detail = event.y;
        
        this.liste.addRow({
          title: howto.title,
          zeit: "Am " + util.zeit("dd.mm.yyyy hh:mm", Math.floor( event.x )), 
          caretLeft: false,
          caretRight: true,
          value: value,
          farbe: howto.farbwert,
          detail: detail
        });
        
        this.liste.on("tangent", function(data)
        {
          if( data.type == "touchstart" ) DOM( data.target ).addClass("selected");
          if( data.type == "touchend" )
          {
            Home.content.hide();
            
            var item = event;
            item.back = Controller.HOME;
            Controller.dispatch(Controller.EINGABE, item);
            
            Home.container.swipe("left");
          }
         }, { watch: "LI" });
      
        this.fieldset.legend(howto.kategorie);
      } 
      else
      {
        var howto = Model.getLexikon().byId( "Symptom" );
        
        this.fieldset.legend("Auswahl");
        
        this.liste.addRow({ title: howto.title, caretLeft: false, caretRight: true});
        this.liste.on("tangent", function(data)
        {
          if( data.type == "touchstart" ) DOM( data.target ).addClass("selected");
          if( data.type == "touchend" )
          {
            Home.content.hide();
            Home.container.swipe("left");
            Controller.dispatch(Controller.SYMPTOME);
          }
        }, { watch: "LI" });   
      }
    }  
  }
};

//      SMALL SCREEN HAS OVERLAY IN TIMELINE
//      if (window.matchMedia("(orientation:landscape) and (max-device-width:768px)").matches) 
//      {   
//        dispatchCommand(Commands.CHART_OVERLAY, {
//          type: "row", title: type.title, zeiit: "am " + util.zeit("dd.mm.yyyy hh:mm", event.x),
//          farbwert: type.farbwert, value: value
//        });
//      }

var Intro = {

  container: DOM("introId")
  ,
  logo: DOM("introId").find(".logo")
  ,
  init: function()
  {
    if (!App.live) console.log("- VIEW Intro");
    
    introfy(this);
    
    this.bind();    
    this.logo.addConsilium();

    this.container.hide();
  }
  ,
  bind: function()
  {    
    Controller.on(Controller.INTRO, function()
    { 
      if( !Intro.done && Intro.hasInformed() )
      {
        Intro.hide();  
        Intro.update();
      } 
      else
      {
        Intro.update();
        Intro.container.style("top", "0%");
      }
      
      Intro.done = true;
    });
  }
  ,
  goHome:function( data )
  {
    if( data.type == "touchend" )
    {
      Model.storage.set("informed", Model.getActor().role_type );
      Intro.hide();
    }
  }
  ,
  hide: function()
  {
    Intro.container.style("top", "100%");
  }
  ,
  hasInformed:function()
  {
    return ( Model.getActor().role_type == Model.storage.get("informed") );
  }
  ,
  update: function()
  { 
    var actor = Model.getActor();
    var role_type = actor.role_type;
    
    Intro.setTitle(  "Consilium" );
    Intro.setClaim(  "Arzt und Patient verbinden");
    
    var detail = Intro.setDetail( "Informationen" );
        detail.add("a", { "class": "button blue floatRight" } ).text("Start").on("tangent", Intro.goHome ); 
    
    if( BROWSER && role_type == "NOT_REGISTER" )
    {
        detail.add("a", { "class": "button green floatRight" } ).text("Beispiel").on("tangent", function(data)
        {
          if( data.type == "touchend") { Model.dummy(); Intro.goHome( data ); }
        });
    }
      
    Intro.setDisclaimer();
  
    this.removeFeatures();

    var goodbye;
    
    // DESKTOP NOLOGIN
    if( ( role_type == "NOT_REGISTER" || role_type == "REGISTER" ) && BROWSER)
    {
      this.addFeatures( IntroText["de"].WEB_NOT_REGISTER );
      goodbye = { title: "6. Epilog", description: "<p>Wir danken für Ihr Interesse.</p>" };
    }
    
    // APP NOLOGIN
    if( role_type == "NOT_REGISTER" && DEVICE)
    {
      this.addFeatures( IntroText["de"].DEVICE_NOT_REGISTER );
      goodbye = { title: "3. Epilog", description: "<p>Die erfassten Daten erscheinen in Ihrer Timeline und in Ihrer Web-Applikation. Wir wünschen Ihnen viel Erfolg!</p>"};
    }

    if( role_type == "PATIENT" )
    { 
      // GRUPPE B   
      if( actor.scope_type == "GRUPPE_B" )
      {
        this.addFeatures( IntroText["de"].PATIENT_GRUPPE_B );      
        goodbye = { title: "4. Epilog", description: "<p>Wir danken für die Teilnahme an der Studie und wünschen Ihnen eine erfolgreiche Therapie.</p>" };
      }
      // GRUPPE C       
      if( actor.scope_type == "GRUPPE_C" )
      {
        this.addFeatures( IntroText["de"].PATIENT_GRUPPE_C);
        goodbye = { title: "4. Epilog", description: "<p>Wir danken für die Teilnahme an der Studie und wünschen Ihnen eine erfolgreiche Therapie.</p>" };
      }
    }
    
    if( role_type == "ARZT" && actor.scope_type == "GRUPPE_C")
    {
      this.addFeatures( IntroText["de"].DOCTOR_CONSILIUM);
      goodbye = { title: "Epilog", description: "<p>Wir wünschen Ihnen viel Erfolg!</p>" };
    }
          
    this.addFeature( goodbye ); //.add("a").addClass("button grey").text("App starten").on("tangent", Intro.goHome );
    
    this.container.show();
  }
};

var Favorites = {
    
  //DOMELEMENTS
  container:    DOM("favoritesId"),
  gotoHome:     DOM("favoritesBackButton"),
  gotoSymptome: DOM("favoritesEditButton"),
  content:      DOM("favoritesContentId"),
  form:         DOM("favFormId"),
  
  init: function()
  {
    if (!App.live) console.log( "- VIEW Favorites");
    this.bind();
    
    this.container.show();
    this.content.hide();
  }
  ,
  bind: function()
  {
    this.gotoHome.on("tangent", function(data)
    {
      if( data.type == "touchend" )
      {
        Favorites.content.hide();
        Controller.dispatch(Controller.HOME);
        Favorites.container.swipe("right");
      }
    });
    
    this.gotoSymptome.on("tangent", Favorites.edit);
    
    Controller.on(Controller.FAVORITES, function(data)
    {
      // START CREATING FIELDSETS DURING TRANSITION
      Favorites.update();
      
      Favorites.container.swipe("middle").on("stage", function()
      {
        Favorites.container.off("stage");
        Favorites.content.show();
      });
    });    
  }
  ,
  edit: function( data )
  {
    if( data.type == "touchend" )
    {
      Favorites.update(true);
      Favorites.gotoSymptome.text("fertig");
      Favorites.gotoHome.hide();
      Favorites.gotoSymptome.off("tangent").on("tangent", Favorites.unedit);
    }
  }
  ,
  unedit: function( data )
  {
    if( data.type == "touchend" )
    {
      Favorites.update();
      Favorites.gotoSymptome.text("ändern");
      Favorites.gotoHome.show();
      Favorites.gotoSymptome.off("tangent").on("tangent", Favorites.edit);
    }
  }
  ,
  update: function(edit){
    
    Favorites.form.removeChilds();

    var lexiFav = Model.getLexikonFavorites(); 
    
    // EACH FAVORIT GETS FIELDSET
    lexiFav.unique("kategorie").forEach( function(kategorie)
    {
      var legend = Favorites.form.add("fieldset").addClass("liste").add("legend").text(kategorie);
      var liste = legend.addNext("ul").addClass("listeNext");
      var rows = lexiFav.has("kategorie", [{ "kategorie": kategorie}] );
      var editables = rows.has("edit", [{ edit: true }] );
      
      // EVENTHANDLER TO CALL NEXT VIEW
      if (!edit) liste.on("tangent", Favorites.selectedItem, { watch: "LI" });
      // ITERATE ROWS
      for (var i = 0; i < rows.length; i++)
      {        
        var row = { title: rows[i].title };
        // EDITABLE MODE
        if (edit)
        { // ROW CAN BE DELETED
          if ( rows[i].edit )
          row.callback = function() { Model.removeActorFavorite( this ); }.bind( rows[i] );
          // GENERATE ROW
          liste.addRemovableRow( row );            
        } 
        else 
        {          
          row.farbe = rows[i].farbwert;
          row.caretRight = true;
          // ACHTUNG KEINE REFERENZ EE
          row.data = { id:rows[i].id };
          // LAST ENTRIES FOR ID
          var acts = Model.getActs().has("id", [{ id: rows[i].id }] );
          if (acts.length > 0)
          {
            var last = acts.sort123("x").clone().pop();
            if (/^\d+$/.test(last.y)) row.value = last.y + " " + rows[i].unit;
            // LABEL LAST ENTRY
            row.zeit = "Zuletzt: " + util.zeit("dd.mm.yyyy hh:mm", Math.floor(last.x)); 
            row.data.x = last.x;
            row.data.y = last.y;
          } 
          // GENERATE ROW
          liste.addRow(row);         
        }
      }
    });
  }
  ,
  selectedItem:function(data)
  {
    if( data.type == "touchstart" ) DOM( data.target ).addClass("selected");        
    if( data.type == "touchend")
    {
      var item = { back: Controller.FAVORITES };
      
      if( data.transfer.id) item.id = data.transfer.id;
      if( data.transfer.x ) item.x = data.transfer.x;
      if( data.transfer.y ) item.y = data.transfer.y;
      
      Favorites.content.hide();
      Favorites.container.swipe("left");
                
      // QUICKLINK ZUR SYMPTOMAUSWAHL
      if( item.id == "Symptom" ) Controller.dispatch( Controller.SYMPTOME, item);
      
      else Controller.dispatch(Controller.EINGABE, item);      
    }
  }
};

var Symptome = {
// VIEW
    
  //DOMELEMENTS
  container:  DOM("symptomeId"),
  gotoHome:   DOM("symptomeBackButton"),
  content:    DOM("symptomeContentId"),
  liste:      DOM("symptomListe"),
  BACK:       null
  ,
  init: function()
  {
    if (!App.live) console.log( "- VIEW Symptome");
    
    this.bind();  
    
    this.container.show();
    this.content.hide();
  }
  ,
  // BINDING
  bind: function()
  {
    this.gotoHome.on("tangent", function( data )
    {
      if( data.type == "touchend" )
      {
        Symptome.content.hide();
        Symptome.container.swipe("right");
        Controller.dispatch(Symptome.BACK);
        Symptome.BACK = null;
      }
    });
    
    this.liste.on("tangent", this.selectHandler, { watch: "LI" });
    
    Controller.on( Controller.SYMPTOME, function(data)
    {
      data = data || {};
      Symptome.BACK = data.back || Symptome.BACK || Controller.HOME;
      Symptome.container.swipe("middle").on("stage", function()
      {
        Symptome.container.off("stage");
        Symptome.update();
      });
    });
  }
  ,
  update: function()
  {   
    this.content.hide();
    
    this.liste.removeChilds();
    
    var symptome = Model.memory.search("lexikon", "Symptom" ).notIn("id", Model.getActorFavorites() );
    
    symptome.sortABC("title");
    
    for (var i = 0; i < symptome.length; i++){
      this.liste.addRow({ title: symptome[i].title, value: "&nbsp;", farbe: symptome[i].farbwert, caretRight: true, data: symptome[i].id });
    }
    
    this.container.show();
    this.content.show();
  }
  ,
  selectHandler:function( data )
  {
    if (data.type == "touchstart") DOM(data.target).addClass("selected");
    if( data.type == "touchend")
    {
      Model.setActorFavorite( { id: data.transfer, edit: true } );
      
      Symptome.done( { id : data.transfer, back:Controller.SYMPTOME } );
    }
  }
  ,
  done:function( payload )
  {
    Controller.dispatch(Controller.EINGABE, payload );
    this.content.hide();
    this.container.swipe("left");
  }
};

   
/**
 * VIEW EINGABE
 */
var Eingabe = {
    
   //DOMELEMENTS
   container:     DOM("eingabeId"),
   goBackButton:  DOM("eingabeBackButton"),
   content:       DOM("eingabeContentId"),
   eingabe:       DOM("strukturierteEingabe"),
   freitext:      DOM("freiText"),
   tipp:          DOM("fieldsetTipp"),
   tippListe:     DOM("fieldsetTipp").find(".listeNext"),

   //VARIABLES
   goBackTo: null,
   item: null,
   itemModified: null
   ,
   init: function()
   {
     if (!App.live) console.log( "- VIEW EINGABE");
     
     this.container.show();
     // container has to be visible before bind or slider will not initialize correctly
     this.content.invisible();
     this.bind();
   }
   ,
   // BINDING
   bind: function()
   {     
     this.goBackButton.on("tangent", function(data)
     {
        if( data.type == "touchend" ) Eingabe.goBack();
     });
    
     // VIEW IS CALLED
     Controller.on(Controller.EINGABE, function(data)
     {  
       Eingabe.content.invisible();   
       Eingabe.build();
       Eingabe.item = null;
       Eingabe.itemModified = null;  
       DOM("sliderArea").setSlider( 0 );
       
       // !data from Tipps, but maybe itemModified
       if (data)
       {
         Eingabe.goBackTo = data.back;
         
         // SYMPTOMLISTE NEU NUR ID
         // TODO FAVORITES AND HOME
         Eingabe.item = Model.getLexikon().byId( data.id );         
         Eingabe.item.x = data.x;
         Eingabe.item.y = data.y;
       }

       Eingabe.show();
     });
     
     Controller.on( Controller.TIPP2EINGABE, function() { Eingabe.show() } );
     
    // SCHIEBEREGLER
    Eingabe.eingabe.find(".blue").on("tangent", this.saveItemModified );
    Eingabe.eingabe.find(".red").on("tangent", this.deleteItem );     
    Eingabe.eingabe.find(".grey").on("tangent", this.cancelItemModified );
    
    // FREITEXT
    Eingabe.freitext.find(".green").on("tangent", this.neuerText ); 
    Eingabe.freitext.find(".blue").on("tangent", this.saveItemModified );
    Eingabe.freitext.find(".red").on("tangent", this.deleteItem );
    Eingabe.freitext.find(".grey").on("tangent", this.cancelItemModified );
     
    Eingabe.tippListe.on("tangent", this.showTipp, { watch: "LI"} );
  }
  ,
  build:function() 
  {
    if( this.done ) return;
    
    this.done = true;
    
    DOM("zeitArea").datetimeCreate(function(value)
    {
      Eingabe.itemModified.x = value;
    });   
    
    // SLIDER CHANGING
    DOM("sliderArea").addSlider( this.eingabeHandler );   
    
    // FREITEXT CHANGING
    DOM("favTextareaId").on("input", this.eingabeHandler );
  }
  ,
  show:function()
  {      
     Eingabe.container.swipe("middle").on("stage", function()
     {
       Eingabe.container.off("stage");
       Eingabe.update();
     });
  }
  ,   
  update: function(data)
  {   
    // FREEZE DATE
    DOM("zeitArea").datetimeOff();
    
    this.content.show();
    this.content.invisible();
    // ONLY IF RESULTS
    this.tipp.hide();
    
    // BUTTON 
    // BLUE ERSTELLEN - GREY ABBRECHEN - GREEN NEUER TEXT - RED LÖSCHEN
    this.content.findAll(".button").hide();
    
    if( !Eingabe.itemModified )
    {
      if( Eingabe.item.x )
      {        
        this.freitext.find(".red").show();
        this.eingabe.find(".red").show();
        this.freitext.find(".green").show(); 
      }
      
      data = Object.create( Eingabe.item );
    }
    
    if ( Eingabe.itemModified )
    {
       this.freitext.find(".blue").show();
       this.eingabe.find(".blue").show();
       this.freitext.find(".grey").show();  
       this.eingabe.find(".grey").show();   

       // NEW DATA MAY SET DATE
       DOM("zeitArea").datetimeOn();
      
       data = Object.create( Eingabe.itemModified );
    } 

    DOM("zeitArea").datetimeSet( data.x );
    
    // FREITEXT 
    if (data.kategorie == "Notizen")
    {     
      this.eingabe.hide();
      
      this.freitext.find("legend").html( data.kategorie );
      this.freitext.find(".favTitle").html( data.title );
      
      DOM("favTextareaId").set("value", (data.y) ? data.y.replace(/<br>/g, "\n") : "");  
      
      this.freitext.show();
    }
    // STRUKTURIERTE EINGABE
    else
    {
      this.freitext.hide();

      this.eingabe.find(".favTitle").html( data.title ); 
      this.eingabe.find("legend").html( data.kategorie );
      
      DOM("favGradId").html("");
      DOM("favOutputId").text( ( data.y || data.zero ) + " " + data.unit);       
      // TODO only set the slider on view change but not on slider change
      
      this.eingabe.show();
      
      DOM("sliderArea").setSlider(parseInt(data.y) || data.zero );
         
      this.showDefinition( data );  
    }

    this.content.show();
  }
  ,
  eingabeHandler:function(data)
  {    
    if (!Eingabe.itemModified)
    {
      Eingabe.itemModified = Object.create(Eingabe.item);
      Eingabe.itemModified.x = new Date().getTime();
    }

    Eingabe.itemModified.y = data.value;
    
    Eingabe.update();
  }
  ,
  showDefinition: function(data)
  {
     if (!data.grad) return;
     
     for (var i = 0; i < data.grad.length; i++)
     {
       var grad = data.grad[i];
       var y = Math.floor( data.y );
       
       if (y >= grad.min && y <= grad.max){
         DOM("favGradId").html("<b>Definition:</b> " + grad.info);
         this.showTipps(grad);
       }
     }
  }
  , 
  showTipps: function(grad)
  {
    // ALWAYS CLEANUP
    this.tippListe.removeChilds();

    // POSSIBLE?
    if (!grad.tipps) return;
    
    // MAP ARRAY TO OBJECT ARRAY
    var search = grad.tipps.split(",").map(function(ele){
     return { id: ele };
    });
    
    Model.getLexikon().has("id", search).forEach( function( tipp )
    {                                                              
      Eingabe.tippListe.addRow(
      {
           title: tipp.title,
           zeit: tipp.kategorie,
           caretLeft: false,
           caretRight: true,
           data: tipp
       });               
    });
       
    DOM("fieldsetTipp").show();
  }
  /**
  * EVENTHANDLER
  **/
  ,
  showTipp:function( data )
  {
    if ( data.type == "touchstart") DOM(data.target).addClass("selected");
    if ( data.type == "touchend")
    {
       if (data.transfer)
       {
          Eingabe.content.hide();
          Eingabe.container.swipe("left");
          Controller.dispatch(Controller.TIPPS, data.transfer);
       }  
    }
  }
  ,
  neuerText:function( data )
  {
      if( data.type == "touchend" ) 
      {           
        Eingabe.itemModified = Object.create( Eingabe.item );         
        Eingabe.itemModified.y = "";
        Eingabe.itemModified.x = new Date().getTime();
        
        Eingabe.update();
      }
  }
  ,
  saveItemModified: function( data )
  {
    if( data.type == "touchend")
    {         
      Model.setAct( 
      {
        id: Eingabe.itemModified.id + "",
        x:  Eingabe.itemModified.x,    
        y: (Eingabe.itemModified.kategorie == "Notizen") ? Eingabe.itemModified.y.replace(/\n/g,"<br>").replace(/(script|embed|object)/gi,"") : Eingabe.itemModified.y
      });
      
      Eingabe.goBack();
    }
  }
  , 
  deleteItem: function( data )
  {
    if( data.type == "touchend" )
    {
      Model.removeAct( Eingabe.item );
      Eingabe.goBack();
    }
  }
  ,   
  cancelItemModified: function(data)
  {
    if( data.type == "touchend" )
    {
      Eingabe.itemModified = null;
      Eingabe.update();
    }
  }
  ,
  goBack: function()
  {
    // CLEANUP
    Eingabe.item = null;
    Eingabe.itemModified = null; 
    // LEAVE STAGE
    Eingabe.content.hide();
    Eingabe.container.swipe("right");     
    // CALL NEXT
    Controller.dispatch(Eingabe.goBackTo);
  }

};

// VIEW
var Tipps = {
  
   //DOMELEMENTS
   container:   DOM("tippId")
   ,
   gotoEingabe: DOM("tippBackButton")
   ,
   content:     DOM("tippContentId")
   ,
   init: function()
   {
     if (!App.live) console.log( "- VIEW Tipps");
     
     this.bind();  
     this.container.show();
   }
   ,
   // BINDING
   bind: function()
   {       
     this.gotoEingabe.on("tangent", function( data )
     {      
       if( data.type == "touchend" ) Controller.dispatch( Controller.TIPP2EINGABE );
     });     
     
     Controller.on(Controller.TIPPS, function( data )
     {   
       Tipps.update( data );
       Tipps.container.swipe("middle").on("stage", function()
       {
         Tipps.container.off("stage");
         Tipps.content.show();
       });
     });
     
     Controller.on(Controller.TIPP2EINGABE, function( data )
     {
        Tipps.content.hide();       
        Tipps.container.swipe("right");
     });
   }
   ,
   update: function(data)
   {
     this.content.removeChilds();
     
     var display = this.content.add("form").add("fieldset").style("text-align", "left").add("legend").text(data.kategorie).parent();
     
     display.add("p").html("<b>" + data.title + "</b>");
     
     for (var i = 0; i < data.bausteine.length; i++)
     {       
       var baustein = data.bausteine[i];       
       for (var info in baustein)
       {
         display.add("p").add("div").html("<i>" + info + "</i>").addNext("div").html(baustein[info]).addClass("borderTop");    
       }
     }
     
     var actions = display.add("p");
     actions.add("a").addClass("button green floatLeft").text("Hilfreich").on("tangent", function(data)
     {
       if( data.type == "touchend" )
       {
         console.log("TODO TIPP HLFREICH"); 
         Controller.dispatch( Controller.TIPP2EINGABE );
       }
     });
     actions.add("a").addClass("button grey floatRight").text("Nicht Hilfreich").on("tangent", function(data)
     {
       if( data.type == "touchend" )
       {
        console.log("TODO TIPP NICHT HLFREICH");
        Controller.dispatch( Controller.TIPP2EINGABE );
       }
     });
   }
 };


