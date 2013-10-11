var Node = {
  
  init:function( domain )
  {      
    if( document.domain == domain || window.device) 
    {
      this.domain = document.domain = "epha.ch";
      this.server = "https://node.epha.ch";
      this.live = true;
    }
    else 
    {
      document.domain = document.domain;
      this.server = "http://"+document.domain+":8080";
      this.live = false;  
    }
    
    this.navigation();
    
    return this.live;
  }
  ,
  navigation:function() {
  
    //if( window.device ) return;
    console.log ("!!!",DOM(document).find("body").addPrevious("header") ); 
  }
};

/**
    <header id="xauth" class="konto"></header>

return this.add( "iframe", { src: url, style: "position:fixed; top:0px; width:100%; height:42px; border:none;"} );

          
DOM(window).on("msg", function( data) {  Konto.response(data); });

var Konto = {
    
    // DOMELEMENTS

    container: DOM( "xauth" )
    ,
    remote:null
    ,
    // TEST
    test:function() 
    {
      if(!App.live) console.log( "- VIEW Konto");
      if(!App.live && !App.konto) console.log( "Missing App.konto");           
    }
    ,
    // INIT
    init: function() 
    {    
      this.test();
      
      this.container.hide();
      
      App.on( App.READY, function() 
      {
        // WEB mit KONTO
        if( App.device == "desktop") 
        {
          Konto.body.style("margin-top", "42px");

          
          // FIRST QUERY
          Konto.remote = DOM()navigation( App.node ).on( "load", function(data) 
          {
            Konto.container.show();        
            
          }).get("contentWindow");        
        }
        // PHONEGAP 
        else if( window.device )
        {
          //IPHONE 7 FIX STATUSBAR
          if( 
              window.device.phonegap == "3.0.0" && 
              window.device.platform == "iPhone" && 
              parseFloat(window.device.version) === 7.0 
            )
          {
            Konto.body.style("margin-top", "20px");
            Konto.container.hide();               
          }
        }
        else {
          Konto.body.style("top", "0px");
        }
      });
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


    
    if(!App.live && !new Node) console.log( "- MODULE Node required");
**/