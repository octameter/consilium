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
  CATALOG:[],
  SEARCH:[],
  DOCUMENT:[]
  ,
  // MODEL
  model:new Model()
  ,
  // VIEWS
  views:function() {
    Konto.init();
    Search.init();
    Intro.init();
    Result.init();
    Document.init();
  },
  // BINDING 
  bind:function() {
    DOM(window).on("ready", function() {
      App.dispatch( App.READY );
    });
  },
  // ENVIROMENT
  initialize: function( domain ) {
    
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
    this.fachinfo = ( this.live ) ? "http://kompendium.epha.ch" : "http://"+this.domain+":8888/kompendium";
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
    // INIT
    init: function() {
      
      if(!App.live) console.log( "- VIEW Konto");
      if(!App.live && !App.konto) console.log( "Missing App.konto");
      
      DOM(window).on("msg", function( data) {
        Konto.response(data);
      });
      
      if( App.device == "desktop") {
      // CREATE
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
    request: function( data ) {
    // REQUEST
      if( data.request == "REDIRECT") Konto.remote.postMessage( { request:"REDIRECT", target:data.target }, "*"); 
    }
    ,
    response: function(data) {
    // RESPONSE
      if( data.request == "REDIRECT") location.replace(data.target);    
    }
};
