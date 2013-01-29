function Liste() 
{
	this.domElement = document.createElement("ul");	
}

Liste.prototype = new Element();

Liste.prototype.addItem = function( data, tapStart, tapEnde, selected)
{
	var item = document.createElement("li");
	item.setAttribute("data", JSON.stringify( data ) );
		
	if("ontouchstart" in window)
	{	
		item.addEventListener( "touchend", tapEnde, false);		
	}
	else
	{
		item.addEventListener( "mouseup", tapEnde, false);
	}
	
	var icon = this.getIcon( data.farbwert ); 
	icon.style["color"] = "#FFF";
	icon.style["fontSize"] = "1.8em";
	icon.innerHTML = "+";	

	if("ontouchstart" in window)
	{	
		icon.addEventListener( "touchstart", tapStart, false);		
	}
	else
	{
		icon.addEventListener( "mousedown", tapStart, false);
	}
	
	item.appendChild(icon);

	var title = this.getTitle( data.title );
	item.appendChild( title );
	
	var kategorie = this.getKategorie( data.kategorie );
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

Liste.prototype.getIcon = function( farbe )
{
	var iconItem = document.createElement("div");
	iconItem .style["position"] = "absolute";
	iconItem .style["top"] = "5px";
	iconItem .style["left"] = "5px";
	iconItem .style["width"] = "40px";
	iconItem .style["height"] = "40px";
	iconItem .style["border-radius"] = "20px";
	iconItem .style["background"] = farbe;
	
	return iconItem ;
};

Liste.prototype.getTitle = function( label )
{
	var title = document.createElement("span");
	title.innerHTML = "<b>"+label+"</b>";		
	title.style["position"] = "absolute";
	title.style["white-space"] = "nowrap";
	title.style["top"] = "5px";
	title.style["left"] = "60px";
	
	return title;
};

Liste.prototype.getKategorie = function( label )
{
	var kategorie = document.createElement("span");
	kategorie.innerHTML = "<i>" + label + "</i>";		
	kategorie.style["position"] = "absolute";
	kategorie.style["white-space"] = "nowrap";
	kategorie.style["top"] = "25px";
	kategorie.style["left"] = "60px";
	
	return kategorie;
};
