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
	
	this.intro();
	
	var that = this;
	
	setInterval(function() 
	{ 
		if(!ChartPoint.selectedElement) {
			
			that.model.atomuhr.addStunden += 1; 
			that.refresh(); 
			console.log( "Stunde vorbei"); 
		}
	
	}, 1000);
};



Home.prototype.intro = function()
{
	// Nothing entered
	if(this.model.data.punkte.length == 0)
	{
		var rahmen = document.createElement("div");
		rahmen.className = "intro";
		
		var p1 = document.createElement("p");
		p1.innerHTML = "Lieber Patient";
		rahmen.appendChild( p1 );
		
		var p2 = document.createElement("p");
		p2.innerHTML += this.model.intro;
		p2.style["margin"] = "20px";
		p2.style["textAlign"] = "justify";
		rahmen.appendChild( p2 );
		
		var button = new Button();
		button.setId("plusZeit");
		button.setLabel("Start");
		button.setAction();
		button.setStyle("width", "200px");
		button.setStyle("height", "40px");
		rahmen.appendChild( button.getDOMElement() );

		var that = this;
		
		button.onTouch(function(event)
		{		
			that.content.removeChild( rahmen );

			that.refresh();
		});
		
		var p3 = document.createElement("p");
		rahmen.appendChild( p3 );	

		this.content.appendChild( rahmen );
	}
	else
	{
		this.refresh();
	}
	

};

//Customize
Home.prototype.refresh = function(id)
{	
	// Default Type
	id = id || "1";
	
	// Category has been selected in list or newly added from symptoms
	if(this.currentItem)
	{			
		id = JSON.parse( this.currentItem.getAttribute("data") ).id;
	}
	
	this.model.sortPunkteByTime(id);
	
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
			
			self.content.scrollTop = 0;
			
			self.refresh( data.id );					
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
	}

	var items = this.model.getTypesByPunkt( id );
	
	liste.addItem( items.pop(), tapStart, tapEnde, true );	
	
	var size = items.length;
	
	while(size--)
	{
		liste.addItem( items[size], tapStart, tapEnde, false );			
	}
	

};



