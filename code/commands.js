/**
 * Created by Marco Egbring on March 2013
 * Copyright 2013 EPha.ch. All rights reserved.
 */

/**
 * COMMANDS
 * @param data
 */
Events = 
{
	TAP_HANDLER:"tap_handler",
	DATE:"input_date",
	ROW:"row_command",
	CHART_OVERLAY:"chart_overlay",
	CHANGE_VIEW:"change_view",
	HIDDEN:"hidden",
	REQUEST:"request",
	RESPONSE:"response",
	SYNC:"sync",
	SYNC_RESULT:"sync result",
		
	START:"start",
	INFO_START:"info_start",
	
	HOME_INIT:"homeInit",
	HOME_EXIT:"homeExit",
	HOME_INTRO:"homeIntro",
	HOME_VERLAUF:"refreshChart",
	HOME_VERLAUF_SELECTED:"home_verlauf_selected",
	HOME_TO_OPTIONEN:"homeToOptionen",
	HOME_TO_FAVORITES:"homeToFavorites",
	HOME_TO_FAVORITE:"home_to_favorite",
	
	OPTIONEN_INIT:"optionenInit",
	OPTIONEN_TO_HOME:"optionenToHome",
	SCAN:"scan",
	SCAN_RESULT:"scan_result",

	FAVORITES_INIT:"favorites_init",
	FAVORITES_ROW:"favorites_row",
	FAVORITES_EDIT:"favorites_edit",
	FAVORITES_DELETE:"favorites_delete",
	FAVORITES_CHANGE:"favorites_Change",
	FAVORITES_TO_HOME:"favorites_to_home",
	FAVORITES_TO_FAVORITE:"favorites_to_favorite",
	FAVORITES_TO_SYMPTOME:"favorites_to_symptome",
	TEXT_CHANGE:"text_change",
	SLIDER:"slider",
	
	FAVORITE_INIT:"favorite_init",
	FAVORITE_SAVE:"favorite_save",
	FAVORITE_CANCEL:"favorite_cancel",
	FAVORITE_CHANGE:"favorite_change",
	FAVORITE_BACK:"favorite_back",
	FAVORITE_SAVE:"favorite_save",
	FAVORITE_DELETE:"favorite_delete",
	FAVORITE_TEXT_CHANGE:"favorite_text_change",
	FAVORITE_TO_FAVORITES:"favorite_to_favorites",
	FAVORITE_TO_HOME:"favorite_to_home",
	FAVORITE_TO_TIPP:"favorite_to_tip",
	
	TIPPS_SHOW:"tipps_show",
	TIPP_SHOW:"tipp_show",
	TIPPS_SELECTED:"tipps_selected",
	TIPP_INIT:"tipp_init",
	TIPP_LIKED:"tipp_liked",
	TIPP_EXIT:"tipp_exit",
	TIPP_TO_FAVORITE:"tipp_to_favorite",
	
	SYMPTOME_INIT:"symptome_init",
	SYMPTOME_EXIT:"symptome_exit",
	SYMPTOME_TO_FAVORITES:"symptomeToFavorites",
};

/** 
 * CHANGE VIEW 
 * NO EVENT DATA
 */
function changeViewCommand( event )
{	
	var cmd = this.properties;
	
	DOM( cmd.to ).attrib("className").replace(/(top|left|right)/, "middle");	
	DOM( cmd.from.split("Id").join("ContentId") ).hide();
	DOM( cmd.from ).attrib("className").replace("middle", cmd.direction );		
};

function hiddenCommand( data )
{
	if( !data.hidden ) location.reload();
};

function startCommand( event )
{	
	// CLIENTWIDTH AVAILABLE
	DOM( "app" ).show();
	
	// LOCAL STORAGE
	if( app.client == "DEVICE" ) dispatchCommand( Events.REQUEST, { "request":"ACTOR_GET"} );
	
	// REMOTE STORAGE
	if( app.client == "DESKTOP")
	{
		// HANDLER FOR STROAGE RESULTS
		DOM( window ).onMSG( Events.RESPONSE );

		DOM().onWindow( Events.HIDDEN, {});
		
		DOM("app").style("top","40px");
		
		DOM("xauth").addChild( "iframe", { id:"apiId", src : app.konto, style:"position:fixed; width:100%; height:42px; border:none;"} ).onLoad( Events.REQUEST, { "request":"ACTOR_GET"} );
		
		app.storage = document.getElementById( "apiId" ).contentWindow;
	}
};

function requestCommand( data )
{
	if( app.client == "DEVICE" )
	{
		if( data.request == "ACTOR_GET") 
		{		
			data.actor = JSON.parse( localStorage.getItem("device_actor") );
		}

		 // ACTOR RECEIVED FROM NODE VIA QR-CODE		
		if( data.request == "ACTOR_UPDATE")
		{
			var lokal = JSON.parse( localStorage.getItem("device_actor") );
			
			// TODO
			if( lokal.upToDate > data.actor.upToDate && false)
			{
				data.actor.favoritesObject = lokal.favoritesObject;			
				data.actor.customerObject = lokal.customerObject;			
				data.actor.upToDate = lokal.upToDate;
			}
		}

		if( data.request == "ACT_SAVE")
		{
			this.model.addPunkt( data.act );
						
			localStorage.setItem( "device_acts", JSON.stringify( this._data["acts"] ));	
		}
		
		
		// NO PATIENT_GET
		if( data.request == "ACTS_GET")
		{
			if( localStorage.getItem("device_acts") ) 
			this.model._data["acts"] = JSON.parse( localStorage.getItem("device_acts") );		
		}
		
		if( data.request == "FAVORITES_SAVE")
		{
			localStorage.setItem( "device_actor", JSON.stringify( this.model.getProtagonist() ));	
		}
		// ENTITIY EVALUATION
		
		dispatchCommand( Events.RESPONSE, data);
	}
	
	if( app.client == "DESKTOP" )
	{
		if( data.request == "ACTOR_GET") app.storage.postMessage( { request:"ACTOR_GET" }, "*");	

		if( data.request == "PATIENT_GET") app.storage.postMessage( { request:"PATIENT_GET" }, "*");		
		
		if( data.request == "ACTS_GET")	app.storage.postMessage( { request:"ACTS_GET", antagonistId:data.antagonistId }, "*");	
		
		if( data.request == "REDIRECT")	app.storage.postMessage( { request:"REDIRECT", target:data.target }, "*");	
		
		if( data.request == "ACT_SAVE") 
		{
			this.model.addPunkt( data.act );
			
			app.storage.postMessage( { request:"ACT_SAVE", 
				
				act:{
					protagonistId:1,
					antagonistId:2,
					entitiesId:data.act.id,
					zeit:data.act.x,
					wert:data.act.y
				}
			
			}, "*" );
			
		}
		
		if( data.request == "FAVORITES_SAVE")
		{
			var payload = {
				id : this.model.getProtagonist().id,
				favoritesObject : this.model.getProtagonist().favoritesObject
			};
			
			app.storage.postMessage( { request:"FAVORITES_SAVE", protagonist:payload }, "*");				
		}
		
		if( data.request == "ENTITY_EVALUATION")
		{
			app.storage.postMessage( { request:"ENTITY_EVALUATION", tipp:data.tipp}, "*");
		}
	}
};

function responseCommand( data )
{
	if( app.client == "DEVICE")
	{
		if( data.request == "ACTOR_GET") 
		{
			// DEFAULT OR REAL ACTOR AVAILABLE
			this.model.setProtagonist( data.actor );			
			
			localStorage.setItem("device_actor", JSON.stringify( this.model.getProtagonist() ) );
			
			dispatchCommand( Events.REQUEST, { request:"ACTS_GET", antagonistId:this.model.getProtagonist().id } );
		}
		
		if( data.request == "ACTOR_UPDATE")
		{
			this.model.setProtagonist( data.actor );
			
			localStorage.setItem("device_actor", JSON.stringify( this.model.getProtagonist() ) );
			
			this.model.setIntro( data.actor.scope );
			
			dispatchCommand( Events.OPTIONEN_INIT, { status: "Erfolgreich", initialize:true} );
		}
		
		if( data.request == "ACTS_GET") 
		{			
			this.model.addActs( data.json );
			
			dispatchCommand( Events.HOME_INIT);		
		}
		
		if( data.request == "ENTITY_EVALUATION")
		{
			dispatchCommand( Events.TIPP_SHOW, data.tipp);
		}
	}
	
	if( app.client == "DESKTOP")
	{
		if( data.request == "ACTOR_GET") 
		{
			// DEFAULT OR REAL ACTOR AVAILABLE		
			this.model.setProtagonist( data.actor );
			
			if( this.model.isArzt() )
			dispatchCommand( Events.REQUEST, { request:"PATIENT_GET" } );
			
			// DEFAULT PROTAGONIST IS PATIENT
			if( this.model.isPatient() && data.actor)
			dispatchCommand( Events.REQUEST, { request:"ACTS_GET", antagonistId:data.actor.id } );
	        
			if( !data.actor )
			{
				this.model.setIntro( "INTRO" );
				
				dispatchCommand( Events.HOME_INIT );
			}			
		}
		
		if( data.request == "ACTS_GET") {
			// model
			this.model.addActs( data.json );
			
			dispatchCommand( Events.HOME_INIT);
		}
		
		if( data.request == "PATIENT_GET") 
		{	
			this.model.setAntagonist( data.patient );
			
			if( this.model.hasAntagonist() )
			{
				DOM("titleId").text( data.patient.roleLabel);
				DOM("titleId").style( "position", "absolute");
				DOM("titleId").style( "left", "20px");
				
				dispatchCommand( Events.REQUEST, { request:"ACTS_GET", antagonistId:data.patient.id } );
			}
			
			
			if( !this.model.hasAntagonist() )
			dispatchCommand( Events.REQUEST, { request:"REDIRECT", target:"Akte"})
		}

		if( data.request == "REDIRECT") location.replace(data.target);  
		
		if( data.request == "REFRESH") location.reload();  // dispatchCommand( Events.START ); SONST IFRAME BLEIBT UND DATEN
	}

	// SAME FOR DEVICE AND DESKTOP
	if( data.request == "FAVORITES_SAVE" ) dispatchCommand( Events.SYMPTOME_TO_FAVORITES);
};


function homeInitCommand( event )
{		
	
	// LOAD DATA INTO MEMORY	
	if( event.introExit) {
		
		this.model.setIntro( null );
        
        localStorage.setItem("device_actor", JSON.stringify( this.model.getProtagonist() ) ); 
		
		DOM( this.properties.id ).removeElements();
	}
    
    // CLIENTWIDTH
    DOM( this.properties.id ).show();
    
	if( this.model.getIntro() )
	{
		DOM( this.properties.sync ).hide();
		DOM( this.properties.start ).hide();
		
		dispatchCommand( Events.HOME_INTRO );
	}
	else
	{
		// SYNC BUTTON
		( app.client == "DEVICE") ? DOM( this.properties.sync ).show() : DOM( this.properties.sync ).hide();
		
		// START BUTTON
		DOM( this.properties.start ).show();
		
		dispatchCommand( Events.HOME_VERLAUF ); 
	}
	
	//TODO show hide addOptionen
};

function homeIntroCommand( event )
{	
	DOM( this.properties.id ).removeElements();
	var div = DOM( this.properties.id ).appendChild("div", {class:"intro"});
    
	var type = "";
	
	if( this.model.getIntro() == "INTRO" && this.model.isPatient() && app.client == "DESKTOP") type = "DESKTOP";
	
	if( this.model.getIntro() == "INTRO" && app.client == "DEVICE") type = "DEVICE";
	
	if( this.model.getIntro() == "GRUPPE B" && this.model.isPatient() ) type = "Gruppe B"; 

	if( this.model.getIntro() == "GRUPPE C" && this.model.isPatient() ) type = "Gruppe C"; 
	
	if( this.model.dict.Intro[type] )
	{		
		DOM( div ).addChild( "p", {}, this.model.dict.Intro[type].title );
		
		for( var i = 0; i < this.model.dict.Intro[type].bausteine.length; i++)
		{
			DOM( div ).addChild( "p", {}, this.model.dict.Intro[type].bausteine[i] );		
		}
	
		DOM( div ).addChild( "a", { class:"button-action blue", style:"width:200px; height:40px" }, "Schliessen").onTouch( Events.HOME_INIT, { introExit: true } );
	}
}

function homeVerlaufCommand( data )
{		
	var scrollerId = this.properties.scroller;
	
	if( ! DOM( scrollerId ).element() )
	{
		DOM( this.properties.id ).addChild( "div", { id:"homeVerlauf"} );
		DOM( "homeVerlauf" ).addChild( "div", { id:"chart", class:"chart"} );
		
		DOM( "chart").addChild("div", { id:scrollerId, class:"scrollableX"}).onTouch( Events.INFO_START, { id:scrollerId } ); 	
		
		app.svg.setContainer( scrollerId );
	}
	
	( ! DOM( "homeForm" ).element() ) ? DOM( "homeVerlauf" ).appendChild( "form", { id:"homeForm"} ) : DOM(  "homeForm" ).removeElements();
	
	DOM( "homeForm").appendChild( "fieldset", { id:"fieldsetAuswahl"} );
	DOM( "fieldsetAuswahl").addChild( "legend", { id:"homeAuswahlLegend"} );
	DOM( "fieldsetAuswahl").addChild( "div", { id:"homeAuswahlInfo"} );
	DOM( "fieldsetAuswahl").hide();

	this.model.sortPunkteByTime();
	
	app.svg.refresh();
    
	dispatchCommand( Events.HOME_VERLAUF_SELECTED );
};

function homeVerlaufSelectedCommand( event )
{
	var cmd = this.properties;

	/* RESET */
	DOM(cmd.info).removeElements().text("");
    
	/* FIGUR SELECTED */
	if(event.id)
	{		
		var type = this.model.getType(event.id);
		var value = ( type.kategorie != "Notizen" ) ? event.y +"%" : "&nbsp;";
		var detail = ( type.kategorie != "Notizen" ) ? "<b>Definition</b> "+this.model.getGrad(event.id, event.y).info : event.y.replace(/\n\r?/g, '<br />');

		/* LEGEND */
		DOM(cmd.legend).text( type.kategorie ); 				

		/* CURRENT ITEM */
		var exportData = JSON.stringify({x:event.x, y:event.y, id:event.id, command:Events.FAVORITE_TO_HOME});
		
		/* ROW */
		var row = DOM( cmd.info ).addChild("div", { id:"homeRowDiv", style:"cursor:pointer;padding:5px;", data:exportData });	

		/* MAY PROCEED TO EDIT IF */
		var caret = ( type.kategorie != "Notizen" || event.id == "privat");
		if( caret )
		{	// GOTO EDIT
			DOM("homeRowDiv").onTap( Events.TAP_HANDLER, { watch: "id:homeRowDiv", command:Events.HOME_EXIT } );			
		}
		dispatchCommand( Events.ROW, { type:"legende", area:row, title:type.title, zeit: "am "+zeit("dd.mm.yyyy hh:mm", event.x ), farbwert : type.farbwert, value : value, caret:caret});			
		
		/* DETAIL */
		DOM(cmd.info).addChild( "p", { class:"row_detail"}, detail);	
		
		// SMALL SCREEN HAS OVERLAY IN TIMELINE
		if(window.matchMedia("(orientation:landscape) and (max-device-width:768px)").matches) 
		{		
			dispatchCommand(Events.CHART_OVERLAY, { type:"row", title:type.title, zeit: "am "+zeit("dd.mm.yyyy hh:mm", event.x ), farbwert : type.farbwert, value : value });
		}
	}
	else
	{
		/* DEFAULT */
		DOM(cmd.legend).text( "Legende" ); 
		DOM(cmd.info).text( "Berühren Sie die Datenpunkte in der Timeline für detaillierte Informationen.");
	}
	
	/* DISPLAY */
	DOM("fieldsetAuswahl").show();	
};

function infoStartCommand( event )
{
	if( this.model.getActs().length == 0)
	{
		dispatchCommand( Events.CHART_OVERLAY, { type:"paragraph", title: "Die Eingabe beginnen Sie über den rechten oberen 'Start' Button."})
	}
};
/**
 * 
 * @param event 
 * @returns
 */
function chartOverlayCommand( e )
{
	if( !DOM( "chartOverlayId" ).element() )
	{
		DOM( this.properties.id ).addChild( "div", { id:"chartOverlayId", class:"overlay" }).addChild("div", { class:"block" }).addChild("div", {id:"centeredId", class:"centered"});
		
		if( e.type == "row")
		DOM( "centeredId" ).addChild("div", { id:"overlayRowId", style:"text-align:left"});
        
        if( e.type == "paragraph")
		DOM( "centeredId" ).addChild("div", { id:"overlayRowId", style:"text-align:center"});
        
		dispatchCommand( Events.ROW, { type:"legende", area:"overlayRowId", title:e.title, zeit:e.zeit, farbwert: e.farbwert, value: e.value });
		
		if( e.type == "paragraph")
		DOM("centeredId").html( "<p>"+e.title+"</p>" );	
		
		var show = setTimeout( function() { DOM( "centeredId" ).attrib("className").add("zoomIn"); }, 0 );		
		var hide = setTimeout( function() {DOM( "chartOverlayId" ).removeElement(); }, 3000);
	}
};

function homeExitCommand( event )
{
	this.model.setStateSymptom( event );
	
	dispatchCommand( Events.HOME_TO_FAVORITE );
};

function tapHandlerCommand( event )
{
	this.properties = this.properties || {};
	// HANDLE INCOMING TAP EVENTS
	switch( event.type )
	{
		case("start"):
		{
			var element = event.element; 
			this.properties.startX = event.startX;	
			this.properties.startY = event.startY;	
			
	        if(element) 
	        { 
	        	element.className = "selected"; this.properties.element = element; 
	        }
			break;
		}
		case("move"):
		{		
	        if (Math.abs(event.clientX - this.properties.startX) > 6 || Math.abs(event.clientY - this.properties.startY) > 6) 
	        {
	        	if(this.properties.element){ this.properties.element.className = ""; this.properties.element = null; }
		    }
			this.properties.startX = event.clientX;	
			this.properties.startY = event.clientY;	
			break;
		}
		case("end"):
		{
	        if(this.properties.element) 
	        {    	 
            	dispatchCommand( event.command,  JSON.parse( this.properties.element.getAttribute("data") ) );
	        } 
	        this.properties = null; 
	        break;
		}
		case("cancel"): { this.properties = null; break; }
	}
};

function tippsShowCommand ( event )
{				
	// CLEAN IF NECESSARY
	( DOM("fieldsetTipp").element() ) ? DOM("fieldsetTipp").removeElements() : DOM( "favitFormId").appendChild( "fieldset", { id:"fieldsetTipp"} );		

	// BASIC SETUP
	DOM( "fieldsetTipp").addChild( "legend", {}, "Empfehlungen" );
	DOM( "fieldsetTipp").addChild( "ul", { class:"listeNext", id:"homeTipps" }).onTap( Events.TAP_HANDLER, { watch:"tagName:LI", command:Events.TIPPS_SELECTED } );
	DOM( "fieldsetTipp").hide();	

	var temp = this.model.getStateTemp();
	
	var tipps = this.model.getEmpfehlungen( { type:temp.id, value:temp.y, key:temp.x } );

	//OLD Array bausteine:Array, dislikes, id, kategorie, likes, title
	
	for( var i = 0; i < tipps.length; i++)
	{
		dispatchCommand( Events.REQUEST, { "request":"ENTITY_EVALUATION", "tipp" : tipps[i] } );
	}
};

function tippShowCommand( data )
{
	var tipp =  data;
	
	var item1 = DOM( "homeTipps" ).addChild( "li", { style:"padding-top:5px;padding-bottom:5px;", data: JSON.stringify( tipp ) });
	
	DOM( item1 ).appendChild("span", { style:"padding-top:10px; padding-right:30px;"}, "<b>"+tipp.title+"</b>");	
	DOM( item1 ).appendChild("br", {}, "");	
	DOM( item1 ).appendChild("span", { style:"font-size:90%;margin:1px;float:left;" }, "<i>"+tipp.kategorie+"</i>");				
	DOM( item1 ).appendChild("div", { class:"row_caret", style:"top:16px;"} ).appendChild( Assets.caret() );
	
	// Community Bewertung
	if( (tipp.likes + tipp.dislikes) > 0 )
	{
		DOM( item1 ).appendChild("span", { style:"position:absolute; top:6px; right:18px; font-size:90%"}, "<i>Empfohlen</i>");				
		DOM( item1 ).appendChild("span", { style:"position:absolute; top:23px; right:18px; font-size:90%"}, "<i>" +likes+" von "+( likes + dislikes )+ "<i>");		
	}
	
	DOM( "fieldsetTipp").show();
};

function tippsSelectedCommand( event )
{
	this.model.setStateTipp( event );
	dispatchCommand( Events.FAVORITE_TO_TIPP );
};



function tippInitCommand( data )
{
	DOM( this.properties.id ).removeElements();
	
	//"data":{"type":"10015090","value":"90","key":1363265891430},
	//"tipp":{"id":"info1","title":"Nelkenwasser","kategorie":"Selbsthilfe","likes":1,"dislikes":0,"displayed":0,"clicked":0,"bausteine":[{"Häufigkeit":"Mundspülung mit Nelkenwasser 2-3 mal pro Tag"},{"Zubereitung":"Kochen Sie hierfür ein paar Gewürznelken in Wasser auf und lassen Sie das Wasser abkühlen."}]}} 
	var tipp = this.model.getStateTipp();

    DOM( this.properties.id ).show();    
    
	DOM( this.properties.id ).addChild("form").addChild("fieldset", { id: "tippFieldsetId" }).addChild("legend", {}, tipp.kategorie);
	
	DOM( "tippFieldsetId" ).addChild( "div", { id:"tipArea"} );
	DOM( "tipArea" ).appendChild( "p", { style: "width:100%;"}, "<b>"+tipp.title+"</b>");

	var bausteine = tipp.bausteine;
	// Bausteine
	for( var i = 0; i< bausteine.length; i++ )
	{		
		var baustein = bausteine[i];
		
		for( var typus in baustein )
		{
			DOM( "tipArea" ).appendChild( "p", { style:'width:100%;padding-top:10px' }, "<i>"+typus+":</i> "+baustein[typus]);	
		}
	}
	
	if( !this.model.trackPunktLikedOrNotExists() )
	{
		DOM( "tipArea" ).addChild("a", { style:"float:left;", class:"button-action green"}, "Erfolgreich").onTouch( Events.TIPP_LIKED, { liked:true } );
		DOM( "tipArea" ).addChild("a", { style:"float:right;", class:"button-action grey"}, "Nicht erfolgreich").onTouch( Events.TIPP_LIKED, { liked:false });	
	}
	
	this.model.trackPunktTipp("clicked");
};

function tippLikedCommand( data )
{
	this.model.setTipp( data );
	
	dispatchCommand( Events.TIPP_EXIT );
};

function tippExitCommand( data )
{
	this.model.setStateTipp(null);
	
	dispatchCommand( Events.TIPP_TO_FAVORITE );
};

function optionenInitCommand( data )
{
	DOM( this.properties.id ).removeElements();
	
	/* VERBINDUNG */
	DOM( this.properties.id ).addChild( "form", { id:"optionenFormId"});
		
	if( this.model.getProtagonist().id  > 0 )
	{			
		DOM("optionenFormId").addChild("fieldset", { id:"fieldsetVerbindung", style:"text-align:left;"}).addChild( "legend", {}, "Verbindung" );	
		DOM( "fieldsetVerbindung"  ).addChild("div", { id:"optStatus"} );
		DOM( "optStatus"  ).addChild( "span", { }, "<b>Mit Brustzentrum</b>" );
		DOM( "optStatus"  ).addChild( "br" );
		DOM( "optStatus"  ).addChild( "span", { style:"color:green; font-size:90%"}, (data.status) ? "<i>"+data.status+"</i>" :"&nbsp;" ); 			
		DOM( "optStatus"  ).addChild( "a", { style:"position:absolute;top:6px;right:2px;color:darkblue" }, "Verbunden" ); 	

		// SYNC
		DOM("optionenFormId").addChild("fieldset", { id:"fieldsetSync", style:"text-align:left;"}).addChild( "legend", {}, "Synchronisation" );	
		DOM( "fieldsetSync"  ).addChild("div", { id:"optSync"} );
		
		if( localStorage.getItem("device_upToDate")	)
		{
			DOM( "optSync" ).addChild( "span", { }, "<b>Zuletzt</b>");
			DOM( "optSync" ).addChild( "br" );
			DOM( "optSync" ).addChild( "span", { style:"font-size:90%"}, "<i>"+zeit("dd.MM.yyyy hh:mm",  parseInt( localStorage.getItem("device_upToDate") ) )+"</i>" ); 					
		}
		else
		{
			DOM( "optSync" ).addChild( "span", { }, "<b>Initialisierung</b>");
			DOM( "optSync" ).addChild( "br" );
			DOM( "optSync" ).addChild( "span", { style:"font-size:90%"}, "<i>&nbsp;</i>" ); 	
		}
		DOM( "optSync" ).addChild( "a", { class:"button-action blue", style:"position:absolute;top:6px;right:2px;"}, "Sync").onTouch(Events.SYNC, { status:"START" });
	}
	else
	{
		DOM("optionenFormId").addChild("fieldset", { id:"fieldsetVerbindung", style:"text-align:left;"}).addChild( "legend", {}, "Verbindung" );	
		DOM( "fieldsetVerbindung"  ).addChild("div", { id:"optStatus"} );
		DOM( "optStatus"  ).addChild( "span", { }, "<b>Mit Brustzentrum</b>" );
		DOM( "optStatus"  ).addChild( "br", { }, "" );
		DOM( "optStatus"  ).addChild( "span", { style:"color:red; font-size:90%"}, (data.status) ? "<i>"+data.status+"</i>":"&nbsp;" ); 	
		DOM( "optStatus"  ).addChild( "a", { class:"button-action blue", style:"position:absolute;top:6px;right:2px;" }, "Verbinden" ).onTouch( Events.SCAN, {}); 	
	}

	DOM( this.properties.id ).show();	
};

function scanCommand( data )
{	
	var scanner = cordova.require("cordova/plugin/BarcodeScanner");

	scanner.scan(

	      function (result) 
	      {  
	    	  dispatchCommand( Events.SCAN_RESULT, { text: result.text, format: result.format, cancelled:result.cancelled  } );
	      }, 
	      function (error) 
	      {  
	    	  dispatchCommand( Events.SCAN_RESULT, { error : ex.message } );
	      }
	   );

};

/**
 * event { result: "", format:"QR_CODE", error:"message" }
 * @param event
 */
function scanResultCommand( data )
{		
	// DEKSTOP BROWSER TESTING
	if( data.error == "Cannot read property 'barcodeScanner' of undefined" && app.debug)
	{
		// Arzt
		data.text = "VAXX2";
		data.format = "QR_CODE";
	}
	// DEVICE BROWSER TESTING
	if( data.error == "'undefined' is not an object" && app.debug ) 
	{		
		// Patient
		data.text = "VAXX2";
		data.format = "QR_CODE";
	}
	
	if( data.format == "QR_CODE" )
	{			
		function success( payload ) 
		{ 
			dispatchCommand( Events.REQUEST, { request:"ACTOR_UPDATE", actor: payload }  );
		};
		
		function error( message )
		{
			alert( message );
			
			dispatchCommand( Events.OPTIONEN_INIT, { status: "Fehlgeschlagen"} );
		}
		
		app.node.readActorByRequestToken( data.text, success, error );
	}
	else
	{
		dispatchCommand( Events.OPTIONEN_INIT, { status: "Fehlgeschlagen"} );	
	}
};


// ONLY DEVICE AND PATIENT CAN CALL
// TODO SERVER NOT AVAIABLE
function syncCommand( event )
{
	// UPDATE ACTS FROM REMOTE SINCE LAST UPDATE
	if( event.status == "START" )
	{		
		var antagonistId = this.model.getProtagonist().id;
		
		app.node.listActsForAntagonistId( antagonistId, localStorage.getItem("device_upToDate"), 
				
			function( payload )
			{
				dispatchCommand( Events.SYNC_RESULT, { status : "START", json : payload });
			}, 
			function( message ) {}
		);
	}
	
	if( event.status == "ACTS")
	{
		var acts = this.model.getActs();
			
		var counter = 0;
		
		for( var i = 0; i < acts.length; i++)
		{		
			if( !acts[i].id )
			{		
				counter++;		

				var act = {};
				
				act.protagonistId = this.model.getProtagonist().id ;
				act.antagonistId = this.model.getProtagonist().id;
				act.entitiesId = acts[i].entitiesId;
				act.zeit = acts[i].zeit;
				act.wert = acts[i].wert;
				
				app.node.createAct(act, 
					function( payload )
					{
						dispatchCommand( Events.SYNC_RESULT, { status: "ACTS", act:act, json:payload });
						
						counter--;
						
						if( counter == 0) dispatchCommand( Events.SYNC_RESULT, { status: "ACTS" });
					}, 
					function( message )
					{
						console.log( message );
					}
				);
			}
		}			
		if( counter == 0) dispatchCommand( Events.SYNC_RESULT, { status: "ACTS" });
	}
};

function syncResultCommand( data )
{
	if( data.status == "START")
	{
		this.model._data.acts = this.model._data.acts.concat( data.json );
		
		localStorage.setItem("device_acts", JSON.stringify( this.model._data.acts ));
				
		dispatchCommand( Events.SYNC, { status:"ACTS"} );
	}
	
	if( data.status == "ACTS")
	{				
		localStorage.setItem("device_upToDate", zeit() );			

		if( data.act && data.json )
		{
			this.model.updateActWithId( data.act, data.json.insertId );
			
			if(this.model.getActs().length > 0)
			localStorage.setItem("device_acts", JSON.stringify( this.model._data.acts ));
			
		}
		// ENDE BATCH QUERY
		else dispatchCommand( Events.OPTIONEN_INIT);
	}
	
};


/**
 * SYMPTOME INIT
 * @param data.id -> ContentId
 * @param data.liste -> ListeId
 */
function symptomeInitCommand( data )
{
	DOM( this.properties.id ).removeElements().appendChild("form", { id : "symFormId" } );
	
    DOM( "symFormId" ).addChild("fieldset", { id: "symFieldsetId" } ).addChild( "legend", {}, "Symptome" );
		
	var liste =	DOM( "symFieldsetId" ).appendChild("ul", { id:"symptomeListe", class:"listeNext"} );	
	
	var items = this.model.getSymptome();
	
	for(var i = 0; i < items.length; i++)
	{		
		var item = DOM( liste ).appendChild("li", { data: items[i].id, style:"padding-top:10px;padding-bottom:10px;" });
		
		DOM( item ).appendChild("span", { class:"row_antiCaret", style:"top:13px; left:-3px;"} ).appendChild( Assets.antiCaret() );
        
		DOM( item ).appendChild("span", { class:"row_title", style: 'display:block;padding-left:10px;padding-right:25px;' }, "<b>"+items[i].title+"</b>");
		DOM( item ).appendChild("span", { class:"row_value", style:"top:10px;padding-top:3px;padding-bottom:3px;background:"+items[i].farbwert }, "&nbsp;" );
		//DOM( item ).appendChild("span", { style: 'position:absolute; white-space:nowrap; top:25px; left:60px;'}, "<i>" + items[i].sub + "</i>");		
	}	
	DOM( "symptomeListe" ).onTap( Events.TAP_HANDLER, { watch: "tagName:LI", command:Events.SYMPTOME_EXIT } );
		
	DOM( this.properties.id ).show();
};

function symptomeExitCommand( event ) {
		
	this.model.addFavorite( "Symptome", event ); 
	
	dispatchCommand( Events.REQUEST, { request:"FAVORITES_SAVE" });
}

function favoritesChangeCommand( data )
{	
    var edit = !this.model.getStateFavEdit();
	
	if(edit)
	{
		DOM( this.properties.editButton ).text("Fertig").attrib("className").replace("colorless","grey");
		DOM( this.properties.backButton ).hide();
		this.model.setStateFavEdit( true );
	}
	else
	{
		DOM( this.properties.editButton ).text("Ändern").attrib("className").replace("grey","colorless");		
		DOM( this.properties.backButton ).show();
		this.model.setStateFavEdit( false );
	}
	
	dispatchCommand( Events.FAVORITES_INIT );		
};

/**
 * FAVORITES BUILD FORM
 *  @param data { id: "viewContentId", edit: true }
 */
function favoritesInitCommand( data )
{			
	DOM( this.properties.id ).removeElements().appendChild("form", { id : "favFormId" } );
    
	for(var favorite in this.model.getFavorites() )
	{
		DOM( "favFormId" ).addChild("fieldset", { id: favorite+"id" } ).addChild( "legend", {}, favorite);

		var liste = DOM( favorite+"id" ).appendChild("ul", { class: "listeNext"} );
		
		if(!this.model.getStateFavEdit())
		{
			DOM( liste ).onTap( Events.TAP_HANDLER, { watch:"tagName:LI", command:Events.FAVORITES_EDIT});
		}
		
        if((this.model.getStateFavEdit() && this.model.hasFavoriteEdit( favorite ) || this.model.getFavorites( favorite ).length == 0 ) )
        {	
            dispatchCommand( Events.FAVORITES_ROW, { row: {}, display: liste });
        }
		
		for(var i = 0; i < this.model.getFavorites( favorite ).length; i++ )
		{
			dispatchCommand( Events.FAVORITES_ROW, { row: this.model.getFavorites( favorite )[i], display: liste,  });		
		}
	}

	DOM( this.properties.id ).show();	
};

/**
 * FAVORITES CREATE LIST ITEM
 * @param data { id:"typeId", display:"listElement" }
 */
function favoritesRowCommand( data )
{	

	var infoData = this.model.getPunkt( data.row.entitiesId );
	var infoType = this.model.getType( data.row.entitiesId );
	var zeitpunkt = (infoData && !data.edit) ? "Zuletzt: "+zeit('dd.mm.yyyy hh:mm', infoData.zeit) : "&nbsp;";
	var title = (infoData && infoType.kategorie != "Notizen") ? infoData.wert + "%" : "&nbsp;";

	var item = DOM( data.display ).appendChild("li", { data:JSON.stringify({ punkt:infoData, type:infoType }), style:"padding-top:10px;padding-bottom:10px;"});

	// KEIN EDIT-MODE
	if( !this.model.getStateFavEdit() )
	{		
		if(data.row.entitiesId)
		{
			// Bewertung, Symptom, Notiz
			dispatchCommand( Events.ROW, { type:"legende", area:item, title:infoType.title, zeit: zeitpunkt, farbwert : infoType.farbwert, value : title, caret:true })			
		}
		else
		{	// Neues Symptom mit Caret
			dispatchCommand( Events.ROW, { type:"legende", area:item, title:"Neues Symptom", zeit:"Zur Liste hinzufügen", caret:true })			
		}
	}
	// EDIT-MODE
    else
	{
    	if( !data.row.entitiesId )
    	{	// Neues Symptom ohne Caret und Button
    		dispatchCommand( Events.ROW, { type:"legende", area:item, title:"Neues Symptom", zeit:"Zur Liste hinzufügen", caret:false })			

    		var button = DOM( item ).appendChild("a", { class:"button blue", style:"position:absolute; right:2px; top:10px; font-size:100%"}, "Plus");
    		DOM( button ).onTouch( Events.FAVORITES_TO_SYMPTOME  );	    		
    	}
    	else if( data.row.edit )
    	{	// Bestehendes Symptom aus Favoritenliste
    		dispatchCommand( Events.ROW, { type:"legende", area:item, title:infoType.title, zeit:"Von Liste entfernen", caret:false })			    		
    		
    		var button = DOM( item ).appendChild("a", { class:"button red", style:"position:absolute; right:2px; top:10px; font-size:100%"}, "Minus");
    		DOM( button ).onTouch(Events.FAVORITES_DELETE, { type:"Symptome", item: { id: data.row.id} } );		    		
    	}
	}
	
};
/**
 * Generate Row Parts
 * @param data { type, area, title, zeit, farbwert, value }
 */
function rowCommand( data )
{
	if( data.type == "legende")
	{
		DOM( data.area ).appendChild("span",{ class:"row_title" }, "<b>"+data.title+"</b>");		
		DOM( data.area ).appendChild("br");	
		
		if(data.zeit) 		DOM( data.area ).appendChild("span",{ class:"row_zeit"}, "<i>"+data.zeit+"</i>" );	
		if(data.farbwert)	DOM( data.area ).appendChild("a", { class:"row_value", style:" background:"+data.farbwert}, data.value);			
		if(data.caret)		DOM( data.area ).appendChild("div", { class:"row_caret" } ).appendChild( Assets.caret() );		
	}
};

function favoritesDeleteCommand( data )
{    
	this.model.removeFavorite( data.type, data.item );
	
	dispatchCommand( Events.FAVORITES_INIT );
}

/**
 * FAVORITES LIST ITEM UP 
 * @param data { TODO }
 */
 
function favoritesEditCommand( data )
{		
	//console.log( data.punkt, data.type );

	var value = {};
	
	if( !data.type )
	{
		dispatchCommand( Events.FAVORITES_TO_SYMPTOME ); return;
	}
	
	value.id =  data.type.id;
	
	if( data.punkt )
	{
		value.y = data.punkt.wert;
		value.x = data.punkt.zeit;
	}
	else
	{
		value.y = data.type.zero;
	}

	value.command = Events.FAVORITE_TO_FAVORITES;
	
	this.model.setStateSymptom( value );
	
	dispatchCommand( Events.FAVORITES_TO_FAVORITE );		
};

/**
 * 
 * @param data, forceNoEdit ( onExit )
 * @param forceNoEdit
 */
function favoriteChangeCommand( event )
{	
	if( this.model.getStateFavitEdit() || event.exit )
	{
		DOM( this.properties.id ).text("Löschen");		
		DOM( this.properties.id ).attrib("className").replace("grey", "colorless");		
	}
	else
	{
		DOM( this.properties.id ).text("Fertig");
		DOM( this.properties.id ).attrib("className").replace("colorless", "grey");					
	}
	
	(event.exit) ? this.model.setStateFavitEdit( false) : this.model.setStateFavitEdit( !this.model.getStateFavitEdit() );	
	
	if(!event.exit)
	dispatchCommand( Events.FAVORITE_INIT );
};

/**
 * FAVORITE INIT
 * @param data 
 * this.properties { id: "ContentId" }
 */
function favoriteInitCommand( data )
{	
	// ITEM TO MODIFY
	var item = this.model.getStateSymptom(); 
	
	// LEGENDE LABEL
	var kategorie = this.model.getType( item.id ).kategorie;
		
	// PERSIST NEW ITEM TO MODEL
	this.model._state.tempItem = { y:item.y, id:item.id };

	// ITEM NOT SPECIFIED THAN GET LAST
	var last = "&nbsp;";
	
	if(this.model.getPunkt( item.id ))
	{
		last = (!item.x) ? "<i>Zuletzt: "+ zeit('dd.mm.yyyy hh:mm', this.model.getPunkt( item.id ).x)+"</i>" : "<i>am "+zeit('dd.mm.yyyy hh:mm',item.x)+"</i>";
	}
	
	// EDITABLE EVENT
	if( item.x ) DOM( this.properties.edit ).show();
	else 		 DOM( this.properties.edit ).hide();
	
	// NOW CLIENTWIDTH AVAILABLE
	DOM( this.properties.id ).removeElements().show(); 
	
	removeCommand( Events.SLIDER, sliderCommand );
	removeCommand( Events.DATE, dateCommand );
    	
	// FORM
	DOM( this.properties.id ).addChild("form", {id:"favitFormId"});
		
	// ZEITPUNKT ONLY IF NOT EDITING
	if( this.model.getStateFavitEdit() )
	{
		DOM( "favitFormId" ).addChild("fieldset", { id: "favitZeitId", disabled:"true" }).addChild("legend", {}, "Zeitpunkt");
	}
	else{
		DOM( "favitFormId" ).addChild("fieldset", { id: "favitZeitId"} ).addChild("legend", {}, "Neuer Zeitpunkt");		
	}
	
	DOM( "favitZeitId" ).addChild("div", {id:"zeitArea" });		
	
	// SYMPTOM
	DOM( "favitFormId").addChild("fieldset", { id: "favoriteFieldsetId" }).addChild("legend", {}, kategorie);
	DOM( "favoriteFieldsetId" ).addChild( "div", { id:"favArea"} );
	DOM( "favArea" ).appendChild( "span", { style: "width:100%; padding-right:80px;"}, "<b>"+this.model.getType( item.id ).title+"</b>");

	// EINTRAG AM ODER ZULETTZT
	DOM( "favArea" ).appendChild( "p", { id:"favitZeitLabel", style:'width:100%;font-size:90%;margin:1px' }, last);		

	// TEXTAREA IF NOTIZ
	if( kategorie == "Notizen")
	{
		DOM( "favArea" ).addChild("textarea", { id:"favTextareaId", style:"font-size:100%;width:100%; height:200px;padding:3px;-webkit-user-select: text;", name:"notizEintrag", placeholder:"Text eingeben"}, item.y);
		DOM( "favArea" ).addChild("div",{ id:"favitReseter" }). addChild("a",{ class:"button-action grey", style:"float:left;"}, "Neuer Text").onTouch( Events.FAVORITE_TEXT_CHANGE, { action:"favitActions", type:"reset", reseter:"favitReseter"});
		DOM( "favTextareaId" ).onChange( Events.FAVORITE_TEXT_CHANGE, { action:"favitActions", reseter:"favitReseter"} );
	}
	else
	{
		DOM( "favArea" ).appendChild( "span", { id:"favOutputId", style: "position:absolute; top:10px; right:2px; font-size:110%" }, item.y +"%");				
	}

	// SLIDER 
	DOM( "favArea" ).appendChild( "div", { id:"sliderArea"});	
	
	// DEFINITION DER KATEGORIE
	if( !this.model.getStateFavitEdit() && kategorie != "Notizen" )
	{
		DOM( "favArea" ).appendChild( "p", { id:"favGradId", style: 'width:100%;padding-top:5px;'}, "<b>Definition: </b>"+this.model.getGrad(item.id, item.y).info );
	}
	
	// SAVE AND CANCEL
	DOM( "favArea" ).appendChild( "div",{ id:"favitActions"});		
	DOM( "favitActions" ).addChild("a", { id:"favitSaveId", class:"button-action blue", style:"float:left;"}, "Erstellen").onTouch(Events.FAVORITE_SAVE);
	DOM( "favitActions" ).addChild("a", { id:"favitCancelId", class:"button-action grey", style:"float:right;"}, "Abbrechen").onTouch(Events.FAVORITE_INIT);
	DOM( "favitActions" ).hide();


	addCommand( Events.DATE, dateCommand, { parent: "zeitArea", actions:"favitActions", zeit:"favitZeitLabel", edit: this.properties.edit});
	dispatchCommand( Events.DATE);	
	
	if( this.model.getStateFavitEdit() )
	{
		DOM("sliderArea").addChild( "a", { class:"button red", style:"float:right;margin-bottom:20px;"}, "Löschen").onTouch(Events.FAVORITE_DELETE);
	}
	
	if( !this.model.getStateFavitEdit() && kategorie != "Notizen" )
	{
		// REGISTER COMMANDS
		addCommand( Events.SLIDER, sliderCommand, { parent:"sliderArea", actions:"favitActions", zeit:"favitZeitLabel", output:"favOutputId", grad:"favGradId", edit:this.properties.edit});
		
		// DISPATCH COMMANDS
		dispatchCommand( Events.SLIDER );
		dispatchCommand( Events.TIPPS_SHOW );				
	}
};

function dateCommand( event )
{	
	// HANDLE CHANGE OF SELECT ( NEW DATE )
	if( event.value && event.type )
	{
		var update = new Date( event.zeitInMs );
		var limit = new Date().getTime();

		if( event.type == "dd") update.setDate( event.value );
		if( event.type == "MM") 
		{
			update.setDate( 1 );
			update.setMonth( Number( event.value ) - 1 );
		}
		if( event.type == "yyyy") update.setYear( Number( event.value ) - 1 );
		if( event.type == "hh") update.setHours( Number( event.value ) - 1 );
		if( event.type == "mm") update.setMinutes( Number( event.value ) - 1 );
		
		if( event.type == "yyyy-MM-dd")
		{
			update.setYear( Number( event.value.substr(0,4)) );
			
			update.setMonth( Number( event.value.substr(5,2)) - 1 );
			
			update.setDate( Number( event.value.substr(8,2)) );
		}
		
		if( event.type == "hh:mm")
		{
			update.setHours( Number( event.value.substr(0,2)) );
			update.setMinutes( Number( event.value.substr(3,2)) );
		}
		
		// UPDATE TEMP ITEM
		if( update.getTime() > limit )
		{
			this.model._state.tempItem.x = limit;
			//alert("Das Datum liegt in der Zukunft und wurde auf Heute zurückgesetzt!"); 
		}
		else
		{
			this.model._state.tempItem.x = update.getTime();
		}
		
		// ZEITPUNKT DELETE
		DOM( this.properties.zeit ).html("&nbsp;");
		// NO EDIT FUNCTION AVAILABLE
		DOM( this.properties.edit ).hide();
		
		// SHOW SAVE AND CANCEL
		DOM( this.properties.actions ).show();
	}

	// GET CURRENT X 
	var zeitInMs = this.model._state.tempItem.x = (this.model._state.tempItem.x)? this.model._state.tempItem.x : new Date().getTime();

	DOM( this.properties.parent ).removeElements();

	// CREATE ELEMENT DESKTOP ODER MOBILE
	if( app.agent.isDevice("Desktop") || (/Android/i.test(navigator.userAgent)))
	{		
		DOM( this.properties.parent ).addChild("span",{ style:"margin-right:5px;" },"<b>Datum</b>"); 
		DOM( this.properties.parent ).addChild("select", { id:"dd", class:"optionen" }).addOptions(1, zeit("ddInMonth",zeitInMs), zeit("dd",zeitInMs)).onChange( Events.DATE, { type:"dd", zeitInMs: zeitInMs, parent:"zeitArea"} );
		DOM( this.properties.parent ).addChild("select", { class:"optionen" }).addOptions(1,12, zeit("MM",zeitInMs)).onChange( Events.DATE, { type:"MM", zeitInMs: zeitInMs, parent:"zeitArea"} );
		DOM( this.properties.parent ).addChild("select", { class:"optionen",  }).addOptions(2013, 2022, zeit("yyyy",zeitInMs)).onChange( Events.DATE, { type:"yyyy", zeitInMs: zeitInMs, parent:"zeitArea"} );
	
		DOM( this.properties.parent ).addChild("span",{ style:"margin-left:10px;margin-right:5px;" },"<b>Zeit</b>"); 
		DOM( this.properties.parent ).addChild("select", { class:"optionen" }).addOptions(1,24, zeit("hh", zeitInMs)).onChange( Events.DATE, { type:"hh", zeitInMs: zeitInMs, parent:"zeitArea"} );
		DOM( this.properties.parent ).addChild("select", { class:"optionen" }).addOptions(1,60, zeit("mm", zeitInMs)).onChange( Events.DATE, { type:"mm", zeitInMs: zeitInMs, parent:"zeitArea"} );
	}
	else
	{		
		DOM( this.properties.parent ).addChild("input", { type:"date", value:zeit("yyyy-MM-dd",zeitInMs), style:"font-size:95%; width:105px;" }).onDone( Events.DATE, { type:"yyyy-MM-dd", zeitInMs: zeitInMs, parent:"zeitArea"});
		DOM( this.properties.parent ).addChild("input", { type:"time", value:zeit("hh:mm",zeitInMs), style:"font-size:95%;margin-left:10px;width:65px" }).onDone( Events.DATE, { type:"hh:mm", zeitInMs: zeitInMs, parent:"zeitArea"});
	}
};

function sliderCommand( event )
{	
	// TRANSFORM CUSTOM RESULT IF CLICKED ON SLIDER NOT THUMB
	if(event.custom && event.tag == "DIV")
	{	
		var hundert = DOM("favSliderId").width() - DOM("thumbId").width();
		var calibrate = DOM("thumbId").width() / 2;	 
		var value = parseInt( ( event.offsetX - calibrate )/ hundert * 100);
		 
		if(value < 0) value = 0; if(value > 100) value = 100;
		 
		DOM( "thumbId" ).style("left",  parseInt( hundert * value / 100 ) + "px");
		 
		event.value = value;
	}
	
	// HANDLE RESULT
	if(event.value) 
	{	
		this.model._state.tempItem.y = event.value;

		var item = this.model._state.tempItem;
		
		// Update Displays
		DOM( this.properties.output ).removeElements().text( event.value  +"%");
		DOM( this.properties.grad ).element().innerHTML = "<b>Definition: </b>"+this.model.getGrad( item.id, item.y ).info;	
		
		// SAVE AND CANCEL
		DOM( this.properties.actions ).show();

		// ZEITPUNKT DELETE
		DOM( this.properties.zeit ).html( "&nbsp;");
		
		// NO EDIT FUNCTION AVAILABLE
		DOM( this.properties.edit ).hide();
		
		dispatchCommand( Events.TIPPS_SHOW, { type:item.id, value:item.y, x: item.x } );	
	}
	
	var temp = this.model._state.tempItem;
	
	// CREATE LEMENT DESKTOP ODER MOBILE IF NO EVENT VALUE
	if( !event.value && event.tag != "A")
	{
		
		if( app.agent.isDevice("Desktop") )
		{				
			DOM( this.properties.parent ).addChild("div", { id:"favSliderId", class:"slider"} ).addChild("a", { id:"thumbId", class:"grey"} );		 
			
			var hundert = DOM("favSliderId").width() - DOM("thumbId").width();
			
			DOM( "thumbId" ).style("left",  parseInt( hundert * temp.y / 100 ) + "px");
			
			DOM( "favSliderId" ).onTouch( Events.SLIDER, {custom:true} );
		}
		else
		{//, , style:"margin-bottom:20px"
			DOM( this.properties.parent ).addChild("input", { id:"favRangeId", type:"range", min:0, max:100, value:temp.y} ).onChange( Events.SLIDER, {} );
		}	
	}
};

function favoriteTextChangeCommand( data )
{	
	DOM(data.reseter).hide();
	DOM(data.action).show();

	if(data.type == "reset")
	{
		data.value = "";
		DOM("favTextareaId").element().value = "";
	}
	
	// Persist to TEMP Model
	if(this.model._state.tempItem)
	this.model._state.tempItem.y = data.value;
};

function favoriteExitCommand( data )
{
	var command = this.model.getStateSymptom().command;
	
    // PERSIT TO MODEL IF SAVE EVENT
	if( this.properties.type == "save") {
		
		var toSave = this.model._state.tempItem;
		
		dispatchCommand( Events.REQUEST, { request:"ACT_SAVE", act: { id:toSave.id, x:toSave.x, y:toSave.y, tipps:toSave.tipps } } );
	}
	// DELETE EVENT
	if( this.properties.type == "delete") {
		
		var toDelete = this.model.getStateSymptom();
		
		this.model.removePunkt( toDelete );
	}
	
	// Cleaning
	this.model._state.tempItem = null;		
	this.model.setStateSymptom( null );	
	
	// CLEANING EDIT BUTTN STATUS
	dispatchCommand( Events.FAVORITE_CHANGE, { exit:true} );
	
	dispatchCommand( command );
}






