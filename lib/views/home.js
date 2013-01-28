function Home() 
{
	View.call(this);
	
	this.model = new Model();
	
	this.chart = null;
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
	this.buildChart();
	
	this.buildKategorieListe();
};

Home.prototype.buildChart = function()
{
	if(!this.chart)
	{
		this.chart = new Chart();		
		chart.init( this.content );
	}
	this.chart.draw();
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
		
		self.buildChart();
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
			self.hideView("right"); 
			
			self.returnToView.showView();
			
			self.returnToView.addCurrent( self.currentItem.data );
		}

		self.currentItem.style["background"] = "white";
		
		self.currentItem = null;
	}
	
	function tapStart(event) 
	{
		self.currentItem = event.currentTarget.parentNode;
		
		self.currentItem.style["background"] = "silver";
	}
	
	var items = this.model.data.type;
	
	for(var i = 0; i < 2; i++)
	{		
		liste.addItem( items[i], tapStart, tapEnde );
	}

};



