/**
 * COMMANDS
 * @param data
 */
Events = 
{
	REFRESH_CHART:"refreshChart",
	SHOW_AUSWAHL:"showAuswahl",
	CHANGE_VIEW:"changeView",
	SCAN:"scan",
	SYMPTOME_SELECTED:"symptomSelected",
	EDIT_EINGABE:"editEingabe",
	INIT_HOME:"initHome",
	INIT_OPTIONEN:"initOptionen",
	INIT_SYMPTOME:"initSymptome",
	INIT_EINGABE:"initEingabe"
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

function initHomeCommand( data )
{	
	var preReg = this.preReg;
	
	if( this.model.data.punkte.length > 0 )
	{		
		dispatchCommand( Events.REFRESH_CHART );
		
		DOM( preReg.intro ).hide();
		DOM( preReg.verlauf ).show();
	}
	else
	{
		DOM( preReg.intro).show();
		DOM( preReg.verlauf ).hide();
	}
	
	dispatchCommand( Events.SHOW_AUSWAHL );
	
	DOM( preReg.id ).show();
};
function initOptionenCommand( data )
{
	DOM( data.id ).show();
};

function initEingabeCommand( data )
{
	console.log("TODO Bewertung dynamisch");
	console.log("TODO Symptome dynamisch");
	console.log("TODO Tagebuch dynamisch");
	console.log("TODO Gewicht dynamisch");
	console.log( this.model.data.favorites.symptome.length );
	
	DOM( data.id ).show();
};

function refreshChartCommand( data )
{
	var preReg = this.preReg;
	
	this.model.sortPunkteByTime();
	
	DOM(preReg.chart).verlauf();
};

function showAuswahlCommand( data )
{
	var customize = this.preReg;
	
	if(data)
	{
		var type = this.model.getType(data.id);
		
		DOM(customize.legend).text( type.kategorie ); 		
		
		DOM(customize.info).text("");

		DOM(customize.info).appendChild( "span", { style: 'position:absolute; top:-3px; right:0; font-size:130%' }, data.y +"%");
		DOM(customize.info).appendChild( "span", {}, "<b>"+type.title+"</b>");
		DOM(customize.info).appendChild( "p", { style:'width:100%;font-size:90%;margin:1px' }, "<i>"+zeit(data.x, "yyyy-mm-dd hh:mm")+"</i>");
		
		this.model.getType(data.id).grad.forEach(function(dataElement)
		{
			if( dataElement.min <= data.y && dataElement.max >= data.y)
			{
				DOM(customize.info).appendChild( "p", { style: 'width:100%;padding-top:5px'}, dataElement.info);
			}
		});	
	}
	else
	{
		DOM(customize.legend).text( "Auswahl" ); 
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
function initSymptomeCommand( data )
{
	DOM( data.liste ).removeElements();
	
	var items = this.model.getSymptomeAsc();
	
	for(var i = 0; i < items.length; i++)
	{		
		var item = DOM( data.liste ).appendChild("li");
		
		DOM( item ).appendChild("div", { style: 'background:'+items[i].farbwert }, "+" ).className = "itemIcon";
		DOM( item ).appendChild("span", { style: 'position:absolute; white-space:nowrap; top:5px; left:60px;' }, "<b>"+items[i].title+"</b>");
		DOM( item ).appendChild("span", { style: 'position:absolute; white-space:nowrap; top:25px; left:60px;'}, "<i>" + items[i].kategorie + "</i>");		

		DOM( item ).onTouch( "symptomSelected", items[i] );
	}	
		
	DOM( data.id ).show();
};

function symptomSelectedCommand( data )
{
	this.model.addFavorite( "symptome", data );
	
	dispatchCommand( Events.CHANGE_VIEW, { from:"symptomeId", to:"eingabeId", direction:"right"} );
};


function editEingabeCommand( data )
{
	console.log("TODO Symptome hinzufügen");
	console.log("TODO Symptome löschen");
	console.log("TODO Symptome ordnen");
};

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
			default: return year + "-" + month+ "-"+day; break;
		};
};


