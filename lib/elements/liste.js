function Liste() 
{
	this.domElement = document.createElement("ul");
}

Liste.prototype = new Element();

Liste.prototype.addItem = function( data, tapStart, tapEnde)
{
	var item = document.createElement("li");
	item.data = data.id;
		
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

	this.domElement.appendChild( item );
};

Liste.prototype.getIcon = function( farbe )
{
	var kreis = document.createElement("div");
	kreis.style["position"] = "absolute";
	kreis.style["top"] = "5px";
	kreis.style["left"] = "5px";
	kreis.style["width"] = "40px";
	kreis.style["height"] = "40px";
	kreis.style["border-radius"] = "20px";
	kreis.style["background"] = farbe;
	
	return kreis;
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
