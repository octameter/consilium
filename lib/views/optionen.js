function Optionen() 
{
	View.call(this);
	
	this.returnToView = null;
	
	this.header = null;
	
	this.model = new Model();
	
	this.speedup = null;
}

Optionen.prototype = new View();

// Define View
Optionen.prototype.init = function()
{
	this.buildView("left"); 
	
	this.buildHeader("Optionen");		
	
	this.buildContent("optionenContentId");
	
	this.removeView();
};

Optionen.prototype.buildContentExt = function()
{
	var that = this;
	
	var form = document.createElement("form");
	this.content.appendChild(form);

	var fieldset = document.createElement("fieldset");
	form.appendChild(fieldset);
	
	var legend = document.createElement("legend");
	legend.appendChild( document.createTextNode("Zeit"));
	fieldset.appendChild(legend);
	
	var toggle = new Toggle();
	toggle.setId("toggleReset");
	toggle.onTouch(function(event)
	{	
		if(that.speedup)
		{
			window.clearInterval(that.speedup);

			that.speedup = null;
		}
		else
		{
			console.log("set");
			
			that.speedup = setInterval(function() 
			{ 
				if(!ChartPoint.selectedElement) {
					
					that.model.atomuhr.addStunden += 12; 
					
					that.returnToView.showViewExt();
				}
				
			}, 30000);			
			
		}
		console.log(toggle.selected);

	});
	toggle.setLabel("<b>Beschleunigung</b><br><i>plus 12 Stunden alle 30 Sek.</i>");
	
	fieldset.appendChild( toggle.domElement );
	
	var hr = document.createElement("hr");
	hr.style["clear"] = "both";
	fieldset.appendChild( hr);

	var toggle2 = new Toggle();
	toggle2.setId("toggleReset2");
	toggle2.onTouch(function(event)
	{	
		toggle2.selected = !toggle2.selected;
		
		if(toggle2.selected)
		{
			that.model.atomuhr.stundenSprung = 5;
		}
		else
		{
			that.model.atomuhr.stundenSprung = 0;			
		}

		console.log(toggle2.selected);
	});
	toggle2.setLabel("<b>Beschleunigung bei Eingabe</b><br><i>plus 5 Stunden</i>");
	
	fieldset.appendChild( toggle2.domElement );
	
	var hr = document.createElement("hr");
	hr.style["clear"] = "both";
	fieldset.appendChild( hr);
	
	var wrapper = document.createElement("div");
	fieldset.appendChild( wrapper );
		
	var p = document.createElement("span");
	p.innerHTML = "<b>Alle Einträge löschen</b>";
	
	wrapper.appendChild( p );
	
	var button = new Button();
	button.setId("buttonReset");
	button.setAction();
	button.setStyle("float", "right");
	button.setLabel("Reset");
	
	button.onTouch(function(event)
	{
		event.preventDefault();
		that.model.reset();
		
		that.returnToView.currentItem = null;
		
		console.log( "reset ");
	});
	
	wrapper.appendChild( button.domElement );
	
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
	back.addElement( Assets.getIcon("right",32) );
	
	this.header.appendChild( back.getDOMElement() );

	back.onTouch(function(event)
	{
		self.hideView("left"); 
		self.returnToView.showView();
	});
	
};