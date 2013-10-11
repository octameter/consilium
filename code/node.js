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
    
    this.navi();
    
    return this.live;
  }
  ,
  navi:function() {
  
    if( window.device ) {
      //IPHONE 7 FIX STATUSBAR
      if( 
          window.device.phonegap == "3.0.0" && 
          window.device.platform == "iPhone" && 
          parseFloat(window.device.version) === 7.0 
        )
        {
          DOM(document).find("body").style("margin-top", "20px");  
        }    
    }else 
    { 
      this.createNavi(); 
    }
  }
  ,
  createNavi:function() {
         
    var first = DOM(document).find("body").find("article");
    
    var iframe =first.addPrevious("header").addClass("konto").add("iframe", 
    {
      src: this.server,
      style: "position:fixed; top:0px; width:100%; height:42px; border:none;"
    });
    
    iframe.on("load", function() 
    { 
      // CALL
      // sso.postMessage( { request:"REDIRECT", target:data.target }, "*"); 
      Node.sso = iframe.get( "contentWindow" );
      
      DOM(document).find("body").style("margin-top", "42px");
      
      DOM(window).on("msg", function( data) {  
        if( data.request == "REDIRECT") location.replace(data.target); 
      });
    });
  }
  ,
  getActor:function( params, callback )
  {
    if( window.device )
    {
      var result = JSON.parse( localStorage.getItem("device_actor") );
      callback( result );
    }
    else
    {
      Node.sso.postMessage({request: "ACTOR_GET"}, "*");
      DOM(window).on("msg", function( data ) {  
        if( data.request == "ACTOR_GET") callback( data ); 
      });
    }   
  }
  ,
  setActor:function( params, callback )
  {
      this.query( "GET", "/authenticate?"+urlVariables, callback);
  }
  ,
  /**
  * SERVER
  */
  readActorsByCredential: function(urlVariables, success, error){
	this.query( "GET", "/authenticate?"+urlVariables, success, error);
  }
  ,
  readActorByRequestToken : function( token, success, error ){
	this.query( "GET", "/authorize?requestToken=" + token, success, error);
  }
  ,
  findActorsForRoleId : function() {}
  ,
  findActorsForScopeId: function( scopeId, accessToken, success, error ){
	var uri = "/actors/scopeId/"+scopeId;
	this.query("GET", uri, success, error, null, accessToken);
  }
  ,
  findActorForId: function() {}
  ,
  updateActorById: function( id, data ,success, error ){
	var uri = "/actors/"+id;	
	this.query("PUT", uri, success, error, data );		
  }
  ,
  listActsForAntagonistId: function( antagonistId, since, success, error){
	var uri = "/acts/antagonistId/" + antagonistId;
	uri += ( since ) ? "?since="+since : "";
	this.query( "GET", uri, success, error);
  }
  ,
  createAct: function( act, success, error ){
	var uri = "/acts";
	this.query( "POST", uri, success, error, act);
  }
  ,
  readAct: function() {}
  ,
  updateAct: function() {}
  ,
  deleteAct: function( act, success, error) {
	var uri = "/acts/"+act.id;
	this.query( "DELETE", uri, success, error);
  }
  ,
  actLikeEntity: function( id, entitiesId, success, error ) {
	var uri = "/acts/"+id+"/like/"+entitiesId;	
	this.query("GET", uri, success, error);
  }
  ,
  actDislikeEntity: function( id, entitiesId, success, error ) {
	var uri = "/acts/"+id+"/dislike/"+entitiesId;
	this.query("GET", uri, success, error);
  }
  ,
  actClickEntity: function( id, entitiesId, success, error ) {
	var uri = "/acts/"+id+"/click/"+entitiesId;
	this.query("GET", uri, success, error);
  }
  ,
  findEntities: function() {}
  ,
  findEntitiesById: function() {}
  ,
  findEvaluationForEntity: function( id, contextId, success, error){	
	var uri = "/entities/"+id+"/evaluation/"+contextId;
	this.query("GET", uri, success, error);		
  }
  ,
  getDevice: function( id, type, since, protagonistId, antagonistId,  success, error){
	var uri = "/logo/"+id+"/"+type;
	if( since || protagonistId || antagonistId ) uri += "?";
	if( since ) uri += "since="+since;
	if( protagonistId ) uri += "&protagonistId="+protagonistId;
	if( antagonistId ) uri += "&antagonistId="+antagonistId;
	this.query("GET", uri, success, error);
  }
  ,
  list: function( success, error){	
	var uri = "/master/list";
	this.query("GET", uri, success, error);		
  }
  ,
  listAtc: function( code, success, error){	
      code = encodeURIComponent(code);
      var uri = "/master/"+code;
      this.query("GET", uri, success, error);		
  }
  ,
  listForm: function( code, success, error){	
      code = encodeURIComponent(code);
      var uri = "/master/"+code+"/form";
      this.query("GET", uri, success, error);		
  }
  ,
  listName: function( code, form, success, error){	
      code = encodeURIComponent(code);
      form = encodeURIComponent(form);
      var uri = "/master/"+code+"/"+form+"/name";
      this.query("GET", uri, success, error);		
  }
  ,
  listMenge: function( code, form, name, success, error){	
      code = encodeURIComponent(code);
      form = encodeURIComponent(form);
      name = encodeURIComponent(name); 
      var uri = "/master/" + code + "/" + form + "/" + name + "/menge";
      this.query("GET", uri, success, error);		
  }
  ,
  /**
   * QUERY NODE SERVER
   * @param method
   * @param uri
   * @param success
   * @param error
   * @param data
   * @param accessToken
   *  * Holds the status of the XMLHttpRequest. Changes from 0 to 4: 
   * 0: request not initialized 
   * 1: server connection established
   * 2: request received 
   * 3: processing request 
   * 4: request finished and response is ready
   */
  query: function( method, uri, callback, data, accessToken){
    this.ajax( method, this.server + uri, callback, data, accessToken );
  }
  ,
  ajax: function( method, uri, callback, data, accessToken) { 
    
    if (method == "GET" && typeof data == "object"){
      uri += "?" + this.toQuery(data);
    }
    var request = new XMLHttpRequest() || ActiveXObject("MSXML2.XMLHTTP.3.0");
    request.open( method, uri, true);
    
    if( data )
    request.setRequestHeader("Content-Type", "application/json");
    
    if( accessToken ) 
    request.setRequestHeader("Authorization", accessToken);
      
    request.onreadystatechange = function(){   
      if( request.readyState == 4){                 
        if( request.status == 200 && request.responseText) 
        callback( { status: request.status, message:JSON.parse( request.responseText ) } );
        else 
        callback( { status: request.status, message:request.statusText } ); 
      }
    };
    request.send( JSON.stringify( data ) );
  }
  ,
  toQuery: function(data) {
    var query = [];
    for (var key in data){
      query.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
    }
    return query.join("&");
  }
  ,
  form: function( method, uri, params ) {
    var form = DOM().fragment("form");
    form.attrib("method", method);
    form.attrib("action", uri);
    
    for( var key in params) {
      if(params.hasOwnProperty(key)) {
        form.add("input").attrib("type", "hidden").attrib("name", key).attrib("value", params[key] );
      }
    }
    form.element.submit();
  }
};

