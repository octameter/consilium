function Symptome()
{
	this.app = null;
	
	this.view = null;
}

Symptome.prototype.init = function(elementId)
{
	var view = document.createElement("div");
	view.setAttribute("id","symptome");
	view.setAttribute("class","view right");
	this.view = view;
	
	this.app = document.getElementById(elementId);
	this.app.appendChild(view);

	this.setHeader("Symptome");	
};

Symptome.prototype.setHeader = function( title )
{
	var header = document.createElement("header");

		var h1 = document.createElement("h1");
		h1.innerHTML = title;
	
	header.appendChild(h1);	

	this.view.appendChild(header);
};

Symptome.prototype.showView = function( )
{
	this.view.className = this.view.className.replace("right", "middle");
};

//document.getElementById("symptome").addEventListener("transitionend", this.onEnd, false);
//document.getElementById("symptome").addEventListener("webkitTransitionEnd", this.onEnd, false);

Symptome.prototype.setViewBack = function( home )
{
	var body = document.createElement("div");
	this.view.appendChild(body);	
	
	var button = document.createElement("button");
	button.setAttribute("id", "goHome");
	button.innerHTML = "Back";
	
	button.addEventListener("click", function(event)
	{
		this.view.className = this.view.className.replace("middle","right"); 

		home.showView();
	}
	.bind(this), false);
	body.appendChild(button);
};