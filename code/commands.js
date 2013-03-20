/**
 * COMMANDS
 * @param data
 */
Events = 
{
	TAP_HANDLER:"tap_handler",
		
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

	FAVORITES_INIT:"favorites_init",
	FAVORITES_ROW:"favorites_row",
	FAVORITES_ITEM:"favorites_item",
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
	FAVORITE_TO_FAVORITES:"favorite_to_favorites",
	FAVORITE_TO_HOME:"favorite_to_home",
	FAVORITE_TO_TIP:"favorite_to_tip",
	DATAPOINT_DELETE:"data_point",
	
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

function homeInitCommand( event )
{	
	if( event.introExit ) this.model.setIntroShow( false );
	
	( this.model.getStateIntro() ) ? dispatchCommand( Events.HOME_INTRO ) : dispatchCommand( Events.HOME_VERLAUF );
	
	DOM( this.properties.id ).show();
};

function homeIntroCommand( event )
{
	var div = DOM( this.properties.id ).removeElements().appendChild("div", {class:"intro"});
    
	DOM( div ).addChild( "p", {}, this.model.dict.intro[0].title );
	
	for( var i = 0; i < this.model.dict.intro[0].bausteine.length; i++)
	{
		DOM( div ).addChild( "p", {}, this.model.dict.intro[0].bausteine[i] );		
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
		DOM( "chart").addChild("div", { id:scroller, class:"scrollableX"}); 		
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
		var buttonLabel = ( type.kategorie != "Notizen" ) ? event.y +"%" : "&nbsp;";
		var detailLabel = ( type.kategorie != "Notizen" ) ? "<b>Definition:</b> "+this.model.getGrad(event.id, event.y).info : "<b>Memo:</b> "+ event.y;

		/* LEGEND */
		DOM(cmd.legend).text( type.kategorie ); 				

		/* CURRENT ITEM */
		var exportData = JSON.stringify({x:event.x, y:event.y, id:event.id, command:Events.FAVORITE_TO_HOME});
		/* ROW */
		var row = DOM( cmd.info ).addChild("div", { id:"homeRowDiv", style:"cursor:pointer;padding:5px;", data:exportData });	
		DOM(row).appendChild("span",{ class:"row_title"}, "<b>"+type.title+"</b>");
		DOM(row).appendChild("span",{ class:"row_value", style:"background:"+type.farbwert}, buttonLabel);
		DOM(row).appendChild("br");					
		DOM(row).appendChild("span",{ class:"row_zeit"}, "<i>"+zeit("dd.mm.yyyy hh:mm", event.x )+"</i>" );
		DOM(row).appendChild("div", { class:"row_caret", style:"top:24px"} ).appendChild( Assets.caret() );
		
		DOM("homeRowDiv").onTap( Events.TAP_HANDLER, { watch: "id:homeRowDiv", command:Events.HOME_EXIT } );
		
		/* DETAIL */
		DOM(cmd.info).appendChild( "p", { class:"row_detail"}, detailLabel );		
	}
	else
	{
		/* DEFAULT */
		DOM(cmd.legend).text( "Auswahl" ); 
		DOM(cmd.info).text( "Ein Figur im Graph berühren, um weitere Information zu erhalten.");
	}
	
	/* DISPLAY */
	DOM("fieldsetAuswahl").show();	
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

function tippsShowCommand ( data )
{		

	if( DOM("fieldsetTipp").element() )
	{
		DOM("fieldsetTipp").removeElements();
	}
	else
	{
		DOM( "favFormId").appendChild( "fieldset", { id:"fieldsetTipp"} );		
	}
	DOM( "fieldsetTipp").addChild( "legend", {}, "Empfehlungen" );
	DOM( "fieldsetTipp").addChild( "ul", { class:"listeNext", id:"homeTipps" }).onTap( Events.TAP_HANDLER, { watch:"tagName:LI", command:Events.TIPPS_SELECTED } );
	DOM( "fieldsetTipp").hide();	
	
	if( !data ) return;
	
	var tipps = this.model.getEmpfehlungen( data );
	
	for( var i = 0; i < tipps.length; i++)
	{	
		var likes = parseInt( tipps[i].likes );
		var dislikes = parseInt( tipps[i].dislikes );

		var exportData =  tipps[i];
		
		var item1 = DOM( "homeTipps" ).addChild( "li", { style:"padding-top:5px;padding-bottom:5px;", data: JSON.stringify( exportData ) });
		
		DOM( item1 ).appendChild("span", { style:"padding-top:10px;"}, "<b>"+tipps[i].title+"</b>");	
		
		if( (likes + dislikes) > 0)
		{
			DOM( item1 ).appendChild("span", { style:"float:right;padding-right:13px;"}, "<i>Empfohlen</i>");
			DOM( item1 ).appendChild("br");	
			DOM( item1 ).appendChild("span", { style:"font-size:90%;margin:1px;float:left;" }, "<i>"+tipps[i].kategorie+"</i>");				
				
			DOM( item1 ).appendChild("span", { style:"float:right;padding-right:13px;"}, "<i>" +likes+" von "+( likes + dislikes )+ "<i>");		
			DOM( item1 ).appendChild("div", { class:"row_caret", style:"top:16px;"} ).appendChild( Assets.caret() );
		}
		else
		{
			DOM( item1 ).appendChild("br");	
			DOM( item1 ).appendChild("span",{ style:"font-size:90%;margin:1px;float:left;" }, "<i>"+tipps[i].kategorie+"</i>");				
		}
		
		DOM( "fieldsetTipp").show();
	}
};

function tippsSelectedCommand( event )
{
	this.model.setStateTipp( event );
	dispatchCommand( Events.FAVORITES_TO_TIPP  );
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
	
	if( ! this.model.trackPunktLiked() )
	{
		DOM( "tipArea" ).addChild("a", { style:"float:left;", class:"button-action green"}, "Hilfreich").onTouch( Events.TIPP_LIKED, { liked:true } );
		DOM( "tipArea" ).addChild("a", { style:"float:right;", class:"button-action grey"}, "Nicht hilfreich").onTouch( Events.TIPP_LIKED, { liked:false });	
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
	DOM( this.properties.id ).show();
};


function datapointDeleteCommand( data )
{
	this.model.setCurrentItem( { id:data.id } );
	
	this.model.removePunkt( data );
	
	dispatchCommand( Events.FAVORITE_INIT );
};

function scanCommand( data )
{	
        try {
            window.plugins.barcodeScanner.scan(function(args) 
            {
                console.log("Scanner result text: " + args.text + "format: " + args.format + "cancelled: " + args.cancelled + "\n");
                /*
                if (args.format == "QR_CODE") {
                    window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
                }
                */
                alert(args);
            });
        } catch (ex) {
            console.log(ex.message);
        }
};

/**
 * SYMPTOME INIT
 * @param data.id -> ContentId
 * @param data.liste -> ListeId
 */
function symptomeInitCommand( data )
{
	DOM( this.properties.id ).removeElements();
	
	var liste = DOM( this.properties.id ).addChild("ul", { id:"symptomeListe", class:"liste"} );
	
	var items = this.model.getSymptome();
	
	for(var i = 0; i < items.length; i++)
	{		
		var item = DOM( liste ).appendChild("li", { data: items[i].id });
		
		DOM( item ).appendChild("div", { style: 'background:'+items[i].farbwert }, "&nbsp;" ).className = "itemIcon";
		DOM( item ).appendChild("span", { style: 'position:absolute; white-space:nowrap; top:5px; left:60px;' }, "<b>"+items[i].title+"</b>");
		DOM( item ).appendChild("span", { style: 'position:absolute; white-space:nowrap; top:25px; left:60px;'}, "<i>" + items[i].kategorie + "</i>");		

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
	
//	console.log("TODO Symptome ordnen");
};

/**
 * FAVORITES BUILD FORM
 *  @param data { id: "viewContentId", edit: true }
 */
function favoritesInitCommand( data )
{		
	DOM( this.properties.id ).removeElements().appendChild("form", { id : "favFormId" } );
	
	for(var favorite in this.model.data.favorites)
	{
		DOM( "favFormId" ).addChild("fieldset", { id: favorite+"id" } ).addChild( "legend", {}, favorite);

		var liste = DOM( favorite+"id" ).appendChild("ul", { class: "listeNext"} );
		
		//DOM( liste ).onTap( )

        if((this.model.getStateFavEdit() && this.model.hasFavoriteEdit( favorite ) || this.model.data.favorites[ favorite ].length == 0 ) )
        {
            dispatchCommand( Events.FAVORITES_ROW, { row: {}, display: liste });
        }
		
		for(var i = 0; i < this.model.data.favorites[ favorite ].length; i++ )
		{
			dispatchCommand( Events.FAVORITES_ROW, { row: this.model.data.favorites[ favorite ][i], display: liste,  });
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
	var item = DOM( data.display ).appendChild("li", {style:"padding-top:10px;padding-bottom:10px;"});
		
	// {x: 1359330905202, y: 87, id: "10025482"}
	var infoData = this.model.getPunkt( data.row.id );
	var title = (infoData) ? infoData.y + "%" : "Eintrag";
	var infoType = this.model.getType( data.row.id );
	var zeitpunkt = (infoData && !data.edit) ? "<i>Zuletzt: "+zeit('dd.mm.yyyy hh:mm', infoData.x)+"</i>" : "&nbsp;";

	if( infoData && infoType.kategorie == "Notizen") title = "Editieren";
	
	// Object {id: "10025482", title: "Subjektives Befinden", kategorie: "Lebensqualität", zero: 100, farbwert: "rgba(154,205,50,0.9)"…}

	if(infoType)
	{
		DOM( item ).appendChild("span",{}, "<b>"+infoType.title+"</b>" );		
	}
	else
	{
		DOM( item ).appendChild("span",{}, "<b>Neues Symptome</b>" );				
	}

	DOM( item ).appendChild("p",{ style:"width:100%;font-size:90%;margin:1px;float:left;" }, zeitpunkt);	

	if( !this.model.getStateFavEdit() && data.row.id)
	{		
		var button = DOM( item ).appendChild("a", { class:"button grey", style:"position:absolute; right:2px; top:10px; font-size:110%;padding-left:5px;padding-right:5px;"}, title);
		DOM( button ).onTouch(Events.FAVORITES_ITEM, { target:item, punkt:infoData, type:infoType } );		
	}
    else if(!data.row.id)
	{
		var button = DOM( item ).appendChild("a", { class:"button-action blue", style:"position:absolute; right:2px; top:10px; font-size:100%;"}, "Hinzufügen");
		DOM( button ).onTouch( Events.FAVORITES_TO_SYMPTOME  );	
	}
	else if(this.model.getStateFavEdit() && data.row.edit)
	{
		var button = DOM( item ).appendChild("a", { class:"button red", style:"position:absolute; right:2px; top:10px; font-size:100%;"}, "Entfernen");
		DOM( button ).onTouch(Events.FAVORITES_DELETE, { type:"Symptome", item: { id: data.row.id} } );		
	}
	
};
function favoritesDeleteCommand( data )
{    
	this.model.removeFavorite( data.type, data.item );
	
	dispatchCommand( Events.FAVORITES_INIT );
}


/**
 * FAVORITES LIST ITEM DOWN
 * @param data { target: "List item" }
 */
function favoritesItemCommand( data )
{		
	data.target.className = "selected";

	DOM( data.target ).onTouchEnd( Events.FAVORITES_EDIT, {  punkt: data.punkt, type:data.type });
};
/**
 * FAVORITES LIST ITEM UP 
 * @param data { TODO }
 */
function favoritesEditCommand( data )
{		
	var value = data.punkt || { y:data.type.zero };
	
	this.model.setStateSymptom( { x:value.x, y:value.y, id:data.type.id, command: Events.FAVORITE_TO_FAVORITES } );
	dispatchCommand( Events.FAVORITES_TO_FAVORITE );		
};

/**
 * FAVORITE INIT
 * @param data 
 * this.properties { id: "ContentId" }
 */
function favoriteInitCommand( data )
{
	var item = this.model.getStateSymptom(); 

	var kategorie = this.model.getType( item.id ).kategorie;
	
	
	if(!item.x)
	{
		var last = this.model.getPunkt( item.id );
		
		if(last) item = last;
	}
	
	DOM( this.properties.save ).hide();
    
	DOM( this.properties.id ).removeElements();
    // NOW CLIENTWIDTH AVAILABLE
    DOM( this.properties.id ).show();    
    
	DOM( this.properties.id ).addChild("form", {id:"favitFormId"});
		
	// ZEITPUNKT
	DOM( "favitFormId").addChild("fieldset", { id: "favZeitpunktId" }).addChild("legend", {}, "Zeitpunkt");
	DOM( "favZeitpunktId" ).addChild("div", {id:"zeitArea" });
	
	
	DOM( "zeitArea" ).addChild("select", { class:"optionen" }).addSelect(1,31, zeit("dd"));
	DOM( "zeitArea" ).addChild("select", { class:"optionen" }).addSelect(1,31, zeit("MM"));
	DOM( "zeitArea" ).addChild("select", { class:"optionen",  }).addSelect(2013,2022, zeit("yyyy"));

	DOM( "zeitArea" ).addChild("select", { class:"optionen", style:"margin-left:10px;" }).addSelect(1,31, zeit("hh"));
	DOM( "zeitArea" ).addChild("select", { class:"optionen" }).addSelect(1,31, zeit("mm"));


	//DOM( "zeitArea" ).addChild("span", {}, zeit("dd.mm.yyyy hh:mm"));
	//DOM( "zeitArea" ).addChild("span", {}, "Später");
	
	DOM( "favitFormId").addChild("fieldset", { id: "favoriteFieldsetId" }).addChild("legend", {}, kategorie);
	
	DOM( "favoriteFieldsetId" ).addChild( "div", { id:"favArea"} );
	DOM( "favArea" ).appendChild( "span", { style: "width:100%;"}, "<b>"+this.model.getType( item.id ).title+"</b>");
    
//	if( kategorie == "Notizen")
//	{
//		DOM( "favArea" ).appendChild( "p", { style:'width:100%;font-size:90%;margin:1px' }, (item.x) ? "<i>Zuletzt: "+zeit('dd.mm.yyyy hh:mm', item.x)+"</i>" :"");	
//		DOM( "favArea" ).addChild("textarea", { id:"favTextareaId", style:"font-size:100%;width:100%; height:200px;padding:3px;-webkit-user-select: text;", name:"notizEintrag", placeholder:"Text eingeben"}, item.y);
//		DOM( "favArea" ).addChild("input", { type:"reset", class:"button-action grey"}).onTouch( Events.TEXT_CHANGE, { id:item.id, save: this.properties.save } );
//		
//		if(item.x)
//		DOM( "favArea" ).addChild("a", { style:"float:right", class:"button-action red"}, "Löschen").onTouch( Events.DATAPOINT_DELETE, item);
//		
//		DOM( "favTextareaId" ).onChange( Events.TEXT_CHANGE, { id:item.id, save: this.properties.save } );
//	}
//	else
//	{
		DOM( "favArea" ).appendChild( "span", { id:"favOutputId", style: "position:absolute; top:10px; right:2px; font-size:110%" }, item.y +"%");
		DOM( "favArea" ).appendChild( "p", { style:'width:100%;font-size:90%;margin:1px' }, (item.x) ? "<i>Zuletzt: "+zeit('dd.mm.yyyy hh:mm',item.x)+"</i>" :"");		
		DOM( "favArea" ).appendChild( "p", { id:"favGradId", style: 'width:100%;padding-top:5px'}, this.model.getGrad(item.id, item.y).info );
		
		dispatchCommand( Events.SLIDER, { parent:"favArea", output:"favOutputId", grad:"favGradId", id:item.id, y:item.y} );
		
		dispatchCommand( Events.TIPPS_SHOW, { type:item.id, value:item.y, key:item.x} );
	//}
	
};

function sliderCommand( event )
{
	// CREATE ELEMENT DESKTOP ODER MOBILE
	if( event.parent && DO.plugins("agent").isDevice("Desktop") )
	{				
        DOM( event.parent ).addChild("div", { id:"favSliderId", class:"slider"} ).addChild("a", { id:"thumbId", class:"grey"} );		 
		 
		 var hundert = DOM("favSliderId").width() - DOM("thumbId").width();
		 
		 DOM( "thumbId" ).style("left",  parseInt( hundert * event.y / 100 ) + "px");
		 
		 DOM( "favSliderId" ).onTouch( Events.SLIDER, {output:"favOutputId", grad:"favGradId", id:event.id, custom:true} );
	}
	else if( event.parent )
	{
		DOM( event.parent ).addChild("input", { id:"favRangeId", type:"range", min:0, max:100, value:event.y, style:"margin-bottom:20px"} ).onChange( Events.SLIDER, {output:"favOutputId", grad:"favGradId", id:event.id} );
	}

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
		// Persist to Model
		this.model.setStateSymptom( { x: new Date().getTime(), y:event.value, id:event.id, } ); 
		
		// SHOW SAVE BUTTON
		DOM( this.properties.save ).show();
		
		// Update Displays
		DOM( event.output ).removeElements().text( event.value  +"%");
		DOM( event.grad ).removeElements().text( this.model.getGrad( event.id, event.value ).info );	
		
		dispatchCommand( Events.TIPPS_SHOW, { type:event.id, value:event.value, x: new Date().getTime() } );
	}
};

function textChangeCommand( data )
{
	// Persist to Model
	this.model.setCurrentItem( { x: new Date().getTime(), y:data.value, id:data.id, } ); 
	
	// SHOW SAVE BUTTON
	DOM( data.save ).show();
};

function favoriteExitCommand( data )
{
	var currentItem = this.model.getStateSymptom();
	
	var command = currentItem.command;
	delete currentItem.command;
	
    DOM( this.properties.hide ).hide();
  
    DOM( this.properties.id ).removeElements();	
    
    // PERSIT TO MODEL IF SAVE EVENT
	if( this.properties.save ) {
		this.model.addPunkt( this.model.getStateSymptom() );
	}

	console.log( command );
	
	dispatchCommand( command );
		
	this.model.setStateSymptom( null );	
}






