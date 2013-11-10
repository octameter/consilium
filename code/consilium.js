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
  initialize: function(domain){  
    if (!DOM) console.log( "- MODULE DOM required");
    
    kontify(this);
    
    Model.init();
    
    Controller.init();
    
    Intro.init();
    Optionen.init();
    Home.init();
    Favorites.init();
    Symptome.init();
    Eingabe.init();
    Tipps.init();
    
    console.log("- Node Server " + (App.live ? "Live" : "Local"));
    
    Model.memory.set("lexikon", Entities.Symptome, ["id", "kategorie"]);
    Model.memory.set("lexikon", Entities.Bewertung, ["id", "kategorie"]);
    Model.memory.set("lexikon", Entities.Tagebuch, ["id", "kategorie"]);
    Model.memory.set("lexikon", Entities.Device, ["id", "kategorie"]);
    Model.memory.set("lexikon", Entities.Tipps, ["id", "kategorie"]);
    
    // DEV
    console.log("Setting DUMMY data");
    
    Model.memory.set("favorites", [
       { id: "10025482" },
       { id: "Symptom" },
       { id: "10047700", "edit": true },
       { id: "10013963", "edit": true },
       { id: "privat"}
    ]);
    
    Model.memory.set("acts", [
      { id: "10025482", x: "1380725392804", y: "80" },
      { id: "10013963", x: "1380735392804", y: "20" },
      { id: "10013963", x: "1380835392804", y: "50" },
      { id: "10013963", x: "1380935392804", y: "70" },
      { id: "privat", x: "1380745392804", y: "Ein guter Tag<br>morgen" }
    ], ["id", "x"]);
    
    this.bind();
  },
  
  bind: function(){
    
    Controller.on(Controller.SETUP, function(){
      
      // domain, node, origin, live
      App.enviroment();
      
      // tv || tablet || mobile || desktop
      App.device = DOM().device();
      
      App.signOn(function(data){
        Controller.dispatch(Controller.START);
      });
      
    });
  }
  
};

var Controller = {
  
  SETUP:      "SETUP",
  START:      "START",
  HOME:       "HOME",
  OPTIONEN:   "OPTIONEN",
  FAVORITES:  "FAVORITES",
  EINGABE:    "EINGABE",
  SYMPTOME:   "SYMPTOME",
  TIPPS:      "TIPPS",
  
  // ENVIROMENT
  init: function(domain){
    // AUGMENT
    eventify(this);
    
    this.bind();
  },
  
  bind: function(){
    DOM(window).on("ready", function(){
      Controller.dispatch(Controller.SETUP);
    });
  }
  
};

var Model = {

  init: function(){
    storify(this);
  }
  
};

var Intro = {

  container: DOM("introId")
  ,
  init: function()
  {
    if (!App.live) console.log("- VIEW Intro");
    
    introfy(this);
    
    this.setContent();
    
    this.bind();
  }
  ,
  bind: function()
  {
    Controller.on( Controller.START, Intro.update );
    
    DOM("introStartApp").on("tangent", function( data )
    {
      if( data.type == "touchend" )
      {
        Controller.dispatch(Controller.HOME);
        Intro.container.swipe("left");
        Intro.container.hide();
      }
    });
  }
  ,
  setContent: function()
  { 
    this.setTitle("Consilium");

    this.addFeatures([
     {title: "1. Funktion", description: "Consilium ist ein Applikation zur Erfassung von Symptomen und Notizen durch die Patienten. Sie unterstützt die Kommunikation zwischen Arzt und Patient über den gemeinsamen Datenzugriff."},
     {title: "2. Entwicklung", description: "Consilium wurde entwickelt zur Überprüfung des Mehrwerts von Applikationen in der medizinischen Versorgung. Die Studie wird aktuell durchgeführt."},
     {title: "3. Nutzung", description: "Die App kann von allen Interessierten ausprobiert werden. Über „Start“ können die Symptome erfasst werden. "},
     {title: "4. Datenspeicherung", description: "Nur über die Verbindung mit dem Datenspeicher und regelmässigen Synchronisation über „Sync“ können die Eingaben gespeichert werden. Ohne diese Verbindung gehen alle Eingaben nach  Schliessen der App verloren."},
     {
       title: "5. Anonymisierung",
       description: "<p>Nutzer der App erhalten eine Individuelle Patienten-ID, mit der Sie berechtigt sind den Service zu nutzen.</p>"
     }
    ]);
  }
  ,
  update: function()
  {
    
  }
};

/**
 * VIEW OPTIONEN
 */
var Optionen = {

  //DOMELEMENTS
  container:  DOM("optionenId"),
  gotoHome:   DOM("optionenBackButton"),
  content:    DOM("optionenContentId"),
  
  init: function()
  {
    if (!App.live) console.log( "- VIEW Optionen");
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
        Optionen.content.hide();
        Optionen.container.swipe("left");
      }
    });
    
    Controller.on( Controller.OPTIONEN, function()
    {  
      Optionen.container.swipe("middle").on("stage", function()
      {
        Optionen.container.off("stage"); 
        Optionen.content.show();
      });
    });
  }
  ,
  update: function(){
    
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
  gotoFavorites:  DOM("addEingabe"),
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
    this.gotoOptionen.on("tangent", function( data )
    {
      if( data.type == "touchend" )
      {
        Controller.dispatch( Controller.OPTIONEN );
        Home.content.hide();
        Home.container.swipe("right");
      }
    });
    
    this.gotoFavorites.on("tangent", function( data )
    { 
      if( data.type == "touchend" )
      {
        Controller.dispatch( Controller.FAVORITES ); 
        Home.content.hide();
        Home.container.swipe("left");
      }
    });
    
    Controller.on( Controller.HOME, function()
    {    
      Home.container.swipe("middle").on("stage", function()
      {
        Home.container.off("stage");
        Home.update();
      });
    });
    
    Controller.on(Controller.START, function()
    {
      if (!window.device) DOM("titleId").hide();
      
      Home.chart.init();
      Home.form.init();
    
      // KEIN TITLE
      Home.update();
    });
  },
  
  // FUNCTIONS
  update: function()
  {
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
      
      var range = Model.memory.get("acts").sort123("x").clone();
      
      var first = Math.floor( range.shift().x );
      var firstMin = new Date();
      if (first > firstMin.setDate(firstMin.getDate() - 30)) first = firstMin;

      var last  = Math.floor( range.pop().x );
      var lastMax = new Date();
      if (last < lastMax.setDate(lastMax.getDate() + 3)) last = lastMax;

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
    
    update: function(){
      
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
             var y = ( howto.id == "privat" ) ? -16 : 102;
             
             this.board.drawNotizen( this.x( notiz.x) , this.y( y ), 24, 24, howto.farbwert, notiz); 
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

    init: function(){  

    },
    
    update: function(event){

      this.fieldset.find("ul").off("tangent");
      this.fieldset.find("ul").removeChilds();

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
        if (/^\d+$/.test(event.y))
        {
           value = event.y + " " + event.unit;
        }
        else detail = event.y;
        
        this.fieldset.find("ul").addRow({
          title: howto.title,
          zeit: "Am " + util.zeit("dd.mm.yyyy hh:mm", Math.floor( event.x )), 
          caretLeft: false,
          caretRight: true,
          value: value,
          farbe: howto.farbwert,
          detail: detail
        });
        
        this.fieldset.find("ul").on("tangent", function(data){
          
          if( data.type == "touchend" )
          {
            Home.content.hide();
            Home.container.swipe("left");
            
            var item = event;
            item.back = App.HOME;
            
            Controller.dispatch(Controller.EINGABE, item);
          }

         }, { watch: "LI" } );
      } 
      else
      {
        var howto = Model.memory.get("lexikon").has("id", [{ id: "Symptom" }] )[0];
        
        this.fieldset.find("ul").addRow({
          title: howto.title,
          caretLeft: false,
          caretRight: true,
          value: "",
          farbe: ""
          //detail:"Berühren Sie die Datenpunkte in der Timeline für detaillierte Informationen." 
        });
       
        this.fieldset.find("ul").on("tangent", function(data)
        {    
          if( data.type == "touchend" )
          {
            Home.content.hide();
            Home.container.swipe("left");
            Controller.dispatch(Controller.SYMPTOME);
          }
        });
      }
      
      this.fieldset.legend(howto.kategorie);
      
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

var Favorites = {
// VIEW
    
  //DOMELEMENTS
  container:    DOM("favoritesId"),
  gotoHome:     DOM("favoritesBackButton"),
  gotoSymptome: DOM("favoritesEditButton"),
  content:      DOM("favoritesContentId"),
  form:         DOM("favFormId"),
  BACK:         Controller.HOME
  ,
  //INIT
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
    
    Controller.on(Controller.START, function(){
      //Favorites.update();
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
      var legend = Favorites.form.add("fieldset").add("legend").text(kategorie);
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
  fieldset:   DOM("symFieldsetId"),
  BACK:       Controller.Home
  ,
  init: function()
  {
    if (!App.live) console.log( "- VIEW Symptome");
    
    //this.bind();  
    
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
      }
    });     
    
    Controller.on(Controller.SYMPTOME, function(data)
    {     
      data = data || {};
      Symptome.BACK = data.back || Controller.HOME;      
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
    
    var liste = this.fieldset.find("ul").on("tangent", function(data)
    {
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
    
    liste.removeChilds();
    
    for (var i = 0; i < symptome.length; i++){
      liste.addRow({ title: symptome[i].title, value: "&nbsp;", farbe: symptome[i].farbwert, caretRight: true, data: symptome[i]});
    }
  }
};

var Eingabe = {
 // VIEW
    
   //DOMELEMENTS
   container:     DOM("eingabeId"),
   goBackButton:  DOM("eingabeBackId"),
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
     this.bind();
     
     this.container.show();
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
     
     Controller.on(Controller.START, function(data)
     {     
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
     });
     
     Controller.on(Controller.EINGABE, function(data){

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
         
         // TODO only set the slider on view change but not on slider change
         DOM("sliderArea").setSlider(data.y || data.zero );

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
             
       rows.on("touch", function(data){
         var tipp = JSON.parse( data.target.getAttribute("data") );
         
         if (tipp){
            Eingabe.content.hide();
            Eingabe.container.swipe("left");
            Controller.dispatch(Controller.TIPPS, tipp);
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
         Tipps.content.hide();       
         Controller.dispatch(Controller.EINGABE);
         Tipps.container.swipe("right");
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
       if( data.type == "touchend" )
       console.log("TODO TIPP HLFREICH");
     });
     actions.add("a").addClass("button grey floatRight").text("Nicht Hilfreich").on("tangent", function(data)
     {
       if( data.type == "touchend" )
       console.log("TODO TIPP NICHT HLFREICH");   
     });
   }
 };


