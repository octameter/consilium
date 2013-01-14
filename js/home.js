function Home() 
{
	this.app = null;
	
	this.view = null;
}

Home.prototype.init = function(elementId)
{
	var view = document.createElement("div");
	view.setAttribute("id","view");
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
};


Home.prototype.setViewSymptome = function(symptome)
{
	var body = document.createElement("div");
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