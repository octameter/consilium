function Symptome( elementId ) 
{
	this.elementId = elementId;
	
	this.model = new Model();
	
	this.currentItem = null;
	
	this.buildContentListe();
}

Symptome.prototype.getDomElement = function()
{
	return document.getElementById( this.elementId );
};


Symptome.prototype.buildContentListe = function()
{		
	var liste = document.getElementById("symptomeListeId");
	
	while(liste.hasChildNodes())
	{
		liste.removeChild( liste.lastChild );
	}
	
	var self = this;
	
	function tapEnde(event) 
	{
		if(!self.currentItem) return;
		
		if(self.currentItem == event.currentTarget) 
		{
			self.returnToView.showView();
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
		this.addItem( items[i], tapStart, tapEnde );
	}	
};


Symptome.prototype.addItem = function( data, tapStart, tapEnde, selected)
{
	var item = document.createElement("li");
    
	var dat = JSON.stringify( data );
	
	item.setAttribute("data",  dat );
		
	if("ontouchstart" in window)
	{	
		item.addEventListener( "touchend", tapEnde, false);		
	}
	else
	{
		item.addEventListener( "mouseup", tapEnde, false);
		item.addEventListener( "mouseout", tapEnde, false);
	}

	/**
	 * ICON
	 */
	var iconItem = document.createElement("div");
	iconItem.style["position"] = "absolute";
	iconItem.style["top"] = "5px";
	iconItem.style["left"] = "5px";
	iconItem.style["right"] = "5px";
	iconItem.style["width"] = "40px";
	iconItem.style["height"] = "40px";
	iconItem.style["border-radius"] = "20px";
	iconItem.style["background"] = data.farbwert;
	iconItem.style["color"] = "#FFF";
	iconItem.style["fontSize"] = "1.8em";
	iconItem.innerHTML = "+";	
	item.appendChild( iconItem );
	
	if("ontouchstart" in window)
	{	
		iconItem.addEventListener( "touchstart", tapStart, false);		
	}
	else
	{
		iconItem.addEventListener( "mousedown", tapStart, false);
	}
	

	/**
	 * TITLE
	 */
	var title = document.createElement("span");
	title.innerHTML = "<b>"+data.title+"</b>";		
	title.style["position"] = "absolute";
	title.style["white-space"] = "nowrap";
	title.style["top"] = "5px";
	title.style["left"] = "60px";
	item.appendChild( title );
	
	
	/**
	 * CATEGORY
	 */
	var kategorie = document.createElement("span");
	kategorie.innerHTML = "<i>" + data.kategorie + "</i>";		
	kategorie.style["position"] = "absolute";
	kategorie.style["white-space"] = "nowrap";
	kategorie.style["top"] = "25px";
	kategorie.style["left"] = "60px";
	item.appendChild( kategorie );
	
	
	/**
	 * Info
	 */
	var info = document.createElement("p");
	info.innerHTML = "<hr/>" + data.info;		
	info.style["position"] = "absolute";
	info.style["white-space"] = "nowrap";
	info.style["text-align"] = "left";
	info.style["top"] = "30px";
	info.style["left"] = "30px";
	item.appendChild( info );

	if(selected)
	{
		item.className += " selectedItem"; 
	}

	document.getElementById("symptomeListeId").appendChild( item );
};

Symptome.prototype.deSelectItems = function()
{
	var items = this.domElement.childNodes.length;
	
	while(items--)
	{		
		this.domElement.childNodes[ items ].className = this.domElement.childNodes[ items ].className.split("selectedItem").join("");
	}
};





