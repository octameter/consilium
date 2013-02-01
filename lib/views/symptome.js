function Symptome() 
{
	// Super
	View.call( this );
	
	this.model = new Model();
	
	this.returnToView = null;
	
	this.currentItem = null;
}

Symptome.prototype = new View();

//Define View
Symptome.prototype.init = function()
{
	this.buildView("right");
	
	this.buildHeader("Symptome");		
	
	this.buildContent(false, "symptomeContentId");
	
	this.removeView();
};

Symptome.prototype.showViewExtend = function()
{
	this.buildContentListe();	
};

Symptome.prototype.setReturnView = function( view )
{
	this.returnToView = view;
};


Symptome.prototype.buildBusy = function()
{	
	var div = Assets.busyDiv("busySymptome");
	
	this.view.appendChild( div );	
};

Symptome.prototype.showBusy = function()
{
	this.hideContent();
	
	document.getElementById("busySymptome").style["display"] = "block";
};

Symptome.prototype.hideBusy = function()
{
	document.getElementById("busySymptome").style["display"] = "none";
};

Symptome.prototype.removeView = function( )
{	
	var self = this;	
	
	var back = new Button();
	back.setId("backButton");
	back.setTopLeft();
	back.setNavigation();
	back.addElement( Util.icon("left",32) );
	
	this.header.appendChild( back.getDOMElement() );

	back.onTouch(function(event)
	{
		self.hideView("right"); 
		self.returnToView.showView();
	});
	
};

Symptome.prototype.buildContentListe = function()
{		
	var liste = new Liste();
	
	liste.getOrCreate("sympomeListeId", this.content);
	
	liste.setClass("liste scrollableY");
	
	liste.removeDOMElements();
	
	var self = this;
	
	function tapEnde(event) 
	{
		if(!self.currentItem) return;
		
		if(self.currentItem == event.currentTarget) 
		{
			self.hideView("right"); 
			
			self.returnToView.showView();
			
			self.returnToView.addCurrent( self.currentItem );
		}

		self.currentItem.style["background"] = "white";
		
		self.currentItem = null;
	}
	
	function tapStart(event) 
	{
		self.currentItem = event.currentTarget.parentNode;
		
		self.currentItem.style["background"] = "silver";
	}
	
	var items = this.model.data.types;
	
	for(var i = 0; i < items.length; i++)
	{		
		liste.addItem( items[i], tapStart, tapEnde );
	}

	
};





