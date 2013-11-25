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

    DOM(window).on("ready", function(){
      App.setup();
    });
  }
  ,
  setup: function()
  {    
    App.enviroment(); // domain, node, origin, live
    App.device = DOM().device(); // tv || tablet || mobile || desktop
    App.phonegap = ( !!window.device ); //App.phonegap = window.device = true;
    App.signOn(function(actor)
    {      
      Model.setActor( actor );
      
      if( !actor ) App.goHome();
      if( actor && !App.phonegap) Model.pullActor();
      if( actor ) Model.refreshActs( App.goHome );   
    });
  }
  ,
  goHome:function() { Controller.dispatch( Controller.HOME ); }
};

var Controller = {
  
  INTRO:      "INTRO",
  HOME:       "HOME",
  EINSTELLUNG:"EINSTELLUNG",
  FAVORITES:  "FAVORITES",
  EINGABE:    "EINGABE",
  SYMPTOME:   "SYMPTOME",
  TIPPS:      "TIPPS",
  
  init: function(domain)
  {
    eventify(this);
    
    this.bind();
  }
  ,
  bind: function()
  {

  }
};

var Model = {

  init: function()
  {
    storify(this);
    
    // DEFAULT START
    //this.memory.set("favorites", [{ id: "Symptom" }]);    
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
  setActor:function( actor ) { if( actor ) this.memory.set("actor", actor); }
  ,
  getActor:function() { return this.memory.get("actor"); }
  ,
  pullActor:function( callback )
  {
    var actor = this.getActor();

    this.remote.read(App.node+"/api/actors/"+actor.actor_id, function( data )
    {
      if( data.status == 200 )  Model.memory.get("actor").favorites_array = data.message.favorites_array;
      
      if( callback ) callback(data);

    }, null, actor.access_token );
  }
  ,
  commitActor:function()
  {
    if( this.getActor() )
    {
      ( App.phonegap ) ? this.saveActor : this.pushActor();
    }
  }
  ,
  pushActor:function( callback )
  {
    var actor = this.getActor();

    this.remote.update(App.node+"/api/actors/"+actor.actor_id, function( data )
    {
      if( data.status == 200 ) console.log("Update Remote Actor"); 
      
      if( callback ) callback( data );    
    }
    , actor, actor.access_token );
  }
  ,
  saveActor:function() { this.storage.set("actor", this.getActor() ); }
  ,
  getFavorites:function()
  {
    // PATIENT START { id: "10025482" }, { id: "privat"}
    // ARZT START { id: "diagnose"}, { id:"zyklus" }
    if( !this.favorites )
    this.favorites = ( this.getActor() ) ? this.getActor().favorites_array : [ {"id":"Symptom"} ];
    
    return this.favorites;
  }
  ,
  setFavorite:function( favorite )
  {
    this.favorites.push( favorite );
    this.commitActor();
  }
  ,
  removeFavorite:function( favorite )
  { 
    // Modify existing array don't create new one
    var index = this.favorites.length;   
    while( index-- ) if( this.favorites[index].id == favorite.id ) this.favorites.splice( index, 1 ); 

    this.commitActor();
  }
  ,
  getLexikon:function()
  {
    return Model.memory.get("lexikon").clone();
  }
  ,
  getLexikonAt:function( index )
  {
    return Model.memory.get("lexikon")[index];
  }
  ,
  getLexikonById:function( id )
  {
    var index = Model.getLexikon().length;
           
    while( index-- )
    {
      var item = Model.getLexikonAt( index );

      if( item.id == id ) return item;
    }
    
    return null;
  }
  ,
  getLexikonFavorites:function()
  {       
    // WARUM MERGE ? EE WARUM X
    return Model.memory.get("lexikon").has("id", this.getFavorites() );
  }
  ,
  refreshActs:function( callback )
  {
    ( App.phonegap ) ? this.loadActs( callback ) : this.pullActs( callback );
  }
  ,
  getActs:function() 
  { 
    return this.memory.get("acts").filter( function(element) { return !element.deleted; } ); 
  }
  ,
  setAct:function( act )
  {
    
    
    var acts = this.memory.set("acts", [ act ], ["id","kategorie"] );
    
    this.commitActs();
  }
  ,
  // Phonegap commits to localstorage and desktop to remote
  commitActs:function() 
  { 
    if( this.getActor() )
    {
      ( App.phonegap ) ? this.saveActs() : this.pushActs(); 
    }
  }
  ,
  saveActs:function( callback ) { this.storage.set("acts", this.memory.get("acts") ); if( callback ) callback(); }
  ,
  loadActs:function( callback ) { this.memory.set("acts", this.storage.get("acts") ); if( callback ) callback(); }
  ,
  pushActs:function()
  {  
    var index = this.memory.get("acts").length;
    
    while( index-- )
    {
      var act = this.memory.get("acts")[ index ];
      
      if( !act.act_id ) this.pushCreateAct( act ); 

      if( act.act_id && act.deleted ) this.pushDeleteAct( act ); 
    }
  }
  ,
  pushCreateAct:function( act )
  {
    var acts = this.memory.get("acts");
    
    this.remote.create(App.node + "/api/acts/", function(data)
    {
      if( data.status == 200 )
      acts.splice( acts.indexOf( act ), 1, data.message );
    }, 
    act, this.getActor().access_token );
  }
  ,
  pushDeleteAct:function( act )
  {
    var acts = this.memory.get("acts");
    
    this.remote.delete(App.node + "/api/acts/"+act.act_id, function(data)
    {
      if( data.status == 200 )
      acts.splice( acts.indexOf( act ), 1 );
    }, 
    act, this.getActor().access_token );  
  }
  ,
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

    this.commitActs();
  }
  ,
  pullActs:function( callback )
  {
    this.remote.read(App.node + "/api/acts/", function(data)
    {
      if( data.status == 200 )
      {
        Model.memory.set("acts", data.message );
        if( callback) callback( data );
      }
      
    }, 
    null, this.getActor().access_token );   
  }
  ,
  test:function()
  {
    // DEV
    console.log("Setting DUMMY data");
    Model.memory.set("acts", [
      { id: "10025482", x: "1380725392804", y: "80" },
      { id: "10013963", x: "1380735392804", y: "20" },
      { id: "10013963", x: "1380835392804", y: "50" },
      { id: "10013963", x: "1380935392804", y: "70" },
      { id: "privat", x: "1380745392804", y: "Ein guter Tag<br>morgen" }
    ], ["id", "x"]);
  }
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
    this.content.show();
    
    var actor = Model.getActor();  
    
    if( App.phonegap )
    {
      if( actor )
      {
        this.verbindenStatus.text( actor.scope_display );
        this.verbindenInfo.text("hergestellt");
        this.verbindenBtn.hide();
        this.sync.show();
      }
      else if( error )
      {
        this.verbindenStatus.text( error.status );
        this.verbindenInfo.text( error.info );
        this.verbindenBtn.show();
        this.sync.hide();
      }
      else
      {
        this.verbindenStatus.text( "Mit Studienzentrum" );
        this.verbindenInfo.text("herstellen");
        this.verbindenBtn.show();
        this.sync.hide();
      }
    }
    else
    {
      if( actor && actor.role_type == "PATIENT")
      {
        this.verbindenStatus.text( actor.scope_display );
        this.verbindenInfo.text("hergestellt");
        this.verbindenBtn.hide();
        this.sync.show();
      }
      else
      {
        this.verbindenStatus.text( "Kein Studienzentrum" );
        this.verbindenInfo.text( "zugeordnet" );
        this.verbindenBtn.hide();
        this.sync.hide();
      }
    }
  } 
  ,
  verbinden:function()
  {
    var scanner = cordova.require("cordova/plugin/BarcodeScanner");

    // text, format, cancelled
    scanner.scan(
      function(result) 
      { 
        if( result.format == "QR_CODE" && result.text.split(":").length == 2)
        {
          var params = {
            "usr": result.text[0]
            ,
            "pwd": result.text[1]
          };

          Model.remote.read( App.node + "/authenticate", function( data )
          {
            if( data.status == 200)
            {
              var actors = data.message;
              var actor;
              
              for( var i = 0; i < actors.length ; i++)
              {
                if( actors[i].scope_display.indexOf( "Consilium" ) > -1 ) actor = actors[i];
              }
              
              if( actor )
              {
                Model.storage.set("device_actor", actor);   
                Model.memory.set("actor", actor);  
                Model.memory.set("favorites", actor.favorites_array );
                Einstellung.update();
              }
              else Einstellung.update( { status:"Berechtigung", info:"nicht vorhanden" } );
            }
            else 
            {
              Model.storage.remove("device_actor");
              Einstellung.update( { status:"Authentifizierung", info:"fehlgeschlagen" } );
            }
          }, params );                  
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
  synchronisieren:function()
  {
    this.pullActor();
    
    console.log("Sync started");
  }
  ,
  pullActor:function()
  {
    Model.pullActor( function(data) 
    {    
      console.log("Response pullActor", data.status);
      
      if( data.status == 200 ) 
      {  
        // TODO UPDATE LOGIK
        var actor =  data.message ;
        
        Einstellung.uploadActor();
      }
      else Einstellung.abbruch( data );
    });
  }
  ,
  uploadActor:function()
  {
    Model.pushActor( function( data )
    {
      console.log("Response uploadActor", data.status);
      
      if( data.status == 200 )
      {
        Einstellung.pullActs();
      }
      else Einstellung.abbruch( data );
    });
  }
  ,
  pullActs:function()
  {
    Model.pullActs( function( data )
    {
      console.log("Response pullActs", data.status);
      
      console.log( Model.getActor(), new Date ( Model.getActor().current_date ) );
      
      if( data.status == 200 )
      {
        Einstellung.pushActs();
      }
      else Einstellung.abbruch( data );
    });
  }
  ,
  pushActs:function()
  {
    console.log("push acts");
    
    Model.pushActs( function( data )
    {
      console.log("Response pushActs", data.status);
      
      if( data.status == 200 )
      {
        Einstellung.synced( data );
      }
      else Einstellung.abbruch( data );
    });
  }
  ,
  synced:function( data )
  {
    console.log("Synced");
  }
  ,
  abbruch:function( err )
  {
    console.log("Sync aborted");
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
  }
  ,
  bind: function()
  {
    Controller.on(Controller.HOME, function()
    {   
      if( Intro.hasInformed() )
      {
         Home.show();
      }
      else Controller.dispatch( Controller.INTRO );
    });
    
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
  show: function()
  {
      Home.container.show();
      Home.content.invisible();
      // START WORKING DURING ANIMATION
      Home.update();
      
      Home.container.on("stage", function()
      {
        Home.container.off("stage");
        Home.content.show();
      });
      
      Home.container.swipe("middle");
  }
  ,
  // FUNCTIONS
  update: function()
  {
    if( !Home.container.hasClass("swipable") )
    {
      if (!window.device) DOM("titleId").hide();
      
      Home.container.addClass("swipable");
      Home.chart.init();
      Home.form.init();   
    } 

    this.content.show();
    this.chart.update();
    this.form.update();
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
  	right: 5,
  	left: 5,
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
      
      this.board.on("touchstart", function(data){
        Home.form.update( data.transfer );
      });
      
      // AT APP START ALL LEFT (0)             
      var scrolledX = Home.chart.scroller.get("scrollLeft");      
      // AT START TAKE ONLY LAST 14 DAYS ELSE
      var fromX = ( scrolledX == 0 ) ? this.x( this.maxInMs - ( 14 * this.stepInMs ) ) : scrolledX;
          fromX -= Home.container.width() - 160; 
      var toX = this.x(this.maxInMs - this.stepInMs);
          toX-= Home.container.width() - 160;      
      // ACTION
      Home.chart.scroller.scrollX(fromX, toX, 2000);
    },
    
    update: function()
    {  
      this.board.findAll(".movePoint").remove();
      this.board.findAll(".connectLine").remove();
      
      Model.getActs().forEach( function( ele )
      {
        // REDRAW IF ACT OUTSIDE RANGE
        if( ele.x <= Home.chart.minInMs || ele.x >= Home.chart.maxInMs) return Home.chart.init();
      });
      
      // Symbole
      Model.getActs().unique("id").forEach(function(id)
      {
        var howto = Model.memory.search("lexikon", id)[0];     
        var acts = Model.getActs().has("id", [ {id: id} ] ).sort321("x"); 

        var todo = acts.length;
        
        if (howto.kategorie == "Symptom" || howto.kategorie == "Bewertung"){  
          var prev = null;
          
          while (todo--){
            var act = acts.pop();

            this.board.drawSymptom( this.x( act.x ), this.y( 100 - act.y ), 17, howto.farbwert, act);
                      
            // Less than 3 days apart
            if (prev && Number(prev.x) < Number(act.x) + 3 * 86400000)
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
        
        // }
      }.bind(this));
    }   
  },
  
  form: {

    fieldset: DOM("homeFieldsetAuswahl"),
    
    liste: DOM("homeAuswahlListe"),
    
    gotoIntro: DOM("homeBackToIntro"),

    init: function(){  
        this.gotoIntro.on("tangent", function( data )
        { 
          if( data.type == "touchstart" ) DOM( data.target ).addClass("selected");
          if( data.type == "touchend" )
          {
            Controller.dispatch( Controller.INTRO );
          }
        }, { watch: "LI" });
    },
    
    update: function(event){
      
      this.liste.off("tangent");
      this.liste.removeChilds();

      if (event)
      {
        var howto = Model.getLexikonById( event.id );
        
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
            Home.container.swipe("left");
            
            var item = event;
            item.back = Controller.HOME;
            Controller.dispatch(Controller.EINGABE, item);
          }
         }, { watch: "LI" });
      
        this.fieldset.legend(howto.kategorie);
      } 
      else
      {
        var howto = Model.getLexikonById( "Symptom" );
        
        this.fieldset.legend("Auswahl");
        
        this.liste.addRow({
          title: howto.title,
          caretLeft: false,
          caretRight: true,
          value: "",
          farbe: ""
          //detail:"Berühren Sie die Datenpunkte in der Timeline für detaillierte Informationen." 
        }).on("tangent", function(data)
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
    // SMALL SCREEN HAS OVERLAY IN TIMELINE
//      if (window.matchMedia("(orientation:landscape) and (max-device-width:768px)").matches) 
//      {   
//        dispatchCommand(Commands.CHART_OVERLAY, {
//          type: "row", title: type.title, zeiit: "am " + util.zeit("dd.mm.yyyy hh:mm", event.x),
//          farbwert: type.farbwert, value: value
//        });
//      }
  }
};

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
    this.container.addClass("swipable");
    this.logo.addConsilium();
    this.container.hide();
  }
  ,
  bind: function()
  {    
    Controller.on(Controller.INTRO, Intro.show );
  }
  ,
  goHome:function( data )
  {
    if( data.type == "touchend" )
    {
      Intro.hide();
      Controller.dispatch(Controller.HOME);
    }
  }
  ,
  show: function( data )
  { 
    Intro.update( data );
    Intro.container.style("top", "0%");
  }
  ,
  hide: function()
  {
    Intro.container.style("top", "100%");
  }
  ,
  hasInformed:function()
  {
    var actor = Model.memory.get("actor");

    if( actor )
    return ( actor.role_type == Model.storage.get("informed") );
    
    if( !actor )
    return Model.memory.get("informed");
  }
  ,
  update: function()
  { 
    this.container.show();

    var role_type = ( Model.memory.get("actor") ) ? Model.memory.get("actor").role_type : "NOT_REGISTER";
    
    Intro.setTitle(  "Consilium" );
    Intro.setClaim(  "Arzt und Patient verbinden");
    Intro.setDetail( "Informationen" ).add("a", { "class": "button blue floatRight" } ).text("Start").on("tangent", Intro.goHome );  
    Intro.setDisclaimer();
  
    this.removeFeatures();
    
    var actor = Model.memory.get("actor");
    var goodbye;
    
    // DESKTOP NOLOGIN
    if( ( role_type == "NOT_REGISTER" || role_type == "REGISTER" ) && !App.phonegap )
    {
      this.addFeatures(
      [
        { title: "1. Funktion", description: "<p>Consilium ist eine Applikation zur Erfassung von Symptomen und Notizen durch die NutzerInnen. Sie unterstützt die Kommunikation mit dem Arzt über einen gemeinsamen Datenzugriff.</p>"}
        ,
        { title: "2. Entwicklung", description: "<p>Consilium wurde für eine Studie entwickelt, die aktuell den Mehrwert von Applikationen in der medizinischen Versorgung untersucht.</p>"}
        ,
        { title: "3. Nutzung", description: "<p>Alle Interssierte dürfen die App testen. Über „Start“ wird die Favoritenliste aufgerufen, in der Wohlbefinden, Symptome und Tagebuchnotizen eingeben werden können.</p>"}
        ,
        { title: "4. Datenspeicherung", description: "<p>Die Daten werden nur nach Verbindung mit dem Server und regelmässiger Synchronisation über „Sync“ gespeichert. Eingegebene Daten in der Testversion werden nicht erfasst.</p>"}
        ,
        { title: "5. Anonymisierung", description: "<p>NutzerInnen der App erhalten eine individuelle Patienten-ID, mit der Sie berechtigt sind den Service zu nutzen.</p>"}
      ]);
      goodbye = { title: "6. Epilog", description: "<p>Wir danken für Ihr Interesse.</p>" };
    }
    
    // APP NOLOGIN
    if( role_type == "NOT_REGISTER" && App.phonegap )
    {
      this.addFeatures(
      [
        { title: "1. Funktion", description: "<p>Die App ist Ihr persönliches Logbuch während einer medizinischen Therapie. Wir empfehlen die App täglich zu nutzen.</p>" }
        ,
        { title: "2. Einführung", description: "<p>Über „Start“ können Sie in der Favoritenliste Wohlbefinden, Symptome und Notizen erfassen.</p>" }
      ]);
      goodbye = { title: "3. Epilog", description: "<p>Die erfassten Daten erscheinen in Ihrer Timeline und in Ihrer Web-Applikation. Wir wünschen Ihnen viel Erfolg!</p>"};
    }

    if( role_type == "PATIENT" )
    { 
      // GRUPPE B   
      if( actor.scope_type == "GRUPPE_B" )
      {
       this.addFeatures(
        [
          { title: "1. Einteilung", description: "<p>Sie gehören der Gruppe B an. Verwenden Sie die App während der Beobachtungszeit, ohne den Arzt darüber zu informieren. Verhalten Sie sich ansonsten in den Arztvisiten wie gewohnt, und informieren Sie den Arzt über alle Ihre Beschwerden und Wünsche.</p>"}
          ,
          { title: "2. Nutzung", description: "<p>Wir empfehlen die App täglich zu nutzen. Über „Start“ können Sie in der Favoritenliste Wohlbefinden, Symptome und Notizen erfassen. Die erfassten Daten erscheinen in Ihrer Timeline und Web-Applikation. Zwei Datenpunkten erhalten eine Verbindungslinie, wenn der Zeitabstand weniger als drei Tage beträgt.</p>"}
          ,
          { title: "3. Fragebogen", description: "<p>Bitte beantworten Sie unsere Fragebögen. Sie können die App dabei verwenden. Notieren Sie bitte auf dem Fragebogen nur Ihre persönliche Patienten-ID (Pat-ID) und nie Ihren Namen. Ihre Pat-ID erscheint in der App durch Berühren der „Sync“-Taste.</p>"}
        ]);      
        goodbye = { title: "4. Epilog", description: "<p>Wir danken für die Teilnahme an der Studie und wünschen Ihnen eine erfolgreiche Therapie.</p>" };
      }
      // GRUPPE C       
      if( actor.scope_type == "GRUPPE_C" )
      {
        this.addFeatures(
        [
          { title: "1. Einteilung", description: "<p>Sie gehören der Gruppe C an. Verwenden Sie die App während der Beobachtungszeit und diskutieren Sie die Daten zusammen mit dem Arzt in der Visite. Verhalten Sie sich ansonsten in den Arztvisiten wie gewohnt, und informieren Sie den Arzt über alle Ihre Beschwerden und Wünsche.</p>"}
          ,
          { title: "2. Nutzung", description: "<p>Wir empfehlen die App täglich zu nutzen. Über „Start“ können Sie in der Favoritenliste Wohlbefinden, Symptome und Notizen erfassen. Die erfassten Daten erscheinen in Ihrer Timeline und in Ihrer Web-Applikation. Zwei Datenpunkten erhalten eine Verbindungslinie, wenn der Zeitabstand weniger als drei Tage beträgt.</p>"}
          ,
          { title: "3. Fragebogen", description: "<p>Bitte beantworten Sie unsere Fragebögen. Sie können die App dabei verwenden. Notieren Sie bitte auf dem Fragebogen nur Ihre persönliche Patienten-ID (Pat-ID) und nie Ihren Namen. Ihre Pat-ID erscheint in der App durch Berühren der „Sync“-Taste.</p>"}
        ]);
        goodbye = { title: "4. Epilog", description: "<p>Wir danken für die Teilnahme an der Studie und wünschen Ihnen eine erfolgreiche Therapie.</p>" };
      }
    }
          
     this.addFeature( goodbye ); //.add("a").addClass("button grey").text("App starten").on("tangent", Intro.goHome );
    
    ( actor ) ? Model.storage.set("informed", role_type ) : Model.memory.set("informed", true);
  }
};

var Favorites = {
    
  //DOMELEMENTS
  container:    DOM("favoritesId"),
  gotoHome:     DOM("favoritesBackButton"),
  gotoSymptome: DOM("favoritesEditButton"),
  content:      DOM("favoritesContentId"),
  form:         DOM("favFormId"),
  BACK:         Controller.HOME
  ,
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
        Controller.dispatch(Controller.HOME); // Favorites.BACK ???
        Favorites.container.swipe("right");
      }
    });
    
    this.gotoSymptome.on("tangent", Favorites.edit);
    
    Controller.on(Controller.FAVORITES, function(data){

      data = data || {};
      Favorites.BACK = data.back || Controller.HOME;
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
    lexiFav.unique("kategorie").forEach(function(kategorie)
    {
      var legend = Favorites.form.add("fieldset").addClass("liste").add("legend").text(kategorie);
      var rows = legend.addNext("ul").addClass("listeNext");
      var entities = lexiFav.has("kategorie", [{ "kategorie": kategorie}] );
      var editables = entities.has("edit", [{ edit: true }] );
      
      if (!edit) rows.on("tangent", function( data )
      {  
        if( data.type == "touchstart" ) DOM( data.target ).addClass("selected");        
        if( data.type == "touchend")
        {
          var item = {
            back: Controller.FAVORITES,
            
          };
          
          // QUICKLINK ZUR SYMPTOMAUSWAHL
          if( item.id == "Symptom" ) Controller.dispatch( Controller.SYMPTOME, item);
          else
          {
            
          }
          // TODO Bubbling
          var item = data.transfer;

          if (item){
            Favorites.content.hide();
   
            Favorites.container.swipe("left");
           
            Controller.dispatch(Controller.EINGABE, item);
          }
        }

      }
      , { watch: "LI" });
      
      for (var i = 0; i < entities.length; i++)
      {
          var params = {};
          params.title = entities[i].title;
          
          if (edit)
          {
            var editableItem = editables.has("id", [{ id: entities[i].id }] );

            if (editableItem.length > 0)
            {
              params.callback = function()
              {
                Model.removeFavorite( this );
              }
              .bind( entities[i] );
            }
            
            rows.addRemovableRow(params);            
          } 
          else 
          {          
            params.farbe = entities[i].farbwert;
            params.caretRight = true;
            params.data = entities[i];
            params.value = "&nbsp;";
            
            var acts = Model.getActs().has("id", [{ id: entities[i].id }] );
            
            if (acts.length > 0){
              var last = acts.sort123("x").clone().pop();
              if (/^\d+$/.test(last.y)) params.value = last.y + " " + entities[i].unit;
              
              params.zeit = "Zuletzt: " + util.zeit("dd.mm.yyyy hh:mm", Math.floor(last.x)); 
              params.data.x = last.x;
              params.data.y = last.y;
            }
            rows.addRow(params);         
          }
      }
    });
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
    
    var symptome = Model.memory.search("lexikon", "Symptom" ).notIn("id", Model.getFavorites() );
    
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
      Model.setFavorite( { id: data.transfer, edit: true } );
      
      Symptome.done( { id : data.transfer, back:Controller.SYMPTOME } );
    }
  }
  ,
  done:function( payload )
  {
    this.content.hide();
    this.container.swipe("left");

    Controller.dispatch(Controller.EINGABE, payload );
  }
};

var Eingabe = {
 // VIEW
    
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
       Eingabe.content.hide();
       
       Eingabe.build();
       
       // !data from Tipps, but maybe itemModified
       if (data)
       {
         Eingabe.goBackTo = data.back;
         
         // SYMPTOMLISTE NEU NUR ID
         // TODO FAVORITES AND HOME
         Eingabe.item = Model.getLexikonById( data.id );         
         Eingabe.item.x = data.x;
         Eingabe.item.y = data.y;
         Eingabe.itemModified = null;         
       }

       Eingabe.container.swipe("middle").on("stage", function()
       {
         Eingabe.container.off("stage");
         Eingabe.update(Eingabe.itemModified || Eingabe.item);
       });
     });
     
    // SCHIEBEREGLER
    // SAVE
    Eingabe.eingabe.find(".blue").on("tangent", this.saveItemModified );
    // DELETE
    Eingabe.eingabe.find(".red").on("tangent", this.deleteItem );     
    // CANCEL
    Eingabe.eingabe.find(".grey").on("tangent", this.cancelItemModified );
    
    // FREITEXT
    DOM("favTextareaId").on("input", function(data)
    {
      Eingabe.itemModified =  Object.create( Eingabe.itemModified || Eingabe.item );      
      Eingabe.itemModified.y = data.value;
      Eingabe.itemModified.x = new Date().getTime();
      
      Eingabe.update( Eingabe.itemModified );
    });
    // NEUER TEXT 
    Eingabe.freitext.find(".lightgrey").on("tangent", this.neuerText ); 
    // SAVE
    Eingabe.freitext.find(".blue").on("tangent", this.saveItemModified );
    // DELETE
    Eingabe.freitext.find(".red").on("tangent", this.deleteItem );
    // CANCEL
    Eingabe.freitext.find(".grey").on("tangent", this.cancelItemModified );
     
    Eingabe.tippListe.on("tangent", this.showTipp, { watch: "LI"} );
  }
  ,
  build:function() 
  {
    if( this.done ) return;
    
    this.done = true;
    
    DOM("zeitArea").addDatetime(function(value)
    {
    // Zeit
      Eingabe.itemModified =  Object.create( Eingabe.itemModified || Eingabe.item );   
      Eingabe.itemModified.x = value;
      
      Eingabe.update(Eingabe.itemModified); 
    });
    
    // Strukurierte Eingabe
    DOM("sliderArea").addSlider(function(value)
    {    
      if (!Eingabe.itemModified)
      {
        Eingabe.itemModified = Object.create(Eingabe.item);
        Eingabe.itemModified.x = new Date().getTime();
      }
      
      Eingabe.itemModified.y = value;
      // TODO: specifically update containers
      Eingabe.update(Eingabe.itemModified);
    });   
  }
  ,
   
/**
 * _term: "10013963 SYMPTOM "
    back: "FAVORITES"
    farbwert: "rgba(40,210,230,0.9)"
    grad: Array[5]
    id: "10013963"
    kategorie: "Symptom"
    sub: "Atemwege"
    title: "Atemnot"
    unit: "Pkte"
    x: "1380725392804"
    y: "20"
    zero: 0
 */
   
  update: function(data)
  {    
     if (data)
     {
       this.content.find(".favActions").hide();
       this.freitext.hide();
       this.eingabe.hide();
       this.tipp.hide();
       
       if (Eingabe.itemModified){
         this.content.findAll(".blue").show();
         this.content.findAll(".grey").show();
         this.content.findAll(".red").hide();    
         this.content.findAll(".favActions").show();
       } 
       else if (data.y != "")
       {  
         this.content.findAll(".blue").hide();
         this.content.findAll(".grey").hide();
         this.content.findAll(".red").show();
         this.content.findAll(".favActions").show();
       }

       if (data.kategorie == "Notizen"){
         this.freitext.show();

         this.freitext.find("legend").html( data.kategorie );
         this.freitext.find(".favTitle").html( data.title );
         DOM("zeitArea").setDatetime( data.x );
         
         DOM("favTextareaId").set("value", (data.y) ? data.y.replace(/<br>/g, "\n") : "");       
       }
       else
       {
         // FOR WIDTH
         this.eingabe.show();

         this.eingabe.find("legend").html( data.kategorie );
         DOM("favGradId").html("");
         this.eingabe.find(".favTitle").html( data.title );
         
         DOM("zeitArea").setDatetime( data.x );
         DOM("favOutputId").text( ( data.y || data.zero ) + " " + data.unit);
         this.content.show();
         
         // TODO only set the slider on view change but not on slider change
         DOM("sliderArea").setSlider(parseInt(data.y) || data.zero );
         
         this.showDefinition( data );
       }
     }
     this.content.show();
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
        
        Eingabe.update( Eingabe.itemModified );
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
        y: (Eingabe.itemModified.kategorie == "Notizen") ? Eingabe.itemModified.y.replace(/\n/g,"<br>") : Eingabe.itemModified.y
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
      Eingabe.update(Eingabe.item);
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
       if( data.type == "touchend" )
       {
         Tipps.goBack();
       }
     });     
     
     Controller.on(Controller.TIPPS, function(data)
     {   
       Tipps.update( data );
       Tipps.container.swipe("middle").on("stage", function()
       {
         Tipps.container.off("stage");
         Tipps.content.show();
       });
     });
   }
   ,
   goBack: function(){
     Tipps.content.hide();       
     Controller.dispatch(Controller.EINGABE);
     Tipps.container.swipe("right");
   }
   ,
   /**
    * _term: "IMELD2 BRUSTZENTRUM "
      bausteine: Array[3]
      dislikes: 0
      id: "iMeld2"
      kategorie: "Brustzentrum"
      likes: 0
      title: "Kontakt aufnehmen"
    */
   update: function(data){
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
       if( data.type == "touchend" ){
        console.log("TODO TIPP HLFREICH");
        Tipps.goBack();
       }
     });
     actions.add("a").addClass("button grey floatRight").text("Nicht Hilfreich").on("tangent", function(data)
     {
       if( data.type == "touchend" ){
        console.log("TODO TIPP NICHT HLFREICH");
        Tipps.goBack();
       }
     });
   }
 };


