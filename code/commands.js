/**
 * COMMANDS
 * @param data
 */
function changeViewCommand( data )
{
	DOM( data.toId ).attrib("className").replace(/(top|left|right)/, "middle");	
	DOM( data.hideId ).hide();
	DOM( data.fromId ).attrib("className").replace("middle", data.direction );	
};
function showContentCommand( data )
{
	DOM( data.id ).show();
};

function initHomeCommand( data )
{	
	if( this.model.data.punkte.length > 0 )
	{		
		dispatchCommand("refreshChart", { id: "chart"} );
		
		DOM( data.intro ).hide();
		DOM( data.verlauf ).show();
	}
	else
	{
		DOM( data.intro).show();
		DOM( data.verlauf ).hide();
	}
	
	dispatchCommand("showAuswahl");
	
	DOM( data.id ).show();
};
function initOptionenCommand( data )
{
	DOM( data.id ).show();
};
function initSymptomeCommand( data )
{
	DOM( data.id ).show();
};
function initEingabeCommand( data )
{
	DOM( data.id ).show();
};

function refreshChartCommand( data )
{
	this.model.sortPunkteByTime("10025482");
	
	DOM("chartSVG").verlauf();
};

function showAuswahlCommand( data )
{
	var customize = this.custom;
	
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
		}
};
