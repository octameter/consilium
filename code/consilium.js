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
    console.log("APP initialize");
    App.start(); // start reporter
    
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
    
    App.report( "App.initialized" );
  }
  ,
  setup: function()
  {
    App.enviroment(); // domain, node, origin, live
    
    App.device = DOM().device(); // tv || tablet || mobile || desktop
    App.phonegap = ( !!window.device );
    
    App.signOn(function(actor)
    {
      Model.memory.set("actor", actor);
      
      if( actor && actor.favorites_object )
      Model.memory.set("favorites", actor.favorites_object );
      
      Controller.dispatch( Controller.HOME );   
    });
    
    App.report( "App.setup" );
  }
  ,
  start: function()
  {
    App.time = new Date();
  }
  ,
  report: function( text )
  {
    console.log( text, new Date().getTime() - App.time );
  }
  
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
    this.memory.set("favorites", [{ id: "Symptom" }]);    
    this.memory.set("acts", [], ["id", "x"]);
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
    
    /* PATIENT START */
    if( false )
    Model.memory.set("favorites", [
       { id: "10025482" },
       { id: "privat"}
    ]);
    
    /* ARZT START */
    if( false )
    Model.memory.set("favorites", [
       { id: "diagnose"},
       { id:"zyklus" }
    ]);
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
        console.log("hier syncen");
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
    
    var actor = Model.memory.get("actor");  
    
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
        this.sync.hide();
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
        if( result.format == "QR_CODE" && result.text.split("&").length == 2)
        {
          var params = {
            "usr": result.text[0];
            "pwd": result.text[1];
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
    this.content.hide();
  }
  ,
  bind: function()
  {
    Controller.on(Controller.HOME, function()
    {
      
      var actor = Model.memory.get("actor");

      if( actor && actor.role_type && Intro.hasInformed( actor ) )
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
      Home.update();
      
      Home.container.on("stage", function()
      {
        Home.container.off("stage");
        Home.content.show();
        App.report("Home on.stage");
      });
      
      Home.container.swipe("middle");
      
      App.report("Home on Controller.HOME");
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
    
    console.log( "update home now");
    this.content.show();
    this.chart.update();
    this.form.update();
  },
  
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
      var range = Model.memory.get("acts").sort123("x").clone();
      // Minimum X for Grid
      var first= new Date(); 
      first.setDate(first.getDate() - 30);
      // Maximum X for Grid
      var last = new Date(); 
      last.setDate(last.getDate() + 3);
      
      // Maybe larger Grid needed
      if( range.length > 0 )  
      {
        var firstAct = Math.floor( range.shift().x );
        if( firstAct < first ) first = firstAct;
        
        var lastAct  = Math.floor( range.pop().x );
        if( lastAct > last ) last = lastAct;
      }

      this.minInMs = util.zeit("midnight", first);
      this.maxInMs = util.zeit("midnight", last);
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
      
      // Fast ganz nach Rechts     
      var rechts = this.x(this.maxInMs - 86400000);
      Home.chart.scroll( rechts );         
    },
    
    update: function()
    {  
      this.board.findAll(".movePoint").remove();
      
      // Symbole
      Model.memory.get("acts").unique("id").forEach(function(id){
      //for (var id in  Model.memory.get("acts").unique("id")){
        
        var howto = Model.memory.search("lexikon", id)[0];
        
        var acts = Model.memory.get("acts").has("id", [ {id: id} ] ).sort123(); 

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
        
        
    },
    
    // TIME
    scroll: function(to)
    {
      var status = Home.chart.scroller.get("scrollLeft");
      // 100 is padding
      var strecke = to - Home.container.width() - status + 100; 
      
      Home.chart.scroller.scrollTo("scrollLeft", strecke, 2000);
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
        var howto = Model.memory.get("lexikon").has("id", [{ id: event.id }] )[0];
        
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
            item.back = App.HOME;
            Controller.dispatch(Controller.EINGABE, item);
          }
         }, { watch: "LI" });
      
        this.fieldset.legend(howto.kategorie);
      } 
      else
      {
        var howto = Model.memory.get("lexikon").has("id", [{ id: "Symptom" }] )[0];
        
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
  init: function()
  {
    if (!App.live) console.log("- VIEW Intro");
    introfy(this);
    this.bind();
    
    Intro.container.addClass("swipable");
    Intro.container.find(".intro-main .cell:last-child").addConsilium();
    
    this.container.hide();
  }
  ,
  bind: function()
  {
    
    Controller.on(Controller.INTRO, function( ){
      Intro.show();
      App.report( "Intro on Controller.INTRO");
    });
    
    this.container.on("tangent", function( data )
    {
      if( data.type == "touchend" )
      {
        Intro.hide();
        Controller.dispatch(Controller.HOME);
      }
    },{ watch: "A" });
    
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
  hasInformed:function( data )
  {
    // check storage against actor.role_type or "NOT_REGISTER"
    return ( data.role_type == Model.storage.get("informed") );
  }
  ,
  update: function()
  { 
    this.container.show();

    var role_type = ( Model.memory.get("actor") ) ? Model.memory.get("actor").role_type : "NOT_REGISTER";
    
    Intro.setTitle("Consilium");
    Intro.setClaim("Arzt und Patient verbinden");
    Intro.setDetail("Informationen").add("a", {
      "class": "button blue floatRight"
    }).text("Start");
    Intro.setDisclaimer();
  
    this.removeFeatures();
    
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
        ,
        { title: "6. Epilog", description: "<p>Wir danken für Ihr Interesse und wünschen Ihnen viel Erfolg.</p>"
          + '<a class="button blue">App starten</a>'
        }
      ]);
    }
    
    // APP NOLOGIN
    if( role_type == "NOT_REGISTER" && App.phonegap )
    {
      this.addFeatures(
      [
        { title: "1. Funktion", description: "<p>Die App ist Ihr persönliches Logbuch während einer medizinischen Therapie. Wir empfehlen die App täglich zu nutzen.</p>" }
        ,
        { title: "2. Einführung", description: "<p>Über „Start“ können Sie in der Favoritenliste Wohlbefinden, Symptome und Notizen erfassen.</p>" }
        ,
        { title: "3. Epilog", description: "<p>Die erfassten Daten erscheinen in Ihrer Timeline und in Ihrer Web-Applikation. Wir wünschen Ihnen viel Erfolg!</p>"
          + '<a class="button blue">App starten</a>'
        }
      ]);
    }
    var actor = Model.memory.get("actor");
    
    console.log( role_type, Model.memory.get("actor").scope_type, (actor.scope_type == "GRUPPE_B"), ( role_type == "PATIENT" )  );
    
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
          ,
          { title: "4. Epilog", description: "<p>Wir danken für die Teilnahme an der Studie und wünschen Ihnen eine erfolgreiche Therapie.</p>"
            + '<a class="button blue">App starten</a>'
          }
        ]);       
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
          ,
          { title: "4. Epilog", description: "<p>Wir danken für die Teilnahme an der Studie und wünschen Ihnen eine erfolgreiche Therapie.</p>" 
            + '<a class="button blue">App starten</a>'
          }
        ]);
      }
    }
    App.report( "INTRO update");
        
    Model.storage.set("informed", role_type ); 
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
    
    // TODO review
    // var lexiFav = Model.memory.get("lexikon").has("id", Model.memory.get("favorites") );

    var data = Model.memory.get("lexikon").merge("id", Model.memory.get("favorites") );
    var lexiFav = data.has("id", Model.memory.get("favorites") );
    lexiFav.unique("kategorie").forEach(function(kategorie){

    // EACH FAVORIT GETS FIELDSET
      var legend = Favorites.form.add("fieldset").addClass("liste").add("legend").text(kategorie);
      var rows = legend.addNext("ul").addClass("listeNext");
      var entities = lexiFav.has("kategorie", [{ "kategorie": kategorie}] );
      var editables = entities.has("edit", [{ edit: true }] );

      if (!edit) rows.on("tangent", function( data )
      {  
        if( data.type == "touchstart" ) DOM( data.target ).addClass("selected");
        
        if( data.type == "touchend")
        {
          // TODO Bubbling
          var item = data.transfer;
          
          if (item){
            Favorites.content.hide();
            item.back = Controller.FAVORITES;
            Favorites.container.swipe("left");
           
            Controller.dispatch(Controller[item.id == "Symptom" ? "SYMPTOME" : "EINGABE"], item);
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

            if (editableItem.length > 0){
              params.callback = function(){
                console.log("TODO: DELETE", this.id);
              }.bind({
                id: entities[i].id
              });
            }
            
            rows.addRemovableRow(params);            
          } 
          else 
          {          
            params.farbe = entities[i].farbwert;
            params.caretRight = true;
            params.data = entities[i];
            params.value = "&nbsp;";
            
            var acts = Model.memory.get("acts").has("id", [{ id: entities[i].id }] );
            
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
    
    Controller.on(Controller.SYMPTOME, function(data)
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
    Symptome.content.show();
    
    this.liste.on("tangent", function(data)
    {
      if (data.type == "touchstart") DOM(data.target).addClass("selected");
      if( data.type == "touchend")
      {
        var item = data.transfer;
        
        if (item){
          Symptome.content.hide();
          Symptome.container.swipe("left");
          Model.memory.set("favorites", [ { id: item.id, edit: true } ]);
          item.back = Controller.SYMPTOME;
          Controller.dispatch(Controller.EINGABE, item);
        }
      }
    }
    , { watch: "LI" });
    
    var symptome = Model.memory.search("lexikon", "Symptom" ).notIn("id", Model.memory.get("favorites"));
    
    symptome.sortABC("title");
    
    this.liste.removeChilds();
    
    for (var i = 0; i < symptome.length; i++){
      this.liste.addRow({ title: symptome[i].title, value: "&nbsp;", farbe: symptome[i].farbwert, caretRight: true, data: symptome[i]});
    }
  }
};

var Eingabe = {
 // VIEW
    
   //DOMELEMENTS
   container:     DOM("eingabeId"),
   goBackButton:  DOM("eingabeBackButton"),
   // gotoSymptome:DOM("favoriteEditId"),
   content:       DOM("eingabeContentId"),
   eingabe:       DOM("strukturierteEingabe"),
   freitext:      DOM("freiText"),
   tipp:          DOM("fieldsetTipp"),

   //VARIABLES
   BACK: App.HOME,
   item: null,
   itemModified: null
   ,
   init: function()
   {
     if (!App.live) console.log( "- VIEW EINGABE");
     
     // container has to be visible before bind or slider will not initialize correctly
     this.container.show();
     
     this.bind();
     
     this.content.invisible();
   }
   ,
   // BINDING
   bind: function()
   {     
      this.goBackButton.on("tangent", function(data)
      {
        if( data.type == "touchend" ) Eingabe.goBack();
      });
      
      DOM("zeitArea").addDatetime(function(value){
      // Zeit
        Eingabe.itemModified = Eingabe.itemModified || Object.create( Eingabe.item );   
        Eingabe.itemModified.x = value;
        
        Eingabe.update(Eingabe.itemModified); 
      });
      
      // Strukurierte Eingabe
      DOM("sliderArea").addSlider(function(value){
      
      if (!Eingabe.itemModified){
        Eingabe.itemModified = Object.create(Eingabe.item);
        Eingabe.itemModified.x = new Date().getTime();
      }
      
      Eingabe.itemModified.y = value;
      // TODO: specifically update containers
        Eingabe.update(Eingabe.itemModified);
      });
      
      // Freitext
      DOM("favTextareaId").on("input", function(data)
      {
        Eingabe.itemModified = Eingabe.itemModified || Object.create( Eingabe.item );      
        Eingabe.itemModified.y = data.value;
        Eingabe.itemModified.x = new Date().getTime();
        
        Eingabe.update( Eingabe.itemModified );
      });
      
      // Actions
      Eingabe.eingabe.find(".blue").on("tangent", function( data ) 
      { 
        // TODO directly assign Eingabe.method
        if( data.type == "touchend" ) Eingabe.saveItemModified(); 
      }); 
      
      Eingabe.eingabe.find(".red").on("tangent", function( data ) 
      { 
        if( data.type == "touchend" ) Eingabe.deleteItem(); 
      });
      
      Eingabe.eingabe.find(".grey").on("tangent", function( data ) 
      { 
        if( data.type == "touchend" ) Eingabe.cancelItemModified();
      });
      
      Eingabe.freitext.find(".lightgrey").on("tangent", function( data )
      {
        if( data.type == "touchend" ) 
        {           
          Eingabe.itemModified = Object.create( Eingabe.item );         
          Eingabe.itemModified.y = "";
          Eingabe.itemModified.x = new Date().getTime();
          
          Eingabe.update( Eingabe.itemModified );
        }
      });
      
      Eingabe.freitext.find(".blue").on("tangent", function(data) 
      { 
        if( data.type == "touchend" ) Eingabe.saveItemModified(); 
      });
      
      Eingabe.freitext.find(".red").on("tangent", function(data) 
      { 
        if( data.type == "touchend" ) Eingabe.deleteItem(); 
      });
      
      Eingabe.freitext.find(".grey").on("tangent", function(data) 
      { 
        if( data.type == "touchend" ) Eingabe.cancelItemModified(); 
      });
     
 
     
     Controller.on(Controller.EINGABE, function(data){
       
       Eingabe.content.hide();
       if (data){
       // Coming from Favorites or Symptom
         Eingabe.BACK = data.back || Controller.HOME;
         Eingabe.item = data;
         Eingabe.itemModified = null;         
       }
       // no data from Tipps
       
       Eingabe.container.swipe("middle").on("stage", function()
       {
         Eingabe.container.off("stage");
         Eingabe.update(Eingabe.itemModified || Eingabe.item);
       });
     });
   },
   
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
   
   update: function(data){
   //
     console.log("EINGABE.update", data);
     
     if (data){
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
   },
   
   deleteItem: function(){
   //
     
     var acts = Model.memory.get("acts");
     var item = Eingabe.item;
     
     for (var i = 0; i < acts.length; i++){
       if (acts[i].id == item.id && acts[i].x == item.x){
         Model.memory.set("deleted", [ acts[i] ]);
         acts.splice(i, 1);
       }
     }
     
     this.goBack();
   },
   
   cancelItemModified: function(){
     Eingabe.itemModified = null;
     Eingabe.update(Eingabe.item);
   },
   
   saveItemModified: function(){
     var item = Eingabe.itemModified;
     
     var act = {
        id: item.id + "",
        x: item.x + "",    
        y: (item.kategorie == "Notizen") ? item.y.replace(/\n/g,"<br>") : item.y
     };
     
     Model.memory.set("acts", [act], ["id", "x"] );

     Eingabe.goBack();
   },
   
   showDefinition: function(data){
     if (!data.grad) return;
     
     for (var i = 0; i < data.grad.length; i++){
       var grad = data.grad[i];
       var y = Math.floor( data.y );
       
       if (y >= grad.min && y <= grad.max){
         DOM("favGradId").html("<b>Definition:</b> " + grad.info);
         this.showTipps(grad);
       }
     }
   },
   
   showTipps: function(grad){
   //
       if (!grad.tipps) return;
       
       var search = grad.tipps.split(",").map(function(ele){
         return { id: ele };
       });
       
       var tipps = Model.memory.get("lexikon").has("id", search).clone();
       
       var rows = DOM("fieldsetTipp").find(".listeNext").removeChilds();
             
       rows.on("tangent", function(data){
         
         if (data.type == "touchstart") DOM(data.target).addClass("selected");
         if( data.type == "touchend")
         {
            var tipp = JSON.parse( data.target.getAttribute("data") );
         
             if (tipp){
                Eingabe.content.hide();
                Eingabe.container.swipe("left");
                Controller.dispatch(Controller.TIPPS, tipp);
             }
         }

       }, { watch: "LI"} );
             
       for (var j = 0; j < tipps.length; j++){
         var tipp = tipps[j];
         
         rows.addRow({
           title: tipps[j].title,
           zeit: tipps[j].kategorie,
           caretLeft: false,
           caretRight: true,
           data: tipps[j]
         });               
       }
       
       DOM("fieldsetTipp").show();
   },
   
   goBack: function(){
     Eingabe.content.hide();
     Controller.dispatch(Eingabe.BACK);
     Eingabe.container.swipe("right");     
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


