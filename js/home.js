function Home() 
{
	this.app = null;
	
	this.view = null;
}

Home.prototype.init = function(elementId)
{
	var view = document.createElement("div");
	view.setAttribute("id","homeView");
	view.setAttribute("class","view middle");
	this.view = view;
	
	this.app = document.getElementById(elementId);
	this.app.appendChild(view);

	this.setHeader("Consilium");	
};


Home.prototype.setHeader = function( title )
{
	var header = document.createElement("header");

		var h1 = document.createElement("h1");
		h1.innerHTML = title;
	
	header.appendChild(h1);	

	this.view.appendChild(header);
};

Home.prototype.showView = function()
{	
	this.view.className = this.view.className.replace("left", "middle");
	
	document.getElementById("bodyHome").style["display"] = "none";
	
	document.getElementById("homeView").addEventListener("transitionend", this.onTransitionEnd, false);
	document.getElementById("homeView").addEventListener("webkitTransitionEnd", this.onTransitionEnd, false);
};

Home.prototype.onTransitionEnd = function(event)
{	
	// Wird Sichtbar
	if(event.target.className.indexOf("middle") > 0)
	{
		document.getElementById("bodyHome").style["display"] = "block";
	}
	else
	{
		document.getElementById("bodyHome").style["display"] = "none";
	}
};


Home.prototype.setViewSymptome = function(symptome)
{
	var body = document.createElement("div");
	body.setAttribute("id", "bodyHome");
	this.view.appendChild(body);	
	
	var button = document.createElement("button");
	button.setAttribute("id", "goSymptome");
	button.innerHTML = "Symptome eingeben";
	button.addEventListener("click", function(event)
	{
		this.view.className = this.view.className.replace("middle","left"); 
		
		symptome.showView();
	}
	.bind(this), false);
	body.appendChild(button);
};