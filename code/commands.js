/**
 * COMMANDS
 * @param data
 */
Events = 
{
	HOME_INIT:"homeInit",
	OPTIONEN_INIT:"optionenInit",
	OPTIONEN_TO_HOME:"optionenToHome",
	SYMPTOME_INIT:"symptome_init",
	SYMPTOME_TO_FAVORITES:"symptomeToFavorites",
	
	REFRESH_CHART:"refreshChart",
	SHOW_AUSWAHL:"showAuswahl",
	CHANGE_VIEW:"changeView",
	SCAN:"scan",
	SYMPTOME_SELECTED:"symptomSelected",
	
	FAVORITES_INIT:"favorites_init",
	FAVORITES_ROW:"favorites_row",
	FAVORITES_ITEM:"favorites_item",

	FAVORITES_EDIT:"favorites_edit",
	FAVORITES_DELETE:"favorites_delete",
	FAVORITES_CHANGE:"favorites_Change",
	FAVORITES_TO_HOME:"favorites_to_home",
	FAVORITES_TO_FAVORITE:"favorites_to_favorite",
	
	FAVORITE_INIT:"favorite_init",
	FAVORITE_CANCEL:"favorite_cancel",
	FAVORITE_SAVE:"favorite_save",
	
	SLIDER_MOVE:"sliderMove",
};

function changeViewCommand( data )
{	
	DOM( data.to ).attrib("className").replace(/(top|left|right)/, "middle");	
	DOM( data.from.split("Id").join("ContentId") ).hide();
	DOM( data.from ).attrib("className").replace("middle", data.direction );	
	
};
function showContentCommand( data )
{
	DOM( data.id ).show();
};

function homeInitCommand( data )
{	
	var prop = this.properties;
	
	if( this.model.data.punkte.length > 0 )
	{		
		dispatchCommand( Events.REFRESH_CHART );
		
		DOM( prop.intro ).hide();
		DOM( prop.verlauf ).show();
	}
	else
	{
		DOM( prop.intro).show();
		DOM( prop.verlauf ).hide();
	}
	
	dispatchCommand( Events.SHOW_AUSWAHL );
	
	DOM( prop.id ).show();
};
function optionenInitCommand( data )
{
	DOM( this.properties.id ).show();
};
function optionenToHomeCommand( data )
{
	dispatchCommand( Events.CHANGE_VIEW, this.properties );
};

function sliderMoveCommand( data )
{
	// Persist to Model
	this.model.addCurrentItem( { x: new Date().getTime(), y:data.value, id:data.id, } ); 
	
	// SHOW SAVE BUTTON
	DOM( data.save ).show();
	
	// Update Displays
	DOM( data.output ).removeElements().text( data.value  +"%");
	DOM( data.grad ).removeElements().text( this.model.getGrad( data.id, data.value ));
};

function refreshChartCommand( data )
{
	var prop = this.properties;
		
	this.model.sortPunkteByTime();
	
	DOM( prop.chart ).verlauf();
};

function showAuswahlCommand( data )
{
	var customize = this.properties;
	
	if(data.id)
	{
		var type = this.model.getType(data.id);
		
		DOM(customize.legend).text( type.kategorie ); 		
		
		DOM(customize.info).removeElements().text("");
		DOM(customize.info).appendChild( "span", { style: 'position:absolute; top:-3px; right:0; font-size:130%' }, data.y +"%");
		DOM(customize.info).appendChild( "span", {}, "<b>"+type.title+"</b>");
		DOM(customize.info).appendChild( "p", { style:'width:100%;font-size:90%;margin:1px' }, "<i>"+zeit(data.x, "yyyy-mm-dd hh:mm")+"</i>");		
		DOM(customize.info).appendChild( "p", { style: 'width:100%;padding-top:5px'}, this.model.getGrad(data.id, data.y) );

	}
	else
	{
		DOM(customize.legend).removeElements().text( "Auswahl" ); 
		DOM(customize.info).text( "Bitte einen Punkt im Graph auwählen.");
	}
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
	var liste = DOM( this.properties.id ).addChild("ul", { class:"liste"} );
	
	var items = this.model.getSymptomeAsc();
	
	for(var i = 0; i < items.length; i++)
	{		
		var item = DOM( liste ).appendChild("li");
		
		DOM( item ).appendChild("div", { style: 'background:'+items[i].farbwert }, "+" ).className = "itemIcon";
		DOM( item ).appendChild("span", { style: 'position:absolute; white-space:nowrap; top:5px; left:60px;' }, "<b>"+items[i].title+"</b>");
		DOM( item ).appendChild("span", { style: 'position:absolute; white-space:nowrap; top:25px; left:60px;'}, "<i>" + items[i].kategorie + "</i>");		

		DOM( item ).onTouch( Events.SYMPTOME_SELECTED, { id : items[i].id} );
	}	
		
	DOM( this.properties.id ).show();
};
function symptomeToFavoritesCommand( data )
{
	dispatchCommand( Events.CHANGE_VIEW, this.properties);
};

function symptomSelectedCommand( data )
{	
	this.model.addFavorite( "Symptome", data.id);
	
	dispatchCommand( Events.SYMPTOME_TO_FAVORITES );
};


function favoritesChangeCommand( data )
{	
    var edit = !this.model.favoritesEdit;
	
	if(edit)
	{
		DOM( this.properties.editButton ).text("Close").attrib("className").replace("colorless","grey");
		DOM( this.properties.backButton ).hide();
        this.model.favoritesEdit = true;
	}
	else
	{
		DOM( this.properties.editButton ).text("Edit").attrib("className").replace("grey","colorless");		
		DOM( this.properties.backButton ).show();
        this.model.favoritesEdit = true;
	}
    
    this.model.favoritesEdit = edit;
	
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
		DOM( "favFormId" ).addChild("fieldset", { id: favorite+"id" } ).addChild("legend", {}, favorite);

		var liste = DOM( favorite+"id" ).appendChild("ul", { class: "listeNext"} );
        
        if((this.model.favoritesEdit && this.model.hasFavoriteEdit( favorite ) || this.model.data.favorites[ favorite].length == 0 ) )
        {
            dispatchCommand( Events.FAVORITES_ROW, { row: {}, display: liste })
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
		
	// Object {id: "10025482", title: "Subjektives Befinden", kategorie: "Lebensqualität", zero: 100, farbwert: "rgba(154,205,50,0.9)"…}
	var infoType = this.model.getType( data.row.id );
	if(infoType)
	{
		DOM( item ).appendChild("span",{}, "<b>"+infoType.title+"</b>" );		
	}
	else
	{
		DOM( item ).appendChild("span",{}, "<b>Neues Symptome</b>" );				
	}
	
	// {x: 1359330905202, y: 87, id: "10025482"}
	var infoData = this.model.getPunkt( data.row.id );
	var title = (infoData) ? infoData.y + "%" : "Eintrag";
	var zeitpunkt = (infoData && !data.edit) ? "<i>Zuletzt: "+zeit(infoData.x,'dd.mm.yyyy hh:mm')+"</i>" : "&nbsp;";
	DOM( item ).appendChild("p",{ style:"width:100%;font-size:90%;margin:1px;float:left;" }, zeitpunkt);	

	if( !this.model.favoritesEdit && data.row.id)
	{		
		var button = DOM( item ).appendChild("a", { class:"button grey", style:"position:absolute; right:2px; top:10px; font-size:110%;padding-left:5px;padding-right:5px;"}, title);
		DOM( button ).onTouch(Events.FAVORITES_ITEM, { target:item, punkt:infoData, type:infoType } );		
	}
    else if(!data.row.id)
	{
		var button = DOM( item ).appendChild("a", { class:"button blue", style:"position:absolute; right:2px; top:10px; font-size:100%;"}, "Hinzufügen");
		DOM( button ).onTouch( Events.CHANGE_VIEW, { from:"favoritesId", to:"symptomeId", direction:"left" } );	
	}
	else if(this.model.favoritesEdit && data.row.edit)
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
	this.model.addCurrentItem( { x:data.punkt.x, y:data.punkt.y, id:data.type.id });
	dispatchCommand( Events.FAVORITES_TO_FAVORITE );		
};
/**
 * FAVORITES CHANGE VIEW
 * @param data
 */
function favoritesToHomeCommand( data )
{
	dispatchCommand( Events.CHANGE_VIEW, this.properties ); 
};
function favoritesToFavoriteCommand( data )
{
	dispatchCommand( Events.CHANGE_VIEW, this.properties ); 
};
/**
 * FAVORITE INIT
 * @param data 
 * this.properties { id: "ContentId" }
 */
function favoriteInitCommand( data )
{
	DOM( this.properties.save ).hide();
	
	var item = this.model.getCurrentItem(); 
	
	DOM( this.properties.id ).removeElements();
	DOM( this.properties.id ).addChild("form").addChild("fieldset", { id: "favoriteFieldsetId" }).addChild("legend", {}, this.model.getType( item.id ).kategorie );
	
	var div = DOM( "favoriteFieldsetId" ).addChild( "div" ).element();
	DOM( div ).appendChild( "span", { style: "width:100%;"}, "<b>"+this.model.getType( item.id ).title+"</b>");
	var output = DOM( div ).appendChild( "span", { style: "position:absolute; top:10px; right:2px; font-size:110%" }, item.y +"%");
	DOM( div ).appendChild( "p", { style:'width:100%;font-size:90%;margin:1px' }, "<i>Zuletzt: "+zeit(item.x,'dd.mm.yyyy hh:mm')+"</i>");		
	var grad = DOM( div ).appendChild( "p", { style: 'width:100%;padding-top:5px'}, this.model.getGrad(item.id, item.y) );
	DOM( div ).appendChild( "input", { id:"favRangeId", type:"range", value:item.y, style:"margin-bottom:20px"});
	
	DOM( "favRangeId" ).onChange( Events.SLIDER_MOVE, { output:output, grad:grad, id:item.id, save: this.properties.save } );
	
	DOM( this.properties.id ).show();
	// {punkt: Object, type: Object}
	// type {id: "10025482", title: "Subjektives Befinden", kategorie: "Lebensqualität", zero: 100, farbwert: "rgba(154,205,50,0.9)"…}
	// var item = this.model.getCurrentItem(); 
};

function favoriteSaveCommand( data )
{
    var prop = this.properties;
    
    DOM( prop.id ).hide();
    
	this.model.addPunkt( this.model.getCurrentItem() );
	
	this.model.removeCurrentItem();
	
	dispatchCommand( Events.CHANGE_VIEW, prop );
}
function favoriteCancelCommand( data )
{
	var prop = this.properties;
	
    DOM( prop.id ).hide();
    
	this.model.removeCurrentItem();
	
	dispatchCommand( Events.CHANGE_VIEW, prop );
}


/**
 * UTILITY FUNCTIONS
 */
function zeit( milliSekunden, pattern )
{
		var currentDate = (milliSekunden) ? new Date( milliSekunden ) : new Date();
		
		var minute = currentDate.getMinutes() < 10 ? "0"+currentDate.getMinutes() : currentDate.getMinutes();
		var stunde = currentDate.getHours() < 10 ? "0"+currentDate.getHours() : currentDate.getHours();
		
		var day = currentDate.getDate() < 10 ? "0"+currentDate.getDate() : currentDate.getDate();
		var month = currentDate.getMonth() < 9 ? "0"+(currentDate.getMonth() + 1) : (currentDate.getMonth() + 1);
		var year = currentDate.getFullYear();
		
		switch( pattern )
		{
			case("yyyy-mm-dd hh:mm"): return year + "-" + month+ "-"+day+" "+stunde+":"+minute; break;
			case("dd.mm.yyyy hh:mm"): return day + "." + month+ "."+year+" "+stunde+":"+minute; break;
			default: return year + "-" + month+ "-"+day; break;
		};
};


