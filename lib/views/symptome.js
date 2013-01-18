function Symptome() 
{

}

Symptome.prototype = new View();

//Define View
Symptome.prototype.init = function()
{
	this.buildView("right");
	
	this.buildHeader("Symptome");		
	
	this.buildContent();

	this.buildContentListe();
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


Symptome.prototype.buildContentListe = function()
{		
	var liste = document.createElement("ul");
	liste.setAttribute("class", "listeSymptome");
	
	for(var i = 0; i < 100; i++)
	{
		var item = document.createElement("li");
		item.setAttribute("class", "listeItemsSymptome");
		item.innerHTML = "jaööp";
		liste.appendChild(item);
	}

	this.content.appendChild(liste);
};





