function Home() 
{
	View.call(this);
	
	this.model = new Model();
	
	this.chart = null;
	
	
	// HTMLLiELement
	this.currentItem = null;
}

Home.prototype = new View();

// Define View
Home.prototype.init = function()
{
	this.buildView("middle"); 
	
	this.buildHeader("Consilium");		
	
	this.buildContent(true, "homeContentId");
};

//Customize
Home.prototype.refresh = function()
{	
	// Default Type
	var id = 1;
	
	// Category has been selected in list or newly added from symptoms
	if(this.currentItem)
	{			
		id = JSON.parse( this.currentItem.getAttribute("data") ).id;
	}
	
	this.model.sortPunkteByIdAndTime(id);
	
	this.buildChart(id);	
	this.buildKategorieListe(id);	
};

Home.prototype.buildChart = function(id)
{
	
	if(!this.chart)
	{
		this.chart = new Chart();		
		chart.init( this.content );
	}

	this.chart.refresh(id);
};

Home.prototype.addCurrent = function(item)
{	
	this.currentItem = item;
	
	this.refresh();
};

Home.prototype.addNext12 = function()
{
	var self = this;
	
	var plus = new Button();
	plus.setId("plusZeit");
	plus.setTopRight();
	plus.setLabel("<b>+17</b>");
	plus.setNavigation();
	plus.setStyle("right", "60px");
	this.header.appendChild( plus.getDOMElement() );

	plus.onTouch(function(event)
	{		
		self.model.atomuhr.addStunden += 17;
		
		self.refresh();
	});
};

// Kategorie Liste
Home.prototype.buildKategorieListe = function( id )
{
	var liste = new Liste();
	
	liste.getOrCreate("homeListeId", this.content);
	
	liste.setClass("liste");
	
	liste.removeDOMElements();

	var self = this;
	
	function tapEnde(event) 
	{
		if(!self.currentItem) return;		
		
		if(self.currentItem == event.currentTarget) 
		{
			var data = JSON.parse( self.currentItem.getAttribute("data") );
			
			self.refresh( data.id );					
			
			console.log( "Ende "+self.currentItem);
		}
		else
		{
			self.currentItem.className.replace("selectedItem", " ");						
		}

	}
	
	function tapStart(event) 
	{	
		self.currentItem = event.currentTarget.parentNode;
		
		self.currentItem.className += " selectedItem";
		
		console.log( "Start "+self.currentItem);
	}

	var items = this.model.getCurrentTypes( id );

	liste.addItem( items.pop(), tapStart, tapEnde, true );	
	
	var size = items.length;
	
	while(size--)
	{
		liste.addItem( items[size], tapStart, tapEnde, false );			
	}
	

};



