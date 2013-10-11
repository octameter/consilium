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
  events: {}
  ,
  // Events
  READY:      "READY",
  HOME:       "HOME",
  OPTIONEN:   "OPTIONEN",
  FAVORITES:  "FAVORITES",
  EINGABE:    "EINGABE",
  SYMPTOME:   "SYMPTOME",
  TIPPS:      "TIPPS",
  
  // MODEL
  model: new Model(),
  
  // VIEWS
  views:function() { 

    Optionen.init();
    Home.init();
    Favorites.init();    
    Symptome.init();
    Eingabe.init();
    Tipps.init();
  }
  ,
  // BINDING 
  bind: function(){
    DOM(window).on("ready", function(data){
      DOM("app").show();
      App.dispatch(App.READY);
    });
  }
  ,
  // ENVIROMENT
  initialize: function( domain ) 
  {  
    if(!DOM) console.log( "- MODULE DOM required");
    
    this.device = DOM().device();
    
    App.live = Node.init( domain );
    
    Node.navigation();
    
    (App.live) ? console.log("- Node Server Live") : console.log( "- Node Server Local");
    
    this.model.setData("lexikon", Entities.Symptome, ["id","kategorie"] );
    this.model.setData("lexikon", Entities.Bewertung, ["id","kategorie"] );
    this.model.setData("lexikon", Entities.Tagebuch, ["id","kategorie"]);
    this.model.setData("lexikon", Entities.Device, ["id","kategorie"]) ;
    this.model.setData("lexikon", Entities.Tipps, ["id","kategorie"]) ;
    
    this.views();
    this.bind();
    
    console.log("setting data");
    // TODO

    
    // DEV
    App.model.setData("favorites",
    [
       {id : "10025482"},
       {id : "Symptom" },
       {id : "10047700", "edit":true},
       {id : "10013963", "edit":true},
       {id : "privat"}  
    ]);
    
    // DEV
    App.model.setData("acts",
    [
      { id:"10025482", x:"1380725392804", y:"80" },
      { id:"10013963", x:"1380735392804", y:"20" },
      { id:"10013963", x:"1380835392804", y:"50" },
      { id:"10013963", x:"1380935392804", y:"70" },
      { id:"privat", x:"1380745392804", y:"Ein guter Tag<br>morgen" }
    ], ["id","x"]);
  }
};

/**
 * VIEW OPTIONEN
 */
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
  //INIT
  init:function() 
  {
    this.test();
    this.bind();  
    
    this.container.show();
    this.content.hide();
  }
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
      Home.chart.init();
      Home.form.init();
    
      Home.update();    
    });
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
  	right:5,
  	left:5,
  	bottom:30
    ,
    x: function( ms ) 
    { return Math.floor( this.left + ( ms - this.minInMs ) / this.xInMs); }
    ,
    y: function( value ) 
    { return Math.floor( this.top + ( value - this.minInValue ) / this.yInValue); }
    ,
    init:function() 
    {        
      this.board.removeChilds();
      
      var range = App.model.getData("acts").sort123("x").clone();
      
      var first = Math.floor( range.shift().x );      
      var firstMin = new Date();
      if( first > firstMin.setDate(firstMin.getDate() - 30) ) first = firstMin;

      var last  = Math.floor( range.pop().x );
      var lastMax = new Date();
      if( last < lastMax.setDate(lastMax.getDate() + 3) ) last = lastMax;

      this.minInMs = util.zeit("midnight", first);
      this.maxInMs = util.zeit("midnight", last);
      this.realInMs = util.zeit();
      
      this.board.attrib( "width", this.x( this.maxInMs ) + this.right );
      this.board.attrib( "height", this.y( this.maxInValue ) + this.bottom );       
 
      // xMin, xMax, xStep, yMin, yMax, yStep, minInMs, xInMs
      this.board.timeGrid
      ( 
          this.x( this.minInMs ), this.x( this.maxInMs ), this.stepInMs / this.xInMs,
          this.y( this.minInValue ), this.y( this.maxInValue ), this.stepInValue / this.yInValue,
          this.minInMs, this.xInMs 
      );
      
      //xMin, xMax, xStep, y
      this.board.timeLegend
      ( 
          this.x( this.minInMs ), this.x( this.maxInMs ), 
          this.stepInMs / this.xInMs, this.y( 100 ),
          this.minInMs, this.xInMs 
      );
      
      this.board.on("touch", function(data) {
        Home.form.update( data.dataTransfer );
      });
      
      // Fast ganz nach Rechts     
      var rechts = this.x( this.maxInMs - 86400000 );
      Home.chart.scroll( rechts );         
    }
    ,
    update:function() {
      
      this.board.findAll(".movePoint").remove();
      
      // Symbole
      for( var id in  App.model.getData("acts").unique("id") )
      {
        var howto = App.model.searchData("lexikon", id )[0];
        
        var acts = App.model.getData("acts").has("id", [ {id:id} ] ).sort123(); 
        
        var todo = acts.length;
        
        if( howto.kategorie == "Symptom" || howto.kategorie == "Bewertung" )
        {  
          var prev = null;
          
          while( todo-- )
          {
            var act = acts.pop();

            this.board.drawSymptom( this.x( act.x ), this.y( 100 - act.y ), 17, howto.farbwert, act);
                      
            // Less than 3 days apart
            if( prev && Number(prev.x) < Number(act.x) + 3 * 86400000 )
            this.board.drawConnect( this.x( act.x ), this.y( 100 - act.y ), this.x( prev.x), this.y(100- prev.y), 19, howto.farbwert );

            prev = Object.create( act );
          }          
        }        
        else if( howto.kategorie == "Notizen" )
        {
           while( todo-- )
           {
             var notiz = acts.pop();
             // Above or below timegrid
             var y = ( howto.id == "privat" ) ? -16 : 102;
             
             this.board.drawNotizen( this.x( notiz.x) , this.y( y ), 24, 24, howto.farbwert, notiz); 
           }
        }  
      }
    }
    ,
    // TIME
    scroll:function( to )
    {
      var status = Home.chart.scroller.get("scrollLeft");
      // 100 is padding
      var strecke = to - Home.container.width() - status + 100; 
      
      Home.chart.scroller.scrollTo("scrollLeft", strecke, 2000);
    }    
  }
  ,
  form: {

    fieldset:DOM("homeFieldsetAuswahl")
    ,
    init:function()
    {  

    }
    ,
    update:function( event ) 
    {

      this.fieldset.find("ul").off("touch");
      this.fieldset.find("ul").removeChilds();

      if( event )
      {
        var howto = App.model.getData("lexikon").has("id", [{ id: event.id }] )[0];
        
        // Augment event
        event.zero = howto.zero;
        event.unit = howto.unit;
        event.title = howto.title;
        event.kategorie = howto.kategorie;
        event.grad = howto.grad;
        
        var detail = "";
        var value = "&nbsp";
        if( /^\d+$/.test(event.y))
        {
           value = event.y + " " + event.unit;
        }
        else detail = event.y;
        
        this.fieldset.find("ul").addRow( 
        {
          title:howto.title,
          zeit:"Am "+util.zeit("dd.mm.yyyy hh:mm", Math.floor( event.x )), 
          caretLeft:false,
          caretRight:true,
          value: value,
          farbe:howto.farbwert,
          detail:detail
        });
        
        this.fieldset.find("ul").on("touch", function(data) 
        {    
          Home.content.hide();
          Home.container.swipe("left");
          
          var item = event;
          item.back = App.HOME;
          
          App.dispatch( App.EINGABE, item );
         }
         ,{ watch:"LI" } );
      } 
      else
      {
        var howto = App.model.getData("lexikon").has("id", [{ id: "Symptom" }] )[0];
        
        this.fieldset.find("ul").addRow( 
        {
          title:howto.title,
          caretLeft:false,
          caretRight:true,
          value:"",
          farbe:"",
          //detail:"Berühren Sie die Datenpunkte in der Timeline für detaillierte Informationen." 
        });
       
        this.fieldset.find("ul").on("touch", function(data) 
        {    
          Home.content.hide();
          Home.container.swipe("left");
          App.dispatch(App.SYMPTOME);
        });
      }
      
      this.fieldset.legend( howto.kategorie );
      
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
  BACK:         App.HOME,
  
  // TEST
  test: function(){
    if (!App.live) console.log( "- VIEW Favorites");
    if (!App.live && !App.FAVORITES) console.log( "Missing: App.FAVORITES");
  },
  
  // BINDING
  bind: function(){       
    this.gotoHome.on("touch", function(){      
      Favorites.content.hide();
      App.dispatch( App.HOME ); // Favorites.BACK ???
      Favorites.container.swipe("right");
    });     
    
    this.gotoSymptome.on("touch", function(){    
      Favorites.update(true);
      Favorites.gotoSymptome.text("back");
    });     
    
    App.on( App.FAVORITES, function( data ){

      data = data || {};
      Favorites.BACK = data.back || App.HOME;
      Favorites.update();
      
      Favorites.container.swipe("middle").on("stage", function(){
        Favorites.content.show();
      });
    });
    
    App.on( App.READY, function(){
      //Favorites.update(); 
    });
  },
  
  //INIT
  init: function(){
    this.test();
    this.bind();  
    
    this.container.show();
    this.content.hide();
  },
  
  update: function(edit){
    
    Favorites.form.removeChilds();
    
    // TODO review
    // var lexiFav = App.model.getData("lexikon").has("id", App.model.getData("favorites") );

    var data = App.model.getData("lexikon").merge("id", App.model.getData("favorites") );
    var lexiFav = data.has("id", App.model.getData("favorites") );
    
    // EACH FAVORIT GETS FIELDSET
    for (var kategorie in lexiFav.unique("kategorie")){
      var legend = Favorites.form.add("fieldset").add("legend").text(kategorie);
      var rows = legend.addNext("ul").addClass("listeNext");
      var entities = lexiFav.has("kategorie", [{ "kategorie": kategorie}] );
      var editables = entities.has("edit", [{ edit: true }] );

      if (!edit) rows.on("touch", function(data){
        // TODO Bubbling
        var item = JSON.parse(data.element.getAttribute("data"));
        
        if (item){
          Favorites.content.hide();
          item.back = App.FAVORITES;
          Favorites.container.swipe("left");
         
          App.dispatch((item.id == "Symptom" ? App.SYMPTOME : App.EINGABE), item);
        }
      }, { watch: "LI" });
      
      for (var i = 0; i < entities.length; i++){
          var params = {};
          params.title = entities[i].title;
          
          if (edit){
            var editableItem = editables.has("id", [{ id: entities[i].id }] );

            if (editableItem.length > 0){
              params.callback = function(){
                console.log("TODO: DELETE", this.id);
              }.bind({
                id: entities[i].id
              });
            }
            
            rows.addRemovableRow(params);
            
          } else {
            
            params.farbe = entities[i].farbwert;
            params.caretRight = true;
            params.data = entities[i];
            params.value = "&nbsp;";
            
            var acts = App.model.getData("acts").has("id", [{ id: entities[i].id }] );
            
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
  BACK:App.Home,
  
  // TEST
  test:function() 
  {
    if(!App.live) console.log( "- VIEW Symptome");
    if(!App.live && !App.EINGABE) console.log( "Missing: App.EINGABE");
    if(!App.live && !App.SYMPTOME) console.log( "Missing: App.SYMPTOME");
  },
  
  // BINDING
  bind:function() 
  {       
    this.gotoHome.on("touch", function() {      

      Symptome.content.hide();
      Symptome.container.swipe("right");
      App.dispatch( Symptome.BACK );     
    });     
    
    App.on( App.SYMPTOME, function(data) {   
      
      data = data || {};
      
      Symptome.BACK = data.back || App.HOME;
      
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
      var item = JSON.parse( data.element.getAttribute("data") );
      
      if( item )
      {
        Symptome.content.hide();
        Symptome.container.swipe("left");
        App.model.setData("favorites", [ { id:item.id, edit:true } ]);
        item.back = App.SYMPTOME;
        App.dispatch( App.EINGABE,  item );
      }
    }
    , {watch:"LI"});
    
    var symptome = App.model.searchData( "lexikon", "Symptom" ).notIn( "id", App.model.getData("favorites") );
    
    symptome.sortABC("title");
    
    liste.removeChilds();
    
    for( var i = 0; i < symptome.length; i++)
    {
      liste.addRow({ title:symptome[i].title, value:"&nbsp;", farbe:symptome[i].farbwert, caretRight:true, data:symptome[i]})
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
   itemModified: null,
   
   //INIT
   init: function(){

     this.test();
     this.bind();
     
     this.container.show();
     this.content.invisible();
   },
   
   // TEST
   test: function(){
     
     if (!App.live) console.log( "- VIEW EINGABE");
     if (!App.live && !App.FAVORITES) console.log( "Missing: App.FAVORITES");
     if (!App.live && !App.EINGABE) console.log( "Missing: App.EINGABE");
     if (!App.live && !App.SYMPTOME) console.log( "Missing: App.SYMPTOME");
     
   },
   
   // BINDING
   bind: function(){
     
      this.goBackButton.on("touch", function(){
        Eingabe.goBack();
      });
     
/*     this.gotoSymptome.on("touch", function() {
       App.dispatch( App.SYMPTOME );
       Eingabe.container.swipe("left");
     });*/
     
     App.on( App.READY, function(data){
     
       DOM("zeitArea").addDatetime( function( value ){
         // Zeit
         Eingabe.itemModified = Eingabe.itemModified || Object.create( Eingabe.item );   
         Eingabe.itemModified.x = value;
         
         Eingabe.update( Eingabe.itemModified ); 
       });
       
       // Strukurierte Eingabe
       DOM("sliderArea").addSlider( function(value){
         
         if (!Eingabe.itemModified){
           Eingabe.itemModified = Object.create( Eingabe.item );
           Eingabe.itemModified.x = new Date().getTime();
         }
         
         Eingabe.itemModified.y = value;
         Eingabe.update( Eingabe.itemModified );      
       });

       // Freitext
       DOM("favTextareaId").on("input", function(data){
         Eingabe.itemModified = Eingabe.itemModified || Object.create( Eingabe.item );      
         Eingabe.itemModified.y = data.value;
         Eingabe.itemModified.x = new Date().getTime();
         
         Eingabe.update( Eingabe.itemModified );
       });
       
       // Actions
       Eingabe.eingabe.find(".blue").on("touch", function() { Eingabe.saveItemModified(); }); // TODO directly assign Eingabe.method
       Eingabe.eingabe.find(".red").on("touch", function() { Eingabe.deleteItem(); });
       Eingabe.eingabe.find(".grey").on("touch", function() { Eingabe.cancelItemModified();});

       Eingabe.freitext.find(".lightgrey").on("touch", function( data ){
         Eingabe.itemModified = Object.create( Eingabe.item );         
         Eingabe.itemModified.y = "";
         Eingabe.itemModified.x = new Date().getTime();
         
         Eingabe.update( Eingabe.itemModified );
       });      
       Eingabe.freitext.find(".blue").on("touch", function() { Eingabe.saveItemModified(); });
       Eingabe.freitext.find(".red").on("touch", function() { Eingabe.deleteItem(); });
       Eingabe.freitext.find(".grey").on("touch", function() { Eingabe.cancelItemModified(); });
     });
     
     App.on( App.EINGABE, function(data){
     //
       if (data){
       // Coming from Favorites or Symptom
         
         Eingabe.BACK = data.back || App.HOME;
         Eingabe.item = data;
         Eingabe.itemModified = null;         
       }
       // no data from Tipps
       
       Eingabe.container.swipe("middle").on("stage", function(){
         Eingabe.update( Eingabe.itemModified || Eingabe.item );
       })
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
   
   update:function(data){
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
       else if ( data.y != "" )
       {  
         this.content.findAll(".blue").hide();
         this.content.findAll(".grey").hide();
         this.content.findAll(".red").show();
         this.content.findAll(".favActions").show();
       }

       if(data.kategorie == "Notizen"){
         this.freitext.show();

         this.freitext.find("legend").html( data.kategorie );
         this.freitext.find(".favTitle").html( data.title );
         DOM("zeitArea").setDatetime( data.x );
         DOM("favTextareaId").set("value", (data.y) ? data.y.replace(/<br>/g, "\n") : "" );       
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
         DOM("sliderArea").setSlider(data.y || data.zero );

         this.showDefinition( data );
       }
     }    
     this.content.show();
   },
   
   deleteItem: function(){
   //
     
     var acts = App.model.getData("acts");
     var item = Eingabe.item;
     
     for( var i = 0; i < acts.length; i++)
     {
       if( acts[i].id == item.id && acts[i].x == item.x)
       {
         App.model.setData("deleted", [ acts[i] ]);
         acts.splice(i,1);
       }
     }
     
     this.goBack();
   },
   
   cancelItemModified: function(){
   //
     Eingabe.itemModified = null;
     Eingabe.update(Eingabe.item);
   },
   
   saveItemModified: function(){
   //
     var item = Eingabe.itemModified;
     
     var act = {
        id: item.id+"",
        x: item.x+"",    
        y: (item.kategorie == "Notizen") ? item.y.replace(/\n/g,"<br>") : item.y
     };
     
     App.model.setData("acts", [ act ], ["id","x"] );

     Eingabe.goBack();
   },
   
   showDefinition: function(data){
   //
     if( !data.grad ) return;
     
     for( var i = 0; i < data.grad.length; i++) 
     {
       var grad = data.grad[i];
       var y = Math.floor( data.y );
       
       if( y >= grad.min && y <= grad.max )
       {
         DOM("favGradId").html("<b>Definition:</b> " + grad.info);
         
         this.showTipps(grad);
       }
     }
   },
   
   showTipps: function(grad){
   //
       if (!grad.tipps) return;
       
       var search = grad.tipps.split(",").map( function(ele) { return { id: ele }; });
       
       var tipps = App.model.getData("lexikon").has("id", search).clone();
       
       var rows = DOM("fieldsetTipp").find(".listeNext").removeChilds();
             
       rows.on("touch", function(data){    
         var tipp = JSON.parse( data.element.getAttribute("data") );
         
         if (tipp){
            Eingabe.content.hide();
            Eingabe.container.swipe("left");
            App.dispatch(App.TIPPS, tipp);
         }
       }, 
       { watch: "LI"} );
             
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
     App.dispatch(Eingabe.BACK);
     Eingabe.container.swipe("right");     
   }
   
};


var Tipps = {
 // VIEW
    
   //DOMELEMENTS
   container:   DOM("tippId"),
   gotoEingabe: DOM("tippBackButton"),
   content:     DOM("tippContentId"),
   
   // TEST
   test:function() 
   {
     if (!App.live) console.log( "- VIEW Tipps");
     if (!App.live && !App.EINGABE) console.log( "Missing: App.EINGABE");
     if (!App.live && !App.TIPPS) console.log( "Missing: App.TIPPS");
   },
   
   // BINDING
   bind:function() 
   {       
     this.gotoEingabe.on("touch", function() {      
       
       Tipps.content.hide();
       
       App.dispatch(App.EINGABE);
       Tipps.container.swipe("right");
     });     
     
     App.on( App.TIPPS, function(data) {
       
       Tipps.update( data );
       
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
   update:function(data)
   {
     this.content.removeChilds();
     
     var display = this.content.add("form").add("fieldset").style("text-align","left").add("legend").text( data.kategorie ).parent();
     
     display.add("p").html("<b>"+data.title+"</b>");
     
     for( var i = 0; i < data.bausteine.length; i++)
     {       
       var baustein = data.bausteine[i];
       
       for( var info in baustein )
       {
         display.add("p").add("div").html("<i>"+info+"</i>").addNext("div").html( baustein[info]).addClass("borderTop");    
       }
     }
     
     var actions = display.add("p");
     actions.add("a").addClass("button-action green floatLeft").text("Hilfreich").on("touch", function( data )
     {
       console.log("TODO TIPP HLFREICH");
     });
     actions.add("a").addClass("button-action grey floatRight").text("Nicht Hilfreich").on("touch", function( data )
     {
       console.log("TODO TIPP NICHT HLFREICH");   
     });
   }
 };


