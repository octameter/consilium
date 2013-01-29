function Home() 
{
	View.call(this);
	
	this.model = new Model();
	
	this.chart = null;
	
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
Home.prototype.addView = function(next)
{	
	this.buildChart(1);
	
	this.buildKategorieListe(1);
};

Home.prototype.buildChart = function(id)
{
	if(!this.chart)
	{
		this.chart = new Chart();		
		chart.init( this.content );
	}
	this.chart.draw(id);
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
		
		self.buildChart(1);
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
			
			self.buildChart( data.id );
			
			console.log("Tap Ende ID", data.id);
		}
		else
		{
			liste.deSelectItems();
			
			self.currentItem.className = " selectedItem";			
		}
	}
	
	function tapStart(event) 
	{	
		liste.deSelectItems();
		
		self.currentItem = event.currentTarget.parentNode;
		
		self.currentItem.className += " selectedItem";
	}
	
	var items = this.model.data.type;
	
	for(var i = 0; i < 2; i++)
	{		
		var selected = false;
		
		if(items[i].id == id)
		{
			selected = true;					
		}

		liste.addItem( items[i], tapStart, tapEnde, selected );			
	}

};



