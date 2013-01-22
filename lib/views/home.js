function Home() 
{
	View.call(this);
	
	this.model = new Model();
}

Home.prototype = new View();

// Define View
Home.prototype.init = function()
{
	this.buildView("middle"); 
	
	this.buildHeader("Consilium");		
	
	this.buildContent(true, "homeContentId");

};

Home.prototype.addCurrent = function( id )
{
	
	var liste = document.getElementById("homeListeId");
	
	if(liste) {
		this.content.removeChild(liste);
	}
	
	liste = document.createElement("ul");
	liste.setAttribute("id", "homeListeId");
	liste.setAttribute("class", "liste");
	
	var items = this.model.data.symptome;
	
	for(var i=0; i < 1; i++)
	{
		var item = document.createElement("li");
		item.data = items[i].id;	
		
//		if("ontouchstart" in window)
//		{	
//			item.addEventListener( "touchend", test2, false);		
//		}
//		else
//		{
//			item.addEventListener( "mouseup", test2, false);
//		}
		
		var kreis = document.createElement("div");
		kreis.style["position"] = "absolute";
		kreis.style["top"] = "5px";
		kreis.style["left"] = "5px";
		kreis.style["width"] = "40px";
		kreis.style["height"] = "40px";
		kreis.style["border-radius"] = "20px";
		kreis.style["background"] = items[i].farbwert;
	
//		if("ontouchstart" in window)
//		{	
//			kreis.addEventListener( "touchstart", test, false);		
//		}
//		else
//		{
//			kreis.addEventListener( "mousedown", test, false);
//		}
		
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
	
	this.content.appendChild( liste );
};


// Customize
Home.prototype.addView = function(next)
{
	var chart = new Chart();
	chart.init( this.content );
	chart.draw();
	
	this.addCurrent();
};
