function Liste() 
{
	this.domElement = document.createElement("ul");	
}

Liste.prototype = new Element();

/**
 * 
 * @param data typeOf Object
 * @param tapStart
 * @param tapEnde
 * @param selected
 */
Liste.prototype.addItem = function( data, tapStart, tapEnde, selected)
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
	
	if(selected)
	{
		item.className += " selectedItem"; 
	}

	this.domElement.appendChild( item );
};

Liste.prototype.deSelectItems = function()
{
	var items = this.domElement.childNodes.length;
	
	while(items--)
	{		
		this.domElement.childNodes[ items ].className = this.domElement.childNodes[ items ].className.split("selectedItem").join("");
	}
};


