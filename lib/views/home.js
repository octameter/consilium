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

Home.prototype.showContent = function()
{
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



