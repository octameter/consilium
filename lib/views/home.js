function Home( elementId ) 
{
	this.elementId = elementId;
	
	this.model = new Model();
	
	this.chart = null;
		
	this.liste = null;
	
	// HTML List Element 
	this.currentItem = null;
	
	this.defaultItemId = "10025482";
}

Home.prototype.buildContentExt = function()
{
	this.chart = new Chart();		
	this.chart.init( this.content );
	
	this.buildIntro();
};

Home.prototype.showViewExt = function()
{	
	if(this.model.data.punkte.length > 0 || this.currentItem)
	{
		this.hideIntro();
		this.showGraph();
	}
	else
	{
		this.hideGraph();
		this.showIntro();	
	}
};

Home.prototype.showGraph = function()
{
	// Default Type
	var id = this.defaultItemId;
	
	// Category has been selected in list or newly added from symptoms
	if(this.currentItem)
	{			
		id = JSON.parse( this.currentItem.getAttribute("data") ).id;
	}
	
	this.model.sortPunkteByTime(id);

	this.chart.show(id);	

	this.buildKategorieListe(id);	
};
Home.prototype.hideGraph = function()
{
	this.chart.hide();	
	
	this.liste.removeDOMElements();
};
Home.prototype.showIntro = function()
{
	document.getElementById("rahmen").style["display"] = "block";	
};
Home.prototype.hideIntro = function()
{
	document.getElementById("rahmen").style["display"] = "none";
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




/**
 * NAVIGATION
 */
Home.prototype.addViewSymptome = function( nextView )
{	
	var self = this;	
	
	var plus = new Button();
	plus.setId("plusButton");
	plus.setTopRight();
	plus.addElement( Assets.getIcon( "plus", 32 ) );
	plus.setNavigation();
	this.header.appendChild( plus.getDOMElement() );

	plus.onTouch(function(event)
	{
		self.hideView("left"); 	
		nextView.showView();
	});
};

Home.prototype.addViewOptionen = function( nextView )
{	
	var self = this;	
	
	var plus = new Button();
	plus.setId("plusButton");
	plus.setTopLeft();
	plus.setNavigation();
	plus.addElement( Assets.getIcon( "optionen", 32 ) );
	this.header.appendChild( plus.getDOMElement() );

	plus.onTouch(function(event)
	{
		self.hideView("right"); 	
		nextView.showView();
	});
};

/**
 * INTRO
 */
Home.prototype.buildIntro = function()
{
		var rahmen = document.createElement("div");
		rahmen.setAttribute("id","rahmen");
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
			that.addItem();
			
			that.showViewExt(true);
		});
		
		var p3 = document.createElement("p");
		rahmen.appendChild( p3 );	

		this.content.appendChild( rahmen );
};

/**
 * LISTE
 */
//Kategorie Liste
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
			
			self.showView( data.id );					
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
	
	this.liste = liste;

};


