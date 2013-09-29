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
    this.content.show();
  }
  ,
  // FUNCTIONS
  update:function()
  {
    
    
    Home.content.show();
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
