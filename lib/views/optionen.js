function Optionen() 
{
	View.call(this);
	
	this.returnToView = null;
	
	this.header = null;
	
	this.model = new Model();
}

Optionen.prototype = new View();

// Define View
Optionen.prototype.init = function()
{
	this.buildView("left"); 
	
	this.buildHeader("Optionen");		
	
	this.buildContent(true, "optionenContentId");

	this.buildCustomContent();
	
	this.removeView();
};

Optionen.prototype.buildCustomContent = function()
{
	var p = document.createElement("p");
	p.innerHTML = "Alle Einträge und Zeit zurücksetzen!";
	
	this.content.appendChild( p );
	
	var reset = new Button();
	reset.setAction();
	reset.setLabel("Reset");
	
	var that = this;
	
	reset.onTouch(function(event)
	{
		that.model.reset();
	});
	
	this.content.appendChild( reset.domElement );
};

Optionen.prototype.setReturnView = function( view )
{
	this.returnToView = view;
};

Optionen.prototype.removeView = function()
{	
	var self = this;	
	
	var back = new Button();
	back.setId("backButton");
	back.setTopRight();
	back.setNavigation();
	back.addElement( Util.icon("right",32) );
	
	this.header.appendChild( back.getDOMElement() );

	back.onTouch(function(event)
	{
		self.hideView("left"); 
		self.returnToView.showView();
	});
	
};