function Home( elementId ) 
{
	this.elementId = elementId;
	
	this.model = new Model();
		
	this.liste = null;
	
	// HTML List Element 
	this.currentItem = null;
		
	this.chart = new Chart("chart");		
	
	onTransitionEnd(this);
}

Home.prototype.getDomElement = function()
{
	return document.getElementById( this.elementId );
};

Home.prototype.showAuswahl = function(event)
{

		if(event)
		{
			var data = JSON.parse( event.detail );
			var type = this.model.getType(data.id);
			
			document.getElementById("homeAuswahlLegend").innerHTML = type.kategorie; 		
			
			var info = document.getElementById("homeAuswahlInfo");
			info.innerHTML = "";
			info.appendChild( createTag("span", { style: 'position:absolute; top:-3px; right:0; font-size:130%' }, data.y +"%") );
			info.appendChild( createTag("span", {}, "<b>"+type.title+"</b>") );
			info.appendChild( createTag("p", { style:'width:100%;font-size:90%;margin:1px' }, "<i>"+getZeitpunkt(data.x)+"</i>") );
			
			this.model.getType(data.id).grad.forEach(function(element)
			{
				if( element.min <= data.y && element.max >= data.y)
				{
					info.appendChild( createTag("p", { style: 'width:100%;padding-top:5px'}, element.info));
				}
			});
			
		}
		else
		{
			document.getElementById("homeAuswahlLegend").innerHTML = "Auswahl"; 
			document.getElementById("homeAuswahlInfo").innerHTML = "Bitte einen Punkt im Graph auwählen.";
		}
};

Home.prototype.showContent = function()
{
	this.showAuswahl();
	
	if(this.model.data.punkte.length > 0)
	{
		hideContent( "rahmen" );
		this.showGraph();
	}
	else
	{
		hideContent( "homeContentId" );
		showContent( "rahmen" );	
	}
};

Home.prototype.hideContent = function()
{
	hideContent( "rahmen" );
	hideContent( "homeContentId" );
};

Home.prototype.showGraph = function()
{
	showContent( "homeContentId" );

	// Category has been selected in list or newly added from symptoms
	if(this.currentItem)
	{			
		id = JSON.parse( this.currentItem.getAttribute("data") ).id;
	}
	
	this.model.sortPunkteByTime("10025482");

	this.chart.refresh();	
};


Home.prototype.addItem = function(item)
{	
	if(!item)
	{
		var defaultItem = document.createElement("li");
		defaultItem.setAttribute("data", JSON.stringify( this.model.getType(this.defaultItemId)));
		item = defaultItem;
	}
	
	this.currentItem = item;
};



