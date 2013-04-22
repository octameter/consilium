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
	
	MODEL_FROM_STORAGE:"model_from_storage",
	SYNC:"sync",
		
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
	TIPPS_SELECTED:"tipps_selected",
	TIPP_INIT:"tipp_init",
	TIPP_LIKED:"tipp_liked",
	TIPP_EXIT:"tipp_exit",
	TIPP_TO_FAVORITE:"tipp_to_favorite",
	
	SYMPTOME_INIT:"symptome_init",
	SYMPTOME_EXIT:"symptome_exit",
	SYMPTOME_TO_FAVORITES:"symptomeToFavorites"
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

function startCommand( event )
{
	// CHECK LOCAL STORAGE
	dispatchCommand( Events.MODEL_FROM_STORAGE );
	
    // CLIENTWIDTH AVAILABLE
    DOM( "app" ).show();
    
	dispatchCommand( Events.HOME_INIT );
};

function modelFromStorageCommand( event )
{
	
	if( localStorage.getItem("dataPunkte") ) 
	this.model._data["punkte"] = JSON.parse( localStorage.getItem("dataPunkte") );	
	
	if( localStorage.getItem("dataFavorites") ) 
	this.model._data["favorites"] = JSON.parse( localStorage.getItem("dataFavorites") );		
	
	if( localStorage.getItem("dataCustomer") ) 
	this.model._data["customer"] = JSON.parse( localStorage.getItem("dataCustomer") );		


//	this.model.dict["Intro"] = localStorage.getKey("dictIntro");
//	this.model.dict["Bewertung"] = localStorage.getKey("dictBewertung");
//	this.model.dict["Tagebuch"] = localStorage.getKey("dictTagebuch");
//	this.model.dict["Symptome"] = localStorage.getKey("dictSymptome");
//	this.model.dict["Tipps"] = localStorage.getKey("dictTipps");
};

function syncCommand( event )
{
	if( !this.model._data.customer.lastSync )
	{
		this.model.addPunkt( {"x":1364571509073, "y": "Chemotherapie mit\n\Methotrexat", "id": "zyklus"} ); 	 	
		this.model.addPunkt( {"x":1364471509073, "y": "Adenocarcinom T3M2", "id": "diagnose"} ); 	 			
	}
	
	this.model.setCustomer("lastSync", zeit());
	
	dispatchCommand( Events.OPTIONEN_INIT);
};

function homeInitCommand( event )
{	
	// LOAD DATA INTO MEMORY
	
	if( event.introExit ) {
		this.model.setCustomer("intro",-1);
		DOM( this.properties.id ).removeElements();
	}
    
    // CLIENTWIDTH
    DOM( this.properties.id ).show();
    
	if( this.model._data.customer.intro == -1 )
	{
		DOM( this.properties.sync ).show();
		DOM( this.properties.start ).show();
		dispatchCommand( Events.HOME_VERLAUF ); 
	}
	else
	{
		DOM( this.properties.sync ).hide();
		DOM( this.properties.start ).hide();
		dispatchCommand( Events.HOME_INTRO );
	}
};

function homeIntroCommand( event )
{
	DOM( this.properties.id ).removeElements();
	var div = DOM( this.properties.id ).appendChild("div", {class:"intro"});
    
	var type = this.model._data.customer.intro;
	
	DOM( div ).addChild( "p", {}, this.model.dict.Intro[type].title );
	
	for( var i = 0; i < this.model.dict.Intro[type].bausteine.length; i++)
	{
		DOM( div ).addChild( "p", {}, this.model.dict.Intro[type].bausteine[i] );		
	}

	DOM( div ).addChild( "a", { class:"button-action blue", style:"width:200px; height:40px" }, "Schliessen").onTouch( Events.HOME_INIT, { introExit: true } );
}

function homeVerlaufCommand( data )
{		
	var scroller = this.properties.scroller;
	
	if( ! DOM( scroller ).element() )
	{
		DOM( this.properties.id ).addChild( "div", { id:"homeVerlauf"} );
		DOM( "homeVerlauf" ).addChild( "div", { id:"chart", class:"chart"} );
		
		DOM( "chart").addChild("div", { id:scroller, class:"scrollableX"}).onTouch( Events.INFO_START, { id:scroller } ); 	
		
		DOM( scroller ).plugins( "svg" ).create();	
	}
	
	( ! DOM( "homeForm" ).element() ) ? DOM( "homeVerlauf" ).appendChild( "form", { id:"homeForm"} ) : DOM(  "homeForm" ).removeElements();
	
	DOM( "homeForm").appendChild( "fieldset", { id:"fieldsetAuswahl"} );
	DOM( "fieldsetAuswahl").addChild( "legend", { id:"homeAuswahlLegend"} );
	DOM( "fieldsetAuswahl").addChild( "div", { id:"homeAuswahlInfo"} );
	DOM( "fieldsetAuswahl").hide();
	
	this.model.sortPunkteByTime();
	
	DOM().plugins( "svg" ).refresh();
    
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
	if( this.model._data.punkte.length == 0)
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
	if( ! DOM( "chartOverlayId" ).element() )
	{
		DOM( this.properties.id ).addChild( "div", { id:"chartOverlayId", class:"overlay" }).addChild("div", { class:"block" }).addChild("div", {id:"centeredId", class:"centered"});
		
		if( e.type == "row")
		DOM( "centeredId" ).addChild("div", { id:"overlayRowId", style:"text-align:left"});
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
	        if (Math.abs(event.clientX - this.properties.startX) > 10 || Math.abs(event.clientY - this.properties.startY) > 10) 
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
	var temp = this.model._state.tempItem;
	
	data = { type:temp.id, value:temp.y, key:temp.x };
	
	if( DOM("fieldsetTipp").element() )
	{
		DOM("fieldsetTipp").removeElements();
	}
	else
	{
		DOM( "favitFormId").appendChild( "fieldset", { id:"fieldsetTipp"} );		
	}
	DOM( "fieldsetTipp").addChild( "legend", {}, "Empfehlungen" );
	DOM( "fieldsetTipp").addChild( "ul", { class:"listeNext", id:"homeTipps" }).onTap( Events.TAP_HANDLER, { watch:"tagName:LI", command:Events.TIPPS_SELECTED } );
	DOM( "fieldsetTipp").hide();	
	
	var tipps = this.model.getEmpfehlungen( data );

	for( var i = 0; i < tipps.length; i++)
	{	
		var likes = parseInt( tipps[i].likes );
		var dislikes = parseInt( tipps[i].dislikes );

		var exportData =  tipps[i];
		
		var item1 = DOM( "homeTipps" ).addChild( "li", { style:"padding-top:5px;padding-bottom:5px;", data: JSON.stringify( exportData ) });
		
		DOM( item1 ).appendChild("span", { style:"padding-top:10px; padding-right:30px;"}, "<b>"+tipps[i].title+"</b>");	
		DOM( item1 ).appendChild("br", {}, "");	
		DOM( item1 ).appendChild("span", { style:"font-size:90%;margin:1px;float:left;" }, "<i>"+tipps[i].kategorie+"</i>");				
		DOM( item1 ).appendChild("div", { class:"row_caret", style:"top:16px;"} ).appendChild( Assets.caret() );
		
		// Community Bewertung
		if( (likes + dislikes) > 0 && false)
		{
			DOM( item1 ).appendChild("span", { style:"position:absolute; top:6px; right:18px; font-size:90%"}, "<i>Empfohlen</i>");				
			DOM( item1 ).appendChild("span", { style:"position:absolute; top:23px; right:18px; font-size:90%"}, "<i>" +likes+" von "+( likes + dislikes )+ "<i>");		
		}
		
		DOM( "fieldsetTipp").show();
	}
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
		
		for( var typus in baustein)
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
		
	if( this.model._data["customer"].login )
	{			
		DOM("optionenFormId").addChild("fieldset", { id:"fieldsetVerbindung", style:"text-align:left;"}).addChild( "legend", {}, "Verbindung" );	
		DOM( "fieldsetVerbindung"  ).addChild("div", { id:"optStatus"} );
		DOM( "optStatus"  ).addChild( "span", { }, "<b>Mit Brustzentrum</b>" );
		DOM( "optStatus"  ).addChild( "br" );
		DOM( "optStatus"  ).addChild( "span", { style:"color:green; font-size:90%"}, (data.status) ? "<i>"+data.status+"</i>" :"&nbsp;" ); 			
		DOM( "optStatus"  ).addChild( "a", {  style:"position:absolute;top:6px;right:2px;color:darkblue" }, "Verbunden" ); 	

		// LOGIN
		DOM("optionenFormId").addChild("fieldset", { id:"fieldsetLogin", style:"text-align:left;"}).addChild( "legend", {}, "Login" );		
		DOM( "fieldsetLogin"  ).addChild("div", { id:"optLogin"} );
		DOM( "optLogin").addChild("p", {}, "<b>PatientIn-Id:</b> "+this.model._data["customer"].login.patId);
		DOM( "optLogin").addChild("p", {}, "<b>Password:</b> "+this.model._data["customer"].login.pwd);
		DOM( "optLogin").addChild("p", {}, "<b>Gruppe:</b> "+this.model._data["customer"].login.gruppe);
		
		// SYNC
		DOM("optionenFormId").addChild("fieldset", { id:"fieldsetSync", style:"text-align:left;"}).addChild( "legend", {}, "Synchronisation" );	
		DOM( "fieldsetSync"  ).addChild("div", { id:"optSync"} );
		
		if( this.model._data["customer"].lastSync )
		{
			DOM( "optSync" ).addChild( "span", { }, "<b>Zuletzt</b>");
			DOM( "optSync" ).addChild( "br" );
			DOM( "optSync" ).addChild( "span", { style:"font-size:90%"}, "<i>"+zeit("dd.MM.yyyy hh:mm", this.model._data["customer"].lastSync)+"</i>" ); 					
		}
		else
		{
			DOM( "optSync" ).addChild( "span", { }, "<b>Initialisierung</b>");
			DOM( "optSync" ).addChild( "br" );
			DOM( "optSync" ).addChild( "span", { style:"font-size:90%"}, "<i>&nbsp;</i>" ); 	
		}
		DOM( "optSync" ).addChild( "a", { class:"button-action blue", style:"position:absolute;top:6px;right:2px;"}, "Sync").onTouch(Events.SYNC);
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
        try {
            window.plugins.barcodeScanner.scan(function(args) 
            {
                console.log("Scanner result text: " + args.text + "format: " + args.format + "cancelled: " + args.cancelled + "\n");
                
                dispatchCommand( Events.SCAN_RESULT, { result: args.text, format: args.format  } );
               
            });
        } catch (ex) {        
        	// DESKTOP WILL ALWAYS DISPATCH THIS AND SOMETIMES DEVICE
        	dispatchCommand( Events.SCAN_RESULT, { error : ex.message} );
        }
};

/**
 * event { result: "", format:"QR_CODE", error:"message" }
 * @param event
 */
function scanResultCommand( event )
{	
	
	if( event.result == "Lmd98324jhkl234987234" || event.error == "Cannot read property 'barcodeScanner' of undefined")
	{
		this.model.setCustomer("login", { patId : "Pat001", pwd: "987234", gruppe:"B"});
			
		if( this.model._data["customer"].login.gruppe == "B")
		this.model.setCustomer("intro", 1);
			
		if( this.model._data["customer"].login.gruppe == "C")
		this.model.setCustomer("intro", 2);

		dispatchCommand( Events.OPTIONEN_INIT, { status: "Erfolgreich"} );
	}
	else
	{
		dispatchCommand( Events.OPTIONEN_INIT, { status: "Fehlgeschlagen"} );		
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
	
    DOM( "symFormId" ).addChild("fieldset", { id: "symFieldsetId" } ).addChild( "legend", {}, "Symptome");
		
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
	
	dispatchCommand( Events.SYMPTOME_TO_FAVORITES);
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
	
	for(var favorite in this.model._data.favorites)
	{
		DOM( "favFormId" ).addChild("fieldset", { id: favorite+"id" } ).addChild( "legend", {}, favorite);

		var liste = DOM( favorite+"id" ).appendChild("ul", { class: "listeNext"} );
		
		if(!this.model.getStateFavEdit())
		{
			DOM( liste ).onTap( Events.TAP_HANDLER, { watch:"tagName:LI", command:Events.FAVORITES_EDIT});
		}

        if((this.model.getStateFavEdit() && this.model.hasFavoriteEdit( favorite ) || this.model._data.favorites[ favorite ].length == 0 ) )
        {
            dispatchCommand( Events.FAVORITES_ROW, { row: {}, display: liste });
        }
		
		for(var i = 0; i < this.model._data.favorites[ favorite ].length; i++ )
		{
			dispatchCommand( Events.FAVORITES_ROW, { row: this.model._data.favorites[ favorite ][i], display: liste,  });		
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
	var infoData = this.model.getPunkt( data.row.id );
	var infoType = this.model.getType( data.row.id );
	var zeitpunkt = (infoData && !data.edit) ? "Zuletzt: "+zeit('dd.mm.yyyy hh:mm', infoData.x) : "&nbsp;";
	var title = (infoData && infoType.kategorie != "Notizen") ? infoData.y + "%" : "&nbsp;";

	var item = DOM( data.display ).appendChild("li", { data:JSON.stringify({ punkt:infoData, type:infoType }), style:"padding-top:10px;padding-bottom:10px;"});

	// KEIN EDIT-MODE
	if( !this.model.getStateFavEdit() )
	{		
		if(data.row.id)
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
    	if( !data.row.id )
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
	var value = {};
	
	if( !data.type )
	{
		dispatchCommand( Events.FAVORITES_TO_SYMPTOME ); return;
	}
	
	value.id =  data.type.id;
	
	if( data.punkt )
	{
		value.y = data.punkt.y;
		value.x = data.punkt.x;
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
		DOM( this.properties.id ).text("Edit");		
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
		DOM( "favitFormId" ).addChild("fieldset", { id: "favitZeitId"} ).addChild("legend", {}, "Zeitpunkt");		
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
	if( DO.plugins("agent").isDevice("Desktop") ) //|| (/Android/i.test(navigator.userAgent)))
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
		DOM( this.properties.parent ).addChild("input", { type:"datetime", value:zeit("yyyy-MM-dd hh:mm",zeitInMs), style:"width:105px;" }).onChange( Events.DATE, { type:"yyyy-MM-dd", zeitInMs: zeitInMs, parent:"zeitArea"});
		DOM( this.properties.parent ).addChild("input", { type:"date", value:zeit("yyyy-MM-dd",zeitInMs), style:"width:105px;" }).onChange( Events.DATE, { type:"yyyy-MM-dd", zeitInMs: zeitInMs, parent:"zeitArea"});
		DOM( this.properties.parent ).addChild("input", { type:"time", value:zeit("hh:mm",zeitInMs), style:"margin-left:10px;width:65px" }).onChange( Events.DATE, { type:"hh:mm", zeitInMs: zeitInMs, parent:"zeitArea"});
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
		
		if( DO.plugins("agent").isDevice("Desktop") )
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
		
		this.model.addPunkt( {id:toSave.id, x:toSave.x, y:toSave.y, tipps:toSave.tipps} );
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






