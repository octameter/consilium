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
	back.setLabel("Back");
	back.setNavigation();
	back.setBeveled();
	this.header.appendChild( back.getDOMElement() );

	back.onTouch(function(event)
	{
		self.hideView("right"); 
		self.returnToView.showView();
	});
	
};



Symptome.prototype.buildContentListe = function()
{		
	var liste = document.getElementById("sympomeListeId");
	
	if(liste) {
		this.content.removeChild(liste);
	}
	
	liste = document.createElement("ul");
	liste.setAttribute("id", "sympomeListeId");
	liste.setAttribute("class", "liste scrollableY");
	
	var items = this.model.data.symptome;
	
	var self = this;
	
	function test2(event) 
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
	
	function test(event) 
	{
		self.currentItem = event.currentTarget.parentNode;
		
		self.currentItem.style["background"] = "silver";
	}
	
	for(var i = 0; i < items.length; i++)
	{
		var item = document.createElement("li");
		item.data = items[i].id;	
		
		if("ontouchstart" in window)
		{	
			item.addEventListener( "touchend", test2, false);		
		}
		else
		{
			item.addEventListener( "mouseup", test2, false);
		}
		
		var kreis = document.createElement("div");
		kreis.style["position"] = "absolute";
		kreis.style["top"] = "5px";
		kreis.style["left"] = "5px";
		kreis.style["width"] = "40px";
		kreis.style["height"] = "40px";
		kreis.style["border-radius"] = "20px";
		kreis.style["color"] = "#FFF";
		kreis.style["fontSize"] = "1.8em";
		kreis.innerHTML = "+";
		kreis.style["background"] = items[i].farbwert;
	
		if("ontouchstart" in window)
		{	
			kreis.addEventListener( "touchstart", test, false);		
		}
		else
		{
			kreis.addEventListener( "mousedown", test, false);
		}
		
		item.appendChild(kreis);

		var title = document.createElement("span");
		title.innerHTML = "<b>"+items[i].title+"</b>";		
		title.style["position"] = "absolute";
		title.style["white-space"] = "nowrap";
		title.style["top"] = "5px";
		title.style["left"] = "60px";
		item.appendChild(title);
		
		var kategorie = document.createElement("span");
		kategorie.innerHTML = "<i>" + items[i].kategorie + "</i>";		
		kategorie.style["position"] = "absolute";
		kategorie.style["white-space"] = "nowrap";
		kategorie.style["top"] = "25px";
		kategorie.style["left"] = "60px";
		item.appendChild(kategorie);

		liste.appendChild(item);
	}

	this.content.appendChild(liste);
};





